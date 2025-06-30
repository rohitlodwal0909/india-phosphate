import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { GetCheckinmodule } from 'src/features/Inventorymodule/guardmodule/GuardSlice';
import { addStore, GetStoremodule } from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { allUnits } from 'src/utils/AllUnit';
import { AppDispatch } from 'src/store';

type FormDataType = {
  supplier_name: string;
  grn_date: string;
  grn_time: any;
  grn_number: string;
  manufacturer_name: string;
  invoice_number: string;
  guard_entry_id: any;
  batch_number: string;
  store_rm_code: string;
  container_count: string;
  container_unit: string;
  quantity: string;
  unit: string;
};
const StoreInventoryAddmodal = ({ placeModal, modalPlacement, setPlaceModal, selectedRow }) => {
  const [formData, setFormData] = useState<FormDataType>({
    supplier_name: '',
    grn_date: '',
    grn_time: null,
    grn_number: "",
    manufacturer_name: '',
    invoice_number: '',
    guard_entry_id: selectedRow?.id,
    batch_number: '',
    store_rm_code: '',
    container_count: '',
    container_unit:'',
    quantity: selectedRow?.quantity_net ,
    unit:selectedRow?.quantity_unit
  });
  const logindata = JSON.parse(localStorage.getItem('logincheck') || '{}');

  const requiredFields = [
    'supplier_name',
    'grn_date',
    'grn_time',
    'grn_number',
    'manufacturer_name',
    'invoice_number',
    'batch_number',
    'store_rm_code',
    'container_count',
    'container_unit',
  ];
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<Partial<FormDataType>>({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' }); // clear error on change
  };
useEffect(()=>{
   setFormData({ ...formData, guard_entry_id: selectedRow?.id ,quantity:selectedRow?.quantity_net, unit:selectedRow?.quantity_unit });
},[selectedRow])
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
   

       dispatch(addStore(formData)).unwrap()
        .then(() => {
        toast.success("Store data added successfully!");
        setFormData({
          supplier_name: '',
          grn_date: '',
          grn_time:null,
          grn_number: "",
          manufacturer_name: '',
          invoice_number: '',
          guard_entry_id: '',
          batch_number: '',
          store_rm_code: '',
          container_count: '',
          container_unit:'',
          quantity:'',
          unit:''
        });
           dispatch(GetCheckinmodule(logindata?.admin?.id))
               dispatch(GetStoremodule())
        setPlaceModal(false);
      })
      .catch((error) => {
        toast.error(error || "Failed to add store data.");
      });
    }
  };


  return (
    <Modal size="3xl"  show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} className="large notranslate"   
  translate="no">
    
      <ModalHeader className="pb-0">New Store Entry</ModalHeader>
      <ModalBody>
        <form className="grid grid-cols-12 gap-5" onSubmit={handleSubmit}>
          {/* Inward No. */}
        {/* Guard Type - Always Show */}
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="guard_type" value="Select Guard Type" />
            <select
              id="guard_type"
              value={selectedRow?.guard_type}
              onChange={(e) => handleChange('guard_type', e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            >
              <option value="">Select</option>
              <option value="Vehicle">Vehicle </option>
              <option value="Courier">Courier</option>
              <option value="Other">Other</option>
            </select>
          </div>

{/* Conditionally show for vehicle_number */}
{selectedRow?.guard_type === "Vehicle" && (
  <>
    <div className="sm:col-span-6 col-span-12">
      <Label htmlFor="vehicleNo" value="Vehicle No." />
      <TextInput
        id="vehicleNo"
        name="vehicle_number"
        type="text"
         style={{borderRadius:"8px"}}
        value={selectedRow?.vehicle_number}
        readOnly
      />
    </div>
  </>
)}

{/* Conditionally show for courier */}
{selectedRow?.guard_type === "Courier" && (
  <>
    <div className="sm:col-span-6 col-span-12">
      <Label htmlFor="senderName" value="Sender Name" />
      <TextInput
        id="senderName"
        name="sender_name"
        type="text"
        style={{borderRadius:"8px"}}
        value={selectedRow?.sender_name}
        readOnly
      />
    </div>
    <div className="sm:col-span-6 col-span-12">
      <Label htmlFor="productName" value="Product Name" />
      <TextInput
        id="productName"
        name="product_name"
        type="text"
         style={{borderRadius:"8px"}}
        value={selectedRow?.product_name}
        readOnly
      />
    </div>
    <div className="sm:col-span-6 col-span-12">
      <Label htmlFor="productId" value="Product ID" />
      <TextInput
        id="productId"
        name="product_id"
        type="text"
         style={{borderRadius:"8px"}}
        value={selectedRow?.product_id}
        readOnly
      />
    </div>
  </>
)}

{selectedRow?.guard_type == "Other" && (
   <div className="sm:col-span-6 col-span-12">
      <Label htmlFor="remark" value="Remark" />
      <TextInput
        id="remark"
        name="remark"
        type="text"
         style={{borderRadius:"8px"}}
        value={selectedRow?.remark}
        readOnly
      />
      
    </div>
)}
{/* Always show Quantity (Net) if available */}
{selectedRow?.quantity_net && (
  <div className="sm:col-span-6 col-span-12">
    <Label htmlFor="quantityNet" value="Quantity (Net)" />
    <div className="flex rounded-md shadow-sm mt-2">
      
      {/* Quantity input (read-only) */}
      <input
        type="text"
        id="quantityNet"
        className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
        value={selectedRow?.quantity_net}
        readOnly
      />

      {/* Unit select (disabled for read-only) */}
      <select
        className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-2 py-2 text-sm text-gray-700"
        value={selectedRow?.quantity_unit || ''}
        disabled
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

          {/* Supplier Name */}
          <InputField
            id="supplier_name"               // id must match formData key
            label="Supplier Name"
            value={formData.supplier_name}  // value from formData
            onChange={handleChange}
            error={errors.supplier_name}
            placeholder="Enter Supplier Name"
          />

          {/* Date */}
          <InputField
            id="grn_date"
            label="GRN Date"
            type="date"
            value={formData.grn_date}
            onChange={handleChange}
            error={errors.grn_date}
          />

          {/* Time */}
           <div className="sm:col-span-6 col-span-12 w-full">
                <Label htmlFor="quantityNet" value="GRN Time" className='' />
                <div className='pt-2'>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
       <TimePicker
    value={formData.grn_time}
    onChange={(value) => handleChange('grn_time', value)}
    slotProps={{
      textField: {
        id: 'grn_time',
        fullWidth: true,
        error: !!errors.grn_time,
        helperText: errors.grn_time,
        sx: {
          '& .MuiInputBase-root': {
            fontSize: '14px',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
          },
          '& .css-1hgcujo-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
            height: '42px',
            fontSize: '14px',
           
            backgroundColor: '#f1f5f9',
            borderRadius: '6px',
          },
          '& input': {
            padding: '2px 0',
          },
          '& .MuiInputLabel-root': {
            fontSize: '13px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#cbd5e1',
          },
        },
      },
    }}
  />
</LocalizationProvider>
                </div>

</div>
          {/* GRN Number */}
          <InputField
            id="grn_number"
            label="GRN Number"
            value={formData.grn_number}
            onChange={handleChange}
            error={errors.grn_number}
            placeholder="Enter GRN Number"
          />

          {/* Manufacturer Name */}
          <InputField
            id="manufacturer_name"
            label="Manufacturer Name"
            value={formData.manufacturer_name}
            onChange={handleChange}
            error={errors.manufacturer_name}
            placeholder="Enter Manufacturer Name"
          />

          {/* Invoice Number */}
          <InputField
            id="invoice_number"
            label="Invoice Number"
            value={formData.invoice_number}
            onChange={handleChange}
            error={errors.invoice_number}
            placeholder="Enter Invoice Number"
          />

          {/* Batch Number */}
          <InputField
            id="batch_number"
            label="Batch Number"
            value={formData.batch_number}
            onChange={handleChange}
            error={errors.batch_number}
            placeholder="Enter Batch Number"
          />

          {/* Store RM Code */}
          <InputField
            id="store_rm_code"
            label="Store RM Code"
            value={formData.store_rm_code}
            onChange={handleChange}
            error={errors.store_rm_code}
            placeholder="Enter Store RM Code"
          />

          {/* Container Count */}

          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="quantity_net"value={`Containers${formData?.container_unit ? ` (${formData.container_unit})` : ''}`}/>
            <span className="text-red-700 ps-1">*</span>
           <div className="mt-3">
          
            <div className="flex rounded-md shadow-sm">
              {/* Input field */}
              <input
                type="text"
                id='container_count'
                name="container_count"
                placeholder="Number Of container"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                 onChange={(e) => handleChange("container_count", e.target.value)}
                value={formData.container_count }
              />
              {/* Unit selector (read-only) */}
              <select
                id="container_unit"
        name="container_unit"
        value={formData.container_unit}
        onChange={(e) => handleChange("container_unit", e.target.value)}
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
          </div>
        
          {/* Submit/Cancel Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-[1rem] ">
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

// Reusable InputField component for consistency
export default StoreInventoryAddmodal;
const InputField = ({ id, label, type = 'text', value, onChange, error, placeholder = '' }) => (
  <div className="sm:col-span-6 col-span-12">
    <div className="mb-2 block">
      <Label htmlFor={id} value={label} />
      <span className="text-red-700 ps-1">*</span>
    </div>
    <TextInput
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(id, e.target.value)}
      color={error ? 'failure' : 'gray'}
      style={{ borderRadius: '5px' }}
      helperText={error && <span className="text-red-500 text-xs">{error}</span>}
    />
  </div>
);

