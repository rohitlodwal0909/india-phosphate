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
import { addPmCode, GetPmCode } from 'src/features/master/PmCode/PmCodeSlice';
import { allUnits } from 'src/utils/AllUnit';

const AddPmCodeModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const permission = logindata?.admin?.id;

  const [formData, setFormData] = useState({
    name: '',
    packaging_type: '',
    opening_stock: '',
    unit: '',
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
        name: '',
        packaging_type: '',
        opening_stock: '',
        unit: '',
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

            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Packaging Type */}
          <div className="col-span-6">
            <Label htmlFor="packaging_type" value="Packaging Type" />
            <span className="text-red-700 ps-1">*</span>

            <Select
              id="packaging_type"
              value={formData.packaging_type}
              onChange={(e) => handleChange('packaging_type', e.target.value)}
              color={errors.packaging_type ? 'failure' : 'gray'}
            >
              <option value="">Select Packaging Type</option>
              <option value="bag">Bag</option>
              <option value="drum">Drum</option>
            </Select>

            {errors.packaging_type && (
              <p className="text-red-500 text-xs">{errors.packaging_type}</p>
            )}
          </div>
          {permission === 5 && (
            <div className="col-span-12">
              <Label value="Quantity (Net)" />

              <div className="flex rounded-md shadow-sm mt-1">
                <input
                  type="text"
                  placeholder="Enter quantity"
                  className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
                  value={formData.opening_stock}
                  onChange={(e) => handleChange('opening_stock', e.target.value)}
                />

                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-2 py-2 text-sm text-gray-700"
                >
                  <option value="">Unit</option>
                  {allUnits.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
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
