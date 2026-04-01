import { Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoice } from 'src/features/account/invoice/taxinvoice';
import { AppDispatch, RootState } from 'src/store';
import { numberToWordsIndian } from './numberToWordsIndian';

const InvoiceViewModel = ({ placeModal, setPlaceModal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();
  const invoice = useSelector((state: RootState) => state.taxinvoices.singleinvoice) as any;

  useEffect(() => {
    if (selectedRow?.id) {
      dispatch(getInvoice(selectedRow.id));
    }
  }, [dispatch, selectedRow?.id]);

  const getProductQty = (batch_no) => {
    try {
      const batches = JSON.parse(batch_no || '[]');
      return batches.reduce((sum, b) => sum + Number(b.qty || 0), 0);
    } catch {
      return 0;
    }
  };

  const parseJSON = (value: any) => {
    try {
      return JSON.parse(value || '[]');
    } catch {
      return [];
    }
  };

  const getProductAmount = (batch_no, rate) => {
    try {
      const batches = parseJSON(batch_no);

      return batches.reduce((sum, b) => sum + Number(b.qty || 0) * Number(rate || 0), 0);
    } catch {
      return 0;
    }
  };

  const products = invoice?.InvoiceItems || [];

  const subtotal = products?.reduce((sum, p) => sum + getProductAmount(p.batch_no, p.rate), 0);

  const totalqty = products?.reduce((sum, p) => sum + getProductQty(p.batch_no), 0);

  const insurancePercent = Number(invoice?.insurance || 0);
  const insuranceAmount = (subtotal * insurancePercent) / 100;

  const freight = Number(invoice?.freight || 0);

  const gstList = JSON.parse(invoice?.gst || '[]');

  const gstPercent = gstList.reduce((sum, g) => sum + Number(g?.rate || 0), 0);

  const gstAmount = gstList.reduce(
    (sum, g) => sum + ((subtotal + insuranceAmount + freight) * g.rate) / 100,
    0,
  );

  const hsnTotals = (products || []).reduce((acc: any, item: any) => {
    const hsn = item?.hsn || 'N/A';

    // ✅ Safe batch parse
    let batches: any[] = [];
    try {
      batches = item?.batch_no ? JSON.parse(item.batch_no) : [];
    } catch (e) {
      batches = [];
    }

    // ✅ Taxable Amount from batches
    const totalBatchAmount = batches.reduce(
      (sum: number, batch: any) => sum + Number(batch?.amount || 0),
      0,
    );

    // ✅ GST should come from item GST (NOT global)
    const gstRate = Number(item?.gstPercent || gstPercent || 0);

    const igstAmount = (totalBatchAmount * gstRate) / 100;
    const totalAmount = totalBatchAmount + igstAmount;

    // ✅ Initialize HSN group
    if (!acc[hsn]) {
      acc[hsn] = {
        taxableAmount: 0,
        igstAmount: 0,
        totalAmount: 0,
      };
    }

    // ✅ Add values
    acc[hsn].taxableAmount += totalBatchAmount;
    acc[hsn].igstAmount += igstAmount;
    acc[hsn].totalAmount += totalAmount;

    return acc;
  }, {});

  // ✅ Final Result Array
  const result = Object?.entries(hsnTotals)?.map(([hsn, value]: any) => ({
    hsn,
    taxableAmount: Number(value.taxableAmount.toFixed(2)),
    igstAmount: Number(value.igstAmount.toFixed(2)),
    totalAmount: Number(value.totalAmount.toFixed(2)),
  }));

  const taxableAmount = result?.reduce((sum, batch) => sum + Number(batch?.taxableAmount || 0), 0);
  const totalAmount = result?.reduce((sum, batch) => sum + Number(batch.totalAmount || 0), 0);

  // const roundOff = Number(invoice?.round_off || 0);

  const grandTotal =
    subtotal + insuranceAmount + freight + gstAmount + Number(invoice.round_off || 0);

  return (
    <Modal size="7xl" show={placeModal} onClose={() => setPlaceModal(false)}>
      <ModalHeader className="text-center text-lg font-semibold border-b">TAX INVOICE</ModalHeader>

      <ModalBody className="bg-white text-[12px] p-6 text-gray-800">
        {/* HEADER */}
        <div className="flex justify-between items-start  p-4 rounded-md mb-3">
          <div className="text-right text-[14px] space-y-1">
            <div>
              <p>
                <b>IRN:</b> {invoice?.irn || '-'}
              </p>
            </div>

            <p>
              <b>ACK No:</b> {invoice?.ack_no || '-'}
            </p>
            <p>
              <b>ACK Date:</b> {invoice?.ack_date || '-'}
            </p>
          </div>
          {/* <div>
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
          </div> */}
        </div>

        {/* INVOICE DETAILS */}
        {/* ================= INVOICE DETAILS BLOCK ================= */}
        <table className="w-full border border-black text-[14px] mb-3">
          <tbody>
            <tr>
              {/* ================= LEFT SIDE ================= */}
              <td className="w-1/2 align-top border-r border-black p-2">
                {/* COMPANY */}
                <b>India Phosphate & Allied Industries Pvt. Ltd.</b>
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
                <p>
                  <b>CIN:</b> Maharashtra (27)
                </p>

                <br />

                {/* SHIP TO */}
                <b>Consignee (Ship To)</b>
                <p>{invoice?.consignee || '-'}</p>

                <br />

                {/* BILL TO */}
                <b>Buyer (Bill To)</b>
                <p>{invoice?.buyer || '-'}</p>
              </td>

              {/* ================= RIGHT SIDE ================= */}
              <td className="w-1/2 align-top p-0">
                <table className="w-full text-[14px] border-collapse">
                  <tbody>
                    {/* ROW 1 */}
                    <tr>
                      <td className="border p-2">
                        <p className="text-gray-600">Invoice No</p>
                        <p className="font-semibold">{invoice?.invoice_no || '-'}</p>
                      </td>
                      <td className="border p-2">
                        <p className="text-gray-600">e-Way Bill No</p>
                        <p className="font-semibold">{invoice?.eway_bill || '-'}</p>
                      </td>

                      <td className="border p-2">
                        <p className="text-gray-600">Dated</p>
                        <p className="font-semibold">{invoice?.invoice_date || '-'}</p>
                      </td>
                    </tr>

                    {/* ROW 2 */}
                    <tr>
                      <td colSpan={2} className="border p-2">
                        <p className="text-gray-600">Delivery Note</p>
                        <p className="font-semibold">{invoice?.delivery_note || '-'}</p>
                      </td>
                      <td colSpan={2} className="border p-2">
                        <p className="text-gray-600">Mode / Terms of Payment</p>
                        <p className="font-semibold">{invoice?.payment_mode || '-'}</p>
                      </td>
                    </tr>

                    {/* ROW 3 */}
                    <tr>
                      <td colSpan={2} className="border p-2">
                        <p className="text-gray-600">References No.& Date</p>
                        <p className="font-semibold">{invoice?.other_reference || '-'}</p>
                      </td>
                      <td className="border p-2">
                        <p className="text-gray-600">Other References</p>
                        <p className="font-semibold">{invoice?.other_reference || '-'}</p>
                      </td>
                    </tr>

                    {/* ROW 4 */}
                    <tr>
                      <td colSpan={2} className="border p-2">
                        <p className="text-gray-600">Buyer Order No</p>
                        <p className="font-semibold">{invoice?.buyer_order_no || '-'}</p>
                      </td>

                      <td className="border p-2">
                        <p className="text-gray-600">Dated</p>
                        <p className="font-semibold">{invoice?.buyer_order_date || '-'}</p>
                      </td>
                    </tr>

                    {/* ROW 5 */}
                    <tr>
                      <td colSpan={2} className="border p-2">
                        <p className="text-gray-600">Dispatch Doc No</p>
                        <p className="font-semibold">{invoice?.dispatch_doc_no || '-'}</p>
                      </td>

                      <td className="border p-2">
                        <p className="text-gray-600">Delivery Note Date</p>
                        <p className="font-semibold">{invoice?.delivery_note_date || '-'}</p>
                      </td>
                    </tr>

                    {/* ROW 6 */}
                    <tr>
                      <td colSpan={2} className="border p-2">
                        <p className="text-gray-600">Dispatched Through</p>
                        <p className="font-semibold">{invoice?.dispatch_through || '-'}</p>
                      </td>

                      <td className="border p-2">
                        <p className="text-gray-600">Destination</p>
                        <p className="font-semibold">{invoice?.destination || '-'}</p>
                      </td>
                    </tr>

                    {/* ROW 7 */}
                    {invoice?.invoice_type !== 'domestic' && (
                      <tr>
                        <td colSpan={3} className="border p-2">
                          <p className="text-gray-600">Country</p>
                          <p className="font-semibold">{invoice?.country || '-'}</p>
                        </td>
                      </tr>
                    )}

                    {invoice?.invoice_type !== 'domestic' && (
                      <tr>
                        <td colSpan={3} className="border p-2">
                          <p className="text-gray-600">
                            LUT/Bond No.: <span>{invoice?.lut_no || '-'}</span>
                          </p>
                          <p className="text-gray-600">
                            From : <span>{invoice?.from_to || '-'}</span>
                          </p>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={3} className="border p-2">
                        <p className="text-gray-600">Terms of Delivery</p>
                        <p className="font-semibold">{invoice?.remark || '-'}</p>
                        <p className="text-gray-600 pt-2">Delivery Address</p>
                        <p className="font-semibold">
                          {selectedRow?.poentry?.delivery_address || '-'}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* PRODUCT TABLE */}
        <table className="w-full text-[14px] border border-black border-collapse mb-3">
          <thead>
            <tr className="text-center font-semibold">
              <th className="border border-black p-1 w-[40px]">Sl No.</th>
              <th className="border border-black p-1 w-[90px]">No. of Pkgs</th>
              <th className="border border-black p-1">Description of Goods</th>
              <th className="border border-black p-1 w-[90px]">HSN/SAC</th>
              <th className="border border-black p-1 w-[110px]">Quantity</th>
              <th className="border border-black p-1 w-[90px]">Rate</th>
              <th className="border border-black p-1 w-[60px]">Per</th>
              <th className="border border-black p-1 w-[120px]">Amount</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((p, i) => (
              <>
                {/* MAIN PRODUCT ROW */}
                <tr key={i}>
                  <td className="border border-black text-center align-top p-1">{i + 1}</td>

                  <td className="border border-black text-center align-top p-1">
                    {p.kind_of_pkgs}
                  </td>

                  {/* DESCRIPTION COLUMN */}
                  <td className="border border-black p-2">
                    <div className="font-semibold">{p?.Product?.product_name || '-'}</div>

                    {/* Batch Lines */}
                    {(() => {
                      let batches = [];

                      try {
                        batches = JSON.parse(p.batch_no || '[]');
                      } catch {
                        batches = [];
                      }

                      return batches.map((b, idx) => (
                        <div key={idx} className="pl-4 text-sm">
                          Batch : {b.batch_no}
                          {/* | MFG : {b.mfg} | EXP : {b.exp} | Qty : {b.qty} */}
                        </div>
                      ));
                    })()}
                  </td>

                  <td className="border border-black text-center align-top p-1">{p.hsn}</td>

                  <td className="border border-black text-right align-top p-1">
                    {getProductQty(p.batch_no).toLocaleString()} Kg
                  </td>

                  <td className="border border-black text-right align-top p-1">{p.rate}</td>

                  <td className="border border-black text-center align-top p-1">{p.per}</td>

                  <td className="border border-black text-right align-top p-1">
                    {getProductAmount(p.batch_no, p.rate).toLocaleString()}
                  </td>
                </tr>
              </>
            ))}

            {/* ROUND OFF ROW */}
            <tr>
              <td colSpan={7} className="border border-black text-right p-2 font-semibold"></td>

              <td className="border border-black text-right p-2">
                {Number(subtotal).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black text-right p-2 font-semibold">
                Insurance Charges Receivable
              </td>
              <td className="border border-black text-right p-2">999799</td>
              <td className="border border-black text-right p-2"></td>

              <td colSpan={2} className="border border-black text-right p-2">
                {invoice?.insurance} %
              </td>
              <td className="border border-black text-right p-2">
                {' '}
                {Number(insuranceAmount).toLocaleString()}
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="border border-black text-right p-2 font-semibold">
                Freight & Packing Charges
              </td>
              <td className="border border-black text-right p-2">999799</td>
              <td className="border border-black text-right p-2"></td>

              <td colSpan={2} className="border border-black text-right p-2"></td>
              <td className="border border-black text-right p-2">
                {' '}
                {Number(freight).toLocaleString()}
              </td>
            </tr>

            {gstList.map((g, i) => (
              <tr key={i}>
                <td colSpan={3} className="border border-black text-right p-2 font-semibold">
                  {g.type} @ {g.rate}%
                </td>

                <td colSpan={5} className="border border-black text-right p-2">
                  {(((subtotal + insuranceAmount + freight) * g.rate) / 100).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="border border-black text-right p-2 font-semibold">
                Round Off
              </td>

              <td colSpan={5} className="border border-black text-right p-2">
                {invoice?.round_off}
              </td>
            </tr>

            {/* TOTAL ROW */}
            <tr>
              <td colSpan={3} className="border border-black text-right p-2 font-semibold">
                Total
              </td>

              <td colSpan={2} className="border border-black text-right p-2 font-semibold">
                {Number(totalqty).toLocaleString()}
                Kg
              </td>

              <td colSpan={2} className="border border-black"></td>

              <td className="border border-black text-right p-2 font-bold">
                ₹ {Number(grandTotal).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="border border-t-0 text-[12px]">
          {/* Amount Chargeable in Words */}
          <div className="border rounded-md p-3 mb-2 text-[14px]">
            <b>Amount in Words:</b> {numberToWordsIndian(grandTotal) || '-'}
          </div>

          {/* HSN & Tax Table */}
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">HSN/SAC</th>
                <th className="border px-2 py-1 text-right">Taxable Value</th>
                <th className="border px-2 py-1 text-center">IGST Rate</th>
                <th className="border px-2 py-1 text-right">IGST Amount</th>
                <th className="border px-2 py-1 text-right">Total Tax Amount</th>
              </tr>
            </thead>
            <tbody>
              {result?.map((p) => (
                <tr>
                  <td className="border px-2 py-1">{p?.hsn || '-'}</td>

                  <td className="border px-2 py-1 text-right">
                    {Number(p?.taxableAmount)?.toLocaleString()}
                  </td>

                  <td className="border px-2 py-1 text-center">{gstPercent || '0'} %</td>

                  <td className="border px-2 py-1 text-right">
                    {' '}
                    {Number(p?.igstAmount)?.toLocaleString()}
                  </td>

                  <td className="border px-2 py-1 text-right">
                    {' '}
                    {Number(p?.totalAmount)?.toLocaleString()}
                  </td>
                </tr>
              ))}

              {/* TOTAL ROW */}
              <tr className="font-semibold">
                <td className="border px-2 py-1 text-right">Total</td>

                <td className="border px-2 py-1 text-right">
                  {Number(taxableAmount)?.toLocaleString() || '-'}
                </td>

                <td className="border"></td>
                <td className="border"></td>

                <td className="border px-2 py-1 text-right">
                  {' '}
                  {Number(totalAmount)?.toLocaleString() || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* BANK */}
        <div className="border rounded-md overflow-hidden text-[12px]">
          <div className="grid grid-cols-2">
            {/* LEFT SIDE */}
            <div className="border-r p-3 space-y-3">
              {/* Tax Amount */}
              <p>
                <b>Tax Amount (in words):</b> NIL
              </p>

              {/* Remarks */}
              {invoice?.invoice_type !== 'domestic' && (
                <div>
                  <p className="font-semibold underline">Remarks:</p>
                  <p>{invoice?.payment_remark}</p>
                </div>
              )}

              {/* PAN / IEC */}
              <p>
                <b>Company's PAN/IEC Code:</b> {selectedRow?.pan_iec || '-'}
              </p>

              {/* Declaration */}
              <div>
                <p className="font-semibold">Declaration</p>

                <p className="leading-5">
                  1) Once goods leaves our premises we shall not be responsible for any quality and
                  quantity.
                  <br />
                  2) Above material is meant for industrial use only.
                  <br />
                  3) Please check the goods and verify before use, we shall not be responsible for
                  any loss/damage/claim whatsoever.
                  <br />
                  4) Interest @24% p.a. will be charged if payment is not made within due date.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-3 flex flex-col justify-between">
              {/* Bank Details */}
              {invoice?.invoice_type !== 'domestic' && (
                <div>
                  <p className="font-semibold mb-2">Company's Bank Details</p>

                  <div className="space-y-1">
                    <p>
                      <b>A/c Holder:</b> India Phosphate and Allied Industries Pvt.Ltd
                    </p>

                    <p>
                      <b>Bank Name:</b> Axis Bank Ltd (IPAIPL CC)
                    </p>

                    <p>
                      <b>A/c No:</b> 924030028364980
                    </p>

                    <p>
                      <b>Branch & IFSC:</b> Ujjain & UTIB0000329
                    </p>

                    <p>
                      <b>SWIFT Code:</b>
                    </p>
                  </div>
                </div>
              )}

              {/* Signature */}
              <div className="text-right mt-10">
                <p>For India Phosphate and Allied Industries Pvt.Ltd</p>

                <div className="h-14"></div>

                <p className="font-semibold">Authorised Signatory</p>
              </div>
            </div>
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
