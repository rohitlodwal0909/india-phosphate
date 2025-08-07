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
import {
  addPurchase,
  GetPurchase,
} from 'src/features/master/Purchase/PurchaseSlice';
import { allUnits } from 'src/utils/AllUnit';

// Sample vendor and unit options (should be fetched from API ideally)



const AddPurchaseModal = ({ show, setShowmodal, logindata ,vendordata}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    vendor_id: '',
    item: '',
    quantity: '',
    unit: '',
    remarks: '',
    price:'',
    total_amount:"",
    payment_terms:"",
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['vendor_id', 'item', 'quantity', 'unit', 'price','payment_terms','total_amount'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addPurchase(formData)).unwrap();
      toast.success(result.message || 'Purchase created successfully');
      dispatch(GetPurchase());
      setFormData({
        vendor_id: '',
        item: '',
        quantity: '',
        unit: '',
       
        remarks: '',
        price:'',
        total_amount:'',
        payment_terms:'',
        created_by: logindata?.admin?.id,
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Purchase</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {/* Vendor */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="vendor_id" value="Vendor" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="vendor_id"
              value={formData.vendor_id}
              onChange={(e) => handleChange('vendor_id', e.target.value)}
              color={errors.vendor_id ? 'failure' : 'gray'}
              className="w-full border border-gray-300 p-2 rounded-md"
            ><option value="">Select Vendor</option>
              {vendordata.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.supplier_name}
                </option>
              ))}
            </select>
            {errors.vendor_id && (
              <p className="text-red-500 text-xs">{errors.vendor_id}</p>
            )}
          </div>

          {/* Item ID */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="item" value="Item Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="item"
              type="text"
              value={formData.item}
              placeholder="Enter item Name"
              className='form-rounded-md'
              onChange={(e) => handleChange('item', e.target.value)}
              color={errors.item ? 'failure' : 'gray'}
            />
            {errors.item && <p className="text-red-500 text-xs">{errors.item}</p>}
          </div>

          {/* Quantity */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="quantity" value="Quantity" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="quantity"
              type="number"
              value={formData.quantity}
              placeholder="Enter quantity"
              className='form-rounded-md'
              onChange={(e) => handleChange('quantity', e.target.value)}
              color={errors.quantity ? 'failure' : 'gray'}
            />
            {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
          </div>

          {/* unit */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="unit" value="Unit of Measurement (unit)" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              color={errors.unit ? 'failure' : 'gray'}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Unit</option>
              {allUnits.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            {errors.unit && <p className="text-red-500 text-xs">{errors.unit}</p>}
          </div>
 <div className="col-span-12 md:col-span-6">
            <Label htmlFor="payment_terms" value="Payment Terms" />
            <span className="text-red-700 ps-1">*</span>
              <TextInput
              id="payment_terms"
              type="text"
              value={formData.payment_terms}
              placeholder="Enter price"
              className='form-rounded-md'
              onChange={(e) => handleChange('payment_terms', e.target.value)}
            />
           
            {errors.payment_terms && <p className="text-red-500 text-xs">{errors.payment_terms}</p>}
          </div>

        
             <div className="col-span-12 md:col-span-6">
            <Label htmlFor="price" value="price" />
            <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="price"
              type="number"
              value={formData.price}
              placeholder="Enter price"
              className='form-rounded-md'
              onChange={(e) => handleChange('price', e.target.value)}
            />
             {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}

          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="total_amount" value="Total Amount" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="total_amount"
              type="number"
              value={formData.total_amount}
              placeholder="Enter total_amount"
              className='form-rounded-md'
              onChange={(e) => handleChange('total_amount', e.target.value)}
            />
             {errors.total_amount && <p className="text-red-500 text-xs">{errors.total_amount}</p>}
          </div>
          {/* Remarks */}
          <div className="col-span-12">
            <Label htmlFor="remarks" value="Remarks" />
            <Textarea
              id="remarks"
              placeholder="Enter any remarks"
              rows={2}
              value={formData.remarks}
              className='rounded-md'
              onChange={(e) => handleChange('remarks', e.target.value)}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddPurchaseModal;
