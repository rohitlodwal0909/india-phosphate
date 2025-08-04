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
  
  GetDepartmentMaster,
  updateDepartmentMaster,
} from 'src/features/master/DepartmentMaster/DepartmentMasterSlice';

const EditDepartmentMasterModal = ({ show, setShowmodal, logindata ,DepartmentMasterData}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    id:'',
    department_code: '',
    department_name: '',
    description: '',
    hod: '',
    status: true,
    created_by: logindata?.admin?.id,
  });
  
  const [errors, setErrors] = useState<any>({});

   useEffect(() => {
    if (DepartmentMasterData) {
      setFormData({
        id: DepartmentMasterData?.id || '',
        department_code: DepartmentMasterData?.department_code || '',
        department_name: DepartmentMasterData?.department_name || '',
        description: DepartmentMasterData?.description || '',
        hod: DepartmentMasterData?.hod || '',
        status: DepartmentMasterData?.status ?? true,
        created_by: logindata?.admin?.id,
      });
    }
  }, [DepartmentMasterData]);
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['department_code', 'department_name'];
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
      const result = await dispatch(updateDepartmentMaster(formData)).unwrap();
      toast.success(result.message || 'Department created successfully');
      dispatch(GetDepartmentMaster());
      setFormData({
        id:'',
        department_code: '',
        department_name: '',
        description: '',
        hod: '',
        status: true,
        created_by: logindata?.admin?.id,
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Department</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            {
              id: 'department_code',
              label: 'Department Code',
              type: 'text',
              placeholder: 'Enter unique department code',
            },
            {
              id: 'department_name',
              label: 'Department Name',
              type: 'text',
              placeholder: 'Enter department name',
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
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Optional description"
              className="w-full border rounded-md p-2 border-gray-300"
              rows={2}
            />
          </div>

          <div className="col-span-6">
            <Label htmlFor="hod" value="Head of Department (HOD)" />
             <TextInput
                id="hod"
                type={'text'}
                value={formData.hod}
                placeholder={"Enter Hod "}
                onChange={(e) => handleChange('hod', e.target.value)}
                   className='form-rounded-md'
              />
           
          </div>

          <div className="col-span-6 ">
             <Label htmlFor="status" value="Status" />
            <div className="col-span-6 mt-3 flex items-center">
  <ToggleSwitch
    id="status"
    checked={formData.status}
    onChange={(value) => handleChange("status", value)}
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
        Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditDepartmentMasterModal;
