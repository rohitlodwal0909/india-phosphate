import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  updateBmrMaster,
  GetBmrMaster,
} from 'src/features/master/BmrMaster/BmrMasterSlice';

const EditBmrMasterModal = ({ show, setShowmodal, BmrMasterData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    bmr_code: '',
    product_name: '',
    batch_number: '',
    manufacturing_date: '',
    expiry_date: '',
    equipment_used: '',
    raw_materials: '',
    process_steps: '',
    packaging_details: '',
    qa_qc_signoff: '',
    remarks: '',
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (BmrMasterData) {
      setFormData({
        id: BmrMasterData?.id || '',
        bmr_code: BmrMasterData?.bmr_code || '',
        product_name: BmrMasterData?.product_name || '',
        batch_number: BmrMasterData?.batch_number || '',
        manufacturing_date: BmrMasterData?.manufacturing_date || '',
        expiry_date: BmrMasterData?.expiry_date || '',
        equipment_used: BmrMasterData?.equipment_used || '',
        raw_materials: BmrMasterData?.raw_materials || '',
        process_steps: BmrMasterData?.process_steps || '',
        packaging_details: BmrMasterData?.packaging_details || '',
        qa_qc_signoff: BmrMasterData?.qa_qc_signoff || '',
        remarks: BmrMasterData?.remarks || '',
        created_by: logindata?.admin?.id,
      });
    }
  }, [BmrMasterData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['bmr_code', 'product_name', 'batch_number', 'manufacturing_date', 'expiry_date'];
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
      const result = await dispatch(updateBmrMaster(formData)).unwrap();
      toast.success(result.message || 'BMR  updated successfully');
      dispatch(GetBmrMaster());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || err || 'Failed to update BMR Master');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Edit BMR Master</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            { id: 'bmr_code', label: 'BMR Code' },
            { id: 'product_name', label: 'Product Name' },
            { id: 'batch_number', label: 'Batch Number' },
            { id: 'manufacturing_date', label: 'Manufacturing Date', type: 'date' },
            { id: 'expiry_date', label: 'Expiry Date', type: 'date' },
            { id: 'equipment_used', label: 'Equipment Used' },
            { id: 'raw_materials', label: 'Raw Materials' },
            { id: 'process_steps', label: 'Process Steps' },
            { id: 'packaging_details', label: 'Packaging Details' },
            { id: 'qa_qc_signoff', label: 'QA/QC Signoff' },
          ].map(({ id, label, type }) => (
            <div key={id} className="col-span-12 md:col-span-6">
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">
                {['bmr_code', 'product_name', 'batch_number', 'manufacturing_date', 'expiry_date'].includes(id) ? '*' : ''}
              </span>
              <TextInput
                id={id}
                type={type || 'text'}
                value={formData[id]}
                placeholder={`Enter ${label.toLowerCase()}`}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* Remarks */}
          <div className="col-span-12">
            <Label htmlFor="remarks" value="Remarks" />
            <Textarea
              id="remarks"
              placeholder="Enter any remarks"
              rows={2}
              value={formData.remarks}
              className="rounded-md"
              onChange={(e) => handleChange('remarks', e.target.value)}
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

export default EditBmrMasterModal;
