import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,

  Textarea
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateSalesMaster, GetSalesMaster } from 'src/features/master/SalesMaster/SalesMasterSlice';


const paymentModes = ['LC', 'Advanced', 'CAD', 'DAP','Creadit','Bank Contract'];
const statusOptions = ['Completed', 'Pending', 'Cancelled'];

const EditSalesMasterModal = ({ show, setShowmodal, SalesMasterData, logindata, CustomerData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialForm = {
    id: '',
    invoice_no: '',
    invoice_date: '',
    customer_id: '',
    payment_mode: '',
    product_details: '',
    subtotal_amount: '',
    tax_amount: '',
    discount_amount: '',
    grand_total: '',
    paid_amount: '',
    balance_amount: '',
    status: '',
    created_by: logindata?.admin?.id || '',
    remarks: ''
  };

  const [formData, setFormData] = useState<any>(initialForm);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (SalesMasterData) {
      setFormData({
        id: SalesMasterData.id || '',
        invoice_no: SalesMasterData.invoice_no || '',
        invoice_date: SalesMasterData.invoice_date?.slice(0, 10) || '',
        customer_id: SalesMasterData.customer_id || '',
        payment_mode: SalesMasterData.payment_mode || '',
        product_details: SalesMasterData.product_details || '',
        subtotal_amount: SalesMasterData.subtotal_amount || '',
        tax_amount: SalesMasterData.tax_amount || '',
        discount_amount: SalesMasterData.discount_amount || '',
        grand_total: SalesMasterData.grand_total || '',
        paid_amount: SalesMasterData.paid_amount || '',
        balance_amount: SalesMasterData.balance_amount || '',
        status: SalesMasterData.status || '',
        created_by: SalesMasterData.created_by || '',
        remarks: SalesMasterData.remarks || ''
      });
    }
  }, [SalesMasterData]);

const handleChange = (field: string, value: any) => {
  setFormData((prev) => {
    const updatedData = { ...prev, [field]: value };

    // Auto-calculate grand_total only if subtotal and tax are valid numbers
    const subtotal = parseFloat(field === 'subtotal_amount' ? value : updatedData.subtotal_amount);
    const tax = parseFloat(field === 'tax_amount' ? value : updatedData.tax_amount);

    const hasBothFields = !isNaN(subtotal) && !isNaN(tax);

    if (hasBothFields) {
      updatedData.grand_total = subtotal + tax;
    }

    return updatedData;
  });

  setErrors((prev) => ({ ...prev, [field]: '' }));
};


  const validateForm = () => {
    const requiredFields = ['invoice_no', 'invoice_date', 'payment_mode', 'status', 'grand_total'];
    const newErrors: any = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
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
      const result = await dispatch(updateSalesMaster(formData)).unwrap();
      toast.success(result.message || 'Sales entry updated successfully');
      dispatch(GetSalesMaster());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || err || 'Something went wrong');
    }
  };

  const renderInput = (id, label, type = 'text') => (
    <div className="col-span-4">
      <Label htmlFor={id} value={label} />
      <span className="text-red-700 ps-1">*</span>
      <TextInput
        id={id}
        type={type}
        value={formData[id]}
        className='form-rounded-md'
        onChange={(e) => handleChange(id, e.target.value)}
        placeholder={`Enter ${label}`}
      />
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );

  const renderSelect = (id, label, options) => (
    <div className="col-span-4">
      <Label htmlFor={id} value={label} />
      <span className="text-red-700 ps-1">*</span>
      <select id={id} value={formData[id]} onChange={(e) => handleChange(id, e.target.value)} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5" >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="6xl">
      <ModalHeader>Edit Sales Entry</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {renderInput('invoice_no', 'Invoice No')}
          {renderInput('invoice_date', 'Invoice Date', 'date')}
          <div className="col-span-4">
            <Label htmlFor="customer_id" value="Customer Name" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="customer_id"
              value={formData.customer_id}
              onChange={(e) => handleChange('customer_id', e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"
            >
              <option value="">Select Customer</option>
              {CustomerData?.map((items) => (
                <option value={items?.id}>{items?.customer_name}</option>
              ))}

              {/* You can map customer list here dynamically */}
            </select>
            {errors.customer_id && (
              <p className="text-red-500 text-xs">{errors.customer_id}</p>
            )}
          </div>


          {renderSelect('payment_mode', 'Payment Mode', paymentModes)}
          {renderInput('subtotal_amount', 'Amount', 'number')}
          {renderInput('tax_amount', 'Tax Amount', 'number')}
          {/* {renderInput('discount_amount', 'Discount Amount', 'number')} */}
          {renderInput('grand_total', 'Grand Total', 'number')}
          {renderInput('paid_amount', 'Paid Amount', 'number')}
          {/* {renderInput('balance_amount', 'Balance Amount', 'number')} */}
          {renderSelect('status', 'Status', statusOptions)}

          <div className="col-span-6">
            <Label htmlFor="product_details" value="Product Details   " />
            <Textarea
              id="product_details"
              rows={2}
              value={formData.product_details}
              className='rounded-md'
              onChange={(e) => handleChange('product_details', e.target.value)}
              placeholder="[{ name: '', qty: '', rate: '', tax: '', amount: '' }]"
            />
          </div>

          <div className="col-span-6">
            <Label htmlFor="remarks" value="Remarks" />
            <Textarea
              id="remarks"
              rows={2}
              value={formData.remarks}
              className='rounded-md'
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Additional remarks (optional)"
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter className='flex justify-end'>
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditSalesMasterModal;
