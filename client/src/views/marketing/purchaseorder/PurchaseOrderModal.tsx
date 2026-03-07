import React, { useState, useEffect } from 'react';
import { Button, Modal, Label, TextInput, Textarea, Checkbox } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { addPurchaseOrder, getPurchaseOrders } from 'src/features/marketing/PurchaseOrderSlice';
import { toast } from 'react-toastify';

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

  const [formData, setFormData] = useState<any>({
    po_no: '',
    company_name: '',
    company_address: '',
    delivery_address: '',
    product_name: '',
    grade: '',
    quantity: '',
    rate: '',
    gst: '',
    total: '',
    packing: '',
    freight: '',
    payment_terms: '',
    domestic: true,
    export: false,
    country_name: '',
    inco_term: '',
    discharge_port: '',
    customise_labels: '',
    expected_delivery_date: '',
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
      const payload = {
        ...formData,
        type: formData.export ? 'export' : 'domestic',
      };

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
            <TextInput
              name="company_name"
              placeholder="Enter company name"
              onChange={handleChange}
            />
          </div>

          {/* Company Address */}
          <div className="col-span-6">
            <Label value="Company Address" />
            <TextInput
              name="company_address"
              placeholder="Enter company address"
              onChange={handleChange}
            />
          </div>

          {/* Product Name */}
          <div className="col-span-6">
            <Label value="Product Name" />
            <TextInput
              name="product_name"
              placeholder="Enter product name"
              onChange={handleChange}
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

          {/* Grade */}
          <div className="col-span-6">
            <Label value="Grade" />
            <TextInput name="grade" placeholder="Enter grade (e.g. IHS)" onChange={handleChange} />
          </div>

          {/* If Grade = IHS → Upload */}
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
              name="quantity"
              type="number"
              placeholder="Enter quantity"
              onChange={handleChange}
            />
          </div>

          {/* Rate */}
          <div className="col-span-4">
            <Label value="Rate" />
            <TextInput
              name="rate"
              type="number"
              placeholder="Enter rate per unit"
              onChange={handleChange}
            />
          </div>

          {/* GST */}
          <div className="col-span-4">
            <Label value="GST" />
            <Select
              options={gstOptions}
              placeholder="Select GST"
              onChange={(selected: any) => setFormData({ ...formData, gst: selected.value })}
            />
          </div>

          {/* Total */}
          <div className="col-span-6">
            <Label value="Total" />
            <TextInput value={formData.total} readOnly placeholder="Auto calculated total" />
          </div>

          {/* Packing */}
          <div className="col-span-6">
            <Label value="Packing" />
            <TextInput name="packing" placeholder="Enter packing details" onChange={handleChange} />
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
