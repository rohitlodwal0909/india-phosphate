import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductWithPO } from 'src/features/master/Customer/CustomerSlice';
import { AppDispatch } from 'src/store';
import CustomerJourneyMap from './CustomerJourneymap';
import { getGstDetails } from 'src/features/dashboard/DashboardCustomerSlice';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewCustomerModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ IMPORTANT
  const { productswithpo } = useSelector((state: any) => state.customer);
  const { gstData, gstLoading, gstError } = useSelector((state: any) => state.customerdashboard);

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
      if (selectedRow?.gstin) {
        dispatch(getGstDetails({ gstin: selectedRow.gstin, forceRefresh: true }));
      }
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
          </TabItem>
          <TabItem
            title="GST Details"
            icon={() => <Icon icon="solar:document-text-outline" height={20} />}
          >
            {gstLoading ? (
              <div className="text-center py-8 text-gray-500">Loading GST details...</div>
            ) : gstError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded p-4">
                {gstError}
              </div>
            ) : gstData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Info */}
                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">GSTIN</p>
                  <p className="text-gray-900 font-bold text-base">{gstData?.gstin || '-'}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">PAN Number</p>
                  <p className="text-gray-900 font-bold text-base">{gstData?.pan_number || '-'}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">GST Status</p>
                  <p className="text-gray-900 font-bold text-base">{gstData?.gst_status || '-'}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm md:col-span-2">
                  <p className="text-gray-700 text-sm font-semibold">Legal Name</p>
                  <p className="text-gray-900 font-bold text-base">{gstData?.legal_name || '-'}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm md:col-span-1">
                  <p className="text-gray-700 text-sm font-semibold">Trade Name</p>
                  <p className="text-gray-900 font-bold text-base">{gstData?.trade_name || '-'}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Constitution</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.constitution || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Taxpayer Type</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.taxpayer_type || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Registration Date</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.registration_date || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Last GST Update</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.gst_last_updated || '-'}
                  </p>
                </div>

                {/* Jurisdiction */}
                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Center Jurisdiction</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.center_jurisdiction || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Center Jurisdiction Code</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.center_jurisdiction_code || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">State Jurisdiction</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.state_jurisdiction || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">State Jurisdiction Code</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.state_jurisdiction_code || '-'}
                  </p>
                </div>

                {/* Address Fields */}
                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Building Name</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_building_name || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Building No</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_building_no || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Floor No</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_floor_no || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm md:col-span-2">
                  <p className="text-gray-700 text-sm font-semibold">Street</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_street || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Location</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_location || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">District</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_district || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">State</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_state || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Pincode</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_pincode || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm">
                  <p className="text-gray-700 text-sm font-semibold">Landmark</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.address_landmark || '-'}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded shadow-sm md:col-span-3">
                  <p className="text-gray-700 text-sm font-semibold">Full Address</p>
                  <p className="text-gray-900 font-bold text-base">
                    {gstData?.full_address || '-'}
                  </p>
                </div>

                {/* Nature of Business */}
                <div className="bg-gray-100 p-4 rounded shadow-sm md:col-span-3">
                  <p className="text-gray-700 text-sm font-semibold mb-2">Nature of Business</p>

                  {Array.isArray(gstData?.business_nature) ? (
                    gstData.business_nature.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {gstData.business_nature.map((item: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-900 font-bold text-base">-</p>
                    )
                  ) : typeof gstData?.business_nature === 'string' ? (
                    <p className="text-gray-900 font-bold text-base">{gstData.business_nature}</p>
                  ) : (
                    <p className="text-gray-900 font-bold text-base">-</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No GST details found</div>
            )}
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
