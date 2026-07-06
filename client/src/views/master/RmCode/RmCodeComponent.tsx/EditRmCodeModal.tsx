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
import { updateRmCode, GetRmCode } from 'src/features/master/RmCode/RmCodeSlice';
import { allUnits } from 'src/utils/AllUnit';

const EditRmCodeModal = ({ show, setShowmodal, RmCodeData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const permission = logindata?.admin?.id || null;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    rm_code: '',
    opening_stock: '',
    unit: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (RmCodeData) {
      setFormData({
        id: RmCodeData?.id || '',
        name: RmCodeData?.name || '',
        rm_code: RmCodeData?.rm_code || '',
        opening_stock: RmCodeData?.opening_stock || '',
        unit: RmCodeData?.unit || '',
      });
    }
  }, [RmCodeData]);

  const handleChange = (field, value) => {
    const newValue = field === 'rm_code' ? value.toUpperCase() : value;

    setFormData((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));

    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const required = ['name', 'rm_code'];
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
      const result = await dispatch(updateRmCode(formData)).unwrap();
      toast.success(result.message || 'Rm code updated successfully');
      dispatch(GetRmCode());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update RmCode');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Rm Code</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            {
              id: 'name',
              label: ' Name',
              type: 'text',
              placeholder: 'Enter  name',
            },
            {
              id: 'rm_code',
              label: 'RM Code',
              type: 'text',
              placeholder: 'Enter Rm Code name',
            },
          ].map(({ id, label, type, placeholder }) => (
            <div className={`col-span-6`} key={id}>
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={placeholder}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className="form-rounded-md"
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}
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
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditRmCodeModal;
