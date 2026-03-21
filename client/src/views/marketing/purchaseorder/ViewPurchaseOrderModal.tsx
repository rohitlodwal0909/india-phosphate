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

const ViewPurchaseOrderModal = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  selectedRow,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const products =
    typeof selectedRow?.products === 'string'
      ? JSON.parse(selectedRow.products)
      : selectedRow?.products || [];

  const { productdata } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(GetProduct());
  });

  const getProductName = (id: any) => {
    const product = productdata?.find((p: any) => p.id == id);
    return product?.product_name || id;
  };

  return (
    <Modal
      size="5xl"
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
    >
      {/* ✅ HEADER */}
      <ModalHeader className="text-center text-xl font-semibold text-gray-800 border-b">
        Purchase Order Details
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* ✅ PO INFO */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">PO Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            {[
              { label: 'PO No.', value: selectedRow?.po_no },
              { label: 'Company Name', value: selectedRow?.customers?.company_name },
              { label: 'Company Type', value: selectedRow?.company_type },
              { label: 'Company Address', value: selectedRow?.company_address },
              { label: 'Delivery Address', value: selectedRow?.delivery_address },
              { label: 'Payment Terms', value: selectedRow?.payment_terms },
              { label: 'Remark', value: selectedRow?.remark },
              { label: 'Freight', value: selectedRow?.freight },
              { label: 'Commission', value: selectedRow?.commission },
              { label: 'Insurance', value: selectedRow?.insurance },
              { label: 'Customise Labels', value: selectedRow?.customise_labels },
              {
                label: 'Type',
                value: selectedRow?.export ? 'Export' : 'Domestic',
              },
              {
                label: 'Expected Delivery',
                value: selectedRow?.expected_delivery_date,
              },
              { label: 'Submitted By', value: selectedRow?.users?.username },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-gray-500">{item.label}</p>
                <p className="text-gray-900 font-medium mt-1">{item.value || '-'}</p>
              </div>
            ))}

            {/* Insurance Remark */}
            {selectedRow?.insurance === 'own_policy' && (
              <div>
                <p className="text-gray-500">Insurance Remark</p>
                <p className="text-gray-900 font-medium mt-1">
                  {selectedRow?.insurance_remark || '-'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ PRODUCT TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            Product Details
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Grade</th>
                  <th className="p-3 text-left">Qty</th>
                  <th className="p-3 text-left">Rate</th>
                  <th className="p-3 text-left">GST</th>
                  <th className="p-3 text-left">Packing</th>
                  <th className="p-3 text-left">Total</th>
                </tr>
              </thead>

              <tbody>
                {products.length ? (
                  products.map((p: any, i: number) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-900 font-medium">
                        {' '}
                        {getProductName(p.product_id || p.product_name)}
                      </td>
                      <td className="p-3 text-gray-700">{p.grade}</td>
                      <td className="p-3 text-gray-700">{p.quantity}</td>
                      <td className="p-3 text-gray-700">{p.rate}</td>
                      <td className="p-3 text-gray-700">{p.gst}</td>
                      <td className="p-3 text-gray-700">{p.packing}</td>
                      <td className="p-3 text-gray-900 font-semibold">{p.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      No Products Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ EXPORT DETAILS */}
        {selectedRow?.export && (
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Export Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
              {[
                { label: 'Country', value: selectedRow?.country_name },
                { label: 'Inco Term', value: selectedRow?.inco_term },
                { label: 'Discharge Port', value: selectedRow?.discharge_port },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-gray-500">{item.label}</p>
                  <p className="text-gray-900 font-medium mt-1">{item.value || '-'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </ModalBody>

      {/* ✅ FOOTER */}
      <ModalFooter>
        <button
          onClick={() => setPlaceModal(false)}
          className="px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-md"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ViewPurchaseOrderModal;
