import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addProduct, GetProduct } from 'src/features/master/Product/ProductSlice';

const AddProductModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    product_name: '',
    ihs_code: '', // ✅ NEW FIELD
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['product_name', 'ihs_code']; // ✅ Added ihs_code
    const newErrors: any = {};

    required.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: any) => {
    e?.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(addProduct(formData)).unwrap();
      toast.success(result.message || 'Product created successfully');

      dispatch(GetProduct());

      setFormData({
        product_name: '',
        ihs_code: '', // ✅ reset
      });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Product</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Product Name */}
          <div className="col-span-12">
            <Label htmlFor="product_name" value="Product Name" />
            <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="product_name"
              type="text"
              value={formData.product_name}
              placeholder="Enter Product name"
              onChange={(e) => handleChange('product_name', e.target.value)}
              color={errors.product_name ? 'failure' : 'gray'}
            />

            {errors.product_name && <p className="text-red-500 text-xs">{errors.product_name}</p>}
          </div>

          {/* ✅ IHS Code Field */}
          <div className="col-span-12">
            <Label htmlFor="ihs_code" value="HSN Code" />
            <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="ihs_code"
              type="text"
              value={formData.ihs_code}
              placeholder="Enter HSN Code"
              onChange={(e) => handleChange('ihs_code', e.target.value)}
              color={errors.ihs_code ? 'failure' : 'gray'}
            />

            {errors.ihs_code && <p className="text-red-500 text-xs">{errors.ihs_code}</p>}
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

export default AddProductModal;
