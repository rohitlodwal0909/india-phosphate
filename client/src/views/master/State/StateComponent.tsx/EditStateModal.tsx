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
  updateState,
  GetState,
} from 'src/features/master/State/StateSlice';

const EditStateModal = ({ show, setShowmodal, StateData ,logindata}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    state_name: '',
    code: '',
    created_by:logindata?.admin?.id
  });


  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (StateData) {
      setFormData({
        id: StateData?.id || '',
        state_name: StateData?.state_name || '',
        code: StateData?.code || '',
          created_by:logindata?.admin?.id
      });
    }
  }, [StateData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['state_name','code'];
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
      const result = await dispatch(updateState(formData)).unwrap();
      toast.success(result.message || 'State updated successfully');
      dispatch(GetState());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update State');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit State</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
       
            <div className={` col-span-12`}>
              <Label value="State" />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
               
                type="text"
                value={formData?.state_name}
                placeholder="Enter State name"
                onChange={(e) => handleChange("state_name", e.target.value)}
                color={errors?.state_name ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors?.state_name && <p className="text-red-500 text-xs"> {errors?.state_name }</p>}
            </div>

            <div className={` col-span-12`}>
              <Label value="State Code" />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
               
                type="text"
                value={formData?.code}
                placeholder="Enter Code"
                onChange={(e) => handleChange("code", e.target.value)}
                color={errors?.code ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors?.code && <p className="text-red-500 text-xs"> {errors?.code }</p>}
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

export default EditStateModal;
