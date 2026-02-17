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
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addGrn, GetGrn } from 'src/features/master/Grn/GRNSlice';

const AddGrnModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    financial_year: '',
    grn_no: '',
  });

  const [errors, setErrors] = useState<any>({});

  // Generate Last 10 Financial Years
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
      const result = await dispatch(addGrn(formData)).unwrap();
      toast.success(result.message || 'GRN created successfully');
      dispatch(GetGrn());

      setFormData({
        financial_year: '',
        grn_no: '',
      });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New GRN</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Financial Year */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="financial_year" value="Financial Year" />
            <span className="text-red-700 ps-1">*</span>
            <Select
              id="financial_year"
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

          {/* GRN No */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="grn_no" value="GRN Number" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="grn_no"
              type="text"
              placeholder="Enter GRN Number"
              value={formData.grn_no}
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
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddGrnModal;
