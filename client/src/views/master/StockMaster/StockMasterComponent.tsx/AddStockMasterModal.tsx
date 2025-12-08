import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Select,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  addStockMaster,
  GetStockMaster,
} from 'src/features/master/StockMaster/StockMasterSlice';
import { allUnits } from 'src/utils/AllUnit';

const itemTypes = [ 'Raw Material', 'Packing Material', 'Finished Good', 'Equipment'];
const uomOptions = allUnits;
// const statusOptions = ['Active', 'Inactive', 'Expired', 'Used'];

const AddStockMasterModal = ({
  show,
  setShowmodal,
  logindata,
  batchnumber,
  itemList,
  locationList,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const initialForm = {
    item_type: '',
    item_id: '',
    item_name: '',
    item_code: '',
    purchase_number: '',
    material_name: '',
    gst_no: '',
    batch_no: '',
    uom: '',
    quantity_in_stock: '',
    minimum_stock_level: '',
    reorder_level: '',
    location_id: '',
    rack_no: '',
    expiry_date: '',
    last_updated_by: logindata?.admin?.id || '',
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'item_id') {
      const selected = itemList?.find((item) => item.rm_code == value);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          item_id: value,
          item_name: selected.name,
          item_code: selected.rm_code,
        }));
      }
    }
  };

  const requiredFields = [
    'item_type',
    'item_id',
    'purchase_number',
    'material_name',
    'gst_no',
    'batch_no',
    'uom',
    'item_name',
    'item_code',
    'rack_no',
    'quantity_in_stock',
    'minimum_stock_level',
    'reorder_level',
    'location_id',
    'expiry_date',
     'status'
  ];

  const validateForm = () => {
    const newErrors: any = {};
    requiredFields.forEach((field) => {
      if (!formData[field])
        newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addStockMaster(formData)).unwrap();
      toast.success(result.message || 'Stock entry created successfully');
      dispatch(GetStockMaster());
      setFormData(initialForm);
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  const renderSelect = (id, label, options, value) => (
    <div className="col-span-4">
      <Label htmlFor={id} value={label} />
               <span className="text-red-700 ps-1">*</span>

      <Select
        id={id}
        value={value}
        onChange={(e) => handleChange(id, e.target.value)}
        className="w-full"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt?.value ? opt?.value : opt} value={opt?.value ? opt?.value : opt}>
            {opt?.value ? opt?.value : opt}
          </option>
        ))}
      </Select>
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );

  const renderInput = (id, label, type = 'text', disabled = false) => (
    <div className="col-span-4">
      <Label htmlFor={id} value={label} />
        <span className="text-red-700 ps-1">*</span>

      <TextInput
        id={id}
        type={type}
        value={formData[id]}
        onChange={(e) => handleChange(id, e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        disabled={disabled}
      />
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  );

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="5xl">
      <ModalHeader>Add Stock Entry</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {renderSelect('item_type', 'Item Type', itemTypes, formData.item_type)}

          {/* Item ID dropdown with auto-fill */}
          <div className="col-span-4">
            <Label htmlFor="item_id" value="Item" />
               <span className="text-red-700 ps-1">*</span>

            <Select
              id="item_id"
              value={formData.item_id}
              onChange={(e) => handleChange('item_id', e.target.value)}
              className="w-full"
            >
              <option value="">Select Item</option>
              {(itemList || []).map((item) => (
                <option key={item.rm_code} value={item.rm_code}>
                  {item.rm_code}
                </option>
              ))}
            </Select>
            {errors.item_id && (
              <p className="text-red-500 text-xs">{errors.item_id}</p>
            )}
          </div>

          {renderInput('item_name', 'Item Name', 'text', true)}
          {renderInput('item_code', 'Item Code', 'text', true)}

          {/* Batch number from dropdown */}
          <div className="col-span-4">
            <Label htmlFor="batch_no" value="Batch Number" />
               <span className="text-red-700 ps-1">*</span>

            <Select
              id="batch_no"
              value={formData.batch_no}
              onChange={(e) => handleChange('batch_no', e.target.value)}
              className="w-full"
            >
              <option value="">Select Batch No</option>
              {(batchnumber?.data || []).map((b) => (
                <option key={b.qc_batch_number} value={b.qc_batch_number}>
                  {b.qc_batch_number}
                </option>
              ))}
            </Select>
            {errors.batch_no && (
              <p className="text-red-500 text-xs">{errors.batch_no}</p>
            )}
          </div>

          {renderSelect('uom', 'Unit of Measurement', uomOptions, formData.uom)}
           
          {renderInput('purchase_number', 'Purchase Number', 'text')}
          {renderInput('material_name', 'Material Name', 'text')}
          {renderInput('gst_no', 'GST No.', 'text')}

          {renderInput('quantity_in_stock', 'Quantity in Stock', 'number')}
          {renderInput('minimum_stock_level', 'Minimum Stock Level', 'number')}
          {renderInput('reorder_level', 'Reorder Level', 'number')}

          {/* Location from locationList */}
          <div className="col-span-4">
            <Label htmlFor="location_id" value="Location / Warehouse" />
               <span className="text-red-700 ps-1">*</span>

            <Select
              id="location_id"
              value={formData?.location_id}
              onChange={(e) => handleChange('location_id', e.target.value)}
              className="w-full border-gray-400 form-rounded-md"
            >
              <option value="">Select Location</option>
           
              {(locationList || []).map((loc) => (
                <option key={loc} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </Select>
            {errors.location_id && (
              <p className="text-red-500 text-xs">{errors.location_id}</p>
            )}
          </div>

          {renderInput('rack_no', 'Rack No')}
          {renderInput('expiry_date', 'Expiry Date', 'date')}
          {/* {renderSelect('status', 'Status', statusOptions, formData.status)} */}
        </form>
      </ModalBody>

      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddStockMasterModal;
