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
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addProcedurePerameter,
  GetProcedure,
} from 'src/features/master/ManufacturingProcedure/ManufacturingProcedureSlice';
import { Icon } from '@iconify/react';

const AddManufacturing = ({ show, setShowmodal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    perameters: [''],
  });

  const [errors, setErrors] = useState<any>({});

  // ✅ Load data safely for edit mode
  useEffect(() => {
    if (selectedRow?.id) {
      let parsed = [''];

      try {
        if (Array.isArray(selectedRow.perameters)) {
          parsed = selectedRow.perameters;
        } else if (selectedRow.perameters) {
          parsed = JSON.parse(selectedRow.perameters);
        }
      } catch (err) {
        parsed = [''];
      }

      setFormData({
        id: selectedRow.id,
        perameters: parsed.length ? parsed : [''],
      });
    }
  }, [selectedRow]);

  // ✅ Reset when modal closes
  useEffect(() => {
    if (!show) {
      setFormData({
        id: '',
        perameters: [''],
      });
      setErrors({});
    }
  }, [show]);

  const handleFieldChange = (index: number, value: string) => {
    const updated = [...formData.perameters];
    updated[index] = value;

    setFormData({ ...formData, perameters: updated });

    if (errors[`perameters_${index}`]) {
      const newErr = { ...errors };
      delete newErr[`perameters_${index}`];
      setErrors(newErr);
    }
  };

  const addFieldRow = () => {
    setFormData((prev) => ({
      ...prev,
      perameters: [...prev.perameters, ''],
    }));
  };

  const removeFieldRow = (index: number) => {
    if (formData.perameters.length === 1) return;

    const updated = formData.perameters.filter((_, i) => i !== index);
    setFormData({ ...formData, perameters: updated });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.id) newErrors.id = 'Procedure ID is required';

    formData.perameters.forEach((item, index) => {
      if (!item.trim()) {
        newErrors[`perameters_${index}`] = 'Perameter is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        id: formData.id,
        perameters: formData.perameters.map((p) => p.trim()),
      };

      await dispatch(addProcedurePerameter(payload)).unwrap();
      dispatch(GetProcedure());
      toast.success('Procedure saved successfully');

      setShowmodal(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create Procedure</ModalHeader>

      <ModalBody>
        {/* ✅ FORM WITH ID */}
        <form id="procedureForm" onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {formData.perameters.map((value, index) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-4 items-end">
              <div className="col-span-10">
                <Label htmlFor={`perameter-${index}`} value="Perameter" />
                <span className="text-red-700 ps-1">*</span>

                <TextInput
                  id={`perameter-${index}`}
                  type="text"
                  value={value}
                  placeholder="Enter Perameter"
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                />

                {errors[`perameters_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`perameters_${index}`]}</p>
                )}
              </div>

              <div className="col-span-1">
                <Button
                  type="button"
                  size="sm"
                  color="failure"
                  className="p-0"
                  onClick={() => removeFieldRow(index)}
                  disabled={formData.perameters.length === 1}
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </div>
            </div>
          ))}

          <div className="col-span-4 mt-2">
            <Button type="button" color="success" onClick={addFieldRow}>
              + Add More
            </Button>
          </div>
        </form>
      </ModalBody>

      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>

        {/* ✅ THIS FIXES SUBMIT ISSUE */}
        <Button type="submit" form="procedureForm" color="primary">
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddManufacturing;
