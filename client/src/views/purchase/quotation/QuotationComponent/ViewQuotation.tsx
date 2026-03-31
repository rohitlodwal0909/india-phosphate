import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';

type Props = {
  placeModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewModal = ({ placeModal, setPlaceModal, selectedRow }: Props) => {
  /* ================= PRODUCTS PARSE ================= */

  const products =
    typeof selectedRow?.products === 'string'
      ? JSON.parse(selectedRow?.products || '[]')
      : selectedRow?.products || [];

  /* ================= BASIC FIELDS ================= */

  const fields = [
    ['Company Name', selectedRow?.company_name],
    ['Contact Person', selectedRow?.contact_person],
    ['Mobile', selectedRow?.mobile],
    ['Trade Type', selectedRow?.trade_type],
    ['Country', selectedRow?.country],
    ['Inco Term', selectedRow?.inco_term],
    ['Discharge Port', selectedRow?.discharge_port],
  ];

  return (
    <Modal size="6xl" show={placeModal} position="center" onClose={() => setPlaceModal(false)}>
      <ModalHeader className="text-2xl font-bold">Quotation Details</ModalHeader>

      <ModalBody>
        <Tabs variant="underline">
          {/* ================= QUOTATION VIEW ================= */}

          <TabItem
            active
            title="Quotation Info"
            icon={() => <Icon icon="mdi:file-document-outline" height={20} />}
          >
            {/* BASIC DETAILS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
              {fields.map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded-md p-4 shadow-sm">
                  <p className="text-sm text-gray-500 font-semibold">{label}</p>
                  <p className="text-base font-medium mt-1">{value || '-'}</p>
                </div>
              ))}
            </div>

            {/* ================= PRODUCTS ================= */}

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Products</h3>

              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">#</th>
                      <th className="border px-4 py-2">Product Name</th>
                      <th className="border px-4 py-2">Rate</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-4">
                          No Products
                        </td>
                      </tr>
                    ) : (
                      products.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{item.name}</td>
                          <td className="border px-4 py-2">{item.rate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= REMARK ================= */}

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Remark</h3>

              <div className="bg-gray-50 p-4 rounded-md">{selectedRow?.remark || '-'}</div>
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

export default ViewModal;
