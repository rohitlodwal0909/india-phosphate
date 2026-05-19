import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { AppDispatch } from 'src/store';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewAuditModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const { productdata } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(GetProduct());
  }, [dispatch]);

  /* ================= PRODUCTS ================= */

  const auditProducts = selectedRow?.interested_products || [];

  const getProductName = (id: any) => {
    const product = productdata?.find((p: any) => p.id == id);
    return product?.product_name || '-';
  };

  return (
    <Modal
      size="6xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
    >
      {/* ================= HEADER ================= */}

      <ModalHeader className="text-center text-xl font-semibold border-b">
        Audit Details
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* ================= AUDIT INFORMATION ================= */}

        <div className="bg-gray-50 border rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Audit Information</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm">
            <Info label="Company">{selectedRow?.customers?.company_name}</Info>

            <Info label="Arrival Date">{selectedRow?.arrival_date}</Info>

            <Info label="Submitted By">{selectedRow?.users?.username}</Info>

            <Info label="Compliance Status">{selectedRow?.compliance_status || '-'}</Info>

            <Info label="Compliance Remark">{selectedRow?.compliance_remark || '-'}</Info>
          </div>
        </div>

        {/* ================= AUDIT DETAILS ================= */}

        <div className="bg-gray-50 border rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Agenda & Notes</h3>

          <div className="grid md:grid-cols-2 gap-5 text-sm">
            <Info label="Audit Agenda">{selectedRow?.audit_agenda || '-'}</Info>

            <Info label="Note">{selectedRow?.note || '-'}</Info>
          </div>
        </div>

        {/* ================= PRODUCT TABLE ================= */}

        <div className="bg-white border rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Interested Products</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Auditor Name</th>
                </tr>
              </thead>

              <tbody>
                {auditProducts.length ? (
                  auditProducts.map((item: any, i: number) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        {' '}
                        <Info>{getProductName(item.product_id)}</Info>
                      </td>
                      <td className="p-3">
                        {' '}
                        <Info>{item.grade}</Info>
                      </td>
                      <td className="p-3">
                        <Info>{item.auditor_name}</Info>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-gray-500">
                      No Audit Products Found
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
          className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

/* ================= REUSABLE INFO FIELD ================= */

const Info = ({ label, children }: any) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-900 mt-1">{children || '-'}</p>
  </div>
);

export default ViewAuditModal;
