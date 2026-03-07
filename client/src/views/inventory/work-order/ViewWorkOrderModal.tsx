import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewWorkOrderModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
    >
      <ModalHeader className="pb-0 text-center mb-4 font-semibold text-gray-800">
        View Work Order
      </ModalHeader>

      <ModalBody>
        <div className="mx-auto p-6 bg-white shadow-md rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ['Company Name', selectedRow?.company_name],
              ['Company Address', selectedRow?.company_address],
              ['Delivery Address', selectedRow?.delivery_address],
              ['Product Name', selectedRow?.product_name],
              ['Grade', selectedRow?.grade],
              ['Quantity', selectedRow?.quantity],
              ['Rate', selectedRow?.rate],
              ['GST (%)', selectedRow?.gst],
              ['Total Amount', selectedRow?.total],
              ['Packing', selectedRow?.packing],
              ['Freight', selectedRow?.freight],
              ['Payment Terms', selectedRow?.payment_terms],
              ['Order Type', selectedRow?.export ? 'Export' : 'Domestic'],
              ['Expected Delivery Date', selectedRow?.expected_delivery_date],
            ].map(([label, value]) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{value || '-'}</p>
              </div>
            ))}

            {/* Export Specific Fields */}
            {selectedRow?.export && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Country Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {selectedRow?.country_name || '-'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Inco Term
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {selectedRow?.inco_term || '-'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Discharge Port
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {selectedRow?.discharge_port || '-'}
                  </p>
                </div>
              </>
            )}

            {/* Custom Labels */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Customise Labels
              </label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                {selectedRow?.customise_labels || '-'}
              </p>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={() => setPlaceModal(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewWorkOrderModal;
