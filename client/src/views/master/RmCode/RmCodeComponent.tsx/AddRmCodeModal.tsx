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
  addRmCode,
  GetRmCode,
} from 'src/features/master/RmCode/RmCodeSlice';

const AddRmCodeModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    user_id:logindata?.admin.id,
    name: '',
    rm_code: '',
  });

  const [errors, setErrors] = useState<any>({});

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
      const result = await dispatch(addRmCode(formData)).unwrap();
      toast.success(result.message || 'Rm code created successfully');
      dispatch(GetRmCode());
      setFormData({
          name: '',
         rm_code: '',
        user_id: logindata?.admin?.id,
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err||"something is went wrong");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New RmCode</ModalHeader>
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
            }
          ].map(({ id, label, type, placeholder }) => (
            <div className="col-span-6" key={id}>
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

export default AddRmCodeModal;
