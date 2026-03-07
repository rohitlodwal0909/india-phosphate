import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Textarea,
} from 'flowbite-react';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addRemark } from 'src/features/marketing/PurchaseOrderSlice';

interface AddModalProps {
  placeModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
}

const Remark: React.FC<AddModalProps> = ({ placeModal, setPlaceModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (selectedRow?.workNo?.remark) {
      setRemark(selectedRow.workNo.remark);
    } else {
      setRemark('');
    }
  }, [selectedRow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!remark) {
      toast.error('Remark is required');
      return;
    }

    try {
      const payload = {
        id: selectedRow?.workNo?.id || null,
        po_id: selectedRow?.id,
        remark: remark,
      };

      const result = await dispatch(addRemark(payload)).unwrap();

      toast.success(result?.message || 'Remark submitted!');
      setPlaceModal(false);
      setRemark('');
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
      <ModalHeader className="pb-0">Add Remark</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Label htmlFor="remark" value="Remark" />
            <span className="text-red-700 ps-1">*</span>

            <Textarea
              id="remark"
              placeholder="Enter Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
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

export default Remark;
