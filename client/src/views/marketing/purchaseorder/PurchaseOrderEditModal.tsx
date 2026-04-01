import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea, Checkbox } from 'flowbite-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getAllCustomers, updatePurchaseOrder } from 'src/features/marketing/PurchaseOrderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { GetProduct } from 'src/features/master/Product/ProductSlice';

interface PurchaseOrderEditModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
  handleupdated: any;
}

const gstOptions = [
  { value: 18, label: '18%' },
  { value: 0.1, label: '0.1%' },
  { value: 0, label: 'Nil' },
];

const PurchaseOrderEditModal: React.FC<PurchaseOrderEditModalProps> = ({
  openModal,
  setOpenModal,
  selectedRow,
}) => {
  const [formData, setFormData] = useState<any>({});
  const dispatch = useDispatch<any>();

  // ✅ Set selected row data
  useEffect(() => {
    if (selectedRow) {
      setFormData(selectedRow);

      if (selectedRow.products) {
        try {
          const parsed =
            typeof selectedRow.products === 'string'
              ? JSON.parse(selectedRow.products)
              : selectedRow.products;

          // 🔥 IMPORTANT mapping
          const formatted = parsed.map((p: any) => ({
            product_id: p.product_id,
            grade: p.grade,
            quantity: p.quantity,
            rate: p.rate,
            gst: p.gst,
            total: p.total,
            packing: p.packing,
            file: null,
          }));

          setProducts(formatted);
        } catch {
          setProducts([]);
        }
      }
    }
  }, [selectedRow]);

  const customers = useSelector((state: RootState) => state.purchaseOrder.customers) as any;
  const { productdata } = useSelector((state: any) => state.products);

  const productOptions = productdata?.map((p: any) => ({
    label: `${p.product_name} (${p.grade || ''})`,
    value: p.id,
    grade: p.grade,
    rate: p.rate,
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

  const handleCustomerChange = (selected: any) => {
    setFormData({
      ...formData,
      company_id: selected.value,
      company_address: selected.address,
    });
  };

  // ✅ Auto Total Calculation
  useEffect(() => {
    dispatch(getAllCustomers());
    dispatch(GetProduct());
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      payload.append('po_no', formData.po_no);
      payload.append('company_id', formData.company_id);
      payload.append('company_address', formData.company_address);
      payload.append('customer_name', formData.customer_name);
      payload.append('delivery_address', formData.delivery_address);
      payload.append('freight', formData.freight);
      payload.append('payment_terms', formData.payment_terms);
      payload.append('expected_delivery_date', formData.expected_delivery_date);
      payload.append('company_type', formData.company_type || '');
      payload.append('remark', formData.remark || '');
      payload.append('commission', formData.commission || '');
      payload.append('insurance', formData.insurance || '');
      payload.append('insurance_remark', formData.insurance_remark || '');
      payload.append('customise_labels', formData.customise_labels || '');
      payload.append('type', formData.export ? 'export' : 'domestic');
      payload.append('products', JSON.stringify(products));

      products.forEach((p, index) => {
        if (p.file) {
          payload.append(`file_${index}`, p.file);
        }
      });

      await dispatch(
        updatePurchaseOrder({
          id: formData.id,
          data: payload,
        }),
      );

      toast.success('Purchase Order Updated Successfully ✅');
      setOpenModal(false);
    } catch (error) {
      console.error('Error submitting purchase order:', error);
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="5xl">
      <Modal.Header>Edit Purchase Order</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* Company Name */}
          <div className="col-span-6">
            <Label value="PO No." />
            <TextInput name="po_no" value={formData.po_no || ''} onChange={handleChange} />
          </div>

          <div className="col-span-6">
            <Label value="Company Type" />
            <select
              name="company_type"
              value={formData.company_type || ''}
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
            <Select
              options={customerOptions}
              value={customerOptions.find((c: any) => c.value === formData.company_id)}
              onChange={handleCustomerChange}
            />{' '}
          </div>

          {/* Company Address */}
          <div className="col-span-6">
            <Label value="Company Address" />
            <TextInput
              name="company_address"
              value={formData.company_address || ''}
              onChange={handleChange}
            />
          </div>

          {formData.company_type == 'Trader' && (
            <div className="col-span-4">
              <Label value="End Customer name" />
              <TextInput
                name="customer_name"
                value={formData.customer_name}
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
              value={formData.delivery_address || ''}
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
                  value={productOptions?.find((o: any) => o.value === (product as any).product_id)}
                  onChange={(selected: any) => {
                    handleProductChange(index, 'product_id', selected.value);
                  }}
                />
              </div>

              {/* Grade */}
              <div className="col-span-2">
                <Label value="Grade" />
                <TextInput
                  placeholder="Grade"
                  value={product.grade}
                  onChange={(e) => handleProductChange(index, 'grade', e.target.value)}
                />
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
                  value={gstOptions.find((g) => g.value === Number(product.gst))}
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
              {product.grade === 'IHS' && (
                <div className="col-span-3">
                  <Label value="IHS Upload" />
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
            <Label value="Freight" />
            <TextInput name="freight" value={formData.freight || ''} onChange={handleChange} />
          </div>

          {/* Payment Terms */}

          <div className="col-span-6">
            <Label value="Payment Terms" />
            <select
              name="payment_terms"
              className="w-full border border-gray-500 p-2 rounded-md"
              value={formData.payment_terms || ''}
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
              <Textarea
                value={formData.remark || ''}
                name="remark"
                placeholder="Enter remark"
                onChange={handleChange}
              />
            </div>
          )}

          {/* Domestic / Export */}
          <div className="col-span-12 flex gap-6 items-center">
            <Checkbox
              name="domestic"
              checked={formData.domestic || false}
              onChange={handleChange}
            />
            <span>Domestic</span>

            <Checkbox name="export" checked={formData.export || false} onChange={handleChange} />
            <span>Export</span>
          </div>

          {/* Export Fields */}
          {formData.export && (
            <>
              <div className="col-span-4">
                <Label value="Country Name" />
                <TextInput
                  name="country_name"
                  value={formData.country_name || ''}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-4">
                <Label value="Inco Term" />
                <select
                  name="inco_term"
                  className="w-full border rounded p-2"
                  value={formData.inco_term || ''}
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
                  value={formData.discharge_port || ''}
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
              <TextInput
                name="commission"
                value={formData.commission}
                placeholder="Enter Commission"
                onChange={handleChange}
              />
            </div>
          )}

          <div className="col-span-6">
            <Label value="Insurance" />
            <select
              name="insurance"
              value={formData.insurance}
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
                value={formData.insurance_remark}
                name="insurance_remark"
                placeholder="Enter remark"
                onChange={handleChange}
              />
            </div>
          )}

          {/* Expected Delivery Date */}
          <div className="col-span-6">
            <Label value="Expected Delivery Date" />
            <TextInput
              type="date"
              name="expected_delivery_date"
              value={formData.expected_delivery_date || ''}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-12 flex justify-end gap-2">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PurchaseOrderEditModal;
