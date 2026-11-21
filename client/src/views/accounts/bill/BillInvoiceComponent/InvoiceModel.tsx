import { Label, TextInput, Textarea } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCustomer } from 'src/features/master/Customer/CustomerSlice';
import { GetSupplier } from 'src/features/master/Supplier/SupplierSlice';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import axiosInstance from 'src/constants/axiosInstance';

const selectStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

const InvoiceModel = ({ formData, setFormData, purchasePos = [] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const existscustomer = useSelector((state: RootState) => state.customer.existscustomer) as any;
  const suppliers = useSelector((state: RootState) => state.supplier.supplierdata) as any;

  const mergedData = [
    ...(existscustomer || []).map((item: any) => ({
      id: item.id,
      name: item.company_name,
      type: 'Customer',
      originalData: item,
    })),

    ...(suppliers || []).map((item: any) => ({
      id: item.id,
      name: item.supplier_name,
      type: 'Supplier',
      originalData: item,
    })),
  ];

  const options = mergedData.map((item) => ({
    value: item.id,
    label: `${item.name} (${item.type})`,
    type: item.type,
    data: item.originalData,
  }));

  useEffect(() => {
    dispatch(GetCustomer());
    dispatch(GetSupplier());
  }, [dispatch]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

  };

  const formatDateInput = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePoChange = async (poId: string) => {
    const selectedPo = purchasePos.find((item: any) => String(item.id) === String(poId));
    if (!selectedPo) {
      setFormData((prev) => ({
        ...prev,
        po_no: '',
        from_to: '',
        delivery_note: '',
        delivery_note_date: '',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      po_no: selectedPo.po_no,
      from_to: formatDateInput(selectedPo.date),
      delivery_note: '',
      delivery_note_date: '',
    }));

    try {
      const response = await axiosInstance.get(`/find-store/${selectedPo.id}`);
      const storeRecords = Array.isArray(response.data?.data) ? response.data.data : [];
      const storeRecord = [...storeRecords]
        .sort((a: any, b: any) => Number(b.id || 0) - Number(a.id || 0))
        .find((item: any) => item.lr_no || item.expected_arrival_date);

      setFormData((prev) => ({
        ...prev,
        delivery_note: storeRecord?.lr_no || '',
        delivery_note_date: formatDateInput(storeRecord?.expected_arrival_date),
      }));
    } catch (error) {
      console.error('Failed to fetch Purchase PO delivery details:', error);
    }
  };

  const selectedPoId = purchasePos.find((item: any) => String(item.po_no) === String(formData.po_no))?.id || '';

  return (
    <form className="grid grid-cols-12 gap-4">
      {/* 🔹 Invoice */}
      <div className="col-span-12 font-semibold text-lg border-b pb-2">Invoice Details</div>

      <div className="col-span-3">
        <Label value="Customer / Supplier" className="text-black" />{' '}
        <Select
          options={options}
          menuPortalTarget={document.body}
          styles={selectStyles}
          placeholder="Select Customer / Supplier"
          value={
            options.find(
              (option) =>
                option.value === formData.company_id && option.type === formData.party_type,
            ) || null
          }
          onChange={(selectedOption: any) => {
            setFormData({
              ...formData,
              company_id: selectedOption?.value,
              party_type: selectedOption?.type,
            });
          }}
        />
      </div>

      <div className="col-span-3">
        <Label value="Credit / Debit Type" />
        <select
          className="w-full border rounded-md p-2"
          value={formData.transaction_type}
          onChange={(e) =>
            setFormData({
              ...formData,
              transaction_type: e.target.value,
            })
          }
        >
          <option value="">Select Type</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>

      <div className="col-span-3">
        <Label value="Purchase Order No." className="text-black" />
        <select
          className="w-full border rounded-md p-2"
          value={selectedPoId}
          onChange={(e) => handlePoChange(e.target.value)}
        >
          <option value="">Select Purchase Order No.</option>
          {purchasePos.map((item: any) => (
            <option key={item.id} value={item.id}>{item.po_no}</option>
          ))}
        </select>
      </div>

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
          min={new Date().toISOString().split('T')[0]}
          value={formData.invoice_date?.split('T')[0] || ''}
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
          min={new Date().toISOString().split('T')[0]}
          value={formData.delivery_note_date}
          onChange={(e) => handleChange('delivery_note_date', e.target.value)}
        />
      </div>
      <div className="col-span-3">
        <Label value="PO Date" />
        <TextInput
          type="date"
          min={new Date().toISOString().split('T')[0]}
          value={formData.from_to ? formData.from_to.split('T')[0] : ''}
          onChange={(e) => handleChange('from_to', e.target.value)}
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
          min={new Date().toISOString().split('T')[0]}
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
          min={new Date().toISOString().split('T')[0]}
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
