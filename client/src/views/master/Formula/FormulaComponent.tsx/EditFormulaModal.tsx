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
  updateFormula,
  GetFormula,
} from 'src/features/master/Formula/FormulaSlice';
import { allUnits } from 'src/utils/AllUnit';

const EditFormulaModal = ({ show, setShowmodal, FormulaData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
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

  useEffect(() => {
    if (FormulaData) {
      setFormData({
        id: FormulaData?.id || '',
        formula_name: FormulaData?.formula_name || '',
        product_type: FormulaData?.product_type || '',
        ingredients: FormulaData?.ingredients || '',
        quantity_per_batch_or_unit: FormulaData?.quantity_per_batch_or_unit || '',
        uom: FormulaData?.uom || '',
        batch_size: FormulaData?.batch_size || '',
        manufacturing_instructions: FormulaData?.manufacturing_instructions || '',
        remarks: FormulaData?.remarks || '',
        created_by: logindata?.admin?.id,
      });
    }
  }, [FormulaData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['formula_name', 'product_type', 'ingredients', 'quantity_per_batch_or_unit', 'uom', 'batch_size'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace(/_/g, ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const result = await dispatch(updateFormula(formData)).unwrap();
      toast.success(result.message || 'Formula updated successfully');
      dispatch(GetFormula());
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to update formula');
    }
  };

  const renderInput = (id: string, label: string, type = 'text', isTextarea = false) => (
    <div className="col-span-12 md:col-span-6">
      <Label htmlFor={id} value={label} />
      {['remarks', 'manufacturing_instructions'].includes(id) ? null : <span className="text-red-700 ps-1">*</span>}
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
          onChange={(e) => handleChange(id, e.target.value)}
          className="form-rounded-md"
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
      <ModalHeader>Edit Formula</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {renderInput('formula_name', 'Formula Name')}
          {renderInput('product_type', 'Product Type')}
          {renderInput('ingredients', 'Ingredients')}
          {renderInput('quantity_per_batch_or_unit', 'Quantity per batch/unit')}
          {renderSelect('uom', 'Unit of Measure', allUnits)}
          {renderInput('batch_size', 'Batch Size')}
          {renderInput('manufacturing_instructions', 'Manufacturing Instructions', 'text', true)}
          {renderInput('remarks', 'Remarks', 'text', true)}
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

export default EditFormulaModal;
