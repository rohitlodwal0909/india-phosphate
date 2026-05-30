import React from 'react';
import CustomerMap from './CustomerMap';
import EmployeeDashboard from './EmployeeDashboard';
import { RootState } from 'src/store';
import { useSelector } from 'react-redux';

const WelcomeDashboard: React.FC = () => {
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const permission = logindata?.admin?.role_id;

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>

            <p className="text-gray-500 mt-1">
              Complete employee performance & productivity analytics
            </p>
          </div>

          {/* <button className="bg-primary text-white px-5 py-3 rounded-2xl shadow-lg font-medium">
            Marketing Dashboard
          </button> */}
        </div>

        <EmployeeDashboard />

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

            <CustomerMap />
          </>
        )}
      </div>
    </>
  );
};

export default WelcomeDashboard;
