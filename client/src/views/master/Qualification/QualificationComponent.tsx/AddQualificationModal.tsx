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
  addQualification,
  GetQualification,
} from 'src/features/master/Qualification/QualificationSlice';

const AddQualificationModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    qualification_name: '',
    status: 'Inactive', // default status
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['qualification_name'];
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
      const result = await dispatch(addQualification(formData)).unwrap();
      toast.success(result.message || 'Qualification created successfully');
      dispatch(GetQualification());
      setFormData({
        qualification_name: '',
        status: 'Inactive',
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Qualification</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <Label htmlFor="qualification_name" value="Qualification Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="qualification_name"
              type="text"
              value={formData.qualification_name}
              placeholder="Enter Qualification name"
              onChange={(e) => handleChange('qualification_name', e.target.value)}
              color={errors.qualification_name ? 'failure' : 'gray'}
              className="form-rounded-md"
            />
            {errors.qualification_name && (
              <p className="text-red-500 text-xs">{errors.qualification_name}</p>
            )}
          </div>

          {/* Toggle Status */}
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

export default AddQualificationModal;
