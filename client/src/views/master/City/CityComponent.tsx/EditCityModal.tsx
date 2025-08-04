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
import {
  updateCity,
  GetCity,
} from 'src/features/master/City/CitySlice';
import { Icon } from '@iconify/react/dist/iconify.js';

const EditCityModal = ({ show, setShowmodal, CityData }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    city_name: [''],
  });

  const [errors, setErrors] = useState<any>({});
useEffect(() => {
  if (CityData) {
    let parsedCities = [];

    if (Array.isArray(CityData?.city_name)) {
      parsedCities = CityData.city_name;
    } else if (typeof CityData?.city_name === 'string') {
      try {
        parsedCities = JSON.parse(CityData.city_name);
      } catch {
        parsedCities = [CityData.city_name];
      }
    }

    setFormData({
      id: CityData?.id || '',
      city_name: parsedCities,
    });
  }
}, [CityData]);

  const handleChange = (index: number, value: string) => {
    const updatedCityNames = [...formData.city_name];
    updatedCityNames[index] = value;
    setFormData((prev) => ({ ...prev, city_name: updatedCityNames }));
    setErrors((prev) => ({ ...prev, city_name: '' }));
  };

  const handleAddCity = () => {
    setFormData((prev) => ({
      ...prev,
      city_name: [...prev.city_name, ''],
    }));
  };

  const handleRemoveCity = (index: number) => {
    const updatedCityNames = formData.city_name.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, city_name: updatedCityNames }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.city_name.length || formData.city_name.some((name) => name.trim() === '')) {
      newErrors.city_name = 'At least one city name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateCity(formData)).unwrap();
      toast.success(result.message || 'City updated successfully');
      dispatch(GetCity());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update city');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit City</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {formData.city_name.map((name, index) => (
            <div className="col-span-12" key={index}>
              <Label value={`City ${index + 1}`} />
              <span className="text-red-700 ps-1">*</span>
              <div className="flex gap-2">
                <TextInput
                  type="text"
                  value={name}
                  placeholder="Enter city name"
                  onChange={(e) => handleChange(index, e.target.value)}
                  color={errors?.city_name ? 'failure' : 'gray'}
                  className="form-rounded-md w-full"
                />
               
                  {index === 0 ? (
                      <Button
                        type="button"
                       onClick={handleAddCity}
                        className="  p-0 bg-primary "
                        title="Add more"
                      >
                        <Icon icon="ic:baseline-plus" height={18} />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                              onClick={() => handleRemoveCity(index)}
                className="  p-0 bg-error "
                        title="Remove"
                      >
                        <Icon icon="ic:baseline-delete" height={18} />
                      </Button>
                    )}
              </div>
            </div>
          ))}
          <div className="col-span-12">
           
            {errors?.city_name && (
              <p className="text-red-500 text-xs mt-1">{errors?.city_name}</p>
            )}
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

export default EditCityModal;
