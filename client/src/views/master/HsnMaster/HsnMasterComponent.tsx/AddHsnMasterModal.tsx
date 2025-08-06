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
  addHsnMaster,
  GetHsnMaster,
} from 'src/features/master/HsnMaster/HsnMasterSlice';

const AddHsnMasterModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    hsn_code: '',
    description: '',
    gst_rate: '',
    cgst_rate: '',
    sgst_rate: '',
    igst_rate: '',
    status: true,
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['hsn_code', 'gst_rate'];
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
      const result = await dispatch(addHsnMaster(formData)).unwrap();
      toast.success(result.message || 'HSN Master added successfully');
      dispatch(GetHsnMaster());
      setFormData({
        hsn_code: '',
        description: '',
        gst_rate: '',
        cgst_rate: '',
        sgst_rate: '',
        igst_rate: '',
        status: true,
        created_by: logindata?.admin?.id,
      });
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Add HSN Master</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* HSN Code */}
          <div className="col-span-6">
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
          </div>

          {/* GST Rates */}
          {[
            { id: 'gst_rate', label: 'GST Rate ' },
            { id: 'cgst_rate', label: 'CGST Rate ' },
            { id: 'sgst_rate', label: 'SGST Rate ' },
            { id: 'igst_rate', label: 'IGST Rate ' },
          ].map(({ id, label }) => (
            <div className="col-span-6" key={id}>
              <Label htmlFor={id} value={label} />
              {id === 'gst_rate' && <span className="text-red-700 ps-1">*</span>}
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
              className="w-full border rounded-md p-2 border-gray-300"
              rows={2}
            />
          </div>

          {/* Status Toggle */}
          <div className="col-span-6">
            <Label htmlFor="status" value="Status" />
            <div className="col-span-6 mt-6 flex items-center">
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
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddHsnMasterModal;
