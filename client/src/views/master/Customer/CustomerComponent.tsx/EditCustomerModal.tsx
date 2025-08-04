import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  updateCustomer,
  GetCustomer,
} from 'src/features/master/Customer/CustomerSlice';

const EditCustomerModal = ({ show, setShowmodal, CustomerData,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    user_id:logindata?.admin.id,
    customer_name: '',
    email: '',
    address: '',
    contact_no: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (CustomerData) {
      setFormData({
        id: CustomerData?.id || '',
        customer_name: CustomerData?.customer_name || '',
        email: CustomerData?.email || '',
        address: CustomerData?.address || '',
         contact_no: CustomerData?.contact_no || '',
        user_id:logindata?.admin.id,
      });
    }
  }, [CustomerData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['customer_name', 'email', 'address', 'contact_no'];
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
      const result = await dispatch(updateCustomer(formData)).unwrap();
      toast.success(result.message || 'Customer updated successfully');
      dispatch(GetCustomer());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update Customer');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Customer</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            {
              id: 'customer_name',
              label: 'Customer Name',
              type: 'text',
              placeholder: 'Enter Customer name',
            },
             {
              id: 'contact_no',
              label: 'Contact No',
              type: 'text',
              placeholder: 'Enter contact number',
            },
            {
              id: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Enter email',
            },
           
          ].map(({ id, label, type, placeholder }) => (
            <div className={`${type ==="email" ? "col-span-12" :"col-span-6"}`} key={id}>
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={placeholder}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          <div className="col-span-12">
            <Label htmlFor="address" value="Address" />
            <span className="text-red-700 ps-1">*</span>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter Customer address"
              className={`w-full border rounded-md p-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditCustomerModal;
