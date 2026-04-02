import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from 'src/store';

import {
  getIssuedPM,
  getStorePM,
  returnPM,
} from 'src/features/Inventorymodule/InventoryIssued/PMIssueSlice';

interface IssuedEditProps {
  openModal: boolean;
  data: any; // selected row
  setOpenModal: (val: boolean) => void;
}

const ReturnPM: React.FC<IssuedEditProps> = ({ openModal, data, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const StoreData = useSelector((state: RootState) => state.pmissue.storepm) as any;

  useEffect(() => {
    dispatch(getStorePM());
  }, [dispatch]);

  const [formData, setFormData] = useState<any>({
    id: '',
    quantity: 0,
    return_bag: 0,
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
        return_bag: data.return_bag || 0, // ✅
        returned_by: data.returned_by || '',
      });

      const storeItem = StoreData?.find((i: any) => i.id === data.issueequipment?.id);

      setMaxQuantity((storeItem?.total_quantity || 0) + Number(data.quantity));
    }
  }, [data, StoreData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.quantity > maxQuantity) {
      return toast.error(`Maximum allowed quantity is ${maxQuantity}`);
    }

    try {
      await dispatch(returnPM(formData)).unwrap();

      toast.success('PM returned successfully');
      dispatch(getIssuedPM());
      dispatch(getStorePM());

      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Returned Packing Material</Modal.Header>

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
              value={formData.return_bag}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  return_bag: Number(e.target.value),
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

export default ReturnPM;
