import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from '../src/features/authentication/AuthenticationSlice'
import UsermanagmentSlice from '../src/features/usermanagment/UsermanagmentSlice'
import PermissionSlice from '../src/features/authentication/PermissionSlice'
import ChechinSlice from './features/Inventorymodule/guardmodule/GuardSlice'
import QcinventorySlice from '../src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice'
import StoreInventorySlice from '../src/features/Inventorymodule/storemodule/StoreInventorySlice'
import DispatchSlice from '../src/features/Inventorymodule/dispatchmodule/DispatchSlice'
import ProdutionSlice from '../src/features/Inventorymodule/productionmodule/ProdutionSlice'
import NotificationSlice from '../src/features/Notifications/NotificationSlice'
import SupplierSlice from '../src/features/master/Supplier/SupplierSlice'
import StaffMasterSlice from '../src/features/master/StaffMaster/StaffMasterSlice'
import RmCodeSlice from '../src/features/master/RmCode/RmCodeSlice'
import CategorySlice from '../src/features/master/Category/CategorySlice'
import UnitSlice from '../src/features/master/Unit/UnitSlice'
import DesignationSlice from '../src/features/master/Designation/DesignationSlice'
import QualificationSlice from '../src/features/master/Qualification/QualificationSlice'
import CustomerSlice from '../src/features/master/Customer/CustomerSlice'
import StateSlice from '../src/features/master/State/StateSlice'
import CitySlice from '../src/features/master/City/CitySlice'
import InwardSlice from '../src/features/master/Inward/InwardSlice'
import CompanySlice from '../src/features/master/Company/CompanySlice'
import DepartmentMasterSlice from '../src/features/master/DepartmentMaster/DepartmentMasterSlice'
import MakeMasterSlice from '../src/features/master/MakeMaster/MakeMasterSlice'
import AccountSlice from '../src/features/master/Account/AccountSlice'
import PackingMaterialSlice from '../src/features/master/PackingMaterial/PackingMaterialSlice'
import TransportSlice from '../src/features/master/Transport/TransportSlice'
import BatchMasterSlice from '../src/features/master/BatchMaster/BatchMasterSlice'
import PendingOrderSlice from '../src/features/master/PendingOrder/PendingOrderSlice'
import StockMasterSlice from '../src/features/master/StockMaster/StockMasterSlice'
import SalesMasterSlice from '../src/features/master/SalesMaster/SalesMasterSlice'
import HsnMasterSlice from '../src/features/master/HsnMaster/HsnMasterSlice'
import CurrencySlice from '../src/features/master/Currency/CurrencySlice'
import EquipmentSlice from '../src/features/master/Equipment/EquipmentSlice'
import OutwardSlice from '../src/features/master/Outward/OutwardSlice'
import PurchaseSlice from '../src/features/master/Purchase/PurchaseSlice'
import BmrMasterSlice from '../src/features/master/BmrMaster/BmrMasterSlice'
import FinishGoodSlice from '../src/features/master/FinishGood/FinishGoodSlice'
import FormulaSlice from '../src/features/master/Formula/FormulaSlice'
import DocumentSlice from '../src/features/master/Documents/DocumentSlice'
export const store = configureStore({
  reducer: {
   authentication : AuthenticationSlice,
   usermanagement: UsermanagmentSlice,
   checkininventory : ChechinSlice,
   qcinventory :  QcinventorySlice,
   storeinventory : StoreInventorySlice,
   rolepermission :PermissionSlice,
   dispatchData: DispatchSlice,
   productionData :ProdutionSlice,
    notifications : NotificationSlice,
    supplier : SupplierSlice,
    category : CategorySlice,
    customer : CustomerSlice,
    rmcodes:RmCodeSlice,
    unit:UnitSlice,
    staffmaster:StaffMasterSlice,
    designation:DesignationSlice,
    qualification:QualificationSlice,
    states: StateSlice,
    cites:CitySlice,
    inward:InwardSlice,
    company:CompanySlice,
    departmentmaster: DepartmentMasterSlice,
    makemaster:MakeMasterSlice,
    account: AccountSlice,
   packing: PackingMaterialSlice,
   transport: TransportSlice,
 batchmasters: BatchMasterSlice,
 pendingorders:PendingOrderSlice,
 stockmasters:StockMasterSlice,
 salesmasters:SalesMasterSlice,
  hsnmasters: HsnMasterSlice,
  currency:CurrencySlice,
  equipment:EquipmentSlice,
  outward:OutwardSlice,
  purchase: PurchaseSlice,
  bmrmaster:BmrMasterSlice,
  finishgood:FinishGoodSlice,
  formula:FormulaSlice,
  document:DocumentSlice
  } 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;