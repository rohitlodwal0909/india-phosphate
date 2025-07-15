import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';

import Select from 'react-select';

import { Icon } from "@iconify/react";
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { addProduction, GetFetchQcProduction } from 'src/features/Inventorymodule/productionmodule/ProdutionSlice';
import { toast } from 'react-toastify';
import { GetAllrowmaterial } from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import { GetNotification } from 'src/features/Notifications/NotificationSlice';
interface VehicleDispatchModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  rmcode: any;
  selectedRow: any;
  handleSubmited:any;
  logindata
}

interface RmCodeOption {
  value: string;
  label: string;
}

const Addproductionmodal: React.FC<VehicleDispatchModalProps> = ({ openModal, setOpenModal, rmcode, selectedRow ,logindata}) => {

const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState<any>({
    batch_id: selectedRow?.id,
    user_id: logindata?.admin?.id,
    items: [{ rm_code: '', quantity: '' }],
  });

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      batch_id: selectedRow?.id,
      user_id:logindata?.admin?.id
    }));
  }, [selectedRow]);

  const [errors, setErrors] = useState<any>({});

  const rmOptions: RmCodeOption[] = Array.from(
    new Set((rmcode || []).map((item: any) => item.rm_code))
  ).map((code) => ({
    value: String(code),
    label: String(code),
  }));

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData((prev: any) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleAddRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [...prev.items, { rm_code: '', quantity: '' }],
    }));
  };

  const handleDeleteRow = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData((prev: any) => ({
      ...prev,
      items: updatedItems,
    }));
  }; const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.batch_id) newErrors.batch_id = 'Batch ID is required';
    if (!formData.items || formData.items.length === 0)
      newErrors.items = 'At least one RM row is required';
    const hasEmpty = formData.items.some(
      (item: any) => !item.rm_code || !item.quantity
    );
    if (hasEmpty)
      newErrors.items = 'All RM rows must have RM Code and Quantity';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      batch_id: formData.batch_id,
       user_id: logindata?.admin?.id,
      rm_code: formData.items.map((item: any) => item.rm_code),
      quantity: formData.items.map((item: any) => item.quantity),
    };
    if(payload){

  // handleSubmited(payload); // ✅ Wait for the async function to complete
  try {
 
     const res = await dispatch(addProduction(payload)).unwrap();
     if (res) {
       toast.success("Production entry created successfully");
       await Promise.all([
         dispatch(GetAllrowmaterial()),
         dispatch(GetFetchQcProduction()),
         dispatch(GetNotification(logindata?.admin?.id)),
       ]);

        setFormData({
      batch_id: '',
      items: [{ rm_code: '', quantity: '' }],
    }) 
        setOpenModal(false);
     }
   } catch (err) {
     toast.error(err || "Failed to add production");
   } finally {
 
 
   }
   }
  };


  
 
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Production Details</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {formData.items.map((item: any, index: number) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
             {index  === 0 &&  <Label value="RM Code" />}
                <Select
                  options={rmOptions}
                  value={rmOptions.find((opt) => opt.value === item.rm_code) || null}
                  onChange={(selected) =>
                    handleItemChange(index, 'rm_code', selected?.value || '')
                  }
                  className="w-full"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>

              <div className="col-span-5">
                {index  === 0 &&   <Label value="Quantity" />}
                <TextInput
                  type="number"
                  placeholder="Enter quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </div>

              <div className="col-span-2">
               { index == 0 ?
               (  <Button type="button" color="primary" onClick={handleAddRow}>
                <Icon icon="material-symbols:add-rounded" height={18} />
               </Button>):
               ( <Button
                  type="button"
                  color="error"
                  onClick={() => handleDeleteRow(index)}
                >
                <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>)}
              </div>
            </div>
          ))}

          {errors.items && (
            <p className="text-red-500 text-sm col-span-12">{errors.items}</p>
          )}

          <div className="flex justify-end gap-2 col-span-12 mt-4">
            <Button type="button" color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Addproductionmodal;
