import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { ImageUrl } from 'src/constants/contant';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewDisputeModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  /* ================= FOLLOWUPS ================= */

  const followups =
    typeof selectedRow?.followups === 'string'
      ? JSON.parse(selectedRow.followups)
      : selectedRow?.followups || [];

  /* ================= PRIORITY OPTIONS ================= */

  const priorityOptions = [
    {
      value: 'high',
      label: 'High',
      color: '#dc2626',
    },
    {
      value: 'medium',
      label: 'Medium',
      color: '#f59e0b',
    },
    {
      value: 'low',
      label: 'Low',
      color: '#16a34a',
    },
  ];

  /* ================= STATUS OPTIONS ================= */

  const disputeStatusOptions = [
    {
      value: 'open',
      label: 'Open',
      color: '#2563eb',
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      color: '#f59e0b',
    },
    {
      value: 'resolved',
      label: 'Resolved',
      color: '#16a34a',
    },
    {
      value: 'closed',
      label: 'Closed',
      color: '#6b7280',
    },
  ];

  /* ================= GETTERS ================= */

  const getPriority = (priority: string) => priorityOptions.find((p) => p.value === priority);

  const getStatus = (status: string) => disputeStatusOptions.find((s) => s.value === status);

  /* ================= BADGES ================= */

  const PriorityBadge = ({ priority }: any) => {
    const option = getPriority(priority);

    if (!option) return <span>-</span>;

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit"
        style={{
          backgroundColor: `${option.color}20`,
          color: option.color,
        }}
      >
        <span
          style={{
            background: option.color,
            width: 8,
            height: 8,
            borderRadius: '50%',
          }}
        />
        {option.label}
      </span>
    );
  };

  const StatusBadge = ({ status }: any) => {
    const option = getStatus(status);

    if (!option) return <span>-</span>;

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit"
        style={{
          backgroundColor: `${option.color}20`,
          color: option.color,
        }}
      >
        <span
          style={{
            background: option.color,
            width: 8,
            height: 8,
            borderRadius: '50%',
          }}
        />
        {option.label}
      </span>
    );
  };

  return (
    <Modal
      size="6xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
    >
      {/* ================= HEADER ================= */}

      <ModalHeader className="text-2xl font-semibold text-gray-800 border-b">
        Dispute Details
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* ================= DISPUTE INFO ================= */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-5 border-b pb-2">
            Dispute Information
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <Info
              label="Dispute Type"
              value={selectedRow?.dispute_type === 'po' ? 'PO Number' : 'Sample Number'}
            />

            <Info
              label={selectedRow?.dispute_type === 'po' ? 'PO Number' : 'Sample Number'}
              value={selectedRow?.purchase_order?.po_no || selectedRow?.sample_request?.sr_no}
            />

            <Info label="Assigned To" value={selectedRow?.assign_to?.username} />

            <Info label="Date" value={selectedRow?.date} />

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Priority
              </p>

              <div className="mt-2">
                <PriorityBadge priority={selectedRow?.priority} />
              </div>
            </div>

            {selectedRow?.pdf_file && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  PDF File
                </p>

                <a
                  href={`${ImageUrl}uploads/dispute/${selectedRow.pdf_file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-medium underline"
                >
                  View PDF
                </a>
              </div>
            )}
          </div>

          {/* ================= REASON ================= */}

          <div className="mt-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Dispute Reason
            </p>

            <div className="bg-gray-50 border rounded-lg p-4 text-gray-700 leading-relaxed">
              {selectedRow?.dispute_reason || '-'}
            </div>
          </div>
        </div>

        {/* ================= FOLLOWUPS ================= */}

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-5 border-b pb-2">Followups</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white text-xs uppercase tracking-wide">
                <tr>
                  <th className="p-3 text-left">Followup Date</th>

                  <th className="p-3 text-left">Status</th>

                  <th className="p-3 text-left">Note</th>
                </tr>
              </thead>

              <tbody>
                {followups.length ? (
                  followups.map((f: any, index: number) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{f.followup_date || '-'}</td>

                      <td className="p-3">
                        <StatusBadge status={f.status} />
                      </td>

                      <td className="p-3 text-gray-700">{f.note || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-5 text-gray-500">
                      No Followups Added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ModalBody>

      {/* ================= FOOTER ================= */}

      <ModalFooter>
        <button
          onClick={() => setPlaceModal(false)}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-semibold"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

/* ================= REUSABLE INFO FIELD ================= */

const Info = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>

    <p className="text-base font-semibold text-gray-800">{value || '-'}</p>
  </div>
);

export default ViewDisputeModal;
