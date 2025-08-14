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
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addSalesMaster, GetSalesMaster } from 'src/features/master/SalesMaster/SalesMasterSlice';

const paymentModes = ['Cash', 'Credit', 'UPI', 'Online'];
// const statusOptions = ['Pending', 'Completed', 'Cancelled'];

const AddSalesMasterModal = ({ show, setShowmodal, logindata, CustomerData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialForm = {
    invoice_no: '',
    invoice_date: '',
    customer_id: '',
    payment_mode: '',
    product_details:'',
    subtotal_amount: '',
    tax_amount: '',
    discount_amount: '',
    grand_total: '',
    paid_amount: '',
    balance_amount: '',
    status: 'Pending',
    created_by: logindata?.admin?.id || '',
    remarks: '',
  };

  const [formData, setFormData] = useState<any>(initialForm);
  const [errors, setErrors] = useState<any>({});
const handleChange = (field: string, value: any) => {
  setFormData((prev) => {
    const updatedData = { ...prev, [field]: value };

    // Auto-calculate grand_total only if all 3 fields have valid numeric values
    const subtotal = parseFloat(field === 'subtotal_amount' ? value : updatedData.subtotal_amount);
    const tax = parseFloat(field === 'tax_amount' ? value : updatedData.tax_amount);
    const discount = parseFloat(field === 'discount_amount' ? value : updatedData.discount_amount);

    const hasAllFields =
      !isNaN(subtotal) && !isNaN(tax) && !isNaN(discount);

    if (hasAllFields) {
      updatedData.grand_total = subtotal + tax - discount;
    }

    return updatedData;
  });

  setErrors((prev) => ({ ...prev, [field]: '' }));
};




  const requiredFields = [
    'invoice_no',
    'invoice_date',
    'customer_id',
    'payment_mode',
    'product_details',
    'subtotal_amount',
    'tax_amount',
    'grand_total',
    'paid_amount',
    'balance_amount',
    'status',
  ];

  const validateForm = () => {
    const newErrors: any = {};
    requiredFields.forEach((field) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addSalesMaster(formData)).unwrap();
      toast.success(result.message || 'Sales entry created successfully');
      dispatch(GetSalesMaster());
      setFormData(initialForm);
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || err|| 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="5xl">
      <ModalHeader>Add Sales Entry</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <Label htmlFor="invoice_no" value="Invoice No" />
               <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="invoice_no"
              value={formData.invoice_no}
              className='form-rounded-md'
              placeholder='Enter Invoice Number'
              onChange={(e) => handleChange('invoice_no', e.target.value)}
            />
            {errors.invoice_no && <p className="text-red-500 text-xs">{errors.invoice_no}</p>}
          </div>

          <div className="col-span-4">
            <Label htmlFor="invoice_date" value="Invoice Date" />
            <TextInput
              id="invoice_date"
              type="date"
              value={formData.invoice_date}
              className='form-rounded-md'
              onChange={(e) => handleChange('invoice_date', e.target.value)}
            />
            {errors.invoice_date && <p className="text-red-500 text-xs">{errors.invoice_date}</p>}
          </div>

          <div className="col-span-4">
  <Label htmlFor="customer_id" value="Customer ID" />
               <span className="text-red-700 ps-1">*</span>

  <select
    id="customer_id"
    value={formData.customer_id}
    onChange={(e) => handleChange('customer_id', e.target.value)}
    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"
  >
    <option value="">Select Customer</option>
  { CustomerData?.map((items)=>(
<option value={items?.id}>{items?.customer_name}</option>
  ))  }
    
    {/* You can map customer list here dynamically */}
  </select>
  {errors.customer_id && (
    <p className="text-red-500 text-xs">{errors.customer_id}</p>
  )}
</div>

          <div className="col-span-4">
            <Label htmlFor="payment_mode" value="Payment Mode" />
               <span className="text-red-700 ps-1">*</span>

            <select
              id="payment_mode"
              value={formData.payment_mode}
              onChange={(e) => handleChange('payment_mode', e.target.value)}
    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"

            >
              <option value="">Select Payment Mode</option>
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
            {errors.payment_mode && <p className="text-red-500 text-xs">{errors.payment_mode}</p>}
          </div>

          {/* Product Details JSON input (for simplicity) */}
         

          {['subtotal_amount', 'tax_amount', 'discount_amount', 'grand_total', 'paid_amount', 'balance_amount'].map((field) => (
            <div className="col-span-4" key={field}>
              <Label htmlFor={field} value={field.replace('_', ' ').toLowerCase()} />
               <span className="text-red-700 ps-1">*</span>

              <TextInput
                id={field}
                type="number"
                value={formData[field]}
                 placeholder={`Enter ${field.replace('_', ' ').toLowerCase()}`}
                className='form-rounded-md'
                onChange={(e) => handleChange(field, e.target.value)}
              />
              {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
            </div>
          ))}

          {/* <div className="col-span-4">
            <Label htmlFor="status" value="Status" />
               <span className="text-red-700 ps-1">*</span>

            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"

            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
          </div> */}

          
           <div className="col-span-6">
            <Label htmlFor="product_details" value="Product Details" />
            <Textarea
              id="product_details"
              value={formData.product_details}
                className='rounded-md'
              onChange={(e) => handleChange('product_details', e.target.value)}
              placeholder='Example: name:Cement,quantity:2,rate:500,tax:18,amount:1180 '
            />
            {errors.product_details && <p className="text-red-500 text-xs">{errors.product_details}</p>}
          </div>
          <div className="col-span-6">
            <Label htmlFor="remarks" value="Remarks" />
            <Textarea
              id="remarks"
              value={formData.remarks}
              className='rounded-md'
              placeholder=' Enter Notes'
              onChange={(e) => handleChange('remarks', e.target.value)}
            />
          </div>
        </form>
      </ModalBody>

      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddSalesMasterModal;
