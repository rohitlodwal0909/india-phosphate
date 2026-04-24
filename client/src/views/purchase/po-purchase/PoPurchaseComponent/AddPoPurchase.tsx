import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, TextInput, Textarea } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import logoimg from '../../../../assets/logoimg.png';

import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { allUnits } from 'src/utils/AllUnit';
import { numberToWordsIndian } from 'src/views/accounts/domestic/taxinvoice/TaxInvoiceComponent/numberToWordsIndian';
import { Icon } from '@iconify/react/dist/iconify.js';
import { createPurchasePo } from 'src/features/purchase/po/PurchasePoSlice';

interface Props {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
}

const CreateModel: React.FC<Props> = ({ placeModal, setPlaceModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    date: '',
    po_no: '',
    shipping_term: '',
    expected_arrival_date: '',
    payment_term: '',
    destination: '',
    bill_to: '',
  });

  const product = useSelector((state: RootState) => state.products.productdata) as any[];

  useEffect(() => {
    dispatch(GetProduct());
  }, [dispatch]);

  /* ================= OPTIONS ================= */

  const [products, setProducts] = useState([
    {
      product_name: '',
      qty: '',
      rate: '',
      gst: 18,
      amount: 0,
      unit: '',
      gst_amount: 0,
      total: 0,
    },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        product_name: '',
        qty: '',
        rate: '',
        gst: 18,
        amount: 0,
        unit: '',
        gst_amount: 0,
        total: 0,
      },
    ]);
  };
  const removeProduct = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };
  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];

    updated[index][field] = value;

    const qty = Number(updated[index].qty) || 0;
    const rate = Number(updated[index].rate) || 0;
    const gst = Number(updated[index].gst) || 0;

    const amount = qty * rate;
    const gst_amount = (amount * gst) / 100;
    const total = amount + gst_amount;

    updated[index].amount = amount;
    updated[index].gst_amount = gst_amount;
    updated[index].total = total;

    setProducts(updated);
  };

  const productOptions = product?.map((i: any) => ({
    value: i.id,
    label: i.product_name,
  }));

  const reportRef = useRef(null);

  const validateForm = () => {
    if (!formData.date) return 'Date is required';
    if (!formData.po_no) return 'PO Number is required';
    if (!formData.shipping_term) return 'Shipping term is required';
    if (!formData.payment_term) return 'Payment term is required';
    if (!formData.destination) return 'Destination is required';
    if (!formData.expected_arrival_date) return 'Expected delivery date is required';
    if (!formData.bill_to) return 'Bill To is required';

    // ✅ Products validation
    if (!products.length) return 'At least one product is required';

    for (let i = 0; i < products.length; i++) {
      const p = products[i];

      if (!p.product_name) return `Product name required at row ${i + 1}`;
      if (!p.qty || Number(p.qty) <= 0) return `Valid qty required at row ${i + 1}`;
      if (!p.rate || Number(p.rate) <= 0) return `Valid rate required at row ${i + 1}`;
      if (!p.unit) return `Unit required at row ${i + 1}`;
    }

    return null;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const errorMsg = validateForm();

      if (errorMsg) {
        toast.error(errorMsg); // ❌ stop if error
        return;
      }

      const finalData = {
        ...formData,
        products: products,
      };

      await dispatch(createPurchasePo(finalData)).unwrap(); // ✅ important

      toast.success('PO Purchase Created'); // ✅ only success पर
      setPlaceModal(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create PO'); // ✅ error पर
    }
  };

  const grandTotal = products.reduce((sum, item) => sum + item.total, 0);

  return (
    <Modal show={placeModal} onClose={() => setPlaceModal(false)} size="7xl">
      <Modal.Header>Purchase PO</Modal.Header>

      <Modal.Body>
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
                    <Textarea
                      value={formData.bill_to}
                      onChange={(e) => setFormData({ ...formData, bill_to: e.target.value })}
                    ></Textarea>
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
                          <TextInput
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Purchase Order No.</b>:
                          <TextInput
                            name="po_no"
                            value={formData.po_no}
                            onChange={(e) => setFormData({ ...formData, po_no: e.target.value })}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Shipping Terms </b>:
                          <TextInput
                            name="shipping_term"
                            value={formData.shipping_term}
                            onChange={(e) =>
                              setFormData({ ...formData, shipping_term: e.target.value })
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Payment Terms</b>:
                          <TextInput
                            name="payment_term"
                            value={formData.payment_term}
                            onChange={(e) =>
                              setFormData({ ...formData, payment_term: e.target.value })
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Destination </b>:
                          <TextInput
                            name="destination"
                            value={formData.destination}
                            onChange={(e) =>
                              setFormData({ ...formData, destination: e.target.value })
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">
                          <b className="text-gray-600">Expected Date Delivery </b>:
                          <TextInput
                            name="expected_arrival_date"
                            type="date"
                            value={formData.expected_arrival_date}
                            onChange={(e) =>
                              setFormData({ ...formData, expected_arrival_date: e.target.value })
                            }
                          />
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
                <th className="border border-black p-1 w-[280px]">Description of Goods</th>
                <th className="border border-black p-1 w-[120px]">GST. Rate</th>
                <th className="border border-black p-1 w-[140px]">Quantity</th>
                <th className="border border-black p-1 w-[160px]">Rate</th>
                <th className="border border-black p-1 w-[160px]">Unit</th>
                <th className="border border-black p-1 w-[120px]">Amount</th>
              </tr>
            </thead>

            <tbody>
              {/* ROUND OFF ROW */}
              {products.map((p, i) => (
                <tr key={i}>
                  <td className="border border-black text-center">{i + 1}</td>

                  {/* PRODUCT */}
                  <td className="border border-black p-2">
                    <Select
                      options={productOptions}
                      onChange={(e) => handleProductChange(i, 'product_name', e?.label)}
                    />
                  </td>

                  {/* DATE */}
                  <td className="border border-black">
                    <select
                      className="border p-2 rounded"
                      value={p.gst}
                      onChange={(e) => handleProductChange(i, 'gst', e.target.value)}
                    >
                      <option value="">GST %</option>
                      <option value="0.1">0.1%</option>
                      <option value="0.5">0.5%</option>

                      {/* Standard */}
                      <option value="5">5%</option>
                      <option value="6">6%</option>
                      <option value="9">9%</option>
                      <option value="12">12%</option>
                      <option value="14">14%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </td>

                  {/* QTY */}
                  <td className="border border-black">
                    <TextInput
                      type="number"
                      value={p.qty}
                      onChange={(e) => handleProductChange(i, 'qty', e.target.value)}
                    />
                  </td>

                  {/* RATE */}
                  <td className="border border-black">
                    <TextInput
                      type="number"
                      value={p.rate}
                      onChange={(e) => handleProductChange(i, 'rate', e.target.value)}
                    />
                  </td>

                  {/* GST % */}
                  <td className="border border-black">
                    <Select
                      options={allUnits}
                      onChange={(e) => handleProductChange(i, 'unit', e?.label)}
                    />
                  </td>

                  {/* AMOUNT */}
                  <td className="border border-black text-right">₹ {p.amount.toFixed(2)}</td>

                  {/* GST AMOUNT */}

                  {/* REMOVE */}
                  <td className="border border-black text-right">
                    <button type="button" onClick={() => removeProduct(i)} className="text-red-500">
                      <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                    </button>
                  </td>
                </tr>
              ))}
              <Button color="primary" type="button" onClick={addProduct}>
                +
              </Button>

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
                  {Number(grandTotal).toLocaleString()}
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
                  <b>Amount Chargeable (in words):</b> {numberToWordsIndian(grandTotal) || '-'}
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

          <div className="col-span-12 flex justify-end gap-3 mt-3">
            <Button color="gray" onClick={() => setPlaceModal(false)}>
              Cancel
            </Button>

            <Button type="button" onClick={(e) => handleSubmit(e)} color="success">
              Save
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateModel;
