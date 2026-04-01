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

interface PurchaseOrderModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const gstOptions = [
  { value: 18, label: '18%' },
  { value: 0.1, label: '0.1%' },
  { value: 0, label: 'Nil' },
];

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<any>();

  const customers = useSelector((state: RootState) => state.purchaseOrder.customers) as any;
  const { productdata } = useSelector((state: any) => state.products);

  const productOptions = productdata?.map((p: any) => ({
    label: p.product_name, // ya jo bhi field ho
    value: p.id,
  }));

  const customerOptions = customers?.map((c: any) => {
    let address = '';

    if (c.addresses) {
      try {
        const parsed = typeof c.addresses === 'string' ? JSON.parse(c.addresses) : c.addresses;

        if (Array.isArray(parsed) && parsed.length > 0) {
          const addr = parsed[0];
          address = `${addr.company_address || ''}, ${addr.factory_address || ''}, ${addr.city || ''}, ${addr.country || ''}`;
        }
      } catch (err) {
        address = '';
      }
    }

    return {
      label: c.company_name,
      value: c.id,
      address: address,
    };
  });

  const [products, setProducts] = useState([
    {
      product_name: '',
      grade: '',
      quantity: '',
      rate: '',
      gst: '',
      total: '',
      packing: '',
      file: null,
    },
  ]);

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    updated[index][field] = value;

    const qty = parseFloat(updated[index].quantity) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    const gst = parseFloat(updated[index].gst) || 0;

    const subtotal = qty * rate;
    const gstAmount = subtotal * (gst / 100);
    updated[index].total = (subtotal + gstAmount).toFixed(2);

    setProducts(updated);
  };

  const addRow = () => {
    setProducts([
      ...products,
      {
        product_name: '',
        grade: '',
        quantity: '',
        rate: '',
        gst: '',
        total: '',
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
    company_address: '',
    customer_name: '',
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
  });

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
  }, []);

  const handleCustomerChange = (selected: any) => {
    setFormData({
      ...formData,
      company_id: selected.value,
      company_address: selected.address,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.po_no || !formData.company_id) {
      toast.error('Please fill required fields ❌');
      return;
    }

    try {
      const payload = new FormData();

      // ✅ Basic Fields
      payload.append('po_no', formData.po_no);
      payload.append('company_id', formData.company_id);
      payload.append('company_address', formData.company_address);
      payload.append('delivery_address', formData.delivery_address);
      payload.append('customer_name', formData.customer_name);
      payload.append('freight', formData.freight);
      payload.append('payment_terms', formData.payment_terms);
      payload.append('expected_delivery_date', formData.expected_delivery_date);

      // ✅ Extra Fields
      payload.append('company_type', formData.company_type || '');
      payload.append('remark', formData.remark || '');
      payload.append('commission', formData.commission || '');
      payload.append('insurance', formData.insurance || '');
      payload.append('insurance_remark', formData.insurance_remark || '');
      payload.append('customise_labels', formData.customise_labels || '');

      // ✅ Type
      payload.append('type', formData.export ? 'export' : 'domestic');

      // ✅ Export Fields (only if export)
      if (formData.export) {
        payload.append('country_name', formData.country_name || '');
        payload.append('inco_term', formData.inco_term || '');
        payload.append('discharge_port', formData.discharge_port || '');
      }

      // ✅ Products Clean
      const cleanProducts = products.map((p, index) => ({
        product_id: p.product_name,
        grade: p.grade,
        quantity: p.quantity,
        rate: p.rate,
        gst: p.gst,
        total: p.total,
        packing: p.packing,
        file_key: p.file ? `file_${index}` : null,
      }));

      payload.append('products', JSON.stringify(cleanProducts));

      // ✅ Files
      products.forEach((p, index) => {
        if (p.file) {
          payload.append(`file_${index}`, p.file);
        }
      });

      // ✅ API Call
      await dispatch(addPurchaseOrder(payload));

      toast.success('Purchase Order Created Successfully ✅');
      dispatch(getPurchaseOrders());
      setOpenModal(false);
    } catch (error) {
      console.error('Error submitting purchase order:', error);
      toast.error('Something went wrong ❌');
    }
  };

  const grades = ['IP', 'BP', 'EP', 'USP', 'FCC', 'HIS'];

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
              <option value="end customer">End customer</option>
            </select>
          </div>

          {/* Company Name */}
          <div className="col-span-6">
            <Label value="Company Name" />
            <Select options={customerOptions} onChange={handleCustomerChange} />
          </div>

          {/* Company Address */}
          <div className="col-span-6">
            <Label value="Company Address" />
            <TextInput
              name="company_address"
              value={formData.company_address}
              readOnly
              placeholder="Enter company address"
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
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              {/* Quantity */}
              <div className="col-span-2">
                <Label value="Qty" />
                <TextInput
                  type="number"
                  placeholder="Qty"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                />
              </div>
              {/* Rate */}
              <div className="col-span-2">
                <Label value="Rate" />
                <TextInput
                  type="number"
                  placeholder="Rate"
                  value={product.rate}
                  onChange={(e) => handleProductChange(index, 'rate', e.target.value)}
                />
              </div>
              {/* GST */}
              <div className="col-span-2">
                <Label value="GST" />
                <Select
                  options={gstOptions}
                  onChange={(val: any) => handleProductChange(index, 'gst', val.value)}
                />
              </div>
              {/* Total */}
              <div className="col-span-2">
                <Label value="Total" />
                <TextInput value={product.total} readOnly />
              </div>
              {/* Packing */}
              <div className="col-span-3">
                <Label value="Packing" />
                <TextInput
                  placeholder="Packing"
                  value={product.packing}
                  onChange={(e) => handleProductChange(index, 'packing', e.target.value)}
                />
              </div>
              {/* IHS File */}
              {product.grade === 'HIS' && (
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
              <div className="col-span-6"></div>
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
            <Checkbox
              name="domestic"
              checked={formData.domestic}
              onChange={(e) => {
                handleChange(e);
                if (e.target.checked) {
                  setFormData((prev: any) => ({ ...prev, export: false }));
                }
              }}
            />
            <span>Domestic</span>

            <Checkbox
              name="export"
              checked={formData.export}
              onChange={(e) => {
                handleChange(e);
                if (e.target.checked) {
                  setFormData((prev: any) => ({ ...prev, domestic: false }));
                }
              }}
            />
            <span>Export</span>
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
