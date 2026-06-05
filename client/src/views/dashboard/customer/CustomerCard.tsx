import { Icon } from '@iconify/react/dist/iconify.js';
import CountUp from 'react-countup';
import FormatCurrency from 'src/views/accounts/ledger/LedgerComponent/components/formatCurrency';

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <DashboardCard
        title="Total Enquiry"
        value={customer?.enquiry}
        icon="solar:chat-round-dots-bold"
        bg="bg-blue-50"
        iconbg="bg-blue-100"
        color="text-blue-600"
        border="border-blue-500"
      />

      {/* <DashboardCard
        title="Total Quotations"
        value={28}
        icon="solar:document-text-bold"
        bg="bg-green-50"
        iconbg="bg-green-100"
        color="text-green-600"
        border="border-green-500"
      /> */}

      <DashboardCard
        title="Total Samples"
        value={customer?.sample}
        icon="solar:test-tube-bold"
        bg="bg-purple-50"
        iconbg="bg-purple-100"
        color="text-purple-600"
        border="border-purple-500"
      />

      <DashboardCard
        title="Total Orders"
        value={customer?.order}
        icon="solar:cart-large-bold"
        bg="bg-orange-50"
        iconbg="bg-orange-100"
        color="text-orange-600"
        border="border-orange-500"
      />

      <DashboardCard
        title="Total PO Value"
        value={FormatCurrency(customer?.po_value)}
        icon="solar:wallet-money-bold"
        bg="bg-cyan-50"
        iconbg="bg-cyan-100"
        color="text-cyan-600"
        border="border-cyan-500"
        isString
      />

      <DashboardCard
        title="FY Sales"
        value={FormatCurrency(customer?.fyTotalValue)}
        icon="solar:graph-up-bold"
        bg="bg-emerald-50"
        iconbg="bg-emerald-100"
        color="text-emerald-600"
        border="border-emerald-500"
        isString
      />

      <DashboardCard
        title="Last Order Date"
        value={
          customer?.lastOrder?.created_at
            ? new Date(customer.lastOrder.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '-'
        }
        icon="solar:calendar-bold"
        bg="bg-indigo-50"
        iconbg="bg-indigo-100"
        color="text-indigo-600"
        border="border-indigo-500"
        isString
      />

      <DashboardCard
        title="Avg Order Value"
        value={FormatCurrency(customer?.avgOrderValue)}
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
        value={FormatCurrency(customer?.potentialRevenue)}
        icon="solar:chart-square-bold"
        bg="bg-amber-50"
        iconbg="bg-amber-100"
        color="text-amber-600"
        border="border-t-amber-500"
        isString
      />
    </div>
  );
};

export default CustomerCard;
