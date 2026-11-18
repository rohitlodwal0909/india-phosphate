import React, { useState, useEffect } from 'react';
import { Button, Modal, Label, TextInput, Textarea, Checkbox } from 'flowbite-react';
import Select from 'react-select';

import { useDispatch, useSelector } from 'react-redux';
import {
  addPurchaseOrder,
  getAllCustomers,
  getPurchaseOrders,
} from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';
import { RootState } from 'src/store';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { GetPmCode } from 'src/features/master/PmCode/PmCodeSlice';
import { GetGrade } from 'src/features/master/Grade/GradeSlice';
import { allUnits } from 'src/utils/AllUnit';

interface PurchaseOrderModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}
type PriorityOption = {
  value: string;
  label: string;
  color: string;
};

const gstOptions = [
  { value: 18, label: '18%' },
  { value: 0.1, label: '0.1%' },
  { value: 0, label: 'Nil' },
];

const priorityOptions: PriorityOption[] = [
  {
    value: 'High',
    label: 'High Priority',
    color: '#ef4444',
  },
  {
    value: 'Priority',
    label: 'Priority',
    color: '#2563eb',
  },
  {
    value: 'Normal',
    label: 'Normal',
    color: '#e9ec1a',
  },
];

const formatOptionLabel = (option: PriorityOption) => (
  <div className="flex items-center gap-2">
    <span
      style={{
        backgroundColor: option.color,
        width: 12,
        height: 12,
        borderRadius: '50%',
        display: 'inline-block',
      }}
    />
    {option.label}
  </div>
);

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const customers = useSelector((state: RootState) => state.purchaseOrder.customers) as any;

  const { productdata } = useSelector((state: any) => state.products);

  const { pmcodedata } = useSelector((state: any) => state.pmcodes);

  const grades = useSelector((state: RootState) => state.grades.gradedata) ?? [];

  const productOptions = productdata?.map((p: any) => ({
    label: p.product_name, // ya jo bhi field ho
    value: p.id,
  }));

  const packingOptions = pmcodedata?.map((p: any) => ({
    label: p.name, // ya jo bhi field ho
    value: p.name,
  }));

  const customerOptions = customers?.map((c: any) => {
    return {
      label: c.company_name,
      value: c.id,
      address: c.company_address,
    };
  });

  const [products, setProducts] = useState([
    {
      product_name: '',
      grade: '',
      quantity: '',
      quantity_date: '',
      quantity_dates: [{ quantity: '', date: '' }],
      unit: '',
      rate: '',
      gst: '',
      total: '',
      packing: '',
      currency: '',
      pro_freight: '',
      file: null,
    },
  ]);

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    updated[index][field] = value;

    const qty = parseFloat(updated[index].quantity) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    const gst = parseFloat(updated[index].gst) || 0;
    const pro_freight = parseFloat(updated[index].pro_freight) || 0;

    // Qty × Rate
    const amount = qty * rate;

    // Amount + Freight
    const subtotal = amount + pro_freight;

    // GST on Amount + Freight
    const gstAmount = subtotal * (gst / 100);

    // Final Total
    const total = subtotal + gstAmount;

    updated[index].total = total.toFixed(2);

    setProducts(updated);
  };

  const handleQuantityDatesChange = (index: number, quantity_dates: any[]) => {
    const updated = [...products];
    const product = { ...updated[index], quantity_dates };
    product.quantity = String(
      quantity_dates.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    );
    product.unit = quantity_dates[0]?.unit || '';
    const subtotal =
      (Number(product.quantity) || 0) * (Number(product.rate) || 0) +
      (Number(product.pro_freight) || 0);
    product.total = (subtotal + subtotal * ((Number(product.gst) || 0) / 100)).toFixed(2);
    updated[index] = product;
    setProducts(updated);
  };

  const addRow = () => {
    setProducts([
      ...products,
      {
        product_name: '',
        grade: '',
        quantity: '',
        quantity_date: '',
        quantity_dates: [{ quantity: '', date: '' }],
        unit: '',
        rate: '',
        gst: '',
        total: '',
        currency: '',
        pro_freight: '',
        packing: '',
        file: null,
      },
    ]);
  };

  const removeRow = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };
  // console.log(customerOptions);
  const [formData, setFormData] = useState<any>({
    po_no: '',
    company_id: '',
    po_date: '',
    destination: '',
    po_remark: '',
    company_address: '',
    customer_name: '',
    company_name: '',
    gstin: '',
    delivery_address: '',
    freight: '',
    payment_terms: '',
    domestic: true,
    export: false,
    country_name: '',
    inco_term: '',
    discharge_port: '',
    customise_labels: '',
    expected_delivery_date: '',
    submitted_by: '',
    priority: '',
  });
  const [createCustomer, setCreateCustomer] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(GetProduct());
    dispatch(GetPmCode());
    dispatch(GetGrade());
  }, []);

  const handleCustomerChange = (selected: any) => {
    setFormData({
      ...formData,
      company_id: selected.value,
      company_name: selected.label,
      company_address: selected.address,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.po_no ||
      (!formData.company_id && !(formData.company_name && formData.company_address))
    ) {
      toast.error('Please fill required fields ❌');
      return;
    }

    try {
      const payload = new FormData();

      /* ================= BASIC ================= */
      payload.append('po_no', formData.po_no);
      payload.append('company_id', formData.company_id);
      payload.append('po_date', formData.po_date);
      payload.append('destination', formData.destination);
      payload.append('po_remark', formData.po_remark);

      payload.append('company_address', formData.company_address);
      payload.append('delivery_address', formData.delivery_address);
      payload.append('customer_name', formData.customer_name);
      payload.append('freight', formData.freight);
      payload.append('payment_terms', formData.payment_terms);
      payload.append('expected_delivery_date', formData.expected_delivery_date);
      payload.append('priority', formData.priority);

      /* ================= EXTRA ================= */
      payload.append('company_type', formData.company_type || '');
      payload.append('remark', formData.remark || '');
      payload.append('commission', formData.commission || '');
      payload.append('insurance', formData.insurance || '');
      payload.append('insurance_remark', formData.insurance_remark || '');
      payload.append('customise_labels', formData.customise_labels || '');

      payload.append('type', formData.export ? 'export' : 'domestic');

      /* ================= EXPORT ================= */
      if (formData.export) {
        payload.append('country_name', formData.country_name || '');
        payload.append('inco_term', formData.inco_term || '');
        payload.append('discharge_port', formData.discharge_port || '');
      }

      /* ================= PRODUCTS ================= */
      const cleanProducts = products.map((p, index) => ({
        product_id: p.product_name,
        grade: p.grade,
        quantity: p.quantity,
        quantity_date: p.quantity_date || p.quantity_dates?.[0]?.date || '',
        quantity_dates: p.quantity_dates || [],
        unit: p.unit,
        rate: p.rate,
        gst: p.gst,
        total: p.total,
        packing: p.packing,
        currency: p.currency,
        pro_freight: p.pro_freight,
        file_key: p.file ? `file_${index}` : null,
      }));

      payload.append('products', JSON.stringify(cleanProducts));

      /* ================= FILES ================= */
      products.forEach((p, index) => {
        if (p.file) {
          payload.append(`file_${index}`, p.file);
        }
      });

      /* ================= API CALL ================= */
      const res = await dispatch(addPurchaseOrder(payload)).unwrap();

      toast.success(res.message || 'Purchase Order Created Successfully ✅');

      dispatch(getPurchaseOrders());
      setOpenModal(false);
    } catch (error: any) {
      // ✅ Backend message show
      toast.error(error?.message || error?.response?.data?.message || 'Something went wrong ❌');

      console.error(error);
    }
  };
  // const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'HIS'];

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="5xl">
      <Modal.Header>Purchase Order</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          <div className="col-span-6">
            <Label value="PO No." />
            <TextInput name="po_no" placeholder="Enter PO No." onChange={handleChange} />
          </div>
          <div className="col-span-6">
            <Label value="Company Type" />
            <select
              name="company_type"
              className="w-full border border-gray-500 p-2 rounded-md"
              onChange={handleChange}
            >
              <option value="">Select Company Type</option>
              <option value="Trader">Trader</option>
              <option value="manufacture">Manufacture</option>
            </select>
          </div>

          {/* Company Name */}
          <div className="col-span-6">
            <Label value="Company Name" />
            <button
              type="button"
              className="mb-2 text-sm text-primary underline"
              onClick={() => {
                setCreateCustomer((value) => !value);
                setFormData((prev: any) => ({
                  ...prev,
                  company_id: '',
                  company_name: '',
                  company_address: '',
                  gstin: '',
                }));
              }}
            >
              {createCustomer ? 'Select existing customer' : 'Add new customer'}
            </button>
            {createCustomer ? (
              <TextInput
                required
                name="company_name"
                placeholder="Enter company name"
                value={formData.company_name}
                onChange={handleChange}
              />
            ) : (
              <Select options={customerOptions} onChange={handleCustomerChange} />
            )}
          </div>

          {/* Company Address */}
          <div className="col-span-6">
            <Label value="Company Address" />
            <TextInput
              name="company_address"
              value={formData.company_address}
              readOnly={!createCustomer}
              required={createCustomer}
              placeholder="Enter company address"
              onChange={handleChange}
            />
          </div>
          {createCustomer && (
            <div className="col-span-6">
              <Label value="GST Number (optional)" />
              <TextInput name="gstin" value={formData.gstin} onChange={handleChange} />
            </div>
          )}

          <div className="col-span-6">
            <Label value="PO Date" />
            <TextInput
              type="date"
              name="po_date"
              value={formData.po_date}
              onChange={handleChange}
              placeholder="Enter PO Date"
            />
          </div>

          <div className="col-span-6">
            <Label value="Destination" />
            <TextInput
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter Destination"
            />
          </div>

          {formData.company_type == 'Trader' && (
            <div className="col-span-4">
              <Label value="End Customer name" />
              <TextInput
                name="customer_name"
                placeholder="Enter End Customer name"
                onChange={handleChange}
              />
            </div>
          )}

          {/* Delivery Address */}
          <div className="col-span-12">
            <Label value="Delivery Address" />
            <Textarea
              name="delivery_address"
              placeholder="Enter delivery address"
              onChange={handleChange}
            />
          </div>

          {products.map((product, index) => (
            <React.Fragment key={index}>
              {/* Product Name */}
              <div className="col-span-4">
                <Label value="Product Name" />

                <Select
                  options={productOptions}
                  value={productOptions.find((opt: any) => opt.value === product.product_name)}
                  onChange={(selected: any) => {
                    handleProductChange(index, 'product_name', selected.value);
                  }}
                />
              </div>
              {/* Grade */}
              <div className="col-span-2">
                <Label value="Grade" />
                <select
                  className="w-full border rounded p-2 text-gray"
                  value={product.grade}
                  onChange={(e) => handleProductChange(index, 'grade', e.target.value)}
                >
                  <option value="">Select Grade</option>
                  {Array.isArray(grades) &&
                    grades.map((g: any) => (
                      <option key={g.id} value={g.grade}>
                        {g.grade}
                      </option>
                    ))}
                </select>
              </div>
              {/* Quantity */}
              <div className="col-span-5">
                <Label value="Qty / Date" />
                {(product.quantity_dates || []).map((entry: any, entryIndex: number) => (
                  <div
                    key={entryIndex}
                    className="grid grid-cols-[1.6fr_100px_1fr_auto] gap-2 mb-2 items-center"
                  >
                    <input
                      type="number"
                      min={0}
                      placeholder="Quantity"
                      className="min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={entry.quantity}
                      onChange={(e) => {
                        const quantity_dates = [...product.quantity_dates];
                        quantity_dates[entryIndex] = { ...entry, quantity: e.target.value };
                        handleQuantityDatesChange(index, quantity_dates);
                      }}
                    />
                    <select
                      aria-label={`Unit for quantity ${entryIndex + 1}`}
                      value={entry.unit || ''}
                      onChange={(e) => {
                        const quantity_dates = [...product.quantity_dates];
                        quantity_dates[entryIndex] = { ...entry, unit: e.target.value };
                        handleQuantityDatesChange(index, quantity_dates);
                      }}
                      className="min-w-0 rounded border border-gray-300 px-2 py-2 text-sm"
                    >
                      <option value="">Unit</option>
                      {allUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.value}
                        </option>
                      ))}
                    </select>
                    <TextInput
                      type="date"
                      value={entry.date || ''}
                      onChange={(e) => {
                        const quantity_dates = [...product.quantity_dates];
                        quantity_dates[entryIndex] = { ...entry, date: e.target.value };
                        handleQuantityDatesChange(index, quantity_dates);
                      }}
                    />
                    {entryIndex > 0 && (
                      <Button
                        type="button"
                        color="failure"
                        size="xs"
                        onClick={() => {
                          const quantity_dates = product.quantity_dates.filter(
                            (_: any, i: number) => i !== entryIndex,
                          );
                          handleQuantityDatesChange(index, quantity_dates);
                        }}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="xs"
                    color="light"
                    onClick={() =>
                      handleQuantityDatesChange(index, [
                        ...product.quantity_dates,
                        { quantity: '', date: '' },
                      ])
                    }
                  >
                    + Add Qty / Date
                  </Button>
                </div>
              </div>

              {/* Rate */}
              <div className="col-span-2">
                <Label value="Rate" />

                <TextInput
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Rate"
                  value={product.rate}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (Number(value) < 0) return;

                    handleProductChange(index, 'rate', value);
                  }}
                />
              </div>
              <div className="col-span-2">
                <Label value="Currency" />
                <select
                  name="currency"
                  className="w-full border border-gray-500 p-2 rounded-md"
                  onChange={handleChange}
                >
                  <option value="">Select Currency</option>
                  <option value="rs">RS</option>
                  <option value="usd">USD</option>
                </select>
              </div>
              {/* GST */}
              <div className="col-span-2">
                <Label value="GST" />
                <Select
                  options={gstOptions}
                  onChange={(val: any) => handleProductChange(index, 'gst', val.value)}
                />
              </div>

              <div className="col-span-2">
                <Label value="Freight" />
                <TextInput
                  type="text"
                  name="pro_freight"
                  value={product.pro_freight}
                  onChange={(e) => {
                    let value = e.target.value;

                    if (value.includes('-')) return;

                    handleProductChange(index, 'pro_freight', value);
                  }}
                />
              </div>

              {/* Total */}
              <div className="col-span-2">
                <Label value="Total" />
                <TextInput value={product.total} readOnly />
              </div>
              {/* Packing */}
              <div className="col-span-4">
                <Label value="Packing" />

                <Select
                  options={packingOptions}
                  value={packingOptions.find((opt: any) => opt.value === product.packing)}
                  onChange={(selected: any) => {
                    handleProductChange(index, 'packing', selected.value);
                  }}
                />

                {/* <TextInput
                  placeholder="Packing"
                  value={product.packing}
                  onChange={(e) => handleProductChange(index, 'packing', e.target.value)}
                /> */}
              </div>
              {/* IHS File */}
              {product.grade === 'IHS' && (
                <div className="col-span-3">
                  <Label value="HIS Upload" />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e: any) => handleProductChange(index, 'file', e.target.files[0])}
                  />
                </div>
              )}
              {/* Remove Button */}
              <div className="col-span-1 flex items-center">
                {index > 0 && (
                  <Button color="failure" size="xs" onClick={() => removeRow(index)}>
                    Remove
                  </Button>
                )}
              </div>
              <div className="col-span-8"></div>
            </React.Fragment>
          ))}
          <div className="col-span-12">
            <Button color="primary" size="sm" onClick={addRow}>
              + Add Product
            </Button>
          </div>

          {/* Freight */}
          <div className="col-span-6">
            <Label value="Delivery Terms" />
            <TextInput name="freight" placeholder="Enter delivery terms" onChange={handleChange} />
          </div>

          {/* Payment Terms Dropdown */}
          <div className="col-span-6">
            <Label value="Payment Terms" />
            <select
              name="payment_terms"
              className="w-full border border-gray-500 p-2 rounded-md"
              onChange={handleChange}
            >
              <option value="">Select Payment Term</option>
              <option value="Advance">Advance</option>
              <option value="LC">LC</option>
              <option value="Credit">Credit</option>
              <option value="Immediate">Immediate</option>
            </select>
          </div>

          {['LC', 'Credit'].includes(formData.payment_terms) && (
            <div className="col-span-6">
              <Label value="Remark" />
              <Textarea name="remark" placeholder="Enter remark" onChange={handleChange} />
            </div>
          )}

          {/* Domestic / Export */}
          <div className="col-span-12 flex gap-6 items-center">
            {/* Domestic - Yellow */}
            <label className="flex items-center gap-2 cursor-pointer text-yellow-600 font-medium">
              <Checkbox
                name="domestic"
                checked={formData.domestic}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.checked) {
                    setFormData((prev: any) => ({
                      ...prev,
                      export: false,
                    }));
                  }
                }}
              />
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md border border-yellow-300">
                Domestic
              </span>
            </label>

            {/* Export - Green */}
            <label className="flex items-center gap-2 cursor-pointer text-green-600 font-medium">
              <Checkbox
                name="export"
                checked={formData.export}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.checked) {
                    setFormData((prev: any) => ({
                      ...prev,
                      domestic: false,
                    }));
                  }
                }}
              />
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md border border-green-300">
                Export
              </span>
            </label>
          </div>
          {/* Export Fields */}
          {formData.export && (
            <>
              <div className="col-span-4">
                <Label value="Country Name" />
                <TextInput
                  name="country_name"
                  placeholder="Enter country name"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-4">
                <Label value="Inco Term" />
                <select
                  name="inco_term"
                  className="w-full border rounded p-2"
                  onChange={handleChange}
                >
                  <option value="">Select Inco Term</option>
                  <option value="EXW">EXW</option>
                  <option value="FCA">FCA</option>
                  <option value="FAS">FAS</option>
                  <option value="FOB">FOB</option>
                  <option value="CFR">CFR</option>
                  <option value="CIF">CIF</option>
                  <option value="CPT">CPT</option>
                  <option value="CIP">CIP</option>
                  <option value="DPU">DPU</option>
                  <option value="DAP">DAP</option>
                  <option value="DDP">DDP</option>
                </select>
              </div>

              <div className="col-span-4">
                <Label value="Discharge Port" />
                <TextInput
                  name="discharge_port"
                  placeholder="Enter discharge port name"
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="col-span-2">
            <Label value="Customise Labels" />

            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customise_labels"
                  value="yes"
                  checked={formData.customise_labels === 'yes'}
                  onChange={handleChange}
                />
                Yes
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="customise_labels"
                  value="no"
                  checked={formData.customise_labels === 'no'}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          {formData.company_type !== 'end customer' && (
            <div className="col-span-4">
              <Label value="Commission" />
              <TextInput name="commission" placeholder="Enter Commission" onChange={handleChange} />
            </div>
          )}

          <div className="col-span-6">
            <Label value="Insurance" />
            <select
              name="insurance"
              className="w-full border border-gray-500 p-2 rounded-md"
              onChange={handleChange}
            >
              <option value="">Select Insurance</option>
              <option value="0.1%">0.1%</option>
              <option value="Nil">Nil</option>
              <option value="own_policy">Own Policy</option>
            </select>
          </div>

          {['own_policy'].includes(formData.insurance) && (
            <div className="col-span-6">
              <Label value="Remark" />
              <Textarea
                name="insurance_remark"
                placeholder="Enter remark"
                onChange={handleChange}
              />
            </div>
          )}

          {/* Expected Delivery Date */}
          <div className="col-span-6">
            <Label value="Expected Delivery Date" />
            <TextInput type="date" name="expected_delivery_date" onChange={handleChange} />
          </div>

          <div className="col-span-6">
            <Label value="Priority" />

            <Select
              options={priorityOptions}
              formatOptionLabel={formatOptionLabel}
              value={priorityOptions.find((opt) => opt.value === formData.priority)}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: selected?.value,
                }))
              }
            />
          </div>

          <div className="col-span-12">
            <Label value="Remark" />
            <Textarea name="po_remark" placeholder="Enter remark" onChange={handleChange} />
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-2">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary" isProcessing={false}>
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PurchaseOrderModal;
