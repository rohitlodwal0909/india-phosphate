import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewEnquiryModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  /* ================= PRODUCTS PARSE ================= */
  const products =
    typeof selectedRow?.interested_products === 'string'
      ? JSON.parse(selectedRow.interested_products)
      : selectedRow?.interested_products || [];

  /* ================= PRODUCT NAME ================= */

  /* ================= STATUS OPTIONS ================= */
  const enquiryStatusOptions = [
    { value: 'closed', label: 'Closed', color: '#16a34a' },
    { value: 'rejected', label: 'Need Clarification', color: '#ef4444' },
    { value: 'quotation', label: 'Pending Quotation', color: '#2563eb' },
    { value: 'coa', label: 'Documents / COA Pending', color: '#facc15' },
    { value: 'freight', label: 'Awaiting Freight', color: '#fdba74' },
    { value: 'dispatch', label: 'Awaiting Dispatch', color: '#f97316' },
    { value: 'internal_hold', label: 'Internal Hold', color: '#9333ea' },
    { value: 'customer_hold', label: 'Customer Hold', color: '#dc2626' },
  ];

  const getStatusOption = (status: string) => enquiryStatusOptions.find((s) => s.value === status);

  /* ================= STATUS BADGE ================= */
  const StatusBadge = ({ status }: any) => {
    const option = getStatusOption(status);

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
        Enquiry Details
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* ================= ENQUIRY INFO ================= */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-5 border-b pb-2">
            Enquiry Information
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Info label="Enquiry No." value={selectedRow?.sr_no} />

            <Info label="Company Name" value={selectedRow?.customers?.company_name} />

            <Info label="Date" value={selectedRow?.date} />

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</p>

              <div className="mt-1">
                <StatusBadge status={selectedRow?.status} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT FOLLOWUPS ================= */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-5 border-b pb-2">
            Product Followups
          </h3>

          {products.length ? (
            products.map((p: any, index: number) => {
              const followups =
                typeof p.followups === 'string' ? JSON.parse(p.followups) : p.followups || [];

              return (
                <div key={index} className="border border-gray-200 rounded-xl mb-6 overflow-hidden">
                  {/* PRODUCT HEADER */}
                  <div className="bg-gray-50 px-5 py-4 flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {p.product?.product_name}
                      </p>
                      <p className="text-sm text-gray-600">Grade : {p.grade || '-'}</p>
                    </div>

                    <div className="text-sm font-medium text-gray-700">
                      Sales Person : {p.sales_name?.username || '-'}
                    </div>
                  </div>

                  {/* FOLLOWUP TABLE */}
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
                          followups.map((f: any, i: number) => (
                            <tr key={i} className="border-t hover:bg-gray-50">
                              <td className="p-3 font-medium text-gray-800">{f.followup_date}</td>

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
              );
            })
          ) : (
            <p className="text-center text-gray-500">No Products Found</p>
          )}
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

export default ViewEnquiryModal;
