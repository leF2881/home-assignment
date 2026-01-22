import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Severity, Status, Category } from '@/types/incident';

export type SortField = 'timestamp' | 'severity';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  severities: Severity[];
  statuses: Status[];
  categories: Category[];
  searchSource: string;
  sortField: SortField;
}

const initialState: FilterState = {
  severities: [],
  statuses: [],
  categories: [],
  searchSource: '',
  sortField: 'timestamp',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSeverities: (state, action: PayloadAction<Severity[]>) => {
      state.severities = action.payload;
    },
    setStatuses: (state, action: PayloadAction<Status[]>) => {
      state.statuses = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setSearchSource: (state, action: PayloadAction<string>) => {
      state.searchSource = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
    },

    resetFilters: (state) => {
      state.severities = [];
      state.statuses = [];
      state.categories = [];
      state.searchSource = '';
      state.sortField = 'timestamp';
    },
    setFiltersFromURL: (state, action: PayloadAction<Partial<FilterState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setSeverities,
  setStatuses,
  setCategories,
  setSearchSource,
  setSortField,
  resetFilters,
  setFiltersFromURL,
} = filterSlice.actions;

// Selectors
export const selectFilterState = (state: { filter: FilterState }) => state.filter;
export const selectSeverities = (state: { filter: FilterState }) => state.filter.severities;
export const selectStatuses = (state: { filter: FilterState }) => state.filter.statuses;
export const selectCategories = (state: { filter: FilterState }) => state.filter.categories;
export const selectSearchSource = (state: { filter: FilterState }) => state.filter.searchSource;
export const selectSortField = (state: { filter: FilterState }) => state.filter.sortField;

// Helper selector to check if any filters are active
export const selectHasActiveFilters = (state: { filter: FilterState }) => {
  const { severities, statuses, categories, searchSource } = state.filter;
  return (
    severities.length > 0 ||
    statuses.length > 0 ||
    categories.length > 0 ||
    searchSource.length > 0
  );
};

export default filterSlice.reducer;
