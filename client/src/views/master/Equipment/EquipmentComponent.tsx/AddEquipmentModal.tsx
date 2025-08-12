import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  ToggleSwitch,
  Select,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addEquipment, GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';

const AddEquipmentModal = ({ show, setShowmodal,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    status: true,
    created_by :logindata?.admin?.id
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['name', 'category'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addEquipment(formData)).unwrap();
      toast.success(result.message || 'Equipment added successfully');
      dispatch(GetEquipment());
      setFormData({
        name: '',
        category: '',
        description: '',
        status: true,
           created_by :logindata?.admin?.id
      });
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Add Equipment</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {/* Name */}
          <div className="col-span-6">
            <Label htmlFor="name" value="Equipment Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter equipment name"
              color={errors.name ? 'failure' : 'gray'}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="col-span-6">
            <Label htmlFor="category" value="Category" />
            <span className="text-red-700 ps-1">*</span>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              color={errors.category ? 'failure' : 'gray'}
            >
              <option value="">Select Category</option>
              <option value="Lab">Lab</option>
              <option value="Production">Production</option>
              <option value="Office">Office</option>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="col-span-12">
            <Label htmlFor="description" value="Description" />
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter equipment description"
              className="w-full rounded-md border-gray-300"
            />
          </div>

          {/* Status */}
          <div className="col-span-6 mt-2">
            <Label htmlFor="status" value="Status" />
            <div className="mt-2">
              <ToggleSwitch
                id="status"
                checked={formData.status}
                onChange={(val) => handleChange('status', val)}
                label={formData.status ? 'Active' : 'Inactive'}
              />
            </div>
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

export default AddEquipmentModal;
