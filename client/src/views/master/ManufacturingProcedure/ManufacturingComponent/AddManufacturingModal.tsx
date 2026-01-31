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
import {
  addProcedure,
  GetProcedure,
} from 'src/features/master/ManufacturingProcedure/ManufacturingProcedureSlice';

// Sample vendor and UOM options (should be fetched from API ideally)

const AddManufacturingModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['name'];
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
      const result = await dispatch(addProcedure(formData)).unwrap();
      toast.success(result.message || 'ManufacturingProcedure created successfully');
      dispatch(GetProcedure());
      setFormData({
        name: '',
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Procedure</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Vendor */}

          {/* Item ID */}
          <div className="col-span-12 md:col-span-12">
            <Label htmlFor="item" value=" Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="name"
              type="text"
              value={formData.name}
              placeholder="Enter  Name"
              className="form-rounded-md"
              onChange={(e) => handleChange('name', e.target.value)}
              color={errors.name ? 'failure' : 'gray'}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
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

export default AddManufacturingModal;
