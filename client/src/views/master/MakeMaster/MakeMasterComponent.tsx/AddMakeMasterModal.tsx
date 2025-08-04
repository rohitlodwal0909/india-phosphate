import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  
  ToggleSwitch,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addMakeMaster,
  GetMakeMaster,
} from 'src/features/master/MakeMaster/MakeMasterSlice';

const AddMakeMasterModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    make_code: '',
    make_name: '',
    description: '',
    status: true,
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['make_code', 'make_name'];
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
      const result = await dispatch(addMakeMaster(formData)).unwrap();
      toast.success(result.message || 'Make Master created successfully');
      dispatch(GetMakeMaster());
      setFormData({
        make_code: '',
        make_name: '',
        description: '',
        status: true,
        created_by: logindata?.admin?.id,
      });
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message ||  err ||'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Make Master</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            {
              id: 'make_code',
              label: 'Make Code',
              type: 'text',
              placeholder: 'Enter make code',
            },
            {
              id: 'make_name',
              label: 'Make Name',
              type: 'text',
              placeholder: 'Enter make name',
            },
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
                className="form-rounded-md"
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* Description */}
          <div className="col-span-12">
            <Label htmlFor="description" value="Description" />
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full border rounded-md p-2 border-gray-300"
              rows={2}
            />
          </div>

          {/* Status Toggle */}
          <div className="col-span-6 ">
                <Label htmlFor="status" value="Status" />
                     <div className="col-span-6 mt-6 flex items-center">
           <ToggleSwitch
             id="status"
             checked={formData.status}
             onChange={(value:any) => handleChange("status", value)}
             label={formData.status ? "Active" : "Inactive"}
           />
           </div>
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

export default AddMakeMasterModal;
