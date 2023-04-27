import { configureStore } from "@reduxjs/toolkit";
// import itemsReducer from "./slice/itemsSlice";
import authSlice from './slice/authSlice'
import productSlice from "./slice/productSlice";


const store = configureStore({
  reducer: {
    // items: itemsReducer,
    auth: authSlice,
    product: productSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
