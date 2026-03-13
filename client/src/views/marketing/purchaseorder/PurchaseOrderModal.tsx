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
  }, []);

  const handleCustomerChange = (selected: any) => {
    setFormData({
      ...formData,
      company_id: selected.value,
      company_address: selected.address,
    });
  };

  // ✅ Auto Total Calculation
  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const gst = parseFloat(formData.gst) || 0;

    const subtotal = qty * rate;
    const gstAmount = subtotal * (gst / 100);
    const total = subtotal + gstAmount;

    setFormData((prev: any) => ({
      ...prev,
      total: total.toFixed(2),
    }));
  }, [formData.quantity, formData.rate, formData.gst]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append('po_no', formData.po_no);
      payload.append('company_id', formData.company_id);
      payload.append('company_address', formData.company_address);
      payload.append('delivery_address', formData.delivery_address);
      payload.append('freight', formData.freight);
      payload.append('payment_terms', formData.payment_terms);
      payload.append('expected_delivery_date', formData.expected_delivery_date);
      payload.append('submitted_by', formData.submitted_by);
      payload.append('type', formData.export ? 'export' : 'domestic');
      payload.append('products', JSON.stringify(products));

      products.forEach((p, index) => {
        if (p.file) {
          payload.append(`file_${index}`, p.file);
        }
      });

      await dispatch(addPurchaseOrder(payload));
      toast.success('Purchase Order Created Successfully ✅');
      dispatch(getPurchaseOrders());
      // success
      setOpenModal(false);
    } catch (error) {
      console.error('Error submitting purchase order:', error);
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="5xl">
      <Modal.Header>Purchase Order</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          <div className="col-span-6">
            <Label value="PO No." />
            <TextInput name="po_no" placeholder="Enter PO No." onChange={handleChange} />
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
                <TextInput
                  placeholder="Product Name"
                  value={product.product_name}
                  onChange={(e) => handleProductChange(index, 'product_name', e.target.value)}
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
            <TextInput name="freight" placeholder="Enter freight charges" onChange={handleChange} />
          </div>

          {/* Payment Terms */}
          <div className="col-span-6">
            <Label value="Payment Terms" />
            <Textarea
              name="payment_terms"
              placeholder="Enter payment terms"
              onChange={handleChange}
            />
          </div>

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
                <TextInput
                  name="inco_term"
                  placeholder="Enter Inco term (e.g. FOB, CIF)"
                  onChange={handleChange}
                />
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

          {/* Customise Labels */}
          <div className="col-span-12">
            <Label value="Customise Labels" />
            <Textarea
              name="customise_labels"
              placeholder="Enter customise label details"
              onChange={handleChange}
            />
          </div>

          {/* Expected Delivery Date */}
          <div className="col-span-6">
            <Label value="Expected Delivery Date" />
            <TextInput type="date" name="expected_delivery_date" onChange={handleChange} />
          </div>
          <div className="col-span-6">
            <Label value="Submitted by " />
            <TextInput
              name="submitted_by"
              placeholder="Enter submitted by name"
              onChange={handleChange}
            />
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
