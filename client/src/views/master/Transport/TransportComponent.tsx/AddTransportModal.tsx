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
  addTransport,
  GetTransport,
} from 'src/features/master/Transport/TransportSlice';

const AddTransportModal = ({ show, setShowmodal, logindata, Statedata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    transporter_name: '',
    contact_person: '',
    contact_number: '',
    alternate_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst_number: '',
    pan_number: '',
    vehicle_types: '',
    preferred_routes: '',
    freight_rate_type: '',
    payment_terms: '',
    is_active: false,
    created_by: logindata?.admin?.id || '',
    date: '',
    time: '',
  });

  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleStateChange = (value: string) => {
    handleChange('state', value);
    const selected = Statedata.find((item: any) => item.id === parseInt(value));
    if (selected && selected.cities?.length > 0) {
      try {
        const parsedCities = JSON.parse(selected.cities[0]?.city_name || '[]');
        setCityOptions(parsedCities);
      } catch (error) {
        setCityOptions([]);
      }
    } else {
      setCityOptions([]);
    }
  };

  const validateForm = () => {
    const required = [
      'transporter_name',
      'contact_person',
      'contact_number',
      'address',
      'city',
      'state',
      'pincode',
      'freight_rate_type',
      'payment_terms',
    ];
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
        is_active: formData.is_active ? true : false,
      };

      const result = await dispatch(addTransport(payload)).unwrap();
      toast.success(result.message || 'Transport created successfully');
      dispatch(GetTransport());
      setFormData({
        transporter_name: '',
        contact_person: '',
        contact_number: '',
        alternate_number: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        gst_number: '',
        pan_number: '',
        vehicle_types: '',
        preferred_routes: '',
        freight_rate_type: '',
        payment_terms: '',
        is_active: false,
        created_by: logindata?.admin?.id || '',
        date: '',
        time: '',
      });
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create New Transport</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            { id: 'transporter_name', label: 'Transporter Name', type: 'text' },
            { id: 'contact_person', label: 'Contact Person', type: 'text' },
            { id: 'contact_number', label: 'Contact Number', type: 'text' },
            { id: 'alternate_number', label: 'Alternate Number', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'pincode', label: 'Pincode', type: 'text' },
            { id: 'gst_number', label: 'GST Number', type: 'text' },
            { id: 'pan_number', label: 'PAN Number', type: 'text' },
            { id: 'vehicle_types', label: 'Vehicle Types', type: 'text' },
            { id: 'preferred_routes', label: 'Preferred Routes', type: 'text' },
            { id: 'freight_rate_type', label: 'Freight Rate Type', type: 'text' },
            { id: 'payment_terms', label: 'Payment Terms', type: 'text' },
          ].map(({ id, label, type }) => (
            <div className="col-span-4" key={id}>
              <Label htmlFor={id} value={label} />
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={`Enter ${label}`}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* State Dropdown */}
          <div className="col-span-4">
            <Label htmlFor="state" value="State" />
            <select
              id="state"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <option value="">Select State</option>
              {(Statedata || []).map((state: any) => (
                <option key={state.id} value={state.state_name}>
                  {state.state_name}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
          </div>

          {/* City Dropdown */}
          <div className="col-span-4">
            <Label htmlFor="city" value="City" />
            <select
              id="city"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            >
              <option value="">Select City</option>
              {cityOptions.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </div>

          {/* Toggle is_active */}
          <div className="col-span-4">
            <Label htmlFor="is_active" value="Status" />
            <div className="flex items-center pt-3">
              <ToggleSwitch
                checked={formData.is_active}
                label={formData.is_active ? 'Active' : 'Inactive'}
                onChange={(checked) => handleChange('is_active', checked)}
              />
            </div>
          </div>

          {/* Address */}
          <div className="col-span-12">
            <Label htmlFor="address" value="Address" />
            <textarea
              id="address"
              value={formData.address}
              placeholder="Enter Address"
              onChange={(e) => handleChange('address', e.target.value)}
              className={`w-full border rounded-md text-sm p-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={2}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

           <div className="col-span-6">
            <Label htmlFor="time" value="Time" />
            <TextInput
              id="time"
              value={formData.time}
              placeholder="Enter time"
              type='time'
              onChange={(e) => handleChange('time', e.target.value)}
               className='form-rounded-md'
              
            />
            {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
          </div>
          <div className="col-span-6">
            <Label htmlFor="date" value="Date" />
            <TextInput
              id="date"
              value={formData.date}
              placeholder="Enter date"
              type='date'
              onChange={(e) => handleChange('date', e.target.value)}
            className='form-rounded-md'
             
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
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

export default AddTransportModal;
