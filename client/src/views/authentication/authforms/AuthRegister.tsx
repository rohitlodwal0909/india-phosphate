import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
interface FormDataType {
  name: string;
  email: string;
  password: string;
}
const AuthRegister = () => {
  const [formData, setFormData] = useState<FormDataType>({
  name: '',
  email: '',
  password: '',
});

const [errors, setErrors] = useState<Partial<FormDataType>>({});
const handleChange = (field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
  setErrors((prev) => ({ ...prev, [field]: '' }));
};


const handleSubmit = (e) => {
  e.preventDefault();
 const newErrors: Partial<FormDataType> = {};
  if (!formData.name) newErrors.name = 'Name is required';
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  setErrors(newErrors);
  if (Object.keys(newErrors).length === 0) {
    console.log('Form Submitted:', formData);
    // Perform your sign-up logic here
  }
};
  return (
    <>
    <form className="mt-6" onSubmit={handleSubmit}>
  {/* Name */}
  <div className="mb-4">
    <Label htmlFor="name" value="Name" />
    <TextInput
      id="name"
      type="text"
      value={formData.name}
      onChange={(e) => handleChange('name', e.target.value)}
      sizing="md"
      className="form-control"
      color={errors.name ? 'failure' : 'gray'}
      helperText={errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
    />
  </div>

  {/* Email */}
  <div className="mb-4">
    <Label htmlFor="emadd" value="Email Address" />
    <TextInput
      id="emadd"
      type="text"
      value={formData.email}
      onChange={(e) => handleChange('email', e.target.value)}
      sizing="md"
      className="form-control"
      color={errors.email ? 'failure' : 'gray'}
      helperText={errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
    />
  </div>

  {/* Password */}
  <div className="mb-6">
    <Label htmlFor="userpwd" value="Password" />
    <TextInput
      id="userpwd"
      type="password"
      value={formData.password}
      onChange={(e) => handleChange('password', e.target.value)}
      sizing="md"
      className="form-control"
      color={errors.password ? 'failure' : 'gray'}
      helperText={errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
    />
  </div>

  {/* Submit */}
  <Button type="submit" color="primary" className="w-full">
    Sign Up
  </Button>
</form>

    </>
  )
}

export default AuthRegister
