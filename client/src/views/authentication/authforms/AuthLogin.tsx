import { Button, Label, TextInput } from 'flowbite-react';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Authenticationmodule,
  GetAuthenticationmodule,
} from 'src/features/authentication/AuthenticationSlice';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { AppDispatch } from 'src/store'; // make sure AppDispatch is defined
import { GetNotification } from 'src/features/Notifications/NotificationSlice';

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginErrors {
  username?: string;
  password?: string;
}

const AuthLogin = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const result = await dispatch(Authenticationmodule(formData)).unwrap();
        toast.success(result?.message || 'Login successful');

        localStorage.setItem('token', result?.token);
        localStorage.setItem('logincheck', JSON.stringify(result));
        const localdata = JSON.parse(localStorage.getItem('logincheck') || '{}');

        if (localdata) {
          dispatch(GetAuthenticationmodule(localdata?.admin?.id));
          dispatch(GetNotification(localdata?.admin?.id));
          navigate('/');
        }
      } catch (error: any) {
        const errorMsg = error?.message;
        if (errorMsg === 'Invalid Username') {
          toast.error('Invalid Username');
        } else if (errorMsg === 'Invalid Password') {
          toast.error('Invalid Password');
        } else {
          toast.error(errorMsg || 'Server Error. Please try again later.');
        }
      }
    }
  };

  return (
    <>
      <form className="mt-6" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-4">
          <Label htmlFor="username" value="Username" />
          <TextInput
            id="username"
            type="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            sizing="md"
            color={errors.username ? 'failure' : 'gray'}
            className="form-control"
            helperText={
              errors.username && <span className="text-red-500 text-xs">{errors.username}</span>
            }
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label htmlFor="userpwd" value="Password" />
          <div className="relative">
            <TextInput
              id="userpwd"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              sizing="md"
              color={errors.password ? 'failure' : 'gray'}
              className="form-control"
            />

            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IconEye size={20} /> : <IconEyeOff size={20} />}
            </div>
          </div>
          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
        </div>

        {/* Remember & Forgot */}
        <div className="flex justify-between my-5">
          <div className="flex items-center gap-2">
            {/* <Checkbox id="accept" className="checkbox" />
            <Label htmlFor="accept" className="opacity-90 font-normal cursor-pointer">
              Remember this Device
            </Label> */}
          </div>
          <Link to="/admin/forgot-password" className="text-primary text-sm font-medium">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button color="primary" type="submit" className="w-full rounded-md">
          Sign in
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
