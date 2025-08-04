import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  ToggleSwitch,
 
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addCompany,
  GetCompany,
} from 'src/features/master/Company/CompanySlice';

const AddCompanyModal = ({ show, setShowmodal, logindata ,Statedata}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    company_code: '', // Optional: can auto-generate or input
    company_name: '',
    address: '',
    city: '',
    state_id: '',
    country: 'India',
    pincode: '',
    email: '',
    phone: '',
    gst_number: '',
    cin_number: '',
    pan_number: '',
    created_by: logindata?.admin?.id || '',
    status: 'Inactive',
  });
  
const [cityOptions, setCityOptions] = useState<string[]>([]);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };
  // Handle state change
const handleStateChange = (value: string) => {
  
  handleChange("state_id", value); // update formData

  const selected = Statedata.find((item: any) => item.id === parseInt(value));
  if (selected && selected.cities?.length > 0) {
    try {
      const parsedCities = JSON.parse(selected.cities[0]?.city_name || "[]");
      setCityOptions(parsedCities);
    } catch (error) {
      setCityOptions([]);
    }
  } else {
    setCityOptions([]);
  }
};


  const validateForm = () => {
    const required = ['company_name', 'email', 'address', 'phone','company_code','city','state_id','country','pincode','gst_number','cin_number','pan_number','created_by','status'];
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
        const payload = {
      ...formData,
      status: formData.status === "Active" ? "Active" : "Inactive", // 👈 convert boolean to string
    };

      const result = await dispatch(addCompany(payload)).unwrap();
      toast.success(result.message || 'Company created successfully');
      dispatch(GetCompany());
      setFormData({
        company_code: '',
        company_name: '',
        address: '',
        city: '',
        state_id: '',
        country: 'India',
        pincode: '',
        email: '',
        phone: '',
        gst_number: '',
        cin_number: '',
        pan_number: '',
        created_by: logindata?.admin?.id,
        status: "Inactive",
      });
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create New Company</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
  { id: 'company_name', label: 'Company Name', type: 'text' },
  { id: 'company_code', label: 'Company Code', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'phone', label: 'Phone', type: 'text' },
  { id: 'country', label: 'Country', type: 'text' },
  { id: 'pincode', label: 'Pincode', type: 'text' },
  { id: 'state_id', label: 'State', type: 'text' },
  { id: 'city', label: 'City', type: 'text' },
  { id: 'gst_number', label: 'GST Number', type: 'text' },
  { id: 'cin_number', label: 'CIN Number', type: 'text' },
  { id: 'pan_number', label: 'PAN Number', type: 'text' },
].map(({ id, label, type }) => (
  <div className="col-span-6" key={id}>
    <Label htmlFor={id} value={label} />

    {id === 'state_id' ? (
      <select
        id="state_id"
        className="w-full border border-gray-300 p-2 rounded-md"
        value={formData.state_id}
        onChange={(e) => handleStateChange(e.target.value)}
      >
        <option value="">Select State</option>
          {(Statedata || []).map((state: any) => (
          <option key={state.id} value={state.id}>
            {state.state_name}
          </option>
        ))}
      </select>
    ) : id === 'city' ? (
      <select
        id="city"
        className="w-full border border-gray-300 p-2 rounded-md"
        value={formData.city}
        onChange={(e) => handleChange("city", e.target.value)}
      >
        <option value="">Select City</option>
         {cityOptions.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>
    ) : (
      <TextInput
        id={id}
        type={type}
        value={formData[id]}
        placeholder={`Enter ${label}`}
        onChange={(e) => handleChange(id, e.target.value)}
        color={errors[id] ? 'failure' : 'gray'}
        className="form-rounded-md"
      />
    )}

    {errors[id] && (
      <p className="text-red-500 text-xs">{errors[id]}</p>
    )}
  </div>
))}
 {/* Status Toggle */}
          <div className="col-span-6  gap-2 ">
            <Label htmlFor="status" value="Status" />
            <div className='flex items-center pt-3 '>
            <ToggleSwitch
              checked={formData.status === 'Active'}
              label={formData.status === 'Active' ? 'Active' : 'Inactive'}
              onChange={(checked) =>
                handleChange('status', checked ? 'Active' : 'Inactive')
              }
            />
            </div>
          </div>

          {/* Address */}
          <div className="col-span-12">
            <Label htmlFor="address" value="Address" />
            <textarea
              id="address"
              value={formData.address}
              placeholder='Enter Address'
              onChange={(e) => handleChange('address', e.target.value)}
              className={`w-full border rounded-md text-sm p-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={2}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color='primary' onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddCompanyModal;
