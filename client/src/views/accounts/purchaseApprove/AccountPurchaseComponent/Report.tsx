import logoimg from '../../../../../assets/logoimg.png';
import { useParams } from 'react-router';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import html2pdf from 'html2pdf.js';
import { Icon } from '@iconify/react';
import { AppDispatch, RootState } from 'src/store';
import { getPOById } from 'src/features/marketing/PurchaseOrderSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { numberToWordsIndian } from 'src/views/accounts/domestic/taxinvoice/TaxInvoiceComponent/numberToWordsIndian';
import CardBox from 'src/components/shared/CardBox';
const PuchaseReport = () => {
  const { id } = useParams();

  const data = useSelector((state: RootState) => state.purchaseOrder.poReport) as any;

  const products =
    typeof data?.products === 'string' ? JSON.parse(data.products) : data?.products || [];

  const total = products.reduce((sum, item) => {
    const amount = parseFloat(item.total);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const { productdata } = useSelector((state: any) => state.products);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;

    dispatch(getPOById(Number(id)));
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(GetProduct());
  }, [dispatch]);

  const reportRef = useRef(null);

  const getProductName = (id: any) => {
    const product = productdata?.find((p: any) => p.id == id);
    return product?.product_name || id;
  };

  return (
    <>
      <CardBox>
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => {
              if (reportRef.current) {
                const printContent = reportRef.current.innerHTML;
                const originalContent = document.body.innerHTML;

                // Replace body with report
                document.body.innerHTML = `
        <html>
          <head>
            <style>
              body { font-family: serif; padding: 20px; color: black; }
              table, th, td { border: 1px solid black; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `;

                // Trigger print
                window.print();
                setTimeout(() => {
                  document.body.innerHTML = originalContent;
                  window.location.reload(); // reload to restore React app properly
                }, 100);
              }
            }}
            className="bg-blue-400 text-white me-2 font-semibold py-2 px-4 rounded"
          >
            <Icon icon={'material-symbols:print'} fontSize={'20px'} />
          </button>
          <button
            onClick={() => {
              if (reportRef.current) {
                const element = reportRef.current;

                // Use setTimeout to ensure DOM is fully rendered before generating PDF
                setTimeout(() => {
                  html2pdf()
                    .set({
                      margin: 0.5,
                      filename: `Purchase_order_Report_${id}.pdf`,
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2, useCORS: true },
                      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                    })
                    .from(element)
                    .save();
                }, 100); // small delay ensures rendering
              }
            }}
            className="bg-gray-400  text-white font-semibold py-2 px-4 rounded"
          >
            <Icon icon={'line-md:download-loop'} fontSize={'22px'} />
          </button>
        </div>

        <div
          className="w-full mx-auto border border-black p-7 px-14 font-serif text-sm text-black"
          ref={reportRef}
        >
          <div className="flex justify-between items-start">
            <div className="text-black text-xs">
              <p>
                19C-D-E/F/20A, Industrial Area, Maxi Road,
                <br />
                Ujjain - 456001 (M.P.) INDIA
              </p>
            </div>
            <div className="text-center text-black">
              <img src={logoimg} alt="India Phosphate Logo" className="h-17 mx-auto" />
            </div>
            <div className="text-right text-xs text-black">
              <p>+91-9993622522</p>
              <p>indiaphosphate@gmail.com</p>
            </div>
          </div>

          <table className="w-full border border-black text-[14px] mb-3">
            <tbody>
              <tr>
                {/* ================= LEFT SIDE ================= */}
                <td className="w-1/2 align-top border-r border-black p-2">
                  {/* COMPANY */}
                  <b>India Phosphate & Allied Industries Pvt. Ltd.</b>
                  <p>
                    Formerly: India Phosphate 19/E 20A, Industrial Area, Maxi Road, Ujjain 456010
                  </p>
                  <p>19C-D-E-F & Part of 20A, Industrial Area, Maxi Road, Ujjain 456010</p>

                  <p>D.L. No. 25/25/2008</p>
                  <p>
                    <b>Contact.No:</b>+91 9993622522, 9109250792
                  </p>
                  <p>
                    <b>Email:</b>Purchase@indiaphosphate.com
                  </p>
                  <p>UDYAM UDYAM-MP-49-0087269 (Micro)</p>
                  <p>
                    <b>GSTIN/UIN:</b> 23AAHCI4308K1ZN
                  </p>
                  <p>
                    <b>State Name:</b> Madhya Pradesh, Code: 23
                  </p>

                  <br />

                  {/* SHIP TO */}
                  {/* <b>Consignee (Ship To)</b>
                  <p>{data?.consignee || '-'}</p> */}

                  <br />

                  {/* BILL TO */}
                  <b>Buyer (Bill To)</b>
                  <p>
                    {data?.customers?.company_name || '-'} {data?.customers?.company_address || '-'}
                  </p>
                </td>

                {/* ================= RIGHT SIDE ================= */}
                <td className="w-1/2 align-top p-0">
                  <table className="w-full text-[14px] border-collapse">
                    <tbody>
                      {/* ROW 1 */}
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Date</b>:
                          <span className="mx-2 font-semibold">{data?.created_at || '--'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Purchase Order No.</b>:
                          <span className="mx-2 font-semibold">{data?.po_no || '--'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Shipping Terms </b>:
                          <span className="mx-2 font-semibold"> {data?.payment_terms || '--'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Payment Terms</b>:
                          <span className="mx-2 font-semibold">{data?.payment_terms || '--'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Destination </b>:
                          <span className="mx-2 font-semibold"> {data?.payment_terms || '--'}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Expected Date Delivery </b>:
                          <span className="mx-2 font-semibold">
                            {data?.expected_delivery_date || '89'}
                          </span>
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
                <th className="border border-black p-1">Description of Goods</th>
                <th className="border border-black p-1 w-[90px]">GST. Rate</th>
                <th className="border border-black p-1 w-[110px]">Quantity</th>
                <th className="border border-black p-1 w-[60px]">Rate</th>
                <th className="border border-black p-1 w-[60px]">Unit</th>
                <th className="border border-black p-1 w-[120px]">Amount</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((p, i) => (
                <>
                  {/* MAIN PRODUCT ROW */}
                  <tr key={i}>
                    <td className="border border-black text-center align-top p-1">{i + 1}</td>

                    {/* DESCRIPTION COLUMN */}
                    <td className="border border-black p-2">
                      <div className="font-semibold">
                        {' '}
                        {getProductName(p.product_id || p.product_name)}
                      </div>
                    </td>

                    <td className="border border-black text-center align-top p-1">{p.gst}</td>

                    <td className="border border-black text-right align-top p-1">{p.quantity}</td>

                    <td className="border border-black text-right align-top p-1">{p.rate}</td>

                    <td className="border border-black text-center align-top p-1">
                      {p.unit || 'Kg'}
                    </td>
                    <td className="border border-black text-center align-top p-1">
                      {p.total || 'Kg'}
                    </td>
                  </tr>
                </>
              ))}
              {/* ROUND OFF ROW */}

              <tr>
                <td colSpan={3} className="border border-black text-right p-2 font-semibold">
                  Total
                </td>
                <td className="border border-black text-right p-2"></td>

                <td colSpan={2} className="border border-black text-right p-2">
                  {/* {data?.insurance} % */}
                </td>
                <td className="border border-black text-right p-2">
                  {' '}
                  {Number(total).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* BANK */}
          <div className="border rounded-md overflow-hidden text-[12px]">
            <div className="grid grid-cols-2">
              {/* LEFT SIDE */}
              <div className="border-r p-3 space-y-3">
                {/* Tax Amount */}
                <p>
                  <b>Amount Chargeable (in words):</b> {numberToWordsIndian(total) || '-'}
                </p>

                {/* Remarks */}

                {/* PAN / IEC */}
                <p>
                  <b>Company's PAN:</b> AAHCI4308K
                </p>

                {/* Declaration */}
                <div>
                  <p className="font-semibold">Declaration</p>

                  <p className="leading-5">
                    <b>GST</b> as per applicable government rates <b>Shelf Life </b>
                    <b> Minimum 80% residual shelf life </b> required upon delivery.
                    <br />
                    PO number must appear on Invoice, D.C., and Packing Slip.
                    <br />
                    All consignments must include a <b>COA for every batch. </b>
                    <br />
                    We reserve the right to reject goods not meeting specifications.
                    <br />
                    Subject to Ujjain Jurisdiction only.
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="border-r p-3 space-y-3">
                <div>
                  <p className="font-semibold">For India Phosphate & Allied Industries Pvt.Ltd</p>

                  <p className="leading-5 b-5">Authorised Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default PuchaseReport;
