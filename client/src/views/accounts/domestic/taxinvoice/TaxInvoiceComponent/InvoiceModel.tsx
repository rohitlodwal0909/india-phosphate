import { Label, TextInput, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { ImageUrl } from 'src/constants/contant';

const InvoiceModel = ({ data, formData, setFormData }) => {
  // 🔹 Invoice Form

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        invoice_no: data?.invoice_no || '',
        buyer:
          (data?.poentry?.customers?.company_name || '') +
          '\n' +
          (data?.poentry?.company_address || ''),
        consignee:
          (data?.poentry?.customers?.company_name || '') +
          '\n' +
          (data?.poentry?.company_address || ''),
      }));
    }
  }, [data]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    // ✅ File preview
    if (key === 'oq_upload' && value) {
      setPreview(URL.createObjectURL(value));
    }
  };

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (formData.oq_upload && typeof formData.oq_upload === 'string') {
      setPreview(ImageUrl + 'uploads/oq-uploads/' + formData.oq_upload);
    }
  }, [formData.oq_upload]);

  return (
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
      <div className="col-span-4">
        <Label value="PO Date" />
        <TextInput
          type="date"
          value={formData.from_to}
          onChange={(e) => handleChange('from_to', e.target.value)}
        />
      </div>
      <div className="col-span-3">
        <Label
          htmlFor="oq_upload"
          value="OQ Upload"
          className="text-sm font-semibold text-gray-700"
        />

        <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg h-[42px] flex items-center justify-center hover:bg-gray-50 transition">
          <input
            type="file"
            id="oq_upload"
            className="hidden"
            onChange={(e) => handleChange('oq_upload', e.target.files[0])}
          />

          <label htmlFor="oq_upload" className="cursor-pointer text-blue-600 text-sm font-medium">
            Click to Upload File
          </label>
        </div>
      </div>
      <div className="col-span-2">
        {preview && (
          <>
            {/* IMAGE PREVIEW */}
            {!preview.includes('.pdf') ? (
              <img
                src={preview}
                width={100}
                height={100}
                alt="preview"
                className=" object-cover rounded border"
              />
            ) : (
              <a
                href={preview}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View
              </a>
            )}
          </>
        )}
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
          readOnly
          value={formData.buyer}
          onChange={(e) => handleChange('buyer', e.target.value)}
          placeholder="Enter Buyer Name, GST No & Billing Address"
        />
      </div>

      <div className="col-span-6">
        <Label value="Consignee (Ship To)" />
        <Textarea
          readOnly
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
          value={formData.payment_mode}
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
      <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">Reference Details</div>

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
      <div className="col-span-12 font-semibold text-lg border-b pt-4 pb-2">Dispatch Details</div>

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

      <div className="col-span-3">
        <Label value="LUT/Bond No" />
        <TextInput
          value={formData.lut_no}
          placeholder="Enter LUT/Bond No"
          onChange={(e) => handleChange('lut_no', e.target.value)}
        />
      </div>

      {/* 🔹 Final */}
      <div className="col-span-3">
        <Label value="Term of delivery" />
        <TextInput
          value={formData.remark}
          placeholder="Enter Term of delivery"
          onChange={(e) => handleChange('remark', e.target.value)}
        />
      </div>
      {/* 🔹 Products */}
    </form>
  );
};

export default InvoiceModel;
