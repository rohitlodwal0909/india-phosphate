import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addDesignation,
  GetDesignation,
} from 'src/features/master/Designation/DesignationSlice';

const AddDesignationModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    designation_name: '',
    status: 'Inactive', // default value
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['designation_name'];
    const newErrors: any = {};
    required.forEach((field) => {
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
      const result = await dispatch(addDesignation(formData)).unwrap();
      toast.success(result.message || 'Designation created successfully');
      dispatch(GetDesignation());
      setFormData({
        designation_name: '',
        status: 'Inactive',
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Designation</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Label htmlFor="designation_name" value="Designation Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="designation_name"
              type="text"
              value={formData.designation_name}
              placeholder="Enter Designation name"
              onChange={(e) => handleChange('designation_name', e.target.value)}
              color={errors.designation_name ? 'failure' : 'gray'}
              className="form-rounded-md"
            />
            {errors.designation_name && (
              <p className="text-red-500 text-xs">{errors.designation_name}</p>
            )}
          </div>

          <div className="col-span-6 gap-2 ">
            <Label htmlFor="status" value="Status" />
           
            <div className="flex gap-3 mt-3">

            <ToggleSwitch
              id="status"
              checked={formData.status === 'Active'}
              onChange={(checked) =>
                handleChange('status', checked ? 'Active' : 'Inactive')
              }
            />
            <span>{formData.status === 'Active' ? 'Active' : 'Inactive'}</span>
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

export default AddDesignationModal;
