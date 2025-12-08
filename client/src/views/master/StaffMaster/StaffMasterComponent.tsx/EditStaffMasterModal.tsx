import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { toast } from "react-toastify";
import {
  updateStaffMaster,
  GetStaffMaster,
} from "src/features/master/StaffMaster/StaffMasterSlice";
import { ImageUrl } from "src/constants/contant";

const EditStaffMasterModal = ({
  show,
  setShowmodal,
  StaffMasterData,
  Qualificationdata,
  Designationdata,
  DepartmentData,
  logindata,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    mobile_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    joining_date: "",
    department: "",
    designation_id: "",
    qualification_id: "",
    kyc_details: "",
    status: "",
    created_by: logindata?.admin?.id,
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (StaffMasterData) {
      setFormData({
        id: StaffMasterData?.id || "",
        full_name: StaffMasterData?.full_name || "",
        email: StaffMasterData?.email || "",
        mobile_number: StaffMasterData?.mobile_number || "",
        date_of_birth: StaffMasterData?.date_of_birth || "",
        gender: StaffMasterData?.gender || "",
        address: StaffMasterData?.address || "",
        joining_date: StaffMasterData?.joining_date || "",
        department: StaffMasterData?.department || "",
        designation_id: StaffMasterData?.designation_id || "",
        qualification_id: StaffMasterData?.qualification_id || "",
        kyc_details: StaffMasterData?.kyc_details || "",
        status: StaffMasterData?.status || "",
        created_by: logindata?.admin?.id,
      });
    }
  }, [StaffMasterData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const required = [
      "full_name",
      "email",
      "mobile_number",
      "date_of_birth",
      "gender",
      "joining_date",
    ];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field])
        newErrors[field] = `${field.replace("_", " ")} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    if (profilePhoto) {
      submissionData.append("profile_photo", profilePhoto);
    } else {
      submissionData.append(
        "profile_photo",
        StaffMasterData?.profile_photo || ""
      );
    }

    try {
      const id = StaffMasterData?.id;
      const result = await dispatch(
        updateStaffMaster({ id, data: submissionData })
      ).unwrap();

      toast.success(result.message || "Staff updated successfully");
      dispatch(GetStaffMaster());

      setFormData({
        id: "",
        full_name: "",
        email: "",
        mobile_number: "",
        date_of_birth: "",
        gender: "",
        address: "",
        joining_date: "",
        department: "",
        designation_id: "",
        qualification_id: "",
        kyc_details: "",
        status: "Active",
        created_by: logindata?.admin?.id,
      });

      setProfilePhoto(null);
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Staff</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            { id: "full_name", label: "Full Name", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "mobile_number", label: "Mobile Number", type: "text" },
            { id: "date_of_birth", label: "Date of Birth", type: "date" },
            { id: "joining_date", label: "Joined Date", type: "date" },
          ].map(({ id, label, type }) => (
            <div className="col-span-4" key={id}>
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? "failure" : "gray"}
              />
              {errors[id] && (
                <p className="text-red-500 text-xs">{errors[id]}</p>
              )}
            </div>
          ))}

          {/* Gender */}
          <div className="col-span-4">
            <Label value="Gender" />
            <span className="text-red-700 ps-1">*</span>
            <select
              value={formData.gender}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs">{errors.gender}</p>
            )}
          </div>

          {/* Department */}
         

          {/* Designation */}
          <div className="col-span-4">
            <Label value="Designation" />
            <select
              value={formData.designation_id}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) => handleChange("designation_id", e.target.value)}
            >
              <option value="">Select Designation</option>
              {Designationdata?.map((items) => (
                <option key={items?.id} value={items?.id}>
                  {items?.designation_name}
                </option>
              ))}
            </select>
          </div>

          {/* Qualification */}
          <div className="col-span-4">
            <Label value="Qualification" />
            <select
              value={formData.qualification_id}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) =>
                handleChange("qualification_id", e.target.value)
              }
            >
              <option value="">Select Qualification</option>
              {Qualificationdata?.map((items) => (
                <option key={items?.id} value={items?.id}>
                  {items?.qualification_name}
                </option>
              ))}
            </select>
          </div>

           <div className="col-span-4">
            <Label value="Department" />
            <select
              value={formData.department}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) => handleChange("department", e.target.value)}
            >
              <option value="">Select Department</option>
              {DepartmentData?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department_name}
                </option>
              ))}
            </select>
          </div>

         

          {/* Address */}
          <div className="col-span-12">
            <Label value="Address" />
            <textarea
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border rounded-md p-2"
              rows={2}
            />
          </div>

           {/* KYC Details */}
          <div className="col-span-12">
             <Label htmlFor="kyc_details" value="KYC Details" />
            <textarea
              id="kyc_details"
              value={formData.kyc_details}
              onChange={(e) => handleChange('kyc_details', e.target.value)}
              placeholder="Enter KYC details"
              className="w-full border rounded-md p-2 border-gray-300"
              rows={3}
            />
          </div>

          {/* Profile Photo */}
          <div className="col-span-12">
            <Label value="Profile Photo" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              className="rounded-md w-full border mt-2"
            />

            {/* Preview */}
            {StaffMasterData?.profile_photo && (
              <img
                src={ImageUrl + StaffMasterData?.profile_photo}
                className="w-16 h-16 mt-2 rounded border"
              />
            )}
          </div>
        </form>
      </ModalBody>

      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditStaffMasterModal;
