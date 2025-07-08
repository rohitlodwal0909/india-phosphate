import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { allUnits } from 'src/utils/AllUnit';
import { GetStoremodule } from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';


interface VehicleDispatchEditModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
  handleupdated:any
}

const VehicleDispatchEditModal: React.FC<VehicleDispatchEditModalProps> = ({ openModal, setOpenModal, selectedRow ,handleupdated}) => {
  const [formData, setFormData] = useState<any>({});

 const StoreData = useSelector((state: any) => state.storeinventory.storedata);
    
      const dispatch = useDispatch<AppDispatch>();
     useEffect(() => {
        const fetchStoreData = async () => {
          try {
            const result = await dispatch(GetStoremodule());
            if (GetStoremodule.rejected.match(result)) return console.error("Store Module Error:", result.payload || result.error.message);
                } catch (error) {
            console.error("Unexpected error:", error);
          }
          fetchStoreData()
        };},[])
      useEffect(() => {
    if (selectedRow) {
      setFormData(selectedRow);
    }
  }, [selectedRow]);
  const filteredusername = StoreData?.data?.filter((item:any) =>  item?.qc_result?.[0]?.testedBy?.username );
const batchOptions = filteredusername
  ?.flatMap((item) => item.batch_number || [])
  .map((batch) => ({ value: batch, label: batch }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleupdated(formData)
   
    setOpenModal(false);
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Dispatch Details</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="vehicle_number" value="Vehicle Number" />
            <TextInput id="vehicle_number" name="vehicle_number" value={formData.vehicle_number || ''} onChange={handleChange} className='form-rounded-md'/>
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="driver_details" value="Driver Details" />
            <TextInput id="driver_details" name="driver_details" value={formData.driver_details || ''} onChange={handleChange} className='form-rounded-md' />
          </div>
         
          <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="product_name" value="Product Name" />
            <TextInput id="product_name" name="product_name" value={formData.product_name || ''} onChange={handleChange} className='form-rounded-md' />
          </div>
           <div className="sm:col-span-6 col-span-12">
            <Label htmlFor="driverDetails" value="Driver Details" />
             <Select
  isMulti
  options={batchOptions}
  value={
    typeof formData.batch_numbers === 'string'
      ? JSON.parse(formData.batch_numbers)
      : formData.batch_numbers || []
  }
  onChange={(selected) => {
    setFormData({ ...formData, batch_numbers: selected });
  }}
  classNamePrefix="react-select"
/></div>
           <div className="sm:col-span-6 col-span-12">
                       <Label htmlFor="quantityNet" value="Quantity " />
                       <div className="flex rounded-md shadow-sm mt-2">
                         {/* Quantity input (read-only) */}
                         <input
                           type="text"
                           id="quantity"
                           name='quantity'
                           className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
                           value={formData?.quantity}
                          onChange={handleChange} 
                         />
                   
                         {/* Unit select (disabled for read-only) */}
                         <select
                           className="rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-2 py-2 text-sm text-gray-700"
                           name='unit'
                           value={formData?.unit || ''}
                           onChange={handleChange}
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
                  <div className='sm:col-span-6 col-span-12'>
                    <Label htmlFor="delivery_location" value="Delivery Location" />
                    <TextInput id="delivery_location" name="delivery_location" value={formData.delivery_location || ''} onChange={handleChange} className="form-rounded-md" />
                  </div>
                  <div className='sm:col-span-6 col-span-12'>
                    <Label htmlFor="delivered_by" value="Delivered By" />
                    <TextInput id="delivered_by" name="delivered_by" value={formData.delivered_by || ''} onChange={handleChange} className="form-rounded-md" />
                  </div>
        
                  <div className='sm:col-span-6 col-span-12'>
                    <Label htmlFor="invoice_number" value="Invoice Number" />
                    <TextInput id="invoice_number" name="invoice_number" value={formData.invoice_number || ''} onChange={handleChange} className="form-rounded-md" />
                  </div>
        
                  <div className='sm:col-span-12 col-span-12'>
                    <Label htmlFor="remarks" value="Remarks" />
                    <Textarea id="remarks" name="remarks" value={formData.remarks || ''} onChange={handleChange} className="form-rounded-md" />
                  </div>
          <div className="flex justify-end gap-2 col-span-12">
            <Button type="button" color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VehicleDispatchEditModal;
