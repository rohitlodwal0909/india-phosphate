import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewWorkOrderModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  const products =
    typeof selectedRow?.products === 'string'
      ? JSON.parse(selectedRow.products)
      : selectedRow?.products || [];

  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
    >
      <ModalHeader className="text-center font-bold text-xl text-gray-900 border-b pb-3">
        Work Order
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Company Details */}
        <div className="bg-gray-50 p-5 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">PO Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-gray-800">PO No.</label>
              <p className="text-gray-900 mt-1">{selectedRow?.po_no || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Company Name</label>
              <p className="text-gray-900 mt-1">{selectedRow?.customers?.company_name || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Company Address</label>
              <p className="text-gray-900 mt-1">{selectedRow?.company_address || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Delivery Address</label>
              <p className="text-gray-900 mt-1">{selectedRow?.delivery_address || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Payment Terms</label>
              <p className="text-gray-900 mt-1">{selectedRow?.payment_terms || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Freight</label>
              <p className="text-gray-900 mt-1">{selectedRow?.freight || '-'}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Expected Delivery Date</label>
              <p className="text-gray-900 mt-1">{selectedRow?.expected_delivery_date || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-800">Submitted By</label>
              <p className="text-gray-900 mt-1">{selectedRow?.submitted_by || '-'}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white border rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Product Details
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Rate</th>
                  <th className="p-3 text-left">GST %</th>
                  <th className="p-3 text-left">Packing</th>
                  <th className="p-3 text-left">Total</th>
                </tr>
              </thead>

              <tbody>
                {products.length ? (
                  products.map((p: any, i: number) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">{p.product_name}</td>
                      <td className="p-3 text-gray-700">{p.grade}</td>
                      <td className="p-3 text-gray-700">{p.quantity}</td>
                      <td className="p-3 text-gray-700">{p.rate}</td>
                      <td className="p-3 text-gray-700">{p.gst}</td>
                      <td className="p-3 text-gray-700">{p.packing}</td>
                      <td className="p-3 font-semibold text-gray-900">{p.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No Products Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Details */}
        {selectedRow?.export && (
          <div className="bg-gray-50 p-5 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Export Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-800">Country</label>
                <p className="text-gray-900 mt-1">{selectedRow?.country_name || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">Inco Term</label>
                <p className="text-gray-900 mt-1">{selectedRow?.inco_term || '-'}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">Discharge Port</label>
                <p className="text-gray-900 mt-1">{selectedRow?.discharge_port || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <button
          onClick={() => setPlaceModal(false)}
          className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewWorkOrderModal;
