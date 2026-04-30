import { Modal, ModalBody, ModalHeader } from 'flowbite-react';

type Props = {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewProductionPlanning = ({ openModal, setOpenModal, selectedRow }: Props) => {
  const details = [
    ['Work Order No', selectedRow?.work_order_no],

    // ['Equipment', selectedRow?.Equipment?.name],

    ['Material Name', selectedRow?.Product?.product_name],

    ['Quantity', selectedRow?.quantity],

    ['Unit', selectedRow?.unit],

    ['Quality', selectedRow?.quality],

    ['Batch No', selectedRow?.batch_no],

    [
      'Expected FPR Date',
      selectedRow?.expected_fpr_date
        ? new Date(selectedRow.expected_fpr_date).toLocaleDateString()
        : '-',
    ],

    ['Labours', selectedRow?.labours],

    ['Output', selectedRow?.output],
  ];

  return (
    <Modal size="3xl" show={openModal} position="center" onClose={() => setOpenModal(false)}>
      <ModalHeader className="pb-0 text-center font-semibold text-gray-800">
        Production Planning Details
      </ModalHeader>

      <ModalBody>
        <div className="mx-auto p-6 bg-white shadow rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {details.map(([label, value]) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>

                <p className="text-gray-900">{value || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewProductionPlanning;
