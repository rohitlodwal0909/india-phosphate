import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGstDetails } from 'src/features/dashboard/DashboardCustomerSlice';
import { AppDispatch } from 'src/store';

const CompanyHeader = ({ company, summary, lastPurchase, lastPayment, analytics }) => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ IMPORTANT
  const { gstData } = useSelector((state: any) => state.customerdashboard);

  const safeParse = (data) => {
    try {
      return JSON.parse(data || '[]');
    } catch {
      return [];
    }
  };

  const fetchData = async () => {
    if (!company?.id) return;

    try {
      if (company?.gstin) {
        dispatch(getGstDetails({ gstin: company.gstin, forceRefresh: true }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [company]);

  const addresses = safeParse(company?.addresses);
  const contacts = safeParse(company?.contacts);

  const city = addresses?.[0]?.city || '';
  const country = addresses?.[0]?.country || '';

  const person_name = contacts?.[0]?.person || '';
  const mobile = contacts?.[0]?.number || '';

  const businessPotential =
    summary?.receivedAmount >= 10000000
      ? 'High'
      : summary?.receivedAmount >= 3000000
        ? 'Medium'
        : 'Low';

  const formatDate = (date: string) => {
    if (!date) return '-';

    return new Date(date)
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(/ /g, '-');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-6">
        {/* Left Section */}
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
            {company?.company_name
              ?.split(' ')
              ?.map((word) => word[0])
              ?.slice(0, 2)
              ?.join('')
              ?.toUpperCase() || 'NA'}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">{company?.company_name}</h2>

            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span>GST: {gstData?.gstin}</span>
              <span>PAN: {gstData?.pan_number}</span>
              <span>Customer Since: {gstData?.registration_date}</span>
            </div>

            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Icon icon="mdi:map-marker" />
                {city} , {country}
              </span>

              <span className="flex items-center gap-1">
                <Icon icon="mdi:phone" />
                +91 {mobile}
              </span>

              <span className="flex items-center gap-1">
                <Icon icon="mdi:email" />
                accounts@indiaphosphate.com
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        {/* <div className="flex flex-wrap gap-3">
          <Badge color="success" size="lg">
            Active Customer
          </Badge>

          <Badge color="warning" size="lg">
            Payment Due
          </Badge>

          <Badge color="info" size="lg">
            Credit Limit ₹50 Lac
          </Badge>
        </div> */}
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mt-6 pt-6 border-t">
        <div>
          <p className="text-gray-500 text-sm">Sales Executive</p>
          <h4 className="font-semibold">{person_name}</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Territory</p>
          <h4 className="font-semibold">Central India</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Business Potential</p>
          <h4
            className={`font-semibold ${
              businessPotential === 'High'
                ? 'text-green-600'
                : businessPotential === 'Medium'
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          >
            {businessPotential}
          </h4>{' '}
        </div>

        <div>
          <p className="text-gray-500 text-sm">Payment Behaviour</p>
          <h4 className="font-semibold text-orange-500">
            Average ({analytics?.avgPaymentCycle} Days)
          </h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Last Purchase</p>
          <h4 className="font-semibold">{formatDate(lastPurchase?.created_at)}</h4>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Last Payment</p>
          <h4 className="font-semibold">{formatDate(lastPayment?.payment_date)}</h4>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
