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
  updateHsnMaster,
  GetHsnMaster,
} from 'src/features/master/HsnMaster/HsnMasterSlice';

const EditHsnMasterModal = ({ show, setShowmodal, HsnMasterData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    // hsn_code: '',
    description: '',
    gst_rate: '',
   
    status: true,
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (HsnMasterData) {
      setFormData({
        id: HsnMasterData?.id || '',
        // hsn_code: HsnMasterData?.hsn_code || '',
        description: HsnMasterData?.description || '',
        gst_rate: HsnMasterData?.gst_rate || '',
       
        status: HsnMasterData?.status ?? true,
        created_by: logindata?.admin?.id,
      });
    }
  }, [HsnMasterData, logindata]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = [ 'gst_rate'];
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
      const result = await dispatch(updateHsnMaster(formData)).unwrap();
      toast.success(result.message || 'HSN Master updated successfully');
      dispatch(GetHsnMaster());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update HSN Master');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit HSN Master</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* HSN Code */}
          {/* <div className="col-span-6">
            <Label htmlFor="hsn_code" value="HSN Code" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="hsn_code"
              type="text"
              value={formData.hsn_code}
              placeholder="Enter HSN code"
              onChange={(e) => handleChange('hsn_code', e.target.value)}
              color={errors.hsn_code ? 'failure' : 'gray'}
              className="form-rounded-md"
            />
            {errors.hsn_code && (
              <p className="text-red-500 text-xs">{errors.hsn_code}</p>
            )}
          </div> */}

          {/* GST Fields */}
          {[
            { id: 'gst_rate', label: 'GST Rate ' },
        
          ].map(({ id, label }) => (
            <div className="col-span-6" key={id}>
              <Label htmlFor={id} value={label} />
     <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type="number"
                step="0.01"
                value={formData[id]}
                placeholder={`Enter ${label}`}
                   className="form-rounded-md"
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
              />
              {errors[id] && (
                <p className="text-red-500 text-xs">{errors[id]}</p>
              )}
            </div>
          ))}

          {/* Description */}
          <div className="col-span-12">
            <Label htmlFor="description" value="Description" />
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description"
              className={`w-full border rounded-md p-2 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={2}
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>

          {/* Status */}
          <div className="col-span-6 mt-2">
            <Label htmlFor="status" value="Status" />
            <div className="mt-2">
              <ToggleSwitch
                id="status"
                checked={formData.status}
                onChange={(value: boolean) => handleChange('status', value)}
                label={formData.status ? 'Active' : 'Inactive'}
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

export default EditHsnMasterModal;
