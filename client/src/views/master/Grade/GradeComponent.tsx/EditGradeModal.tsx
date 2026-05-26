import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateGrade, GetGrade } from 'src/features/master/Grade/GradeSlice';

const EditGradeModal = ({ show, setShowmodal, GradeData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    grade: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (GradeData) {
      setFormData({
        id: GradeData?.id || '',
        grade: GradeData?.grade || '',
      });
    }
  }, [GradeData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['grade'];
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
      const result = await dispatch(updateGrade(formData)).unwrap();
      toast.success(result.message || 'Grade updated successfully');
      dispatch(GetGrade());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update Grade');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Grade</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className={` col-span-12`}>
            <Label value="Grade" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              type="text"
              value={formData?.grade}
              placeholder="Enter Grade name"
              onChange={(e) => handleChange('grade', e.target.value)}
              color={errors?.grade ? 'failure' : 'gray'}
              className="form-rounded-md"
            />
            {errors?.grade && <p className="text-red-500 text-xs"> {errors?.grade}</p>}
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

export default EditGradeModal;
