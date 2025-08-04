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
  updateInward,
  GetInward,
} from 'src/features/master/Inward/InwardSlice';

const EditInwardModal = ({ show, setShowmodal, InwardData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
   
    inward_number: '',
  });
  console.log(InwardData)

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (InwardData) {
      setFormData({
        id: InwardData?.id || '',
        inward_number: InwardData?.inward_number || '',
      });
    }
  }, [InwardData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['inward_number'];
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
      const result = await dispatch(updateInward(formData)).unwrap();
      toast.success(result.message || 'Inward updated successfully');
      dispatch(GetInward());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update Inward');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Inward</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
       
            <div className={` col-span-12`}>
              <Label value="Inward" />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
               
                type="text"
                value={formData?.inward_number}
                placeholder="Enter Inward number"
                onChange={(e) => handleChange("inward_number", e.target.value)}
                color={errors?.inward_number ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors?.inward_number && <p className="text-red-500 text-xs"> {errors?.inward_number }</p>}
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

export default EditInwardModal;
