import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import { Changepassword, forgotpassword} from "../../../features/authentication/AuthenticationSlice";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
const AuthForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null); // ← API se jo user aaye wo yahan store hoga
   const [formData, setFormData] = useState<any>({
       user_id:userData?.id,
        new_password: "",
        confirm_password: "",
    });
    useEffect(()=>{
    setFormData((prev) => ({ ...prev, user_id: userData?.id }));
    },[userData])

    const [errors, setErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);
     const navigate = useNavigate()
        const handleInputChange = (e: any) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: "" }));
        };
    
        const validateForm = (): boolean => {
            const newErrors: any = {};
            if (!formData.new_password) {
                newErrors.new_password = "New password is required";
            } else if (formData.new_password.length < 6) {
                newErrors.new_password = "Password must be at least 6 characters";
            }
    
            if (!formData.confirm_password) {
                newErrors.confirm_password = "Please confirm your password";
            } else if (formData.new_password !== formData.confirm_password) {
                newErrors.confirm_password = "Passwords do not match";
            }
    
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };
    
        const handlepasswordSubmit = async (e:any) => {
            e.preventDefault();
    
            if (validateForm()) {
                try {
                    const res = await dispatch(Changepassword(formData)).unwrap();
                    toast.success(res.message || "Password changed successfully");
                    localStorage.removeItem("logincheck");
                    navigate("/admin/login")
                    setFormData({ new_password: "", confirm_password: "" });
                } catch (error: any) {
                    toast.error(error?.message || "Something went wrong");
                }
            }
        };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(forgotpassword(email)).unwrap();
      setUserData(res.user);
      setEmail("") // Set user data in state
    } catch (error) {
      toast.error(error.message );
    }
  };

  return (
    <>
     { !userData ? <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email Address" />
          </div>
          <TextInput
            id="email"
            type="email"
            sizing="md"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit" color="primary" className="w-full rounded-md">
          Forgot Password
        </Button>
      </form> :   
            <form onSubmit={handlepasswordSubmit}>
                                      {/* New Password */}
                                      <div className="my-4">
                                          <Label htmlFor="new_password" className="text-gray-600 " value="New Password" />
                                          <div className="relative">
                                              <TextInput
                                                  id="new_password"
                                                  name="new_password"
                                                  type={showPassword ? "text" : "password"}
                                                  value={formData.new_password}
                                                  onChange={handleInputChange}
                                                  color={errors.new_password ? "failure" : "gray"}
                                                  className="form-rounded-md bg-transparent"
                                              />
                                              <div
                                                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
                                                  onClick={() => setShowPassword(!showPassword)}
                                              >
                                                  {showPassword ? <IconEye size={20} />  : <IconEyeOff size={20} />}
                                              </div>
                                          </div>
                                          {errors.new_password && (
                                              <div className="text-red-500 text-xs mt-1">{errors.new_password}</div>
                                          )}
                                      </div>
      
                                      {/* Confirm Password */}
                                      <div className="mb-4">
                                          <Label htmlFor="confirm_password" className="text-gray-600 " value="Confirm Password" />
                                          <TextInput
                                              id="confirm_password"
                                              name="confirm_password"
                                              type="password"
                                              value={formData.confirm_password}
                                              onChange={handleInputChange}
                                              color={errors.confirm_password ? "failure" : "gray"}
                                              className="form-rounded-md bg-transparent"
                                              
                                          />
                                          {errors.confirm_password && (
                                              <div className="text-red-500 text-xs mt-1">{errors.confirm_password}</div>
                                          )}
                                      </div>
      
                                      {/* Submit Button */}
                                      <Button color="primary" type="submit" className="w-full mt-4 rounded-md">
                                          Change Password
                                      </Button>
                                  </form>}

  
      
    </>
  );
};

export default AuthForgotPassword;
