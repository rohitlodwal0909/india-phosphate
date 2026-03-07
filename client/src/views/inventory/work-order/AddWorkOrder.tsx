import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createWorkOrderNo } from 'src/features/marketing/PurchaseOrderSlice';

interface AddModalProps {
  placeModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
}

const AddWorkOrder: React.FC<AddModalProps> = ({ placeModal, setPlaceModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const [work_order_no, setWorkOrderNo] = useState('');

  useEffect(() => {
    if (selectedRow?.workNo?.work_order_no) {
      setWorkOrderNo(selectedRow.workNo.work_order_no);
    } else {
      setWorkOrderNo('');
    }
  }, [selectedRow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!work_order_no) {
      toast.error('Work Order No is required');
      return;
    }

    try {
      const payload = {
        id: selectedRow?.workNo?.id || null,
        po_id: selectedRow?.id,
        work_order_no: work_order_no,
      };

      const result = await dispatch(createWorkOrderNo(payload)).unwrap();

      toast.success(result?.message || 'Work Order submitted!');
      setPlaceModal(false);
      setWorkOrderNo('');
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Modal
      show={placeModal}
      position="center"
      onClose={() => setPlaceModal(false)}
      className="large"
    >
      <ModalHeader className="pb-0">Add Work Order No.</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Label htmlFor="work_order_no" value="Work Order No" />
            <span className="text-red-700 ps-1">*</span>

            <TextInput
              id="work_order_no"
              type="text"
              placeholder="Enter Work Order No"
              value={work_order_no}
              onChange={(e) => setWorkOrderNo(e.target.value)}
              required
            />
          </div>

          <div className="col-span-12 flex justify-end items-center gap-4">
            <Button type="button" color="error" onClick={() => setPlaceModal(false)}>
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

export default AddWorkOrder;
