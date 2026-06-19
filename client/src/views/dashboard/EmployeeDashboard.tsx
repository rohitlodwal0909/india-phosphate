import React, { useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import { AppDispatch, RootState } from 'src/store';
import { getemployeedata } from 'src/features/dashboard/DashboardCustomerSlice';
import PendingTaskList from './employee/PendiingTaskList';
import { getPendingTask, getRemainingTask } from 'src/features/dashboard/DashboardEmployeeSlice';
import { Button } from 'flowbite-react';
import RemainingTaskList from './employee/RemainingTaskList';

interface EmployeeDashboardProps {
  id?: number | string;
}
const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();

  const employeedata = useSelector((state: RootState) => state.customerdashboard.employeedata);
  const pendingTasks = useSelector((state: RootState) => state.employeedashboard.pendingtask);
  const remainingTask = useSelector((state: RootState) => state.employeedashboard.remainingtask);
  const [openPendingModal, setOpenPendingModal] = useState(false);
  const [openRemainingModal, setOpenRemainingModal] = useState(false);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const formatDuration = (minutes) => {
    if (!minutes || minutes <= 0) return '0 min';

    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;

    const parts = [];

    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hr`);
    if (mins) parts.push(`${mins} min`);

    return parts.join(' ');
  };

  useEffect(() => {
    if (id) {
      dispatch(
        getemployeedata({
          id,
          fromDate,
          toDate,
        }),
      );
    }
  }, [id, fromDate, toDate]);

  const handlePendingTask = async () => {
    try {
      await dispatch(getPendingTask(id as number | string)).unwrap();
      setOpenPendingModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemainingTask = async () => {
    try {
      await dispatch(getRemainingTask(id as number | string)).unwrap();
      setOpenRemainingModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stats = useMemo(() => {
    const totalLeads = employeedata?.totalTasks || 0;
    const completedTasks = employeedata?.completedTasks || 0;
    const remainingTasks = employeedata?.remainingTasks;
    const pendingCases = employeedata?.pendingTasks;
    const followUps = employeedata?.inProgressTasks;
    const overdueItems = employeedata?.overdueTasks;
    const slaBreaches = employeedata?.slaBreaches;
    const workingHours = employeedata?.workingHours;
    const avgResponse = employeedata?.avgResponse || 0;
    const acceptedTime = employeedata?.acceptedTime || 0;
    const todayTasks = employeedata?.todayTasks;
    const weeklyProductivity = employeedata?.weeklyProductivity;

    return {
      weeklyProductivity,
      todayTasks,
      totalLeads,
      completedTasks,
      remainingTasks,
      pendingCases,
      followUps,
      overdueItems,
      slaBreaches,
      workingHours,
      avgResponse,
      acceptedTime,
      revenueImpact: '₹12.5L',
      conversionValue: totalLeads > 0 ? ((completedTasks / totalLeads) * 100).toFixed(1) : 0,
    };
  }, [employeedata]);

  const pieData = [
    {
      name: 'Completed',
      value: stats.completedTasks,
      color: '#22c55e',
    },
    {
      name: 'Pending',
      value: stats.pendingCases,
      color: '#eab308',
    },
    {
      name: 'Overdue',
      value: stats.overdueItems,
      color: '#ef4444',
    },
    {
      name: 'Follow Ups',
      value: stats.followUps,
      color: '#3b82f6',
    },
  ];

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>

            <p className="text-gray-500 mt-1">
              Complete employee performance & productivity analytics
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">From Date</label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-[180px] rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">To Date</label>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-[180px] rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <Button
              color="light"
              className="h-[42px]"
              onClick={() => {
                setFromDate('');
                setToDate('');
              }}
            >
              <Icon icon="solar:restart-bold" className="mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Selected Range */}
        {fromDate && toDate && (
          <div className="mt-5 border-t pt-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Icon icon="solar:calendar-bold" width={18} />
              Showing Data :
              <span className="font-semibold">
                {new Date(fromDate).toLocaleDateString('en-GB')}
              </span>
              →<span className="font-semibold">{new Date(toDate).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <DashboardCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon="solar:check-circle-bold"
            bg="bg-green-50"
            iconbg="bg-green-100"
            color="text-green-600"
            border="border-green-500"
          />

          <DashboardCard
            title="Remaining Tasks"
            value={stats.remainingTasks}
            onClick={handleRemainingTask}
            icon="solar:clock-circle-bold"
            bg="bg-yellow-50"
            iconbg="bg-yellow-100"
            color="text-yellow-600"
            border="border-yellow-500"
          />

          <DashboardCard
            onClick={handlePendingTask}
            title="Pending Errors"
            value={stats.pendingCases}
            icon="solar:danger-circle-bold"
            bg="bg-red-50"
            iconbg="bg-red-100"
            color="text-red-600"
            border="border-red-500"
          />

          {/* <DashboardCard
            title="Revenue Impact"
            value={stats.revenueImpact}
            icon="solar:dollar-bold"
            bg="bg-blue-50"
            iconbg="bg-blue-100"
            color="text-blue-600"
            border="border-blue-500"
            isString
          /> */}
        </div>

        {/* =========================================================
          SECOND ROW
      ========================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <MiniCard title="Task Count" value={stats.totalLeads} icon="solar:clipboard-list-bold" />

          <MiniCard title="Ongoing" value={stats.overdueItems} icon="solar:alarm-bold" />

          <MiniCard
            title="SLA Breaches"
            value={stats.slaBreaches}
            icon="solar:shield-warning-bold"
          />

          <MiniCard
            title="Conversion Value"
            value={`${stats.conversionValue}%`}
            icon="solar:graph-up-bold"
            isString
          />
        </div>

        {/* =========================================================
          CHARTS SECTION
      ========================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* PIE CHART */}

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Work Distribution</h3>

                <p className="text-sm text-gray-500">Overall employee work analytics</p>
              </div>

              <Icon icon="solar:pie-chart-3-bold" width={28} className="text-primary" />
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PRODUCTIVITY */}

          <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Employee Productivity</h3>
                <p className="text-sm text-gray-500">Daily task performance</p>
              </div>

              {/* <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
              +18.2%
            </div> */}
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyProductivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="task" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =========================================================
          DAILY DIGEST + WORK HOURS
      ========================================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* DAILY DIGEST */}

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Daily Pending Task Digest</h3>

            <div className="space-y-4">
              {stats.todayTasks?.length > 0 ? (
                stats.todayTasks.map((row: any) => (
                  <DigestCard
                    key={row.id}
                    title={row.task_title}
                    status={row.status}
                    priority={row.priority}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">No tasks available today</div>
              )}
            </div>
          </div>

          {/* WORK HOURS */}

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Employee Performance Metrics</h3>

            <div className="grid grid-cols-2 gap-5">
              <MetricCard
                title="Working Hours"
                value={`${stats.workingHours}`}
                icon="solar:clock-circle-bold"
              />

              <MetricCard
                title="Accepted Time"
                value={formatDuration(stats?.acceptedTime)}
                icon="solar:check-circle-bold"
              />

              <MetricCard
                title="First Response"
                value={formatDuration(stats?.avgResponse)}
                icon="solar:chat-round-bold"
              />

              <MetricCard title="Follow Ups" value={stats.followUps} icon="solar:bell-bold" />
            </div>
          </div>

          <PendingTaskList
            open={openPendingModal}
            onClose={() => setOpenPendingModal(false)}
            tasks={pendingTasks || []}
          />
          <RemainingTaskList
            open={openRemainingModal}
            onClose={() => setOpenRemainingModal(false)}
            tasks={remainingTask || []}
          />
        </div>
      </div>
    </>
  );
};

export default EmployeeDashboard;

const DashboardCard = ({
  title,
  value,
  icon,
  bg,
  iconbg,
  color,
  border,
  isString = false,
  onClick,
}: any) => {
  return (
    <div
      onClick={onClick}
      className={`${bg} ${border} border-l-4 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>

          <h2 className="text-4xl font-bold text-gray-800">
            {isString ? value : <CountUp end={Number(value)} duration={2} />}
          </h2>
        </div>

        <div className={`w-16 h-16 rounded-2xl ${iconbg} flex items-center justify-center`}>
          <Icon icon={icon} width={34} className={color} />
        </div>
      </div>
    </div>
  );
};

const MiniCard = ({ title, value, icon, isString = false }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {isString ? value : <CountUp end={Number(value)} />}
          </h3>
        </div>

        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon icon={icon} width={24} className="text-primary" />
        </div>
      </div>
    </div>
  );
};

const DigestCard = ({ title, status, priority }: any) => {
  return (
    <div className="border rounded-2xl p-4 hover:bg-gray-50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">Status : {status}</p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          {priority}
        </span>
      </div>
    </div>
  );
};

/* =========================================================
    METRIC CARD
========================================================= */

const MetricCard = ({ title, value, icon }: any) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border">
      <div className="flex items-center justify-between mb-3">
        <Icon icon={icon} width={28} className="text-primary" />

        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
    </div>
  );
};
