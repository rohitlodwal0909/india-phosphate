import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addCheckin, GetCheckinmodule } from 'src/features/Inventorymodule/guardmodule/GuardSlice';
import { allUnits } from 'src/utils/AllUnit';

interface GuardAddModalProps {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
}

interface FormData {
  user_id: string;
  guard_type: string;
  vehicle_number: string;
  product_name: string;
  product_id: string;
  quantity_net: string;
  sender_name: string;
  quantity_unit: string;
  inward_number: string;
  remark: string;
}

interface Errors {
  [key: string]: string;
}

const GuardAddmodal: React.FC<GuardAddModalProps> = ({ placeModal, modalPlacement, setPlaceModal }) => {
  const dispatch = useDispatch<any>();
  const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');

  const [formData, setFormData] = useState<FormData>({
    user_id: '',
    guard_type: '',
    vehicle_number: '',
    product_name: '',
    product_id: '',
    quantity_net: '',
    sender_name: '',
    quantity_unit: '',
    inward_number: '',
    remark: ''
  });

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setFormData((prev) => ({ ...prev, user_id: logindata?.admin?.id || '' }));
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === 'guard_type') {
      const resetFields = {
        vehicle_number: '',
        product_name: '',
        product_id: '',
        sender_name: '',
        remark: ''
      };
      setFormData((prev) => ({
        ...prev,
        guard_type: value,
        ...resetFields
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!formData.guard_type) {
      newErrors.guard_type = 'Guard Type is required';
    }

    switch (formData.guard_type.toLowerCase()) {
      case 'vehicle':
        if (!formData.vehicle_number) newErrors.vehicle_number = 'Vehicle number is required';
        if (!formData.quantity_net) newErrors.quantity_net = 'Net quantity is required';
        if (!formData.quantity_unit) newErrors.quantity_unit = 'Quantity unit is required';
        break;
      case 'material':
        if (!formData.product_name) newErrors.product_name = 'Product name is required';
        if (!formData.product_id) newErrors.product_id = 'Product ID is required';
        if (!formData.quantity_net) newErrors.quantity_net = 'Net quantity is required';
        if (!formData.quantity_unit) newErrors.quantity_unit = 'Quantity unit is required';
        if (!formData.sender_name) newErrors.sender_name = 'Sender name is required';
        break;
      case 'visitor':
        if (!formData.sender_name) newErrors.sender_name = 'Sender name is required';
        break;
      default:
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields based on type');
      return;
    }

    try {
      const result = await dispatch(addCheckin(formData)).unwrap();
      setPlaceModal(false);
      setFormData({
        user_id: logindata?.admin?.id || '',
        guard_type: '',
        vehicle_number: '',
        product_name: '',
        product_id: '',
        quantity_net: '',
        sender_name: '',
        quantity_unit: '',
        inward_number: '',
        remark: ''
      });
      dispatch(GetCheckinmodule(logindata?.admin?.id));
      toast.success(result?.message);
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  return (
    <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} className="large">
      <ModalHeader className="pb-0">New Entry</ModalHeader>
      <ModalBody className="overflow-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          {/* Select Guard Type */}
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="guard_type" value="Select Guard Type" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="guard_type"
              value={formData.guard_type}
              onChange={(e) => handleChange('guard_type', e.target.value)}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.guard_type ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Select</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Courier">Courier</option>
              <option value="Other">Other</option>
            </select>
            {errors.guard_type && <span className="text-red-500 text-xs">{errors.guard_type}</span>}
          </div>

          {/* Vehicle Fields */}
          {formData.guard_type === 'Vehicle' && (
            <div className="sm:col-span-6 col-span-12">
              <Label htmlFor="vehicle_number" value="Vehicle No." />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                id="vehicle_number"
                type="text"
                placeholder="Enter Vehicle No."
                value={formData.vehicle_number}
                onChange={(e) => handleChange('vehicle_number', e.target.value)}
                color={errors.vehicle_number ? 'failure' : 'gray'}
                style={{ borderRadius: '5px' }}
                helperText={errors.vehicle_number && <span className="text-red-500 text-xs">{errors.vehicle_number}</span>}
              />
            </div>
          )}

          {/* Courier Fields */}
          {formData.guard_type === 'Courier' && (
            <>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="sender_name" value="Sender Name" />
                <TextInput
                  id="sender_name"
                  type="text"
                  placeholder="Enter Sender Name"
                  value={formData.sender_name}
                  onChange={(e) => handleChange('sender_name', e.target.value)}
                  color={errors.sender_name ? 'failure' : 'gray'}
                  style={{ borderRadius: '5px' }}
                  helperText={errors.sender_name && <span className="text-red-500 text-xs">{errors.sender_name}</span>}
                />
              </div>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="product_name" value="Product Name" />
                <TextInput
                  id="product_name"
                  type="text"
                  placeholder="Enter Product Name"
                  value={formData.product_name}
                  onChange={(e) => handleChange('product_name', e.target.value)}
                  style={{ borderRadius: '5px' }}
                />
              </div>
              <div className="sm:col-span-6 col-span-12">
                <Label htmlFor="product_id" value="Product ID" />
                <TextInput
                  id="product_id"
                  type="text"
                  placeholder="Enter Product ID"
                  value={formData.product_id}
                  onChange={(e) => handleChange('product_id', e.target.value)}
                  style={{ borderRadius: '5px' }}
                />
              </div>
            </>
          )}

          {/* Quantity Field */}
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="quantity_net" value="Quantity (Net)" />
            <span className="text-red-700 ps-1">*</span>
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                id="quantity"
                name="quantity"
                placeholder="Enter quantity"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.quantity_net || ''}
                onChange={(e) => handleChange('quantity_net', e.target.value)}
              />
              <select
                id="quantity_unit"
                name="quantity_unit"
                value={formData.quantity_unit}
                onChange={(e) => handleChange('quantity_unit', e.target.value)}
                className="rounded-r-md border border-l-0 border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Unit</option>
                {allUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Other Fields */}
          {formData.guard_type === 'Other' && (
            <div className="sm:col-span-6 col-span-12">
              <Label htmlFor="remark" value="Remark" />
              <span className="text-red-700 ps-1">*</span>
              <textarea
                id="remark"
                placeholder="Enter your remarks here"
                value={formData.remark}
                onChange={(e) => handleChange('remark', e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
                  errors.remark ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows={4}
              />
              {errors.remark && <span className="text-red-500 text-xs">{errors.remark}</span>}
            </div>
          )}

          {/* Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-4">
            <Button type="reset" color="error" onClick={() => setPlaceModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default GuardAddmodal;
