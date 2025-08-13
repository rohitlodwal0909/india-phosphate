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
import { addCity, GetCity } from 'src/features/master/City/CitySlice';
import { Icon } from '@iconify/react/dist/iconify.js';
// import { Plus } from 'lucide-react';

const AddCityModal = ({ show, setShowmodal, selectRow ,logindata}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    city_name: [''],
    state_id: '',
    created_by:logindata?.admin?.id
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setFormData((prev) => ({ ...prev, state_id: selectRow?.id || '' }));
  }, [selectRow]);

  const handleChange = (index: number, value: string) => {
    const updatedCities = [...formData.city_name];
    updatedCities[index] = value;
    setFormData((prev) => ({ ...prev, city_name: updatedCities }));

    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[`city_name_${index}`];
      return newErr;
    });
  };

  const handleAddCityInput = () => {
    setFormData((prev) => ({
      ...prev,
      city_name: [...prev.city_name, ''],
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    formData.city_name.forEach((name, index) => {
      if (!name?.trim()) {
        newErrors[`city_name_${index}`] = 'City name is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleRemoveCityInput = (index) => {
  const updatedCities = [...formData.city_name];
  updatedCities.splice(index, 1);
  setFormData({ ...formData, city_name: updatedCities });
};
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addCity(formData)).unwrap();
      toast.success(result.message || 'Cities added successfully');
      dispatch(GetCity());
      setFormData({
        city_name: [''],
        state_id: selectRow?.id || '',
        created_by:logindata?.admin?.id
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create City</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
      {formData.city_name.map((city, index) => (
  <div className="col-span-12 flex items-start gap-2" key={index}>
    <div className="w-full">
      <Label htmlFor={`city_name_${index}`} value={`City Name ${index + 1}`} />
      <span className="text-red-700 ps-1">*</span>
      <TextInput
        id={`city_name_${index}`}
        type="text"
        value={city}
        placeholder="Enter City Name"
        onChange={(e) => handleChange(index, e.target.value)}
        color={errors[`city_name_${index}`] ? 'failure' : 'gray'}
      />
      {errors[`city_name_${index}`] && (
        <p className="text-red-500 text-xs">
          {errors[`city_name_${index}`]}
        </p>
      )}
    </div>

    {index === 0 ? (
      <Button
        type="button"
        onClick={handleAddCityInput}
        className="mt-7  p-0 bg-primary "
        title="Add more"
      >
        <Icon icon="ic:baseline-plus" height={18} />
      </Button>
    ) : (
      <Button
        type="button"
        onClick={() => handleRemoveCityInput(index)}
className="mt-7  p-0 bg-error "
        title="Remove"
      >
        <Icon icon="ic:baseline-delete" height={18} />
      </Button>
    )}
  </div>
))}
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

export default AddCityModal;
