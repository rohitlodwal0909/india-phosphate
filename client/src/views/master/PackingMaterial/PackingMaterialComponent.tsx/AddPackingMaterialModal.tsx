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
  addPackingMaterial,
  GetPackingMaterial,
} from 'src/features/master/PackingMaterial/PackingMaterialSlice';

const AddPackingMaterialModal = ({ show, setShowmodal, logindata, supplierData, unitOptions, }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    material_name: '',
    material_code: '',
    material_type: '',
    supplier_id: '',
    unit_of_measurement: '',
    purchase_rate: '',
    stock_quantity: '',
    current_stock:'',
    min_required_stock: '',
    hsn_code: '',
    created_by: logindata?.admin?.id || '',
  
  });

  const [errors, setErrors] = useState<any>({});

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
      const result = await dispatch(addPackingMaterial(formData)).unwrap();
      toast.success(result.message || 'Packing material created successfully');
      dispatch(GetPackingMaterial());
      setFormData({
    material_name: '',
    material_code: '',
    material_type: '',
    supplier_id: '',
    unit_of_measurement: '',
    purchase_rate: '',
    stock_quantity: '',
    current_stock:'',
    min_required_stock: '',
    hsn_code: '',
    created_by: logindata?.admin?.id || '',
  });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Create Packing Material</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Material Name */}
          <div className="col-span-6">
            <Label htmlFor="material_name" value="Material Name" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="material_name"
              placeholder='Enter Material Name'
              value={formData.material_name}
              onChange={(e) => handleChange('material_name', e.target.value)}
              color={errors.material_name ? 'failure' : 'gray'}
              className='form-rounded-md'
            />
            {errors.material_name && <p className="text-red-500 text-xs">{errors.material_name}</p>}
          </div>

          {/* Material Code */}
          <div className="col-span-6">
            <Label htmlFor="material_code" value="Material Code" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="material_code"
              value={formData.material_code}
               placeholder='Enter Material Code'
              onChange={(e) => handleChange('material_code', e.target.value)}
              color={errors.material_code ? 'failure' : 'gray'}
                   className='form-rounded-md'
            />
            {errors.material_code && <p className="text-red-500 text-xs">{errors.material_code}</p>}
          </div>



          {/* Standard Rate */}
          <div className="col-span-6">
            <Label htmlFor="purchase_rate" value="Purchase Rate" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="purchase_rate"
              type="number"
                placeholder='Enter Purchase  Rate'
              value={formData.purchase_rate}
              onChange={(e) => handleChange('purchase_rate', e.target.value)}
              color={errors.purchase_rate ? 'failure' : 'gray'}
                   className='form-rounded-md'
            />
            {errors.purchase_rate && <p className="text-red-500 text-xs">{errors.purchase_rate}</p>}
          </div>
           <div className="col-span-6">
            <Label htmlFor="current_stock" value="Current Stock" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="current_stock"
              type="text"
                placeholder='Enter Purchase Rate'
              value={formData.current_stock}
              onChange={(e) => handleChange('current_stock', e.target.value)}
              color={errors.current_stock ? 'failure' : 'gray'}
                   className='form-rounded-md'
            />
            {errors.current_stock && <p className="text-red-500 text-xs">{errors.current_stock}</p>}
          </div>

          {/* Stock Quantity */}
          <div className="col-span-6">
            <Label htmlFor="stock_quantity" value="Stock Quantity" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="stock_quantity"
              type="number"
                placeholder='Enter Stock Quantity'
              value={formData.stock_quantity}
              onChange={(e) => handleChange('stock_quantity', e.target.value)}
              color={errors.stock_quantity ? 'failure' : 'gray'}
                   className='form-rounded-md'
            />
            {errors.stock_quantity && <p className="text-red-500 text-xs">{errors.stock_quantity}</p>}
          </div>

          {/* Min Required Stock */}
          <div className="col-span-6">
            <Label htmlFor="min_required_stock" value="Min Required Stock" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="min_required_stock"
              type="number"
              value={formData.min_required_stock}
              placeholder='Enter Required Stock '
              onChange={(e) => handleChange('min_required_stock', e.target.value)}
              color={errors.min_required_stock ? 'failure' : 'gray'}
                   className='form-rounded-md'
            />
            {errors.min_required_stock && <p className="text-red-500 text-xs">{errors.min_required_stock}</p>}
          </div>

          {/* HSN Code */}
          <div className="col-span-6">
            <Label htmlFor="hsn_code" value="HSN Code" />
             <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="hsn_code"
              type="text"
              value={formData.hsn_code}
              placeholder='Enter Hsn Code '

              onChange={(e) => handleChange('hsn_code', e.target.value)}
              color={errors.hsn_code ? 'failure' : 'gray'}
                   className='form-rounded-md'
            />
            {errors.hsn_code && <p className="text-red-500 text-xs">{errors.hsn_code}</p>}
          </div>
          {/* Material Type */}
          <div className="col-span-6">
            <Label htmlFor="material_type" value="Material Type" />
             <span className="text-red-700 ps-1">*</span>
            <select
              id="material_type"
              value={formData.material_type}
              onChange={(e) => handleChange('material_type', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Type</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
            </select>
            {errors.material_type && <p className="text-red-500 text-xs">{errors.material_type}</p>}
          </div>

          {/* Supplier */}
          <div className="col-span-6">
            <Label htmlFor="supplier_id" value="Supplier" />
             <span className="text-red-700 ps-1">*</span>
            <select
              id="supplier_id"
              value={formData.supplier_id}
              onChange={(e) => handleChange('supplier_id', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
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
              value={formData.unit_of_measurement}
             
              onChange={(e) => handleChange('unit_of_measurement', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Unit</option>
              {(unitOptions || []).map((unit: any, i: number) => (
                <option key={i} value={unit?.value}>{unit?.value}</option>
              ))}
            </select>
            {errors.unit_of_measurement && <p className="text-red-500 text-xs">{errors.unit_of_measurement}</p>}
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

export default AddPackingMaterialModal;
