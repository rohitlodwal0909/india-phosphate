import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';

import {
  getIssuedEquipment,
  getStoreEquipment,
  returnEquipment,
} from 'src/features/Inventorymodule/InventoryIssued/IssueEquipmentSlice';

interface IssuedEditProps {
  openModal: boolean;
  data: any; // selected row
  setOpenModal: (val: boolean) => void;
  StoreData: any;
  logindata: any;
}

const ReturnEquipment: React.FC<IssuedEditProps> = ({
  openModal,
  data,
  setOpenModal,
  StoreData,
  logindata,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    id: '',
    quantity: 0,
    return_equipment: 0,
    returned_by: '',
  });

  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  /* =======================
     PREFILL DATA
  ======================= */
  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        quantity: data.quantity,
        return_equipment: data.return_equipment || 0, // ✅
        returned_by: data.returned_by || '',
      });

      const storeItem = StoreData?.find((i: any) => i.id === data.issueequipment?.id);

      setMaxQuantity((storeItem?.total_quantity || 0) + Number(data.quantity));
    }
  }, [data, StoreData, logindata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.quantity > maxQuantity) {
      return toast.error(`Maximum allowed quantity is ${maxQuantity}`);
    }

    try {
      await dispatch(returnEquipment(formData)).unwrap();

      toast.success('equipment returned successfully');
      dispatch(getIssuedEquipment());
      dispatch(getStoreEquipment());

      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Returned Equipment</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* Equipment */}

          {/* Person */}

          <div className="sm:col-span-6 col-span-12">
            <Label value="Returned Quantity" />
            <TextInput
              type="number"
              min={0}
              max={formData.quantity}
              value={formData.return_equipment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  return_equipment: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Label value="Returned By" />
            <TextInput
              value={formData.returned_by}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  returned_by: e.target.value,
                })
              }
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

export default ReturnEquipment;
