import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { formatDate, formatTime } from 'src/utils/Datetimeformate';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewGuardModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
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
          View Guard Details
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto p-6 bg-white shadow-md rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ['Inward Number', selectedRow?.inward_number],
                ['Guard Type', selectedRow?.guard_type],
                ['Vehicle Number', selectedRow?.vehicle_number],
                ['Entry Date', formatDate(selectedRow?.entry_date)],
                ['Entry Time', formatTime(selectedRow?.entry_time)],
                ['Quantity', selectedRow?.quantity_net],
                ['Unit', selectedRow?.quantity_unit],
                ['Sender Name', selectedRow?.sender_name],
                ['Remark', selectedRow?.remark],
                ['Product Name', selectedRow?.product_name],
                ['Product Id', selectedRow?.product_id],
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

export default ViewGuardModal;
