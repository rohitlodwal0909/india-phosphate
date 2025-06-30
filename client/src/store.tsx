import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from '../src/features/authentication/AuthenticationSlice'
import UsermanagmentSlice from '../src/features/usermanagment/UsermanagmentSlice'
import PermissionSlice from '../src/features/authentication/PermissionSlice'
import ChechinSlice from './features/Inventorymodule/guardmodule/GuardSlice'
import QcinventorySlice from '../src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice'
import StoreInventorySlice from '../src/features/Inventorymodule/storemodule/StoreInventorySlice'
import DispatchSlice from '../src/features/Inventorymodule/dispatchmodule/DispatchSlice'
export const store = configureStore({
  reducer: {
   authentication : AuthenticationSlice,
   usermanagement: UsermanagmentSlice,
   checkininventory : ChechinSlice,
   qcinventory :  QcinventorySlice,
   storeinventory : StoreInventorySlice,
   rolepermission :PermissionSlice,
   dispatchData: DispatchSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;