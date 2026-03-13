import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { TabItem, Tabs } from 'flowbite-react';
import { Icon } from '@iconify/react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewCustomerModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
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
                <p className="text-gray-700 text-sm font-semibold">Customer Type</p>
                <p className="text-gray-900 font-bold text-base">
                  {selectedRow?.customer_type || '-'}
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
                    <th className="p-2 border">Number</th>
                  </tr>
                </thead>

                <tbody className="text-gray-900">
                  {contacts.length > 0 ? (
                    contacts.map((c: any, index: number) => (
                      <tr key={index}>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border font-medium">{c.person}</td>
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
                    <p>
                      <span className="font-semibold text-gray-800">Company Address:</span>{' '}
                      {addr.company_address}
                    </p>

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
