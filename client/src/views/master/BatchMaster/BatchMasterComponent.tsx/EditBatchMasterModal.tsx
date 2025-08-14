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
  updateBatchMaster,
  GetBatchMaster,
} from 'src/features/master/BatchMaster/BatchMasterSlice';

const EditBatchMasterModal = ({ show, setShowmodal, logindata, BatchMasterData ,rmcodedata,batchnumber}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    bmr_number: '',
    batch_number: '',
    product_name: '',
    production_date: '',
    expiry_date: '',
    quantity_produced: '',
    raw_materials_used: '',
    process_details: '',
    verified_by: '',
    approved_by: '',
    status: 'Draft',
    created_by: logindata?.admin?.id || '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  useEffect(() => {
    if (BatchMasterData) {
      setFormData({
        id: BatchMasterData.id || '',
        bmr_number: BatchMasterData.bmr_number || '',
        batch_number: BatchMasterData.batch_number || '',
        product_name: BatchMasterData.product_name || '',
        production_date: BatchMasterData.production_date?.slice(0, 10) || '',
        expiry_date: BatchMasterData.expiry_date?.slice(0, 10) || '',
        quantity_produced: BatchMasterData.quantity_produced || '',
        raw_materials_used: BatchMasterData.raw_materials_used || '',
        process_details: BatchMasterData.process_details || '',
        verified_by: BatchMasterData.verified_by || '',
        approved_by: BatchMasterData.approved_by || '',
        status: BatchMasterData.status || 'Draft',
        created_by: logindata?.admin?.id || '',
      });
    }
  }, [BatchMasterData, logindata]);

  const validateForm = () => {
    const requiredFields = [
      'bmr_number',
      'batch_number',
      'product_name',
      'production_date',
      'expiry_date',
      'quantity_produced',
      'status',
    ];
    const newErrors: any = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateBatchMaster(formData)).unwrap();
      toast.success(result.message || 'BatchMaster updated successfully');
      dispatch(GetBatchMaster());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Batch Master</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {[
            { id: 'bmr_number', label: 'BMR Number' },
            { id: 'batch_number', label: 'Batch Number' },
            { id: 'product_name', label: 'Product Name' },
            { id: 'production_date', label: 'Production Date', type: 'date' },
            { id: 'expiry_date', label: 'Expiry Date', type: 'date' },
            { id: 'quantity_produced', label: 'Quantity Produced', type: 'number' },
            { id: 'verified_by', label: 'Verified By' },
            { id: 'approved_by', label: 'Approved By' },
          ].map(({ id, label, type = 'text' }) => (
            <div className="col-span-4" key={id}>
              <Label htmlFor={id} value={label} />
                <span className="text-red-700 ps-1">*</span>
               { id=== "batch_number" ? <select
              id="batch_number"
              value={formData.batch_number}
            
              onChange={(e) => handleChange('batch_number', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Batch Number</option>
              {(batchnumber?.data ||[]).map((type) => (
                <option key={type?.qc_batch_number} value={type?.qc_batch_number}>{type?.qc_batch_number}</option>
              ))}
            </select> :(

              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                onChange={(e) => handleChange(id, e.target.value)}
                placeholder={`Enter ${label}`}
                color={errors[id] ? 'failure' : 'gray'}
                className='form-rounded-md'
              />)}
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* Raw Materials Used */}
          <div className="col-span-4">
            <Label htmlFor="raw_materials_used" value="Raw Materials Used" />
              <span className="text-red-700 ps-1">*</span>
            <select
              id="raw_materials_used"
              value={formData.raw_materials_used}
            
              onChange={(e) => handleChange('raw_materials_used', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Raw Material Code</option>
              {(rmcodedata ||[]).map((type) => (
                <option key={type?.rm_code} value={type?.rm_code}>{type?.rm_code}</option>
              ))}
            </select>
          </div>
 <div className="col-span-6">
            <Label htmlFor="status" value="Status" />
            <select
              id="status"
              
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            > <option value="">Select Status</option>
              {['Draft', 'Final', 'Cancelled'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
          </div>
          {/* Process Details */}
          <div className="col-span-6">
            <Label htmlFor="process_details" value="Process Details (optional)" />
            <Textarea
              id="process_details"
              value={formData.process_details}
              onChange={(e) => handleChange('process_details', e.target.value)}
              rows={2}
              className='rounded-md'
              placeholder="Enter process details or remarks"
            />
          </div>

          {/* Status */}
         
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

export default EditBatchMasterModal;
