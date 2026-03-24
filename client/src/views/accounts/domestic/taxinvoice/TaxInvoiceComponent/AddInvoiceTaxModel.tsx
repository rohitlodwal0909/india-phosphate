import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,
} from 'flowbite-react';
import { useState } from 'react';

const AddInvoiceTaxModel = ({ show, setShowmodal }) => {
  const [formData, setFormData] = useState({
    // Basic
    invoice_no: '',
    invoice_date: '',
    eway_bill: '',
    delivery_note: '',
    delivery_note_date: '',

    // IRN
    irn: '',
    ack_no: '',
    ack_date: '',

    // Party
    buyer: '',
    consignee: '',
    gst_type: '', // export / domestic

    // Payment
    payment_mode: '',
    payment_remark: '',

    // References
    reference_no: '',
    other_reference: '',
    buyer_order_no: '',
    buyer_order_date: '',

    // Dispatch
    dispatch_doc_no: '',
    dispatch_through: '',
    destination: '',
    country: '',

    // Export
    lut_no: '',
    from_to: '',

    // Charges
    insurance: '',
    freight: '',
    round_off: '',

    // GST
    gst_rate: '',

    // Other
    terms_delivery: '',
    remark: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal show={show} onClose={setShowmodal} size="7xl">
      <ModalHeader>Tax Invoice</ModalHeader>

      <ModalBody>
        <form className="grid grid-cols-12 gap-4">
          {/* 🔹 Invoice */}
          <div className="col-span-12 font-semibold text-lg border-b pb-2">Invoice Details</div>

          <div className="col-span-3">
            <Label value="Invoice No" className="text-black" />
            <TextInput
              value={formData.invoice_no}
              onChange={(e) => handleChange('invoice_no', e.target.value)}
              placeholder="Enter Invoice No"
            />
          </div>

          <div className="col-span-3">
            <Label value="Invoice Date" />
            <TextInput
              type="date"
              value={formData.invoice_date}
              onChange={(e) => handleChange('invoice_date', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="E-Way Bill" />
            <TextInput
              value={formData.eway_bill}
              onChange={(e) => handleChange('eway_bill', e.target.value)}
              placeholder="Enter E-Way Bill"
            />
          </div>

          <div className="col-span-3">
            <Label value="Delivery Note" />
            <TextInput
              value={formData.delivery_note}
              placeholder="Enter Delivery Note"
              onChange={(e) => handleChange('delivery_note', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Delivery Note Date" />
            <TextInput
              type="date"
              value={formData.delivery_note_date}
              onChange={(e) => handleChange('delivery_note_date', e.target.value)}
            />
          </div>

          {/* 🔹 IRN */}
          <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">IRN Details</div>

          <div className="col-span-4">
            <Label value="IRN" />
            <TextInput
              value={formData.irn}
              placeholder="Enter IRN Number"
              onChange={(e) => handleChange('irn', e.target.value)}
            />
          </div>

          <div className="col-span-4">
            <Label value="ACK No" />
            <TextInput
              value={formData.ack_no}
              placeholder="Enter Acknowledgement Number"
              onChange={(e) => handleChange('ack_no', e.target.value)}
            />
          </div>

          <div className="col-span-4">
            <Label value="ACK Date" />
            <TextInput
              type="date"
              value={formData.ack_date}
              onChange={(e) => handleChange('ack_date', e.target.value)}
            />
          </div>

          {/* 🔹 Party */}
          <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">Party Details</div>

          <div className="col-span-6">
            <Label value="Buyer (Bill To)" />
            <Textarea
              value={formData.buyer}
              onChange={(e) => handleChange('buyer', e.target.value)}
              placeholder="Enter Buyer Name, GST No & Billing Address"
            />
          </div>

          <div className="col-span-6">
            <Label value="Consignee (Ship To)" />
            <Textarea
              value={formData.consignee}
              onChange={(e) => handleChange('consignee', e.target.value)}
              placeholder="Enter Consignee Name & Shipping Address"
            />
          </div>

          {/* 🔹 Payment */}
          <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">Payment</div>

          <div className="col-span-4">
            <Label value="Mode of Payment" />
            <select
              className="w-full border p-2 rounded-md"
              onChange={(e) => handleChange('payment_mode', e.target.value)}
            >
              <option value="">Select</option>
              <option value="advance">Advance</option>
              <option value="lc">LC</option>
              <option value="credit">Credit</option>
              <option value="immediate">Immediate</option>
            </select>
          </div>

          <div className="col-span-4">
            <Label value="Payment Remark" />
            <TextInput
              value={formData.payment_remark}
              placeholder="Enter payment remarks (if any)"
              onChange={(e) => handleChange('payment_remark', e.target.value)}
            />
          </div>

          {/* 🔹 References */}
          <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">
            Reference Details
          </div>

          <div className="col-span-3">
            <Label value="Reference No" />
            <TextInput
              value={formData.reference_no}
              placeholder="Enter Reference Number"
              onChange={(e) => handleChange('reference_no', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Other Reference" />
            <TextInput
              value={formData.other_reference}
              placeholder="Enter Additional Reference"
              onChange={(e) => handleChange('other_reference', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Buyer Order No" />
            <TextInput
              value={formData.buyer_order_no}
              placeholder="Enter Buyer Order Number"
              onChange={(e) => handleChange('buyer_order_no', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Buyer Order Date" />
            <TextInput
              type="date"
              value={formData.buyer_order_date}
              onChange={(e) => handleChange('buyer_order_date', e.target.value)}
            />
          </div>

          {/* 🔹 Dispatch */}
          <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">
            Dispatch Details
          </div>

          <div className="col-span-3">
            <Label value="Dispatch Doc No" />
            <TextInput
              value={formData.dispatch_doc_no}
              placeholder="Enter Dispatch Document Number"
              onChange={(e) => handleChange('dispatch_doc_no', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Dispatch Through" />
            <TextInput
              value={formData.dispatch_through}
              placeholder="Transport / Courier Name"
              onChange={(e) => handleChange('dispatch_through', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Destination" />
            <TextInput
              value={formData.destination}
              placeholder="Enter Destination"
              onChange={(e) => handleChange('destination', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Country" />
            <TextInput
              value={formData.country}
              placeholder="Enter Country"
              onChange={(e) => handleChange('country', e.target.value)}
            />
          </div>

          {/* 🔹 Charges */}
          <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">Charges</div>

          <div className="col-span-4">
            <Label value="From to" />
            <TextInput
              type="date"
              value={formData.buyer_order_date}
              onChange={(e) => handleChange('buyer_order_date', e.target.value)}
            />
          </div>

          <div className="col-span-4">
            <Label value="LUT/Bond No" />
            <TextInput
              value={formData.freight}
              placeholder="Enter LUT / Bond Number"
              onChange={(e) => handleChange('freight', e.target.value)}
            />
          </div>

          <div className="col-span-4">
            <Label value="Term of delivery" />
            <TextInput
              value={formData.round_off}
              placeholder="Enter Delivery Terms"
              onChange={(e) => handleChange('round_off', e.target.value)}
            />
          </div>

          {/* 🔹 Final */}
          <div className="col-span-12">
            <Label value="Remarks" />
            <Textarea
              value={formData.remark}
              placeholder="Enter any additional remarks"
              onChange={(e) => handleChange('remark', e.target.value)}
            />
          </div>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={setShowmodal}>
          Cancel
        </Button>
        <Button color="primary">Save Invoice</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddInvoiceTaxModel;
