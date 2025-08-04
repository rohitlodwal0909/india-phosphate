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
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  updateMakeMaster,
  GetMakeMaster,
} from 'src/features/master/MakeMaster/MakeMasterSlice';

const EditMakeMasterModal = ({ show, setShowmodal, MakeMasterData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    make_code: '',
    make_name: '',
    description: '',
    status: true,
    created_by: logindata?.admin.id,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (MakeMasterData) {
      setFormData({
        id: MakeMasterData?.id || '',
        make_code: MakeMasterData?.make_code || '',
        make_name: MakeMasterData?.make_name || '',
        description: MakeMasterData?.description || '',
        status: MakeMasterData?.status ?? true,
        created_by: logindata?.admin.id,
      });
    }
  }, [MakeMasterData, logindata]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['make_code', 'make_name', 'description'];
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
      const result = await dispatch(updateMakeMaster(formData)).unwrap();
      toast.success(result.message || 'Make master updated successfully');
      dispatch(GetMakeMaster());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update MakeMaster');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit MakeMaster</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            {
              id: 'make_code',
              label: 'Make Code',
              type: 'text',
              placeholder: 'Enter Make Code',
            },
            {
              id: 'make_name',
              label: 'Make Name',
              type: 'text',
              placeholder: 'Enter Make Name',
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
                className='form-rounded-md'
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          <div className="col-span-12">
            <Label htmlFor="description" value="Description" />
            <span className="text-red-700 ps-1">*</span>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description"
              className={`w-full border rounded-md p-2 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          <div className="col-span-12 flex items-center gap-2 mt-2">
            <ToggleSwitch
              id="status"
              checked={formData.status}
              onChange={(value: boolean) => handleChange('status', value)}
              label={formData.status ? 'Active' : 'Inactive'}
            />
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

export default EditMakeMasterModal;
