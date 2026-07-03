import React, { useEffect } from 'react';
import CustomerMap from './CustomerMap';
import EmployeeDashboard from './EmployeeDashboard';
import { AppDispatch, RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import CustomerCard from './companycustomers/CustomerCard';
import { gettotalCustomer } from 'src/features/dashboard/DashboardCustomerSlice';
import CustomerConversation from './companycustomers/CustomerConversation';
import CustomerMapRevenue from './companycustomers/CustomerMapRevenue';
import RevivalQueue from './companycustomers/RevivalQueue';

const WelcomeDashboard: React.FC = () => {
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const permission = logindata?.admin?.role_id || null;
  const id = logindata?.admin?.id || null;

  const dispatch = useDispatch<AppDispatch>();

  //afeqv

  const totalcustomer = useSelector((state: RootState) => state.customerdashboard.totalcustomers);

  const orders = {
    pending_orders: totalcustomer.pending_orders,
    total_disputes: totalcustomer.total_disputes,
    total_orders: totalcustomer.total_orders,
  };

  useEffect(() => {
    dispatch(gettotalCustomer());
  }, [dispatch]);

  const totalcustomers = totalcustomer.customers;
  const customer = totalcustomer.customer;
  const customer_conversation = totalcustomer.customer.customer_conversation;
  const customersRevenueMap = totalcustomer.customer.customersRevenueMap;
  const revivalQueue = totalcustomer.customer.revivalQueue;

  return (
    <>
      {/* <div className="flex items-center justify-center  p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-3xl w-full px-8 py-20 text-center"
        >
          <motion.img
            src={logoimg}
            alt="User Avatar"
            className="w-30 h-30  mx-auto mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to India Phosphate Dashboard
          </motion.h1>

          <motion.p
            className="text-gray-600 text-base mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Manage your data, view insights, and navigate your workspace with ease.
          </motion.p>

          <motion.button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition-all shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div> */}
      <div className="space-y-6">
        {/* Employee Dashboard */}

        <EmployeeDashboard id={id} />

        {/* Marketing Dashboard */}
        {(permission === 9 || permission === 1) && (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Marketing Dashboard</h1>

                <p className="text-gray-500 mt-1">
                  Complete marketing analytics & customer tracking
                </p>
              </div>

              {/* <button className="bg-primary text-white px-5 py-3 rounded-2xl shadow-lg font-medium">
                Employee Dashboard
              </button> */}
            </div>

            <CustomerMap totalcustomers={totalcustomers} orders={orders} />
            <CustomerCard customer={customer} />
            <CustomerConversation customer={customer_conversation} />
            <CustomerMapRevenue customer={customersRevenueMap} />
            <RevivalQueue revivalQueue={revivalQueue} />
          </>
        )}
      </div>
    </>
  );
};

export default WelcomeDashboard;
