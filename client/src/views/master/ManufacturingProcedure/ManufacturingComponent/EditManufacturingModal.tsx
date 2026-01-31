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
  GetProcedure,
  updateProcedure,
} from 'src/features/master/ManufacturingProcedure/ManufacturingProcedureSlice';

const EditManufacturingModal = ({ show, setShowmodal, OutwardData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (OutwardData) {
      setFormData({
        id: OutwardData?.id || '',
        name: OutwardData?.name || '',
      });
    }
  }, [OutwardData]);

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
      const result = await dispatch(updateProcedure(formData)).unwrap();
      toast.success(result.message || 'ManufacturingProcedure updated successfully');
      dispatch(GetProcedure());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update Outward');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit ManufacturingProcedure</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Vendor */}

          {/* Item ID */}
          <div className="col-span-12 md:col-span-12">
            <Label htmlFor="item" value="Item Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="item"
              type="text"
              value={formData.name}
              placeholder="Enter name "
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
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditManufacturingModal;
