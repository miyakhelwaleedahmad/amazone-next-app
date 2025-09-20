// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import nextReducer from "./nextSlice";

export const store = configureStore({
  reducer: {
    next: nextReducer,
  },
});

// ✅ Export RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
