import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewDispatchModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
}: Props) => {

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
        View Dispatch  Details
      </ModalHeader>
      <ModalBody>
        <div className=" mx-auto p-6 bg-white shadow-md rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              ["Vehicle Number", selectedRow?.vehicle_number ],
              ["Product Name", selectedRow?.product_name],
              ["Driver Details", selectedRow?.driver_details],
[
  "Batch Number",
  (() => {
    let value = selectedRow?.batch_numbers;
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        return '';
      }
    }
    return Array.isArray(value) ? value.map((v: any) => v.value).join(', ') : '';
  })()
],
              ["Inward Number", selectedRow?.invoice_number],
              ["Remark", selectedRow?.remarks],
              ["Delivery Location", selectedRow?.delivery_location],
              ["Delivered BY",selectedRow?.delivered_by],
              ["Quantity", selectedRow?.quantity],
              ["Unit", selectedRow?.unit],  
            ].map(([label, value]) => (
              <div key={label}>
                <label className="block text-sm font-medium text-black-900 mb-1">
                  {label}
                </label>
                <p className="text-gray-900">{value || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
      </ModalFooter>
    </Modal>
    </div>
  );
};

export default ViewDispatchModal;
