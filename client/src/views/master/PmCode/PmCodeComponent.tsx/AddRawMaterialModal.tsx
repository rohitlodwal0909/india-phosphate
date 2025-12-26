import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addpmrawmaterial } from 'src/features/master/PmCode/PmCodeSlice';
import { GetrawMaterial } from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';

const AddRawMaterialModal = ({ show, setShowmodal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    pm_id: '',
    fields: [
      { type: '', test: '', limit: '' },
    ],
  });

  const [errors, setErrors] = useState<any>({});


  useEffect(() => {
    if (selectedRow?.id) {
      setFormData((prev) => ({ ...prev, pm_id: selectedRow.id }));
    }
  }, [selectedRow]);

  const handleFieldChange = (index: number, field: string, value: string) => {
    const updatedFields = [...formData.fields];
    updatedFields[index][field] = value;
    setFormData({ ...formData, fields: updatedFields });

    if (errors[`fields_${index}_${field}`]) {
      setErrors((prevErrors) => {
        const updated = { ...prevErrors };
        delete updated[`fields_${index}_${field}`];
        return updated;
      });
    }
  };

  const addFieldRow = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { type: '', test: '', limit: '' }],
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.pm_id) newErrors.pm_id = 'PM Code is required';

    formData.fields.forEach((field, index) => {
      if (!field.type) newErrors[`fields_${index}_type`] = 'Type is required';
      if (!field.test) newErrors[`fields_${index}_test`] = 'Test is required';
      if (!field.limit) newErrors[`fields_${index}_limit`] = 'Limit is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('swc');
    if (!validateForm()) return;

    try {
    
        const payload = {
          pm_id: formData.pm_id,
          fields: formData?.fields
        };
        await dispatch(addpmrawmaterial(payload)).unwrap();
    

      toast.success('Raw material(s) created successfully');
      dispatch(GetrawMaterial(formData.pm_id));
      setFormData({
         pm_id: formData.pm_id,
        fields: [{ type: '', test: '', limit: '' }],
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create New Raw Material {formData.pm_id}</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* RM Code - ReadOnly */}
          
          {formData.fields.map((field, index) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-4 items-end">
              {/* Type */}
              <div className="col-span-4">
                <Label htmlFor={`type-${index}`} value="Type" />
                <span className="text-red-700 ps-1">*</span>
                <select
                  id={`type-${index}`}
                  value={field.type}
                  onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="1">Raw Material</option>
                  <option value="2">Physical Properties</option>
                </select>
                {errors[`fields_${index}_type`] && (
                  <p className="text-red-500 text-xs">{errors[`fields_${index}_type`]}</p>
                )}
              </div>

              {/* Test */}
              <div className="col-span-4">
                <Label htmlFor={`test-${index}`} value="Test" />
                <span className="text-red-700 ps-1">*</span>
                <TextInput
                  id={`test-${index}`}
                  type="text"
                  value={field.test}
                      placeholder='Enter Test Name '
                  onChange={(e) => handleFieldChange(index, 'test', e.target.value)}
                  className='form-rounded-md'
                />
                {errors[`fields_${index}_test`] && (
                  <p className="text-red-500 text-xs">{errors[`fields_${index}_test`]}</p>
                )}
              </div>

              {/* Limit */}
              <div className="col-span-4">
                <Label htmlFor={`limit-${index}`} value="Limit" />
                <span className="text-red-700 ps-1">*</span>
                <TextInput
                  id={`limit-${index}`}
                  type="text"
                  value={field.limit}
                  placeholder='Enter Limit '
                  onChange={(e) => handleFieldChange(index, 'limit', e.target.value)}
                   className='form-rounded-md'
                />
                {errors[`fields_${index}_limit`] && (
                  <p className="text-red-500 text-xs">{errors[`fields_${index}_limit`]}</p>
                )}
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <div className="col-span-12 mt-2">
            <Button type="button" onClick={addFieldRow}>
              + Add More
            </Button>
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

export default AddRawMaterialModal;
