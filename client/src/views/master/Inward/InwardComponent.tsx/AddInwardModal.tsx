import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,

} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addInward,
  GetInward,
} from 'src/features/master/Inward/InwardSlice';
import { allUnits } from 'src/utils/AllUnit';

// Sample vendor and UOM options (should be fetched from API ideally)



const AddInwardModal = ({ show, setShowmodal, logindata ,vendordata}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    vendor_id: '',
    item_id: '',
    quantity: '',
    uom: '',
    vehicle_number: '',
    remarks: '',
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['vendor_id', 'item_id', 'quantity', 'uom','vehicle_number'];
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
      const result = await dispatch(addInward(formData)).unwrap();
      toast.success(result.message || 'Inward created successfully');
      dispatch(GetInward());
      setFormData({
        vendor_id: '',
        item_id: '',
        quantity: '',
        uom: '',
        vehicle_number: '',
        remarks: '',
        created_by: logindata?.admin?.id,
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create New Inward</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {/* Vendor */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="vendor_id" value="Vendor" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="vendor_id"
              value={formData.vendor_id}
              onChange={(e) => handleChange('vendor_id', e.target.value)}
              color={errors.vendor_id ? 'failure' : 'gray'}
              className="w-full border border-gray-300 p-2 rounded-md"
            ><option value="">Select Vendor</option>
              {vendordata.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.supplier_name}
                </option>
              ))}
            </select>
            {errors.vendor_id && (
              <p className="text-red-500 text-xs">{errors.vendor_id}</p>
            )}
          </div>

          {/* Item ID */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="item_id" value="Item Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="item_id"
              type="text"
              value={formData.item_id}
              placeholder="Enter item Name"
              className='form-rounded-md'
              onChange={(e) => handleChange('item_id', e.target.value)}
              color={errors.item_id ? 'failure' : 'gray'}
            />
            {errors.item_id && <p className="text-red-500 text-xs">{errors.item_id}</p>}
          </div>

          {/* Quantity */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="quantity" value="Quantity" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="quantity"
              type="number"
              value={formData.quantity}
              placeholder="Enter quantity"
              className='form-rounded-md'
              onChange={(e) => handleChange('quantity', e.target.value)}
              color={errors.quantity ? 'failure' : 'gray'}
            />
            {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
          </div>

          {/* UOM */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="uom" value="Unit of Measurement (UOM)" />
            <span className="text-red-700 ps-1">*</span>
            <select
              id="uom"
              value={formData.uom}
              onChange={(e) => handleChange('uom', e.target.value)}
              color={errors.uom ? 'failure' : 'gray'}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Unit</option>
              {allUnits.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
            {errors.uom && <p className="text-red-500 text-xs">{errors.uom}</p>}
          </div>

          {/* Vehicle Number */}
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="vehicle_number" value="Vehicle Number" />
            <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="vehicle_number"
              type="text"
              value={formData.vehicle_number}
              placeholder="Enter vehicle number"
              className='form-rounded-md'
              onChange={(e) => handleChange('vehicle_number', e.target.value)}
            />
          </div>

          {/* Remarks */}
          <div className="col-span-12">
            <Label htmlFor="remarks" value="Remarks" />
            <Textarea
              id="remarks"
              placeholder="Enter any remarks"
              rows={2}
              value={formData.remarks}
              className='rounded-md'
              onChange={(e) => handleChange('remarks', e.target.value)}
            />
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

export default AddInwardModal;
