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
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addPmCode,
  GetPmCode,
} from 'src/features/master/PmCode/PmCodeSlice';

const AddPmCodeModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    user_id: logindata?.admin?.id,
    name: '',
    packaging_type: '',
  });

  const [errors, setErrors] = useState<any>({});

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
      const result = await dispatch(addPmCode(formData)).unwrap();
      toast.success(result.message || 'PM Code created successfully');
      dispatch(GetPmCode());

      setFormData({
        user_id: logindata?.admin?.id,
        name: '',
        packaging_type: '',
      });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New PM Code</ModalHeader>

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
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddPmCodeModal;
