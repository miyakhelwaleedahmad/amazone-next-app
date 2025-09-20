import { configureStore } from "@reduxjs/toolkit";
import  nextReducer from "./nextSlice";


import{
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
const PersistConfig={
  key:'root',
  version:1,
  storage,
}
const persistedReducer = persistReducer( PersistConfig,nextReducer)
export const store = configureStore({
  reducer:{next:persistedReducer},
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoredActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export let persistor=persistStore(store);
 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
