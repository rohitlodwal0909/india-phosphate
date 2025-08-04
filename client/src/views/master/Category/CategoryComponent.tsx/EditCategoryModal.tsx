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
  updateCategory,
  GetCategory,
} from 'src/features/master/Category/CategorySlice';

const EditCategoryModal = ({ show, setShowmodal, CategoryData,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    user_id:logindata?.admin.id,
    category_name: '',
  });
  console.log(CategoryData)

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (CategoryData) {
      setFormData({
        id: CategoryData?.id || '',
        category_name: CategoryData?.category_name || '',
        user_id:logindata?.admin.id,
      });
    }
  }, [CategoryData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['category_name'];
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
      const result = await dispatch(updateCategory(formData)).unwrap();
      toast.success(result.message || 'Category updated successfully');
      dispatch(GetCategory());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update Category');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Category</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
       
            <div className={` col-span-12`}>
              <Label value="Category" />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
               
                type="text"
                value={formData?.category_name}
                placeholder="Enter category name"
                onChange={(e) => handleChange("category_name", e.target.value)}
                color={errors?.category_name ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors?.category_name && <p className="text-red-500 text-xs"> {errors?.category_name }</p>}
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

export default EditCategoryModal;
