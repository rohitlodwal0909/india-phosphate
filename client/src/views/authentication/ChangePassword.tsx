import { Button, Label, TextInput } from "flowbite-react";
import { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "src/store";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Changepassword } from "src/features/authentication/AuthenticationSlice";
import { useNavigate } from "react-router";
import bgimages from '../../assets/images/backgrounds/welcome-bg2.png'
interface PasswordFormData {
    new_password: string;
    confirm_password: string;
}

interface PasswordErrors {
    new_password?: string;
    confirm_password?: string;
}

const ChangePassword = () => {
    const [formData, setFormData] = useState<PasswordFormData>({
        new_password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState<PasswordErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = (): boolean => {
        const newErrors: PasswordErrors = {};
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    return (

        <div data-testid="flowbite-card" className="flex rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-darkgray p-6 relative w-full break-words flex-col card bg-primary-gt  pe-0  dark:shadow-dark-md shadow-md !border-none" style={{
  borderRadius: "12px",
  background: "linear-gradient(135deg, rgba(104, 59, 228, 0.7), rgba(163, 209, 224, 0.7))", // sky blue gradient
  backdropFilter: "blur(10px)", // blur effect
  WebkitBackdropFilter: "blur(10px)", // Safari support
  padding: "20px",
  color: "#fff"
}}>
            <div className="flex h-full flex-col justify-center gap-2 p-0">
                <div className="grid grid-cols-12 gap-[30px]">
                    <div className="md:col-span-6 col-span-6 flex justify-start">
                        <img alt="banner" className="" src={bgimages} />
                    </div>
                    <div className="md:col-span-6 col-span-6">
                        <div className=" max-w-xl p-8 ">
                            {/* Title & Subtitle */}
                            <div className="mb-6 ">
                                <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
                                <p className="text-gray-600 text-sm mt-2">
                                    To change your password, please confirm below
                                </p>
                            </div>
                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* New Password */}
                                <div className="mb-4">
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
                            </form>
                        </div>
                    </div>

                </div>
            </div></div>

    );

};

export default ChangePassword;
