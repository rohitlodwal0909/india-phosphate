import { Icon } from '@iconify/react/dist/iconify.js';
import CountUp from 'react-countup';
import FormatCurrency from 'src/views/accounts/ledger/LedgerComponent/components/formatCurrency';
import ProductWiseCard from '../customer/ProductWiseCard';
import GradeWiseCard from '../customer/GradeWiseCard';

const DashboardCard = ({
  title,
  value,
  icon,
  bg,
  iconbg,
  color,
  border,
  isString = false,
}: any) => {
  return (
    <div
      className={`
        ${bg}
        border border-gray-100
        ${border}
        rounded-2xl
        p-4
        shadow-sm
        hover:shadow-md
        hover:-translate-y-1
        transition-all duration-300
      `}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>

          <h2 className="text-2xl font-bold text-gray-800 truncate">
            {isString ? value : <CountUp end={Number(value || 0)} duration={1.5} />}
          </h2>
        </div>

        <div
          className={`
            w-12 h-12
            rounded-xl
            ${iconbg}
            flex items-center justify-center
            shrink-0
          `}
        >
          <Icon icon={icon} width={24} className={color} />
        </div>
      </div>
    </div>
  );
};
const CustomerCard = ({ customer }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="FY Sales"
          value={FormatCurrency(customer?.fyTotalValue || 0)}
          icon="solar:graph-up-bold"
          bg="bg-emerald-50"
          iconbg="bg-emerald-100"
          color="text-emerald-600"
          border="border-emerald-500"
          isString
        />

        <DashboardCard
          title="Avg Order Value"
          value={FormatCurrency(customer?.avgOrderValue || 0)}
          icon="solar:dollar-minimalistic-bold"
          bg="bg-rose-50"
          iconbg="bg-rose-100"
          color="text-rose-600"
          border="border-rose-500"
          isString
        />
        <DashboardCard
          title="Buying Cycle"
          value={`${customer?.buyingCycle || 0} Days`}
          icon="solar:restart-bold"
          bg="bg-white-50"
          iconbg="bg-violet-100"
          color="text-violet-600"
          border="border-t-violet-500"
          isString
        />
        <DashboardCard
          title="Potential Revenue"
          value={FormatCurrency(customer?.potentialRevenue || 0)}
          icon="solar:chart-square-bold"
          bg="bg-amber-50"
          iconbg="bg-amber-100"
          color="text-amber-600"
          border="border-t-amber-500"
          isString
        />
        <DashboardCard
          title="Dormant Customers"
          value={customer?.dormantCustomers || 0}
          icon="solar:user-block-bold"
          bg="bg-red-50"
          iconbg="bg-red-100"
          color="text-red-600"
          border="border-red-500"
          isString
        />

        <DashboardCard
          title="Conversion Rate"
          value={`${customer?.conversionRate || 0}%`}
          icon="solar:target-bold"
          bg="bg-green-50"
          iconbg="bg-green-100"
          color="text-green-600"
          border="border-green-500"
          isString
        />
        <DashboardCard
          title="Revived Customers"
          value={`${customer?.revivedCustomers || 0}`}
          icon="solar:refresh-circle-bold"
          bg="bg-green-50"
          iconbg="bg-green-100"
          color="text-green-600"
          border="border-green-500"
          isString
        />
        <DashboardCard
          title="Recovery Rate"
          value={`${customer?.recoveryRate || 0}%`}
          icon="solar:refresh-circle-bold"
          bg="bg-amber-50"
          iconbg="bg-amber-100"
          color="text-amber-600"
          border="border-amber-500"
          isString
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        <ProductWiseCard products={customer?.productWiseData} />
        <GradeWiseCard grades={customer?.gradeWiseData} />
      </div>
    </>
  );
};

export default CustomerCard;
