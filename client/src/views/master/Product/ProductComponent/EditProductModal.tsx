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
import { updateProduct, GetProduct } from 'src/features/master/Product/ProductSlice';

const EditProductModal = ({ show, setShowmodal, ProductData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    product_name: '',
    ihs_code: '', // ✅ NEW FIELD
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (ProductData) {
      setFormData({
        id: ProductData?.id || '',
        product_name: ProductData?.product_name || '',
        ihs_code: ProductData?.ihs_code || '', // ✅ SET VALUE
      });
    }
  }, [ProductData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.product_name) {
      newErrors.product_name = 'Product name is required';
    }

    if (!formData.ihs_code) {
      newErrors.ihs_code = 'IHS code is required'; // ✅ VALIDATION
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: any) => {
    e?.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        product_name: formData.product_name,
        ihs_code: formData.ihs_code, // ✅ SEND TO API
      };

      const result = await dispatch(updateProduct({ id: formData.id, ...payload })).unwrap();

      toast.success(result.message || 'Product updated successfully');

      dispatch(GetProduct());

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update Product');
    }
  };

  const handleClose = () => {
    setShowmodal(false);
    setErrors({});
  };

  return (
    <Modal show={show} onClose={handleClose} size="2xl">
      <ModalHeader>Edit Product</ModalHeader>

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

          {/* ✅ IHS Code */}
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
        <Button color="gray" onClick={handleClose}>
          Cancel
        </Button>

        <Button type="submit" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditProductModal;
