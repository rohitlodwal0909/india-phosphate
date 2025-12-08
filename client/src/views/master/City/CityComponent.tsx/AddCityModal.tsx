import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Select,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import { addCity, GetCity } from "src/features/master/City/CitySlice";
import { Icon } from "@iconify/react/dist/iconify.js";

const AddCityModal = ({ show, setShowmodal, selectRow, stateList, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    state_id: "",
    city_name: [""],
    pincode: [""],
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      state_id: selectRow?.id || "",
    }));
  }, [selectRow]);

  const handleChange = (index: number, key: string, value: string) => {
    const updatedItems = [...formData[key]];
    updatedItems[index] = value;

    setFormData((prev) => ({ ...prev, [key]: updatedItems }));

    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr[`${key}_${index}`];
      return newErr;
    });
  };

  const addMore = () => {
    setFormData((prev) => ({
      ...prev,
      city_name: [...prev.city_name, ""],
      pincode: [...prev.pincode, ""],
    }));
  };

  const removeField = (index: number) => {
    const updatedCities = [...formData.city_name];
    const updatedPincode = [...formData.pincode];

    updatedCities.splice(index, 1);
    updatedPincode.splice(index, 1);

    setFormData({
      ...formData,
      city_name: updatedCities,
      pincode: updatedPincode,
    });
  };

  const validateForm = () => {
    const newErrors: any = {};

    formData.city_name.forEach((city, i) => {
      if (!city.trim()) newErrors[`city_name_${i}`] = "City name is required";

      if (!formData.pincode[i]?.trim())
        newErrors[`pincode_${i}`] = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode[i]))
        newErrors[`pincode_${i}`] = "Enter valid 6-digit pincode";
    });

    if (!formData.state_id)
      newErrors["state_id"] = "State selection is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addCity(formData)).unwrap();
      toast.success(result.message || "Cities added successfully");

      dispatch(GetCity());

      setFormData({
        state_id: selectRow?.id || "",
        city_name: [""],
        pincode: [""],
        created_by: logindata?.admin?.id,
      });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Add City</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* State Dropdown */}
          <div className="col-span-12">
            <Label value="Select State" />
            <span className="text-red-600">*</span>

            <Select
              value={formData.state_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  state_id: e.target.value,
                }))
              }
              color={errors.state_id ? "failure" : "gray"}
            >
              <option value="">Select State</option>
              {stateList?.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.state_name}
                </option>
              ))}
            </Select>

            {errors.state_id && (
              <p className="text-red-500 text-xs">{errors.state_id}</p>
            )}
          </div>

          {/* Dynamic City + Pincode Fields */}
          {formData.city_name.map((city, index) => (
            <div
              className="col-span-12 grid grid-cols-12 gap-3 items-start"
              key={index}
            >
              {/* City */}
              <div className="col-span-5">
                <Label value={`City Name ${index + 1}`} />
                <span className="text-red-600">*</span>

                <TextInput
                  placeholder="Enter City"
                  value={formData.city_name[index]}
                  onChange={(e) =>
                    handleChange(index, "city_name", e.target.value)
                  }
                  color={errors[`city_name_${index}`] ? "failure" : "gray"}
                />
                {errors[`city_name_${index}`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`city_name_${index}`]}
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div className="col-span-5">
                <Label value={`Pincode ${index + 1}`} />
                <span className="text-red-600">*</span>

                <TextInput
                  placeholder="Enter Pincode"
                  value={formData.pincode[index]}
                  onChange={(e) =>
                    handleChange(index, "pincode", e.target.value)
                  }
                  color={errors[`pincode_${index}`] ? "failure" : "gray"}
                />
                {errors[`pincode_${index}`] && (
                  <p className="text-red-500 text-xs">
                    {errors[`pincode_${index}`]}
                  </p>
                )}
              </div>

              {/* Add / Remove Buttons */}
              <div className="col-span-2 flex gap-2 mt-7">
                {index === 0 ? (
                  <Button
                    type="button"
                    onClick={addMore}
                    className="bg-primary p-0"
                  >
                    <Icon icon="ic:baseline-plus" height={20} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => removeField(index)}
                    className="bg-error p-0"
                  >
                    <Icon icon="ic:baseline-delete" height={20} />
                  </Button>
                )}
              </div>
            </div>
          ))}
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

export default AddCityModal;
