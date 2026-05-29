import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductWithPO } from 'src/features/master/Customer/CustomerSlice';
import { AppDispatch } from 'src/store';
import CustomerJourneyMap from './CustomerJourneymap';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from 'recharts';

// const journeyStages = [
//   {
//     stage: 'Awareness',
//     color: 'bg-yellow-500',
//     topActivities: ['Print Content', 'Search Data'],
//     bottomActivities: ['Word of Mouth', 'Radio / TV'],
//   },
//   {
//     stage: 'Consideration',
//     color: 'bg-pink-500',
//     topActivities: ['Landing Page', 'Social Media'],
//     bottomActivities: ['Direct Mail', 'Store & Branch'],
//   },
//   {
//     stage: 'Purchase',
//     color: 'bg-green-500',
//     topActivities: ['Website'],
//     bottomActivities: ['Agent & Broker'],
//   },
//   {
//     stage: 'Retention',
//     color: 'bg-cyan-500',
//     topActivities: ['Web Service', 'Community'],
//     bottomActivities: ['Mailing', 'Offer & Invoice'],
//   },
//   {
//     stage: 'Advocacy',
//     color: 'bg-blue-600',
//     topActivities: ['Offer to Customers', 'Loyalty Program'],
//     bottomActivities: ['Referrals'],
//   },
// ];

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewCustomerModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ IMPORTANT
  const { productswithpo } = useSelector((state: any) => state.customer);

  const traders = Array.isArray(selectedRow?.trader_names)
    ? selectedRow.trader_names
    : typeof selectedRow?.trader_names === 'string'
      ? JSON.parse(selectedRow.trader_names)
      : [];

  const contacts = Array.isArray(selectedRow?.contacts)
    ? selectedRow.contacts
    : typeof selectedRow?.contacts === 'string'
      ? JSON.parse(selectedRow.contacts)
      : [];

  const addresses = Array.isArray(selectedRow?.addresses)
    ? selectedRow.addresses
    : typeof selectedRow?.addresses === 'string'
      ? JSON.parse(selectedRow.addresses)
      : [];

  const products = Array.isArray(selectedRow?.products)
    ? selectedRow.products
    : typeof selectedRow?.products === 'string'
      ? JSON.parse(selectedRow.products)
      : [];

  const fetchData = async () => {
    if (!selectedRow?.id) return;

    try {
      await dispatch(getProductWithPO({ id: selectedRow.id })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRow]);

  return (
    <Modal
      size="6xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
    >
      <ModalHeader className="text-2xl font-bold text-gray-900">Customer Details</ModalHeader>

      <ModalBody>
        <Tabs variant="underline">
          {/* CUSTOMER INFO */}

          <TabItem
            title="Customer Info"
            icon={() => <Icon icon="solar:user-outline" height={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-gray-700 text-sm font-semibold">Company Name</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.company_name || '-'}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-gray-700 text-sm font-semibold">Application</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.application || '-'}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-gray-700 text-sm font-semibold">Customer Type</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.customer_type || '-'}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-gray-700 text-sm font-semibold">Company HQ</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.company_hq || '-'}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-gray-700 text-sm font-semibold">Company Address</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.company_address || '-'}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-gray-700 text-sm font-semibold">Open Field</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.open_field || '-'}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded shadow-sm">
                <p className="text-gray-700 text-sm font-semibold">Sales Person Name</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.sales_person?.username || '-'}
                </p>
              </div>
            </div>
          </TabItem>

          {/* TRADERS */}

          <TabItem title="Traders" icon={() => <Icon icon="solar:shop-outline" height={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {traders.length > 0 ? (
                traders.map((trader: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded shadow-sm text-gray-900 font-medium"
                  >
                    {trader}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No traders available</p>
              )}
            </div>
          </TabItem>

          {/* CONTACTS */}

          <TabItem title="Contacts" icon={() => <Icon icon="solar:phone-outline" height={20} />}>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Contact Person</th>
                    <th className="p-2 border">Contact Email</th>
                    <th className="p-2 border">Number</th>
                  </tr>
                </thead>

                <tbody className="text-gray-900">
                  {contacts.length > 0 ? (
                    contacts.map((c: any, index: number) => (
                      <tr key={index}>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border font-medium">{c.person}</td>
                        <td className="p-2 border font-medium">{c.email}</td>
                        <td className="p-2 border">{c.number}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center p-3 text-gray-500">
                        No contacts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabItem>

          {/* ADDRESSES */}

          <TabItem
            title="Addresses"
            icon={() => <Icon icon="solar:map-point-outline" height={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.length > 0 ? (
                addresses.map((addr: any, index: number) => (
                  <div key={index} className="bg-gray-100 p-4 rounded shadow-sm text-gray-900">
                    {/* <p>
                      <span className="font-semibold text-gray-800">Company Address:</span>{' '}
                      {addr.company_address}
                    </p> */}

                    <p>
                      <span className="font-semibold text-gray-800">Factory Address:</span>{' '}
                      {addr.factory_address}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-800">City:</span> {addr.city}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-800">Country:</span> {addr.country}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No address available</p>
              )}
            </div>
          </TabItem>

          {/* PRODUCTS */}

          <TabItem title="Products" icon={() => <Icon icon="solar:box-outline" height={20} />}>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Grade</th>
                  </tr>
                </thead>

                <tbody className="text-gray-900">
                  {products.length > 0 ? (
                    products.map((p: any, index: number) => (
                      <tr key={index}>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border font-medium">{p.product}</td>
                        <td className="p-2 border">{p.grade}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center p-3 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabItem>

          <TabItem
            title="Added Products"
            icon={() => <Icon icon="solar:box-outline" height={20} />}
          >
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-2 border">S.No</th>
                    <th className="p-2 border">Product Name</th>
                  </tr>
                </thead>

                <tbody className="text-gray-900">
                  {productswithpo.length > 0 ? (
                    productswithpo.map((p: any, index: number) => (
                      <tr key={index}>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border font-medium">{p.product_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center p-3 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabItem>

          <TabItem
            title="Customer Journey Maps"
            icon={() => <Icon icon="solar:chart-outline" height={20} />}
          >
            <CustomerJourneyMap selectedRow={selectedRow} />
            {/* CRM Analytics Dashboard */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
              <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Opportunity Insights</p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">78%</h2>

                    <p className="text-green-600 text-sm mt-2">High conversion probability</p>
                  </div>

                  <Icon icon="solar:graph-up-outline" width={40} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Future Requirement Prediction</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">Calcium Carbonate</h2>

                    <p className="text-green-600 text-sm mt-2">Expected next month</p>
                  </div>

                  <Icon icon="solar:lightbulb-outline" width={40} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Buying Behavior</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">Bulk Orders</h2>

                    <p className="text-yellow-600 text-sm mt-2">Quarterly purchase cycle</p>
                  </div>

                  <Icon icon="solar:cart-large-outline" width={40} className="text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pain Points</p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">Delivery Delay</h2>

                    <p className="text-red-600 text-sm mt-2">Frequent complaint detected</p>
                  </div>

                  <Icon icon="solar:danger-outline" width={40} className="text-red-500" />
                </div>
              </div>
            </div> */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-800">Product Frequency</h3>

                  <Icon icon="solar:box-outline" width={24} className="text-blue-500" />
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Calcium Carbonate', value: 90 },
                    { name: 'Hydrated Lime', value: 70 },
                    { name: 'Dolomite Powder', value: 45 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-800">Dormant Customer Tracking</h3>

                  <Icon icon="solar:clock-circle-outline" width={24} className="text-red-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-semibold text-gray-800">ABC Industries</p>

                      <p className="text-sm text-gray-500">Last order: 93 days ago</p>
                    </div>

                    <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full">
                      High Risk
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-semibold text-gray-800">XYZ Minerals</p>

                      <p className="text-sm text-gray-500">Last order: 61 days ago</p>
                    </div>

                    <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                      Medium Risk
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
          </TabItem>

          <TabItem
            title="Customer Overview Card"
            icon={() => <Icon icon="solar:box-outline" height={20} />}
          >
            {/* Customer Overview Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow p-6 mt-8 border">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left Section */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon icon="solar:buildings-2-outline" width={30} className="text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">ABC Industries</h2>

                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                          Paint Industry
                        </span>

                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                          India
                        </span>

                        <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                          Gujarat
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sales Info */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-gray-500 text-sm">Total Enquiry</p>

                      <h3 className="text-2xl font-bold text-gray-800 mt-1">14</h3>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-gray-500 text-sm">Converted</p>

                      <h3 className="text-2xl font-bold text-green-600 mt-1">9</h3>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-gray-500 text-sm">Lost</p>

                      <h3 className="text-2xl font-bold text-red-500 mt-1">3</h3>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-gray-500 text-sm">Pending</p>

                      <h3 className="text-2xl font-bold text-yellow-500 mt-1">2</h3>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
                  {/* FY Sale */}
                  <div className="bg-white rounded-2xl shadow-sm p-5 min-w-[180px] border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total FY Sale</p>

                        <h3 className="text-2xl font-bold text-gray-800 mt-2">₹1.8 Cr</h3>
                      </div>

                      <Icon icon="solar:dollar-outline" width={32} className="text-green-500" />
                    </div>
                  </div>

                  {/* Product */}
                  <div className="bg-white rounded-2xl shadow-sm p-5 min-w-[220px] border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Most Purchased Product</p>

                        <h3 className="text-lg font-bold text-gray-800 mt-2">Calcium Carbonate</h3>
                      </div>

                      <Icon icon="solar:box-outline" width={32} className="text-blue-500" />
                    </div>
                  </div>

                  {/* Buying Frequency */}
                  <div className="bg-white rounded-2xl shadow-sm p-5 min-w-[200px] border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Buying Frequency</p>

                        <h3 className="text-xl font-bold text-gray-800 mt-2">Every 45 Days</h3>
                      </div>

                      <Icon icon="solar:refresh-outline" width={32} className="text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabItem>
        </Tabs>
      </ModalBody>

      <ModalFooter className="justify-center">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewCustomerModal;
