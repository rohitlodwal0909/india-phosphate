import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductWithPO } from 'src/features/master/Customer/CustomerSlice';
import { AppDispatch } from 'src/store';
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

  const journeyStages = [
    {
      stage: 'Awareness',
      icon: 'solar:eye-outline',
      color: 'bg-yellow-500',
      topActivities: ['Print Content', 'Search Data'],
      bottomActivities: ['Word of Mouth', 'Radio / TV'],
    },
    {
      stage: 'Consideration',
      icon: 'solar:chat-round-outline',
      color: 'bg-pink-500',
      topActivities: ['Landing Page', 'Social Media'],
      bottomActivities: ['Direct Mail', 'Store & Branch'],
    },
    {
      stage: 'Purchase',
      icon: 'solar:cart-outline',
      color: 'bg-green-500',
      topActivities: ['Website'],
      bottomActivities: ['Agent & Broker'],
    },
    {
      stage: 'Retention',
      icon: 'solar:shield-check-outline',
      color: 'bg-cyan-500',
      topActivities: ['Web Service', 'Community'],
      bottomActivities: ['Mailing', 'Offer & Invoice'],
    },
    {
      stage: 'Advocacy',
      icon: 'solar:like-outline',
      color: 'bg-blue-600',
      topActivities: ['Offer to Customers', 'Loyalty Program'],
      bottomActivities: ['Referrals'],
    },
  ];

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
            <div className="bg-[#f8fafc] rounded-2xl p-10 overflow-x-auto">
              <div className="min-w-[1200px] relative">
                {/* Top Labels */}
                <div className="flex justify-between mb-10 px-10">
                  {journeyStages.map((stage, index) => (
                    <div key={index} className="flex flex-col items-center w-[180px]">
                      <div className="flex flex-col items-center gap-3">
                        {stage.topActivities.map((item: string, i: number) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-yellow-400 border-4 border-white shadow-lg z-10" />

                            <div className="w-[2px] h-6 bg-gray-300" />

                            <span className="text-xs text-gray-600 whitespace-nowrap">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Journey Stages */}
                <div className="flex items-center">
                  {journeyStages.map((stage, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center justify-center h-16 flex-1 text-white font-semibold text-sm tracking-wide
            ${stage.color}
            ${index !== 0 ? 'ml-2' : ''}
          `}
                      style={{
                        clipPath:
                          index !== journeyStages.length - 1
                            ? 'polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 8% 50%)'
                            : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 8% 50%)',
                      }}
                    >
                      <div className="flex items-center gap-2 z-10">
                        <Icon icon={stage.icon} width={20} />
                        {stage.stage}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Labels */}
                <div className="flex justify-between mt-10 px-10">
                  {journeyStages.map((stage, index) => (
                    <div key={index} className="flex flex-col items-center w-[180px]">
                      <div className="flex flex-col items-center gap-3">
                        {stage.bottomActivities.map((item: string, i: number) => (
                          <div key={i} className="flex flex-col items-center">
                            <span className="text-xs text-gray-600 whitespace-nowrap mb-2">
                              {item}
                            </span>

                            <div className="w-[2px] h-6 bg-gray-300" />

                            <div className="w-4 h-4 rounded-full bg-pink-500 border-4 border-white shadow-lg z-10" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CRM Analytics Dashboard */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
              {/* Opportunity Insights */}
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

              {/* Future Prediction */}
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

              {/* Buying Behavior */}
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

              {/* Pain Points */}
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
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Product Frequency */}
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

              {/* Dormant Customer */}
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
