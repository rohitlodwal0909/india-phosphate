import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { AppDispatch } from 'src/store';
import { Icon } from '@iconify/react';
import { ImageUrl } from 'src/constants/contant';

type Props = {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
};

const ViewSampleModal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }: Props) => {
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
        Sample Details
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* ================= AUDIT INFORMATION ================= */}

        <div className="bg-gray-50 border rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Company Information</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm">
            <Info label="Company">{selectedRow?.customers?.company_name}</Info>

            <Info label="Type">{selectedRow?.type}</Info>

            <Info label="Contact Person">{selectedRow?.contact_person}</Info>

            <Info label="Mobile">{selectedRow?.mobile || '-'}</Info>

            <Info label="Address">{selectedRow?.address || '-'}</Info>
            <Info label="Submitted By">{selectedRow?.users?.username || '-'}</Info>
            <Info label="Remark">{selectedRow?.remark || '-'}</Info>
          </div>
        </div>

        {/* ================= AUDIT DETAILS ================= */}

        {/* <div className="bg-gray-50 border rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Agenda & Notes</h3>

          <div className="grid md:grid-cols-2 gap-5 text-sm">
            <Info label="Sample Agenda">{selectedRow?.audit_agenda || '-'}</Info>

            <Info label="Note">{selectedRow?.note || '-'}</Info>
          </div>
        </div> */}

        {/* ================= PRODUCT TABLE ================= */}

        <div className="bg-white border rounded-lg p-5">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Sample Product Details</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Sample Type</th>
                  <th className="p-3 text-left">Spec</th>
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
                        <Info>{item.qty}</Info>
                      </td>
                      <td className="p-3">
                        <Info>{item.sample_type}</Info>
                      </td>
                      <td className="p-3">
                        {item.file && (
                          <a
                            href={ImageUrl + 'uploads/sample-request/' + item.file} // file url from backend
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 cursor-pointer"
                          >
                            {/* Dynamic Icon */}
                            {item.file.toLowerCase().endsWith('.pdf') ? (
                              <Icon icon="mdi:file-pdf-box" width={24} />
                            ) : (
                              <Icon icon="mdi:file-image" width={24} />
                            )}
                            View File
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-gray-500">
                      No Sample Products Found
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

export default ViewSampleModal;
