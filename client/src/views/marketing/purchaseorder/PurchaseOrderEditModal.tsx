import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea, Checkbox } from 'flowbite-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { updatePurchaseOrder } from 'src/features/marketing/PurchaseOrderSlice';
import { useDispatch } from 'react-redux';

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
    }
  }, [selectedRow]);

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
      const payload = {
        ...formData,
        type: formData.export ? 'export' : 'domestic',
      };

      await dispatch(updatePurchaseOrder(payload));
      toast.success('Purchase Order Updated Successfully ✅');
      // success
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

          {/* Company Name */}
          <div className="col-span-6">
            <Label value="Company Name" />
            <TextInput
              name="company_name"
              value={formData.company_name || ''}
              onChange={handleChange}
            />
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

          {/* Delivery Address */}
          <div className="col-span-12">
            <Label value="Delivery Address" />
            <Textarea
              name="delivery_address"
              value={formData.delivery_address || ''}
              onChange={handleChange}
            />
          </div>

          {/* Product Name */}
          <div className="col-span-6">
            <Label value="Product Name" />
            <TextInput
              name="product_name"
              value={formData.product_name || ''}
              onChange={handleChange}
            />
          </div>

          {/* Grade */}
          <div className="col-span-6">
            <Label value="Grade" />
            <TextInput name="grade" value={formData.grade || ''} onChange={handleChange} />
          </div>

          {/* IHS Upload */}
          {formData.grade === 'IHS' && (
            <div className="col-span-12">
              <Label value="Upload IHS Document" />
              <input type="file" className="block w-full text-sm text-gray-500" />
            </div>
          )}

          {/* Quantity */}
          <div className="col-span-4">
            <Label value="Quantity" />
            <TextInput
              type="number"
              name="quantity"
              value={formData.quantity || ''}
              onChange={handleChange}
            />
          </div>

          {/* Rate */}
          <div className="col-span-4">
            <Label value="Rate" />
            <TextInput
              type="number"
              name="rate"
              value={formData.rate || ''}
              onChange={handleChange}
            />
          </div>

          {/* GST */}
          <div className="col-span-4">
            <Label value="GST" />
            <Select
              options={gstOptions}
              value={gstOptions.find((g) => g.value == formData.gst)}
              onChange={(selected: any) => setFormData({ ...formData, gst: selected.value })}
            />
          </div>

          {/* Total */}
          <div className="col-span-6">
            <Label value="Total" />
            <TextInput value={formData.total || ''} readOnly />
          </div>

          {/* Packing */}
          <div className="col-span-6">
            <Label value="Packing" />
            <TextInput name="packing" value={formData.packing || ''} onChange={handleChange} />
          </div>

          {/* Freight */}
          <div className="col-span-6">
            <Label value="Freight" />
            <TextInput name="freight" value={formData.freight || ''} onChange={handleChange} />
          </div>

          {/* Payment Terms */}
          <div className="col-span-6">
            <Label value="Payment Terms" />
            <Textarea
              name="payment_terms"
              value={formData.payment_terms || ''}
              onChange={handleChange}
            />
          </div>

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
                <TextInput
                  name="inco_term"
                  value={formData.inco_term || ''}
                  onChange={handleChange}
                />
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
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PurchaseOrderEditModal;
