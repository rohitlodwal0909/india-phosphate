import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
import { getGstDetails } from 'src/features/dashboard/DashboardCustomerSlice';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewSupplierModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ IMPORTANT
  const { gstData, gstLoading, gstError } = useSelector((state: any) => state.customerdashboard);

  const fetchData = async () => {
    if (!selectedRow?.id) return;

    try {
      if (selectedRow?.gst_number) {
        dispatch(getGstDetails({ gstin: selectedRow.gst_number, forceRefresh: true }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRow]);

  const fields = [
    ['Supplier Name', selectedRow?.supplier_name],
    ['Contact Number', selectedRow?.contact_no],
    ['Address', selectedRow?.address],
    ['Email', selectedRow?.email],
    ['Supplier Type', selectedRow?.supplier_type],
    ['Manufacturer Type', selectedRow?.manufacturer_type],
    ['GST Number', selectedRow?.gst_number],
    ['Invoice Number', selectedRow?.invoice_no],
    ['Domestic', selectedRow?.domestic],
  ];

  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="overflow-x-hidden"
    >
      <ModalHeader className="pb-0 text-center text-2xl font-bold text-gray-800">
        Supplier Details
      </ModalHeader>
      <ModalBody>
        <Tabs aria-label="Tabs with underline" variant="underline">
          <TabItem
            active
            title="Supplier View"
            icon={() => <Icon icon="solar:shield-user-outline" height={20} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2">
              {fields.map(([label, value]) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-gray-500 font-semibold">{label}</p>
                  <p className="text-base text-gray-800 mt-1 font-medium break-words">
                    {value || '-'}
                  </p>
                </div>
              ))}
            </div>
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
        <div className="rounded-lg  n px-2">
          <div className="bg-white shadow rounded p-4"></div>
        </div>
      </ModalBody>
      <ModalFooter className="justify-center">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewSupplierModal;
