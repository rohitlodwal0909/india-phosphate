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
  updateUnit,
  GetUnit,
} from 'src/features/master/Unit/UnitSlice';

const EditUnitModal = ({ show, setShowmodal, UnitData,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    user_id:logindata?.admin.id,
    unit: '',
  });
  console.log(UnitData)

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (UnitData) {
      setFormData({
        id: UnitData?.id || '',
        unit: UnitData?.unit || '',
        user_id:logindata?.admin.id,
      });
    }
  }, [UnitData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['unit'];
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
      const result = await dispatch(updateUnit(formData)).unwrap();
      toast.success(result.message || 'Unit updated successfully');
      dispatch(GetUnit());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update Unit');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Unit</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
       
            <div className={` col-span-12`}>
              <Label value="Unit" />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
               
                type="text"
                value={formData?.unit}
                placeholder="Enter Unit name"
                onChange={(e) => handleChange("unit", e.target.value)}
                color={errors?.unit ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors?.unit && <p className="text-red-500 text-xs"> {errors?.unit }</p>}
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

export default EditUnitModal;
