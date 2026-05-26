import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { AppDispatch } from 'src/store';
import { addGrade, GetGrade } from 'src/features/master/Grade/GradeSlice';

interface AddGradeModalProps {
  show: boolean;
  setShowmodal: (value: boolean) => void;
}

const AddGradeModal = ({ show, setShowmodal }: AddGradeModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    grade: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.grade.trim()) {
      newErrors.grade = 'Grade Name is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e?.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(addGrade(formData)).unwrap();

      toast.success(result?.message || 'Grade created successfully');

      dispatch(GetGrade());

      setFormData({
        grade: '',
      });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Grade</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Label htmlFor="grade" value="Grade Name" />
            <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="grade"
              type="text"
              value={formData.grade}
              placeholder="Enter Grade name"
              onChange={(e) => handleChange('grade', e.target.value)}
              color={errors.grade ? 'failure' : 'gray'}
              className="form-rounded-md"
            />

            {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
          </div>
        </form>
      </ModalBody>

      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddGradeModal;
