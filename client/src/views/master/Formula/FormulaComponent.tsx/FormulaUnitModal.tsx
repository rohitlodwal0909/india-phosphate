import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  createSpecification,
  getSpecificationById,
} from 'src/features/master/Formula/FormulaSlice';

const FormulaUnitModal = ({ show, setShowmodal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: any) => state.formula);

  const [formData, setFormData] = useState({
    formula_id: '',
    fields: [{ test: '', specification: '' }],
  });

  const [errors, setErrors] = useState<any>({});

  /* ===========================
     FETCH DATA
  ============================ */
  useEffect(() => {
    if (selectedRow?.id && show) {
      dispatch(getSpecificationById(selectedRow.id));
    }
  }, [selectedRow, show]);

  /* ===========================
     SET FORM FROM SELECTOR
  ============================ */
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setFormData({
        formula_id: selectedRow.id,
        fields: data.map((item: any) => ({
          test: item.test,
          specification: item.specification,
        })),
      });
    } else {
      setFormData({
        formula_id: selectedRow?.id || '',
        fields: [{ test: '', specification: '' }],
      });
    }
  }, [data]);

  /* ===========================
     FIELD CHANGE
  ============================ */
  const handleFieldChange = (index: number, field: string, value: string) => {
    const updatedFields = [...formData.fields];
    updatedFields[index][field] = value;
    setFormData({ ...formData, fields: updatedFields });
  };

  const addFieldRow = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { test: '', specification: '' }],
    }));
  };

  const removeFieldRow = (index: number) => {
    if (formData.fields.length === 1) return;
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData({ ...formData, fields: updatedFields });
  };

  /* ===========================
     VALIDATION
  ============================ */
  const validateForm = () => {
    const newErrors: any = {};

    formData.fields.forEach((field, index) => {
      if (!field.test) newErrors[`fields_${index}_test`] = 'Test is required';
      if (!field.specification)
        newErrors[`fields_${index}_specification`] = 'Specification is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===========================
     SINGLE SUBMIT (UPSERT)
  ============================ */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        formula_id: formData.formula_id,
        fields: formData.fields,
      };

      // SAME API handles create + update
      await dispatch(createSpecification(payload)).unwrap();

      toast.success('Specification saved successfully');
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>
        {data?.length > 0 ? 'Update' : 'Create'} {selectedRow?.product_type} Specification
      </ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {formData.fields.map((field, index) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
                <Label value="Tests" />
                <TextInput
                  type="text"
                  value={field.test}
                  onChange={(e) => handleFieldChange(index, 'test', e.target.value)}
                />
              </div>

              <div className="col-span-5">
                <Label value="Specification" />
                <TextInput
                  type="text"
                  value={field.specification}
                  onChange={(e) => handleFieldChange(index, 'specification', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                {index === 0 ? (
                  <Button type="button" color="success" onClick={addFieldRow} className="w-full">
                    +
                  </Button>
                ) : (
                  <Button
                    type="button"
                    color="failure"
                    onClick={() => removeFieldRow(index)}
                    className="w-full"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          ))}
        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          {data?.length > 0 ? 'Update' : 'Submit'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FormulaUnitModal;
