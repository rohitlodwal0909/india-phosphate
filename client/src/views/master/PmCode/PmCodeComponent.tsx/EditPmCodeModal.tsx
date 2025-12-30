import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Select,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';

import {
  GetPmCode,
  updatePmCode,
} from 'src/features/master/PmCode/PmCodeSlice';

const EditPmCodeModal = ({ show, setShowmodal, RmCodeData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    user_id: logindata?.admin?.id,
    name: '',
    packaging_type: '',
  });

 const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (RmCodeData) {
      setFormData({
        id: RmCodeData?.id || '',
        name: RmCodeData?.name || '',
        packaging_type: RmCodeData?.packaging_type || '',
        user_id: logindata?.admin?.id,
      });
    }
  }, [RmCodeData, logindata]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const required = ['name', 'packaging_type'];
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
      const result = await dispatch(updatePmCode(formData)).unwrap();
      toast.success(result.message || 'PM Code updated successfully');
      dispatch(GetPmCode());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update PM Code');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit PM Code</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {/* Name */}
          <div className="col-span-6">
            <Label htmlFor="name" value="Name" />
            <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="name"
              type="text"
              value={formData.name}
              placeholder="Enter name"
              onChange={(e) => handleChange('name', e.target.value)}
              color={errors.name ? 'failure' : 'gray'}
            />

            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Packaging Type */}
          <div className="col-span-6">
            <Label htmlFor="packaging_type" value="Packaging Type" />
            <span className="text-red-700 ps-1">*</span>

            <Select
              id="packaging_type"
              value={formData.packaging_type}
              onChange={(e) =>
                handleChange('packaging_type', e.target.value)
              }
              color={errors.packaging_type ? 'failure' : 'gray'}
            >
              <option value="">Select Packaging Type</option>
              <option value="bag">Bag</option>
              <option value="drum">Drum</option>
            </Select>

            {errors.packaging_type && (
              <p className="text-red-500 text-xs">
                {errors.packaging_type}
              </p>
            )}
          </div>

        </form>
      </ModalBody>

      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditPmCodeModal;
