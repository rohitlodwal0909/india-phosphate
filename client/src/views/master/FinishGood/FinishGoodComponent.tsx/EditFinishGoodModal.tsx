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
  updateFinishGood,
  GetFinishGood,
} from 'src/features/master/FinishGood/FinishGoodSlice';
import { allUnits } from 'src/utils/AllUnit';

const EditFinishGoodModal = ({ show, setShowmodal, FinishGoodData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    // product_code: '',
    product_name: '',
    product_description: '',
    batch_size: '',
    unit_of_measure: '',
    packing_details: '',
    hsn_code: '',
    gst_rate: '',
    shelf_life: '',
    storage_condition: '',
    mrp: '',
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (FinishGoodData) {
      setFormData({
        id: FinishGoodData?.id || '',
        // product_code: FinishGoodData?.product_code || '',
        product_name: FinishGoodData?.product_name || '',
        product_description: FinishGoodData?.product_description || '',
        batch_size: FinishGoodData?.batch_size || '',
        unit_of_measure: FinishGoodData?.unit_of_measure || '',
        packing_details: FinishGoodData?.packing_details || '',
        hsn_code: FinishGoodData?.hsn_code || '',
        gst_rate: FinishGoodData?.gst_rate || '',
        shelf_life: FinishGoodData?.shelf_life || '',
        storage_condition: FinishGoodData?.storage_condition || '',
        mrp: FinishGoodData?.mrp || '',
        created_by: logindata?.admin?.id,
      });
    }
  }, [FinishGoodData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = Object.keys(formData).filter(k => k !== 'product_description' && k !== 'created_by' && k !== 'id');
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
      const result = await dispatch(updateFinishGood(formData)).unwrap();
      toast.success(result.message || 'Finish good updated successfully');
      dispatch(GetFinishGood());
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to update Finish Good');
    }
  };

  const renderInput = (id: string, label: string, type = 'text', isTextarea = false) => (
    <div className="col-span-12 md:col-span-6">
      <Label htmlFor={id} value={label} />
      {id !== 'product_description' && <span className="text-red-700 ps-1">*</span>}
      {isTextarea ? (
        <Textarea
          id={id}
          rows={2}
          value={formData[id]}
          onChange={(e) => handleChange(id, e.target.value)}
          className="rounded-md"
        />
      ) : (
        <TextInput
          id={id}
          type={type}
          value={formData[id]}
          className='form-rounded-md'
          onChange={(e) => handleChange(id, e.target.value)}
        />
      )}
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );
const renderSelect = (id: string, label: string, options: any) => (
  <div className="col-span-12 md:col-span-6">
    <Label htmlFor={id} value={label} />
    <span className="text-red-700 ps-1">*</span>
    <select
      id={id}
      value={formData[id]}
      onChange={(e) => handleChange(id, e.target.value)}
      className="w-full mt-1 rounded-md border border-gray-300 dark:bg-gray-800 dark:text-white p-2"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option?.value} value={option?.value}>{option?.value}</option>
      ))}
    </select>
    {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
  </div>
);
  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Finish Good</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* {renderInput('product_code', 'Product Code')} */}
          {renderInput('product_name', 'Product Name')}
          {renderInput('batch_size', 'Batch Size')}
          {renderSelect('unit_of_measure', 'Unit of Measure', allUnits)}
          {renderInput('hsn_code', 'HSN Code')}
          {renderInput('gst_rate', 'GST Rate', 'number')}
          {renderInput('shelf_life', 'Shelf Life')}
          {renderInput('storage_condition', 'Storage Condition')}
          {renderInput('mrp', 'MRP (₹)', 'number')}
          {renderInput('packing_details', 'Packing Details' )}
          {renderInput('product_description', 'Product Description', 'text', true)}
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

export default EditFinishGoodModal;
