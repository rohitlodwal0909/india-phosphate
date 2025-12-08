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
import { updateCity, GetCity } from 'src/features/master/City/CitySlice';

const EditCityModal = ({ show, setShowmodal, CityData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: "",
    city_name: "",
    pincode: "",
    state_id: "",
    created_by: logindata?.admin?.id
  });


  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (CityData) {
      setFormData({
        id: CityData?.id || "",
        city_name: CityData?.city_name || "",
        pincode: CityData?.pincode || "",
        state_id: CityData?.state_id || "",
        created_by: logindata?.admin?.id
      });
    }
  }, [CityData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.city_name.trim()) newErrors.city_name = "City name is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Invalid pincode (must be 6 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateCity(formData)).unwrap();
      toast.success(result.message || "City updated successfully");
      dispatch(GetCity());
      setShowmodal(false);
    } catch (error) {
      toast.error("Failed to update city");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="lg">
      <ModalHeader>Edit City</ModalHeader>
      <ModalBody>
        <form className="grid grid-cols-12 gap-4" onSubmit={handleSubmit}>
          
          {/* City Name */}
          <div className="col-span-12">
            <Label value="City Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              name="city_name"
              value={formData.city_name}
              placeholder="Enter City Name"
              onChange={handleChange}
              color={errors.city_name ? "failure" : "gray"}
            />
            {errors.city_name && (
              <p className="text-red-500 text-xs">{errors.city_name}</p>
            )}
          </div>

          {/* Pincode */}
          <div className="col-span-12">
            <Label value="Pincode" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              name="pincode"
              value={formData.pincode}
              placeholder="Enter Pincode"
              onChange={handleChange}
              color={errors.pincode ? "failure" : "gray"}
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs">{errors.pincode}</p>
            )}
          </div>

        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditCityModal;
