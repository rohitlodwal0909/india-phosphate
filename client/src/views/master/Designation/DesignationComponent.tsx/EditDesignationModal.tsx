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
  updateDesignation,
  GetDesignation,
} from 'src/features/master/Designation/DesignationSlice';

const EditDesignationModal = ({ show, setShowmodal, DesignationData ,logindata}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    status:'Inactive',
    designation_name: '',
    created_by :logindata?.admin?.id
  });


  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (DesignationData) {
      setFormData({
        id: DesignationData?.id || '',
        designation_name: DesignationData?.designation_name || '',
        status: DesignationData?.status || '',
        created_by: DesignationData?.created_by
      });
    }
  }, [DesignationData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['designation_name'];
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
      const result = await dispatch(updateDesignation(formData)).unwrap();
      toast.success(result.message || 'Designation updated successfully');
      dispatch(GetDesignation());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update Designation');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Designation</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
                 <div className="col-span-6">
                   <Label htmlFor="designation_name" value="Designation Name" />
                   <span className="text-red-700 ps-1">*</span>
                   <TextInput
                     id="designation_name"
                     type="text"
                     value={formData.designation_name}
                     placeholder="Enter Designation name"
                     onChange={(e) => handleChange('designation_name', e.target.value)}
                     color={errors.designation_name ? 'failure' : 'gray'}
                     className="form-rounded-md"
                   />
                   {errors.designation_name && (
                     <p className="text-red-500 text-xs">{errors.designation_name}</p>
                   )}
                 </div>
       
                 <div className="col-span-6 gap-2 ">
                   <Label htmlFor="status" value="Status" />
                  
                   <div className="flex gap-3 mt-3">
       
                   <ToggleSwitch
                     id="status"
                     checked={formData.status === 'Active'}
                     onChange={(checked) =>
                       handleChange('status', checked ? 'Active' : 'Inactive')
                     }
                   />
                   <span>{formData.status === 'Active' ? 'Active' : 'Inactive'}</span>
                   </div>
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

export default EditDesignationModal;
