import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import incidentsReducer from "@/features/incidents/incidentsSlice";
import connectionReducer from "@/features/connection/connectionSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    incidents: incidentsReducer,
    connection: connectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;