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
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addFinishGood,
  GetFinishGood,
} from 'src/features/master/FinishGood/FinishGoodSlice';
import { allUnits } from 'src/utils/AllUnit';

const AddFinishGoodModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = Object.keys(formData).filter(k => k !== 'product_description' && k !== 'created_by');
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
      const result = await dispatch(addFinishGood(formData)).unwrap();
      toast.success(result.message || 'Finish good created successfully');
      dispatch(GetFinishGood());
      setFormData({
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
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
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
            placeholder={`Enter ${label}`}
          onChange={(e) => handleChange(id, e.target.value)}
          className="rounded-md"
        />
      ) : (
        <TextInput
          id={id}
          type={type}
          value={formData[id]}
          placeholder={`Enter ${label}`}
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
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Create Finish Good</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* {renderInput('product_code', 'Product Code')} */}
          {renderInput('product_name', 'Product Name')}
          {renderInput('batch_size', 'Batch Size')}
      {renderSelect('unit_of_measure', 'Unit of Measure', allUnits)}
          {renderInput('packing_details', 'Packing Details')}
          {renderInput('hsn_code', 'HSN Code')}
          {renderInput('gst_rate', 'GST Rate ', 'number')}
          {renderInput('shelf_life', 'Shelf Life')}
          {renderInput('storage_condition', 'Storage Condition')}
          {renderInput('mrp', 'MRP (₹)', 'number')}
          {renderInput('product_description', 'Product Description', 'text', true)}
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

export default AddFinishGoodModal;
