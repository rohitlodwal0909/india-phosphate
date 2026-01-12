import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { AppDispatch } from 'src/store';
import {
  updateIssuedEquipment,
  getIssuedEquipment,
  getStoreEquipment,
} from 'src/features/Inventorymodule/InventoryIssued/IssueEquipmentSlice';

interface IssuedEditProps {
  openModal: boolean;
  data: any; // selected row
  setOpenModal: (val: boolean) => void;
  StoreData: any;
  logindata: any;
}

const EquipementIssuedEdit: React.FC<IssuedEditProps> = ({
  openModal,
  data,
  setOpenModal,
  StoreData,
  logindata,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<any>({
    id: '',
    user_id: '',
    equipment_id: '',
    quantity: 0,
    person_name: '',
    type: '',
    note: '',
  });

  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  /* =======================
     PREFILL DATA
  ======================= */
  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        user_id: logindata?.admin?.id,
        equipment_id: data.issueequipment?.id,
        quantity: data.quantity,
        person_name: data.person_name,
        type: data.type,
        note: data.note,
      });

      // max = available stock + already issued qty
      const storeItem = StoreData?.find((i: any) => i.id === data.issueequipment?.id);

      setMaxQuantity((storeItem?.total_quantity || 0) + Number(data.quantity));
    }
  }, [data, StoreData, logindata]);

  /* =======================
     OPTIONS
  ======================= */
  const equipmentOptions =
    StoreData?.map((item: any) => ({
      value: item.id,
      label: item.name,
      total_quantity: item.total_quantity,
    })) || [];

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.quantity > maxQuantity) {
      return toast.error(`Maximum allowed quantity is ${maxQuantity}`);
    }

    try {
      await dispatch(updateIssuedEquipment(formData)).unwrap();

      toast.success('Issued equipment updated successfully');
      dispatch(getIssuedEquipment());
      dispatch(getStoreEquipment());

      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Issued Equipment</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* Equipment */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Equipment Name" />
            <Select
              options={equipmentOptions}
              value={equipmentOptions.find((opt: any) => opt.value === formData.equipment_id)}
              isDisabled // ❌ equipment change nahi karna
            />
          </div>

          {/* Quantity */}
          <div className="sm:col-span-6 col-span-12">
            <Label value={`Quantity (Max ${maxQuantity})`} />
            <TextInput
              type="number"
              min={1}
              max={maxQuantity}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Person */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Issued Person Name" />
            <TextInput
              value={formData.person_name}
              onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
            />
          </div>

          {/* Type */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Type" />
            <TextInput
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
          </div>

          {/* Note */}
          <div className="col-span-12">
            <Label value="Note" />
            <Textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EquipementIssuedEdit;
