import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  updatePackingMaterial,
  GetPackingMaterial,
} from 'src/features/master/PackingMaterial/PackingMaterialSlice';

const materialTypeOptions = ['Primary', 'Secondary'];

const EditPackingMaterialModal = ({
  show,
  setShowmodal,
  logindata,
  PackingMaterialData,
  supplierData,
  unitOptions,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    material_name: '',
    material_code: '',
    material_type: '',
    supplier_id: '',
    unit_of_measurement: '',
    purchase_rate: '',
    current_stock:'',
    stock_quantity: '',
    min_required_stock: '',
    hsn_code: '',
    created_by: logindata?.admin?.id || '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (PackingMaterialData) {
      setFormData({
        id: PackingMaterialData.pm_id || '',
        material_name: PackingMaterialData.material_name || '',
        material_code: PackingMaterialData.material_code || '',
        material_type: PackingMaterialData.material_type || '',
        supplier_id: PackingMaterialData.supplier_id?.toString() || '',
        unit_of_measurement: PackingMaterialData.unit_of_measurement?.toString() || '',
        purchase_rate: PackingMaterialData.purchase_rate || '',
        current_stock: PackingMaterialData.current_stock || '',
        stock_quantity: PackingMaterialData.stock_quantity || '',
        min_required_stock: PackingMaterialData.min_required_stock || '',
        hsn_code: PackingMaterialData.hsn_code || '',
        created_by: logindata?.admin?.id || '',
      });
    }
  }, [PackingMaterialData, logindata]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = [
      'material_name',
      'material_code',
      'material_type',
      'supplier_id',
      'unit_of_measurement',
      'purchase_rate',
      'current_stock',
      'stock_quantity',
      'min_required_stock',
      'hsn_code',
      'created_by',
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
      const result = await dispatch(updatePackingMaterial(formData)).unwrap();
      toast.success(result.message || 'Packing material updated successfully');
      dispatch(GetPackingMaterial());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Packing Material</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            { id: 'material_name', label: 'Material Name' },
            { id: 'material_code', label: 'Material Code' },
            { id: 'purchase_rate', label: 'Purchase Rate', type: 'number' },
            { id: 'current_stock', label: 'Current Stock ', type: 'text' },
            { id: 'stock_quantity', label: 'Stock Quantity', type: 'number' },
            { id: 'min_required_stock', label: 'Min Required Stock', type: 'number' },
            { id: 'hsn_code', label: 'HSN Code' },
          ].map(({ id, label, type = 'text' }) => (
            <div className="col-span-6" key={id}>
              <Label htmlFor={id} value={label} />
                <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type={type}
                placeholder={`Enter ${label}`}
                value={formData[id]}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                 className='form-rounded-md'
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}

          {/* Material Type */}
          <div className="col-span-6">
            <Label htmlFor="material_type" value="Material Type" />
              <span className="text-red-700 ps-1">*</span>
            <select
              id="material_type"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={formData.material_type}
              onChange={(e) => handleChange('material_type', e.target.value)}
            >
              <option value="">Select Material Type</option>
              {materialTypeOptions.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.material_type && <p className="text-red-500 text-xs">{errors.material_type}</p>}
          </div>

          {/* Supplier */}
          <div className="col-span-6">
            <Label htmlFor="supplier_id" value="Supplier" />
              <span className="text-red-700 ps-1">*</span>
            <select
              id="supplier_id"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={formData.supplier_id}
              onChange={(e) => handleChange('supplier_id', e.target.value)}
            >
              <option value="">Select Supplier</option>
              {(supplierData || []).map((supplier: any) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
            {errors.supplier_id && <p className="text-red-500 text-xs">{errors.supplier_id}</p>}
          </div>

          {/* Unit of Measurement */}
          <div className="col-span-6">
            <Label htmlFor="unit_of_measurement" value="Unit of Measurement" />
              <span className="text-red-700 ps-1">*</span>
            <select
              id="unit_of_measurement"
              className="w-full border border-gray-300 p-2 rounded-md"
              value={formData.unit_of_measurement}
              onChange={(e) => handleChange('unit_of_measurement', e.target.value)}
            >
              <option value="">Select Unit</option>
              {(unitOptions || []).map((unit: any, i: number) => (
                <option key={i} value={unit?.value}>
                  {unit?.value}
                </option>
              ))}
            </select>
            {errors.unit_of_measurement && (
              <p className="text-red-500 text-xs">{errors.unit_of_measurement}</p>
            )}
          </div>
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

export default EditPackingMaterialModal;
