import React, {  useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import Select from 'react-select';
import { allUnits } from 'src/utils/AllUnit';
import { addDispatch, GetFetchDispatch } from 'src/features/Inventorymodule/dispatchmodule/DispatchSlice';
import { GetStoremodule } from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { toast } from 'react-toastify';
interface VehicleDispatchModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
   StoreData:any
}

const VehicleDispatchModal: React.FC<VehicleDispatchModalProps> = ({ openModal, setOpenModal,StoreData}) => {

  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
   };
  

  const batchOptions = StoreData?.flatMap((item) => item.qc_batch_number || []).map((batch) => ({ value: batch, label: batch }));

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
   const requiredFields = ['vehicle_number', 'driver_details', 'product_name', 'quantity', 'delivery_location', 'batch_numbers', 'delivered_by', 'invoice_number', 'remarks', 'unit'];;
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
     try {
           const res = await   dispatch(addDispatch(formData)).unwrap();
           if (res) {
             toast.success("New Dispatch Entry  Successfully");
                dispatch(GetFetchDispatch())
                dispatch(GetStoremodule())
                 setFormData({
  vehicle_number: '',
  driver_details: '',
  product_name: '',
  quantity: '',
  delivery_location: '',
  batch_numbers: '',
  delivered_by: '',
  invoice_number: '',
  remarks: '',
  unit: ''
})

    setOpenModal(false);
           }
         } catch (err: any) {
           toast.error(err.message || "Failed to update entry");
         }
     
     
 
  
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Dispatch Details</Modal.Header>
      <Modal.Body>
       <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">

  <div className='sm:col-span-6 col-span-12'>
    <Label htmlFor="vehicle_number" value="Vehicle Number" />
    <TextInput id="vehicle_number" name="vehicle_number" placeholder=' Enter Vehicle Number' value={formData.vehicle_number || ''} onChange={handleChange} className="form-rounded-md" />
    {errors.vehicle_number && <span className="text-red-500 text-sm">{errors.vehicle_number}</span>}
  </div>

  <div className='sm:col-span-6 col-span-12'>
    <Label htmlFor="driver_details" value="Driver Details" />
    <TextInput id="driver_details" name="driver_details" placeholder=' Enter Driver Details' value={formData.driver_details || ''} onChange={handleChange} className="form-rounded-md" />
    {errors.driver_details && <span className="text-red-500 text-sm">{errors.driver_details}</span>}
  </div>

  <div className='sm:col-span-6 col-span-12'>
    <Label htmlFor="product_name" value="Product Name" />
    <TextInput id="product_name" name="product_name"  placeholder=' Enter Produuct Name'value={formData.product_name || ''} onChange={handleChange} className="form-rounded-md" />
    {errors.product_name && <span className="text-red-500 text-sm">{errors.product_name}</span>}
  </div>

  <div className='sm:col-span-6 col-span-12'>
    <Label htmlFor="batch_numbers" value="Batch Numbers" className='' />
    <Select isMulti options={batchOptions} value={formData.batch_numbers || []} onChange={(selected) => { setFormData({ ...formData, batch_numbers: selected }); setErrors({ ...errors, batch_numbers: '' }); }} classNamePrefix="react-select  "  />
    {errors.batch_numbers && <span className="text-red-500 text-sm">{errors.batch_numbers}</span>}
  </div>

  <div className="sm:col-span-6 col-span-12">
    <Label htmlFor="quantity" value="Quantity " />
    <div className="flex rounded-md shadow-sm mt-2">
      <input type="text" id="quantity" name='quantity' className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm bg-gray-100" value={formData?.quantity} onChange={handleChange}  placeholder=' Enter Quantity' />
      <select className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-2 py-2 text-sm text-gray-700" name='unit' value={formData?.unit || ''} onChange={handleChange}>
        <option value="">Unit</option>
        {allUnits.map((unit) => (
          <option key={unit.value} value={unit.value}>{unit.value}</option>
        ))}
      </select>
    </div>
    {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
    {errors.unit && <span className="text-red-500 text-sm">{errors.unit}</span>}
  </div>

  <div className='sm:col-span-6 col-span-12'>
    <Label htmlFor="delivery_location" value="Delivery Location"  />
    <TextInput id="delivery_location" name="delivery_location"  placeholder=' Enter Delivery Location' value={formData.delivery_location || ''} onChange={handleChange} className="form-rounded-md" />
    {errors.delivery_location && <span className="text-red-500 text-sm">{errors.delivery_location}</span>}
  </div>

  <div className='sm:col-span-6 col-span-12'>
    <Label htmlFor="delivered_by" value="Delivered By"  />
    <TextInput id="delivered_by" name="delivered_by"   placeholder=' Enter Delivered By' value={formData.delivered_by || ''} onChange={handleChange} className="form-rounded-md" />
    {errors.delivered_by && <span className="text-red-500 text-sm">{errors.delivered_by}</span>}
  </div>

  <div className='sm:col-span-6 col-span-12'>
    <Label htmlFor="invoice_number" value="Invoice Number" />
    <TextInput id="invoice_number" name="invoice_number"   placeholder=' Enter Invoice Number'  value={formData.invoice_number || ''} onChange={handleChange} className="form-rounded-md" />
    {errors.invoice_number && <span className="text-red-500 text-sm">{errors.invoice_number}</span>}
  </div>

  <div className='sm:col-span-12 col-span-12'>
    <Label htmlFor="remarks" value="Remarks" />
    <Textarea id="remarks" name="remarks"  placeholder=' Enter remarks'    value={formData.remarks || ''} onChange={handleChange} className="form-rounded-md" />
    {errors.remarks && <span className="text-red-500 text-sm">{errors.remarks}</span>}
  </div>

  <div className="flex justify-end gap-2 col-span-12">
    <Button type="button" color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
    <Button type="submit">Submit</Button>
  </div>

</form>
      </Modal.Body>
    </Modal>
  );
};

export default VehicleDispatchModal;
