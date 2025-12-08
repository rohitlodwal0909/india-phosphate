import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addStaffMaster,
  GetStaffMaster,
} from 'src/features/master/StaffMaster/StaffMasterSlice';

const AddStaffMasterModal = ({
  show,
  setShowmodal,
  Qualificationdata,
  Designationdata,
  DepartmentData, // NEW PROP
  logindata
}) => {

  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    joining_date: '',
    designation_id: '',
    qualification_id: '',
    department: '',             // NEW
    kyc_details: '',            // NEW
    created_by: logindata?.admin?.id,
    status: 'Active',
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = [
      'full_name',
      'email',
      'mobile_number',
      'date_of_birth',
      'gender',
      'joining_date',
      'department',     // NEW required
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

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    if (profilePhoto) submissionData.append('profile_photo', profilePhoto);

    try {
      const result = await dispatch(addStaffMaster(submissionData)).unwrap();
      toast.success(result.message || 'Staff created successfully');
      dispatch(GetStaffMaster());

      setFormData({
        full_name: '',
        email: '',
        mobile_number: '',
        date_of_birth: '',
        gender: '',
        address: '',
        joining_date: '',
        designation_id: '',
        qualification_id: '',
        department: '',
        kyc_details: '',
        status: 'Active',
        created_by: logindata?.admin?.id,
      });

      setProfilePhoto(null);
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create New Staff</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {/* Basic Inputs */}
          {[
            { id: 'full_name', label: 'Full Name', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'mobile_number', label: 'Mobile Number', type: 'text' },
            { id: 'date_of_birth', label: 'Date of Birth', type: 'date' },
            { id: 'joining_date', label: 'Joined Date', type: 'date' }, // renamed
          ].map(({ id, label, type }) => (
            <div className="col-span-4" key={id}>
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={`Enter ${label}`}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className="form-rounded-md"
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* Gender */}
          <div className="col-span-4">
            <Label htmlFor="gender" value="Gender" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="gender"
              value={formData.gender}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
          </div>

          {/* Designation */}
          <div className="col-span-4">
            <Label htmlFor="designation_id" value="Designation" />
            <select
              id="designation_id"
              value={formData.designation_id}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) => handleChange('designation_id', e.target.value)}
            >
              <option value="">Select Designation</option>
              {Designationdata &&
                Designationdata.map((items) => (
                  <option key={items.id} value={items.id}>
                    {items.designation_name}
                  </option>
                ))}
            </select>
            {errors.designation_id && <p className="text-red-500 text-xs">{errors.designation_id}</p>}
          </div>

          {/* Qualification */}
          <div className="col-span-4">
            <Label htmlFor="qualification_id" value="Qualification" />
            <select
              id="qualification_id"
              value={formData.qualification_id}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) => handleChange('qualification_id', e.target.value)}
            >
              <option value="">Select Qualification</option>
              {Qualificationdata &&
                Qualificationdata.map((items) => (
                  <option key={items.id} value={items.id}>
                    {items.qualification_name}
                  </option>
                ))}
            </select>
            {errors.qualification_id && (
              <p className="text-red-500 text-xs">{errors.qualification_id}</p>
            )}
          </div>

          {/* Department - NEW */}
          <div className="col-span-4">
            <Label htmlFor="department" value="Department" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="department"
              value={formData.department}
              className="rounded-md w-full border border-gray-300"
              onChange={(e) => handleChange('department', e.target.value)}
            >
              <option value="">Select Department</option>
              {DepartmentData &&
                DepartmentData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.department_name}
                  </option>
                ))}
            </select>
            {errors.department && <p className="text-red-500 text-xs">{errors.department}</p>}
          </div>

          {/* Address */}
          <div className="col-span-12">
            <Label htmlFor="address" value="Address" />
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter address"
              className="w-full border rounded-md p-2 border-gray-300"
              rows={2}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

          {/* KYC Details - NEW */}
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
            <Label htmlFor="profile_photo" value="Profile Photo (optional)" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              className="rounded-md w-full mt-2 border border-gray-200"
            />
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

export default AddStaffMasterModal;
