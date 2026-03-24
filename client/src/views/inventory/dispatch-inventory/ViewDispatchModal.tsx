import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'flowbite-react';

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
  // ✅ Batch Map
  const batchMap = Object.fromEntries(
    (StoreDatas || []).map((b: any) => [b.id, b.qc_batch_number]),
  );

  // ✅ Get Batch Numbers
  const getBatchNumbers = () => {
    let value = selectedRow?.batch_numbers;

    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        value = [];
      }
    }

    if (!Array.isArray(value)) return '-';

    return value.map((id: any) => batchMap[id] || id).join(', ');
  };

  // ✅ Date Formatter
  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN');
  };

  // ✅ Reusable Info
  const Info = ({ label, value, highlight = false, multiline = false }: any) => (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div
        className={`text-sm font-medium px-3 py-2 rounded-md border ${
          highlight
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
        } ${multiline ? 'min-h-[60px]' : ''}`}
      >
        {value || '-'}
      </div>
    </div>
  );

  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
    >
      {/* 🔥 HEADER */}
      <ModalHeader className="border-b bg-gradient-to-r from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              🚚 Dispatch Details
            </h2>
            <p className="text-xs text-gray-500 mt-1">View complete dispatch information</p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            Active
          </span>
        </div>
      </ModalHeader>

      {/* 🔥 BODY */}
      <ModalBody>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-6">
          {/* 🚀 TOP SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Info label="Vehicle Number" value={selectedRow?.vehicle_number} highlight />
            <Info label="Quantity" value={selectedRow?.quantity} highlight />
            <Info label="Unit" value={selectedRow?.unit} highlight />
          </div>

          {/* 🔻 DIVIDER */}
          <div className="border-t"></div>

          {/* 📦 DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Basic Information</h3>

              <Info label="Driver Details" value={selectedRow?.driver_details} />
              <Info label="Invoice No." value={selectedRow?.invoice_no} />
              <Info label="Booking Date" value={formatDate(selectedRow?.booking_date)} />
              <Info label="Arrived Date" value={formatDate(selectedRow?.arrived_booking)} />
              <Info label="Batch Numbers" value={getBatchNumbers()} />
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Delivery Details</h3>

              <Info label="Delivery Location" value={selectedRow?.delivery_location} />
              <Info label="Transporter" value={selectedRow?.delivered_by} />
              <Info label="Remarks" value={selectedRow?.remarks} multiline />
            </div>
          </div>
        </div>
      </ModalBody>

      {/* 🔥 FOOTER */}
      <ModalFooter className="justify-between border-t">
        <div className="text-xs text-gray-500">
          Created on: {formatDate(selectedRow?.created_at)}
        </div>

        <div className="flex gap-2">
          <Button color="gray" onClick={() => setPlaceModal(false)}>
            Close
          </Button>

          <Button color="primary" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ViewDispatchModal;
