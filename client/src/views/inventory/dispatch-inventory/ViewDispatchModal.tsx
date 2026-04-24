import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'flowbite-react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewDispatchModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  /* ================= DATE FORMAT ================= */
  const formatDate = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN');
  };

  /* ================= TOTAL QTY ================= */
  const totalQty =
    selectedRow?.batches?.reduce((sum: number, b: any) => sum + Number(b.quantity || 0), 0) || 0;

  /* ================= COMMON INFO UI ================= */
  const Info = ({ label, value, highlight = false, multiline = false }: any) => (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>

      <div
        className={`text-sm font-medium px-3 py-2 rounded-md border
        ${
          highlight
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
        }
        ${multiline ? 'min-h-[60px]' : ''}`}
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
      {/* ================= HEADER ================= */}
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

      {/* ================= BODY ================= */}
      <ModalBody>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 space-y-6">
          {/* ===== TOP SUMMARY ===== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Info label="Vehicle Number" value={selectedRow?.vehicle_number} highlight />
            <Info label="Total Quantity" value={totalQty} highlight />
            <Info label="Dispatch Date" value={formatDate(selectedRow?.dispatch_date)} highlight />
          </div>

          <div className="border-t"></div>

          {/* ===== BASIC + DELIVERY ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Basic Information</h3>

              <Info label="Product Name" value={selectedRow?.product_name} />
              <Info label="LR No." value={selectedRow?.lr_no} />
              <Info label="Driver Details" value={selectedRow?.driver_details} />
              <Info label="Booking Date" value={formatDate(selectedRow?.booking_date)} />
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Delivery Details</h3>

              <Info label="Delivery Location" value={selectedRow?.delivery_location} />
              <Info label="Transporter" value={selectedRow?.Transport?.transporter_name} />
              <Info label="Arrived Date" value={formatDate(selectedRow?.arrived_booking)} />
              <Info label="Remarks" value={selectedRow?.remarks} multiline />
            </div>
          </div>

          {/* ================= BATCH TABLE ================= */}
          <div>
            <h3 className="text-sm font-semibold text-dark-600 uppercase mb-2">Batch Details</h3>

            <div className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-gray-700 dark:text-gray-200">
                {/* Header */}
                <thead className="bg-gradient-to-r from-indigo-300 to-indigo-300 text-black">
                  <tr>
                    <th className="p-3 text-left font-semibold">Batch No</th>
                    <th className="p-3 text-left font-semibold">Quantity</th>
                    <th className="p-3 text-left font-semibold">Unit</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y dark:divide-gray-700">
                  {selectedRow?.batches?.length ? (
                    selectedRow.batches.map((batch: any, index: number) => (
                      <tr
                        key={index}
                        className="hover:bg-indigo-50 dark:hover:bg-gray-800 transition duration-150"
                      >
                        <td className="p-3 font-medium text-indigo-600 dark:text-indigo-400">
                          {batch.batch.qc_batch_number}
                        </td>

                        <td className="p-3">{batch.quantity}</td>

                        <td className="p-3">
                          <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-semibold">
                            {batch.unit}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center p-6 text-gray-400">
                        No batch data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ModalBody>

      {/* ================= FOOTER ================= */}
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
