import { configureStore } from "@reduxjs/toolkit";
import { indexApi } from "./features/api/indexApi";
import { authSlice } from "./features/slice/authSlice";

export const store = configureStore({
  reducer: {
    [indexApi.reducerPath]: indexApi.reducer,
    auth: authSlice.reducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(indexApi.middleware),
});

export type IRootState = ReturnType<typeof store.getState>;

const initializeApp = async () => {
  // await store.dispatch(
  //   indexApi.endpoints.refreshToken.initiate({}, { forceRefetch: true })
  // );
  // await store.dispatch(
  //   indexApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  // );
};

initializeApp()