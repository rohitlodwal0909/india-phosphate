import React, { useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  getIssuedEquipment,
  getStoreEquipment,
  issuedEquipment,
} from 'src/features/Inventorymodule/InventoryIssued/IssueEquipmentSlice';

interface EquipementIssuedAddProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  storeequipments: any;
  logindata: any;
}

const EquipementIssuedAdd: React.FC<EquipementIssuedAddProps> = ({
  openModal,
  setOpenModal,
  storeequipments,
  logindata,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    user_id: logindata?.admin?.id,
    equipment_id: '',
    quantity: 0,
    person_name: '',
    type: '',
    note: '',
    date: new Date().toISOString().split('T')[0], // ✅ required
  });

  const [errors, setErrors] = useState<any>({});
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  const equipmentOptions =
    storeequipments?.map((item: any) => ({
      value: item.id,
      label: item.name,
      total_quantity: item.total_quantity,
    })) || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['equipment_id', 'quantity', 'person_name', 'type'];
    const newErrors: any = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === 0) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.quantity > maxQuantity) {
      newErrors.quantity = `Maximum allowed quantity is ${maxQuantity}`;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(issuedEquipment(formData)).unwrap();

      toast.success('Equipment issued successfully');

      // ✅ refresh list + stock
      dispatch(getIssuedEquipment());
      dispatch(getStoreEquipment());

      setFormData({
        user_id: logindata?.admin?.id,
        equipment_id: '',
        quantity: 0,
        person_name: '',
        type: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
      });

      setMaxQuantity(0);
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to issue equipment');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Issue Equipment</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* Equipment */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Equipment Name" />
            <Select
              options={equipmentOptions}
              value={equipmentOptions.find((opt: any) => opt.value === formData.equipment_id)}
              onChange={(selected: any) => {
                setFormData({ ...formData, equipment_id: selected?.value });
                setMaxQuantity(selected?.total_quantity || 0);
                setErrors({ ...errors, equipment_id: '' });
              }}
            />
            {errors.equipment_id && (
              <span className="text-red-500 text-sm">{errors.equipment_id}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="sm:col-span-6 col-span-12">
            <Label value={`Quantity (Max ${maxQuantity})`} />
            <TextInput
              type="number"
              min={1}
              max={maxQuantity}
              value={formData.quantity || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: Number(e.target.value),
                })
              }
            />
            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
          </div>

          {/* Person */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Issued Person Name" />
            <TextInput name="person_name" value={formData.person_name} onChange={handleChange} />
          </div>

          {/* Type */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Type" />
            <TextInput name="type" value={formData.type} onChange={handleChange} />
          </div>

          {/* Note */}
          <div className="col-span-12">
            <Label value="Note" />
            <Textarea name="note" value={formData.note} onChange={handleChange} />
          </div>

          {/* Actions */}
          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EquipementIssuedAdd;
