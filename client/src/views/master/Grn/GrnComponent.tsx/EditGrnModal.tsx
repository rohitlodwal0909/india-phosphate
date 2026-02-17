import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Select,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { GetGrn, updateGrn } from 'src/features/master/Grn/GRNSlice';

const EditGrnModal = ({ show, setShowmodal, data }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    financial_year: '',
    grn_no: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (data) {
      setFormData({
        id: data?.id || '',
        financial_year: data?.financial_year || '',
        grn_no: data?.grn_no || '',
      });
    }
  }, [data]);

  // Financial Year 2020–2035
  const generateFinancialYears = () => {
    const years = [];
    for (let year = 2020; year <= 2035; year++) {
      const nextYearShort = (year + 1).toString().slice(-2);
      years.push(`${year}-${nextYearShort}`);
    }
    return years;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.financial_year) newErrors.financial_year = 'Financial year is required';

    if (!formData.grn_no) newErrors.grn_no = 'GRN number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateGrn(formData)).unwrap();
      toast.success(result.message || 'GRN updated successfully');
      dispatch(GetGrn());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update GRN');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit GRN</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Financial Year */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Financial Year" />
            <span className="text-red-700 ps-1">*</span>
            <Select
              value={formData.financial_year}
              onChange={(e) => handleChange('financial_year', e.target.value)}
              color={errors.financial_year ? 'failure' : 'gray'}
            >
              <option value="">Select Financial Year</option>
              {generateFinancialYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            {errors.financial_year && (
              <p className="text-red-500 text-xs">{errors.financial_year}</p>
            )}
          </div>

          {/* GRN Number */}
          <div className="col-span-12 md:col-span-6">
            <Label value="GRN Number" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              type="text"
              value={formData.grn_no}
              placeholder="Enter GRN Number"
              onChange={(e) => handleChange('grn_no', e.target.value)}
              color={errors.grn_no ? 'failure' : 'gray'}
            />
            {errors.grn_no && <p className="text-red-500 text-xs">{errors.grn_no}</p>}
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

export default EditGrnModal;
