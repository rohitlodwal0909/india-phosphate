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
import { addFormula, GetFormula } from 'src/features/master/Formula/FormulaSlice';
import { allUnits } from 'src/utils/AllUnit';

const AddFormulaModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    formula_name: '',
    product_type: '',
    ingredients: '',
    quantity_per_batch_or_unit: '',
    uom: '',
    batch_size: '',
    manufacturing_instructions: '',
    remarks: '',
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const requiredFields = ['formula_name', 'product_type', 'ingredients', 'quantity_per_batch_or_unit', 'uom', 'batch_size'];
    const newErrors: any = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addFormula(formData)).unwrap();
      toast.success(result.message || 'Formula created successfully');
      dispatch(GetFormula());
      setFormData({
        formula_name: '',
        product_type: '',
        ingredients: '',
        quantity_per_batch_or_unit: '',
        uom: '',
        batch_size: '',
        manufacturing_instructions: '',
        remarks: '',
        created_by: logindata?.admin?.id,
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  const renderInput = (id: string, label: string, type = 'text') => (
    <div className="col-span-12 md:col-span-6">
      <Label htmlFor={id} value={label} />
      <span className="text-red-700 ps-1">*</span>
      <TextInput
        id={id}
        type={type}
        value={formData[id]}
        placeholder={`Enter ${label}`}
        className="rounded-md"
        onChange={(e) => handleChange(id, e.target.value)}
      />
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );

  const renderTextarea = (id: string, label: string) => (
    <div className="col-span-12 md:col-span-6">
      <Label htmlFor={id} value={label} />
      <Textarea
        id={id}
        rows={3}
        value={formData[id]}
        placeholder={`Enter ${label}`}
        onChange={(e) => handleChange(id, e.target.value)}
        className="rounded-md"
      />
    </div>
  );

  const renderSelect = (id: string, label: string, options: any[]) => (
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
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Create Formula</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {renderInput('formula_name', 'Formula Name')}
          {renderInput('product_type', 'Product Type')}
          {renderInput('ingredients', 'Ingredients')}
          {renderInput('quantity_per_batch_or_unit', 'Quantity Per Batch / Unit', 'number')}
          {renderSelect('uom', 'Unit of Measure', allUnits)}
          {renderInput('batch_size', 'Batch Size', 'number')}
          {renderTextarea('manufacturing_instructions', 'Manufacturing Instructions')}
          {renderTextarea('remarks', 'Remarks / Notes')}
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

export default AddFormulaModal;
