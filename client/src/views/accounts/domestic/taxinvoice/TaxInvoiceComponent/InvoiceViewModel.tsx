import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoice } from 'src/features/account/invoice/taxinvoice';
import { AppDispatch, RootState } from 'src/store';

const InvoiceViewModel = ({ placeModal, setPlaceModal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();
  const invoice = useSelector((state: RootState) => state.taxinvoices.singleinvoice) as any;

  useEffect(() => {
    dispatch(getInvoice(selectedRow?.id));
  }, [dispatch]);

  console.log(invoice);
  const productdata = [];

  const products = invoice?.InvoiceItems;

  const subtotal = products?.reduce((acc, item) => {
    return acc + Number(item.amount || 0);
  }, 0);
  const insurancePercent = Number(invoice?.insurance || 0);
  const insuranceAmount = (subtotal * insurancePercent) / 100;

  const freight = Number(invoice?.freight || 0);
  const gstPercent = Number(invoice?.gst || 0);
  const gstAmount = ((subtotal + insuranceAmount + freight) * gstPercent) / 100;
  const roundOff = Number(invoice?.round_off || 0);
  const grandTotal = subtotal + insuranceAmount + freight + gstAmount + roundOff;

  const getProductName = (id) => {
    const product = productdata?.find((p) => p.id == id);
    return product?.product_name || id;
  };

  return (
    <Modal size="7xl" show={placeModal} onClose={() => setPlaceModal(false)}>
      <ModalHeader className="text-center text-lg font-semibold border-b">TAX INVOICE</ModalHeader>

      <ModalBody className="bg-white text-[12px] p-6 text-gray-800">
        {/* HEADER */}
        <div className="flex justify-between items-start border p-4 rounded-md mb-3">
          <div>
            <h2 className="text-[16px] font-bold uppercase">
              India Phosphate & Allied Industries Pvt. Ltd.
            </h2>
            <p>Shop No. 7A, 1st Floor, Ausadh Compound</p>
            <p>Dalmiil Compound, Purna Village</p>
            <p>Bhiwandi, Thane - 421302</p>
            <p>
              <b>Mob:</b> 9821243321
            </p>
            <p>
              <b>GSTIN:</b> {invoice?.company_gstin || '-'}
            </p>
            <p>
              <b>State:</b> Maharashtra (27)
            </p>
          </div>

          <div className="text-right text-[11px] space-y-1">
            <p>
              <b>IRN:</b> {invoice?.irn || '-'}
            </p>
            <p>
              <b>ACK No:</b> {invoice?.ack_no || '-'}
            </p>
            <p>
              <b>ACK Date:</b> {invoice?.ack_date || '-'}
            </p>
          </div>
        </div>

        {/* INVOICE DETAILS */}
        <div className="grid grid-cols-2 border rounded-md overflow-hidden mb-3">
          <div className="border-r">
            {[
              ['Invoice No', invoice?.invoice_no],
              ['E-Way Bill No', invoice?.eway_bill],
              ['Delivery Note', invoice?.delivery_note],
              ['Buyer Order No', invoice?.buyer_order_no],
              ['Dispatch Doc No', invoice?.dispatch_doc_no],
              ['Dispatch Through', invoice?.dispatch_through],
              ['Terms of Delivery', invoice?.remark],
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between px-3 py-2 border-b text-[11px]">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium">{value || '-'}</span>
              </div>
            ))}
          </div>

          <div>
            {[
              ['Invoice Date', invoice?.invoice_date],
              ['Mode/Terms of Payment', invoice?.payment_mode],
              ['Other References', invoice?.other_reference],
              ['Buyer Order Date', invoice?.buyer_order_date],
              ['Delivery Note Date', invoice?.delivery_note_date],
              ['Destination', invoice?.destination],
            ].map(([label, value], i) => (
              <div key={i} className="flex justify-between px-3 py-2 border-b text-[11px]">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium">{value || '-'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BUYER / CONSIGNEE */}
        <div className="grid grid-cols-2 border rounded-md overflow-hidden mb-3">
          <div className="p-3 border-r">
            <p className="font-semibold text-sm mb-1">Consignee (Ship To)</p>
            <p>{invoice?.consignee || '-'}</p>
          </div>

          <div className="p-3">
            <p className="font-semibold text-sm mb-1">Buyer (Bill To)</p>
            <p>{invoice?.buyer || '-'}</p>
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <table className="w-full border text-[11px] mb-3">
          <thead className="bg-gray-100">
            <tr>
              {['Sr', 'Pkgs', 'Description', 'Batch', 'HSN', 'Qty', 'Rate', 'Per', 'Amount'].map(
                (h) => (
                  <th key={h} className="border px-2 py-2 font-semibold text-gray-700">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {products?.length ? (
              products.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border text-center p-1">{i + 1}</td>
                  <td className="border text-center p-1">{p.kind_of_pkgs}</td>
                  <td className="border p-1">{getProductName(p.product_id)}</td>
                  <td className="border text-center p-1">{p.batch_no}</td>
                  <td className="border text-center p-1">{p.hsn}</td>
                  <td className="border text-right p-1">{p.qty}</td>
                  <td className="border text-right p-1">{p.rate}</td>
                  <td className="border text-center p-1">{p.per}</td>
                  <td className="border text-right p-1 font-medium">
                    ₹ {Number(p.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center p-3 text-gray-500">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="flex justify-end mb-3">
          <div className="w-[320px] border rounded-md text-[12px]">
            <div className="flex justify-between px-3 py-2 border-b">
              <span>Sub Total</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between px-3 py-2 border-b">
              <span>Insurance ({insurancePercent}%)</span>
              <span>₹ {insuranceAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between px-3 py-2 border-b">
              <span>Freight</span>
              <span>₹ {freight.toLocaleString()}</span>
            </div>

            <div className="flex justify-between px-3 py-2 border-b">
              <span>GST</span>
              <span>₹ {gstAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between px-3 py-2 border-b">
              <span>Round Off</span>
              <span>₹ {roundOff.toLocaleString()}</span>
            </div>

            <div className="flex justify-between px-3 py-3 font-bold bg-gray-100">
              <span>Total</span>
              <span>₹ {grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* AMOUNT WORD */}
        <div className="border rounded-md p-3 mb-2">
          <b>Amount in Words:</b> {selectedRow?.amount_words || '-'}
        </div>

        {/* BANK */}
        <div className="grid grid-cols-2 border rounded-md overflow-hidden">
          <div className="p-3 border-r">
            <p className="font-semibold mb-1">Bank Details</p>
            <p>Bank: {selectedRow?.bank_name || '-'}</p>
            <p>A/C No: {selectedRow?.account_no || '-'}</p>
            <p>IFSC: {selectedRow?.ifsc || '-'}</p>
          </div>

          <div className="p-3 text-right flex flex-col justify-between">
            <p>For Company</p>
            <div className="h-12"></div>
            <p className="font-semibold">Authorized Signatory</p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={() => setPlaceModal(false)}
          className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default InvoiceViewModel;
