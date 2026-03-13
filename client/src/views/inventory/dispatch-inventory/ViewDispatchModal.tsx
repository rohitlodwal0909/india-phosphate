import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
  StoreDatas: any;
};

const ViewDispatchModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
  StoreDatas,
}: Props) => {
  const batchMap = Object.fromEntries(
    (StoreDatas || []).map((b: any) => [b.id, b.qc_batch_number]),
  );

  const getBatchNumbers = () => {
    let value = selectedRow?.batch_numbers;

    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        value = [];
      }
    }

    if (!Array.isArray(value)) return '';

    return value.map((id: any) => batchMap[id] || id).join(', ');
  };

  return (
    <div>
      <Modal
        size="3xl"
        show={placeModal}
        position={modalPlacement}
        onClose={() => setPlaceModal(false)}
        className="large"
      >
        <ModalHeader className="pb-0 text-center mb-2 font-semibold text-gray-800">
          View Dispatch Details
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto p-6 bg-white shadow-md rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ['Vehicle Number', selectedRow?.vehicle_number],
                ['Driver Details', selectedRow?.driver_details],
                ['Batch Number', getBatchNumbers()],
                // ['Inward Number', selectedRow?.invoice_number],
                ['Remark', selectedRow?.remarks],
                ['Delivery Location', selectedRow?.delivery_location],
                ['Delivered BY', selectedRow?.delivered_by],
                ['Quantity', selectedRow?.quantity],
                ['Unit', selectedRow?.unit],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-black-900 mb-1">{label}</label>
                  <p className="text-gray-900">{value || '-'}</p>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </div>
  );
};

export default ViewDispatchModal;
