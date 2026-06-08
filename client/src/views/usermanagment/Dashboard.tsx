import React from 'react';

import { useParams } from 'react-router';
import EmployeeDashboard from '../dashboard/EmployeeDashboard';

const Dashboard: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <div className="space-y-6">
        {/* Employee Dashboard */}

        <EmployeeDashboard id={id} />
      </div>
    </>
  );
};

export default Dashboard;
