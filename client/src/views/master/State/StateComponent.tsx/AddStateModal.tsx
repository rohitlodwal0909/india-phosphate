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
  addState,
  GetState,
} from 'src/features/master/State/StateSlice';

const AddStateModal = ({ show, setShowmodal,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    state_name: '',
    code: '',
      created_by:logindata?.admin?.id
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['state_name'];
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
      const result = await dispatch(addState(formData)).unwrap();
      toast.success(result.message || 'State created successfully');
      dispatch(GetState());
      setFormData({
        state_name: '',
        code: '',
        created_by:logindata?.admin?.id
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err||"something is went wrong");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New State</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            {
              id: 'state_name',
              label: 'State Name',
              type: 'text',
              placeholder: 'Enter State name',
            },
            {
              id: 'code',
              label: 'State Code',
              type: 'text',
              placeholder: 'Enter Code',
            },
            
          ].map(({ id, label, type, placeholder }) => (
            <div className={`col-span-12`} key={id}>
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={placeholder}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className={`form-rounded-md `}
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}
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

export default AddStateModal;
