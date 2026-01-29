import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { formatDate } from 'src/utils/Datetimeformate';

type Props = {
  openModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const BmrView = ({ openModal, setPlaceModal, selectedRow }: Props) => {
  return (
    <div>
      <Modal
        size="3xl"
        show={openModal}
        position="center"
        onClose={() => setPlaceModal(false)}
        className="large"
      >
        <ModalHeader className="pb-0 text-center mb-2 font-semibold text-gray-800">
          View BMR Report
        </ModalHeader>
        <ModalBody>
          <div className=" mx-auto p-6 bg-white shadow-md rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                ['Product Name', selectedRow?.records?.product_name],
                ['Batch No.', selectedRow?.batch_no],
                ['Batch Size', selectedRow?.records?.batch_size],
                ['MFG. Date', formatDate(selectedRow?.mfg_date)],
                ['EXP. Date', formatDate(selectedRow?.exp_date)],
                ['MFG. Start', formatDate(selectedRow?.mfg_date)],
                ['MFG. Completed', formatDate(selectedRow?.mfg_complete)],
                ['Product Code', selectedRow?.records?.product_code],
                ['Shelf Life', selectedRow?.records?.shelf_life],
                ['Packaging', selectedRow?.records?.packaging_details],
                ['Storage Condition', selectedRow?.records?.storage_conditions],
                ['Status', selectedRow?.status],
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

export default BmrView;
