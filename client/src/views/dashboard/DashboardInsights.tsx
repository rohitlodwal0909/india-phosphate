import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import DisputeAlertList from './DisputeAlertList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { getDispute } from 'src/features/marketing/DisputeSlice';
import PendingOrderList from './PendingOrderList';
import { getPendingOrder } from 'src/features/dashboard/DashboardCustomerSlice';

/* ======================================================
   MAIN COMPONENT
====================================================== */

const DashboardInsights = ({ orders }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [pendingOrderModal, setPendingOrderModal] = useState(false);
  const [disputeModal, setDisputeModal] = useState(false);

  const disputeList = useSelector((state: RootState) => state.disputes.disputes);
  const pendingOrders = useSelector((state: RootState) => state.customerdashboard.pendingOrders);

  useEffect(() => {
    dispatch(getDispute());
  }, [disputeModal]);

  useEffect(() => {
    dispatch(getPendingOrder());
  }, [pendingOrderModal]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <AnalyticsCard
          title="Total Order Lift"
          value={orders?.total_orders || 0}
          subtitle="Orders processed this month"
          icon="solar:box-bold"
          bg="bg-gray-50"
          border="border-gray-300"
        />

        <AnalyticsCard
          title="Pending Orders"
          value={orders?.pending_orders || 0}
          subtitle="Waiting for dispatch"
          icon="solar:clipboard-list-bold"
          bg="bg-orange-50"
          border="border-orange-300"
          onClick={() => setPendingOrderModal(true)}
        />

        <AnalyticsCard
          title="Dispute Alerts"
          value={orders?.total_disputes || 0}
          subtitle="Urgent customer disputes"
          icon="solar:danger-triangle-bold"
          bg="bg-red-50"
          border="border-red-300"
          onClick={() => setDisputeModal(true)}
        />
      </div>

      <DisputeAlertList
        open={disputeModal}
        onClose={() => setDisputeModal(false)}
        data={disputeList}
      />
      <PendingOrderList
        open={pendingOrderModal}
        onClose={() => setPendingOrderModal(false)}
        data={pendingOrders}
      />
    </div>
  );
};

export default DashboardInsights;

/* ======================================================
   ANALYTICS CARD
====================================================== */

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  bg: string;
  border: string;
  onClick?: () => void;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  bg,
  border,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl border ${border} ${bg} p-6 shadow-lg
        hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="text-4xl font-bold text-gray-800 mt-2">{value}</h2>

          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white shadow flex items-center justify-center">
          <Icon icon={icon} width={28} className="text-gray-700" />
        </div>
      </div>
    </div>
  );
};

/* ======================================================
   STATIC DATA
====================================================== */

// const pendingOrders = [
//   {
//     customer: 'ABC Chemicals',
//     qty: '120 MT',
//     status: 'Pending Dispatch',
//   },

//   {
//     customer: 'Shree Industries',
//     qty: '80 MT',
//     status: 'Approval Pending',
//   },

//   {
//     customer: 'National Traders',
//     qty: '45 MT',
//     status: 'Payment Pending',
//   },
// ];

// const opportunityInsights = [
//   {
//     customer: 'Indo Amines',
//     opportunity: 'Bulk order expansion',
//     value: '₹ 12L',
//   },

//   {
//     customer: 'Apex Minerals',
//     opportunity: 'New product onboarding',
//     value: '₹ 8L',
//   },

//   {
//     customer: 'ChemPro Ltd',
//     opportunity: 'Annual supply contract',
//     value: '₹ 18L',
//   },
// ];

// const disputeAlerts = [
//   {
//     customer: 'XYZ Chemicals',
//     issue: 'Material quality complaint',
//     severity: 'High',
//     status: 'Open',
//   },

//   {
//     customer: 'Orbit Industries',
//     issue: 'Late delivery dispute',
//     severity: 'Medium',
//     status: 'In Progress',
//   },

//   {
//     customer: 'Aashirwad Traders',
//     issue: 'Invoice mismatch',
//     severity: 'Low',
//     status: 'Pending',
//   },
// ];
