import React from 'react';

import { useParams } from 'react-router';
import EmployeeDashboard from '../dashboard/EmployeeDashboard';

const Dashboard: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <div className="space-y-6">
        {/* Employee Dashboard */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>

            <p className="text-gray-500 mt-1">
              Complete employee performance & productivity analytics
            </p>
          </div>
        </div>

        <EmployeeDashboard id={id} />
      </div>
    </>
  );
};

export default Dashboard;
