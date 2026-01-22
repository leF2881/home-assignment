import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  createSelector
} from "@reduxjs/toolkit";
import { incidentsAPI } from "./incidentsAPI";
import { Incident, IncidentUpdate } from "@/types/incident";
import { RootState } from "@/app/store";

// Entity adapter for normalized state
const incidentsAdapter = createEntityAdapter<Incident>({
  sortComparer: (a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
});

interface IncidentsState {
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState = incidentsAdapter.getInitialState<IncidentsState>({
  loading: false,
  error: null,
  lastFetch: null,
});

// Async thunks
export const fetchIncidents = createAsyncThunk(
  "incidents/fetchIncidents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await incidentsAPI.getIncidents();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch incidents",
      );
    }
  },
);

export const updateIncidentStatus = createAsyncThunk(
  "incidents/updateStatus",
  async (
    { id, status }: { id: string; status: IncidentUpdate },
    { rejectWithValue },
  ) => {
    try {
      const data = await incidentsAPI.updateIncident(id, status);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        id,
        error: error.response?.data?.detail || "Failed to update incident",
      });
    }
  },
);

export const createTestIncident = createAsyncThunk(
  "incidents/createTest",
  async (incident: any, { rejectWithValue }) => {
    try {
      const data = await incidentsAPI.createTestIncident(incident);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to create incident",
      );
    }
  },
);
const incidentsSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    // Add incident from WebSocket
    addIncident: (state, action: PayloadAction<Incident>) => {
      incidentsAdapter.addOne(state, action.payload);
    },

    // Update incident from WebSocket
    updateIncident: (state, action: PayloadAction<Incident>) => {
      incidentsAdapter.upsertOne(state, action.payload);
    },

    // Optimistic update - mark as updating
    startOptimisticUpdate: (
      state,
      action: PayloadAction<{ id: string; status: string }>,
    ) => {
      const { id, status } = action.payload;
      const incident = state.entities[id];
      if (incident) {
        incident.status = status as any;
        incident.optimisticUpdate = true;
        delete incident.error;
      }
    },

    revertOptimisticUpdate: (
      state,
      action: PayloadAction<{
        id: string;
        originalStatus: string;
        error: string;
      }>,
    ) => {
      const { id, originalStatus, error } = action.payload;
      const incident = state.entities[id];
      if (incident) {
        incident.status = originalStatus as any;
        incident.optimisticUpdate = false;
        incident.error = error;
      }
    },
    // Clear incident error
    clearIncidentError: (state, action: PayloadAction<string>) => {
      const incident = state.entities[action.payload];
      if (incident) {
        delete incident.error;
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch incidents
    builder.addCase(fetchIncidents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchIncidents.fulfilled, (state, action) => {
      state.loading = false;
      incidentsAdapter.setAll(state, action.payload);
      state.lastFetch = Date.now();
    });
    builder.addCase(fetchIncidents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update incident status
    builder.addCase(updateIncidentStatus.fulfilled, (state, action) => {
      incidentsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          ...action.payload,
          optimisticUpdate: false,
        },
      });
    });
    builder.addCase(updateIncidentStatus.rejected, (state, action: any) => {
      const { id, error } = action.payload;
      const incident = state.entities[id];
      if (incident) {
        incident.error = error;
        incident.optimisticUpdate = false;
      }
    });

    // Create test incident
    builder.addCase(createTestIncident.fulfilled, (state, action) => {
      incidentsAdapter.addOne(state, action.payload);
    });
  },
});

export const {
  addIncident,
  updateIncident,
  startOptimisticUpdate,
  revertOptimisticUpdate,
  clearIncidentError,
  clearError,
} = incidentsSlice.actions;

// Selectors
export const {
  selectAll: selectAllIncidents,
  selectById: selectIncidentById,
  selectIds: selectIncidentIds,
  selectTotal: selectTotalIncidents,
} = incidentsAdapter.getSelectors((state: RootState) => state.incidents);

export const selectIncidentsLoading = (state: RootState) =>
  state.incidents.loading;
export const selectIncidentsError = (state: RootState) => state.incidents.error;

// createSelector memoizes computed selector results to avoid unnecessary rerenders

export const selectSeverityCounts = createSelector(
  [selectAllIncidents],
  (incidents) => {
    return incidents.reduce((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
);

export const selectIncidentsBySeverity =
  (severity: string) => (state: RootState) => {
    const incidents = selectAllIncidents(state);
    return incidents.filter((i) => i.severity === severity);
  };

export const selectIncidentsByStatus =
  (status: string) => (state: RootState) => {
    const incidents = selectAllIncidents(state);
    return incidents.filter((i) => i.status === status);
  };

export default incidentsSlice.reducer;
