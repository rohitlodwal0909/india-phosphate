import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  ToggleSwitch,
  Select,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { updateEquipment, GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';
import { allUnits } from 'src/utils/AllUnit';

const EditEquipmentModal = ({ show, setShowmodal, EquipmentData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
  const permission = logindata?.admin?.id;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    status: true,
    opening_stock: '',
    unit: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (EquipmentData) {
      setFormData({
        id: EquipmentData?.id || '',
        name: EquipmentData?.name || '',
        category: EquipmentData?.category || '',
        description: EquipmentData?.description || '',
        status: EquipmentData?.status ?? true,
        opening_stock: EquipmentData?.opening_stock || '',
        unit: EquipmentData?.unit || '',
      });
    }
  }, [EquipmentData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['name', 'category'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateEquipment(formData)).unwrap();
      toast.success(result.message || 'Equipment updated successfully');
      dispatch(GetEquipment());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update Equipment');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Equipment</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Name */}
          <div className="col-span-6">
            <Label htmlFor="name" value="Assets Name" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter assets name"
              color={errors.name ? 'failure' : 'gray'}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Category */}
          <div className="col-span-6">
            <Label htmlFor="category" value="Category" />
            <span className="text-red-700 ps-1">*</span>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              color={errors.category ? 'failure' : 'gray'}
            >
              <option value="">Select Category</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Production Equipment">Production Equipment</option>
              <option value="Electrical Parts">Electrical Parts</option>
              <option value="Mechanical Spare Parts">Mechanical Spare Parts</option>
              <option value="Instrumentation">Instrumentation</option>
              <option value="Utility Equipment">Utility Equipment</option>
              <option value="HVAC System">HVAC System</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Office Assets">Office Assets</option>
              <option value="Computer system Equipment">Computer system Equipment</option>
              <option value="Warehouse Equipment">Warehouse Equipment</option>
              <option value="Calibration Instruments">Calibration Instruments</option>
              <option value="Maintenance Tools">Maintenance Tools</option>
            </Select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="col-span-12">
            <Label htmlFor="description" value="Description" />
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter equipment description"
              className="w-full rounded-md border-gray-300"
            />
          </div>

          {/* Status Toggle */}
          <div className="col-span-6 mt-2">
            <Label htmlFor="status" value="Status" />
            <div className="mt-2">
              <ToggleSwitch
                id="status"
                checked={formData.status}
                onChange={(val) => handleChange('status', val)}
                label={formData.status ? 'Active' : 'Inactive'}
              />
            </div>
          </div>

          {permission === 5 && (
            <div className="col-span-12">
              <Label value="Quantity (Net)" />

              <div className="flex rounded-md shadow-sm mt-1">
                <input
                  type="text"
                  placeholder="Enter quantity"
                  className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
                  value={formData.opening_stock}
                  onChange={(e) => handleChange('opening_stock', e.target.value)}
                />

                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-2 py-2 text-sm text-gray-700"
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
          )}
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditEquipmentModal;
