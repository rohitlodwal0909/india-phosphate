import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addFpr } from 'src/features/Inventorymodule/FPR/FprSlice';

interface AddModalProps {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  rowData: any;
  setOnreload: React.Dispatch<React.SetStateAction<boolean>>;
}

const Addmodal: React.FC<AddModalProps> = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  rowData,
  setOnreload,
}) => {
  const dispatch = useDispatch<any>();

  const releases = Array.isArray(rowData?.batch_releases) ? rowData.batch_releases : [];
  const batchQuantity = Number(rowData?.actual_batch_quantity || 0);
  const releasedQuantity = releases.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);
  const remainingQuantity = Math.max(0, batchQuantity - releasedQuantity);
  const [releaseNo, setReleaseNo] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!releaseNo) {
      toast.error('Release No is required');
      return;
    }
    if (!releaseDate) {
      toast.error('Release Date is required');
      return;
    }
    const releaseQty = Number(quantity);
    if (!Number.isFinite(releaseQty) || releaseQty <= 0) {
      toast.error('Enter a quantity greater than zero');
      return;
    }
    if (releaseQty > remainingQuantity) {
      toast.error(`Quantity cannot exceed the remaining batch quantity of ${remainingQuantity}`);
      return;
    }

    try {
      const payload = {
        batch_id: rowData?.id || '',
        release_no: releaseNo,
        release_date: releaseDate,
        quantity: releaseQty,
      };

      const result = await dispatch(addFpr(payload)).unwrap();

      toast.success(result?.message || 'Release data submitted!');
      setPlaceModal(false);
      setOnreload(true);
      setReleaseNo('');
      setReleaseDate('');
      setQuantity('');
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  return (
    <Modal
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="large"
    >
      <ModalHeader className="pb-0">Add FPR Entry</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          <div className="col-span-12 rounded bg-gray-50 p-3 text-sm">
            Actual finished batch quantity: <b>{batchQuantity}</b> · Already released: <b>{releasedQuantity}</b> · Remaining: <b>{remainingQuantity}</b>
          </div>
          {/* Release No */}
          <div className="col-span-12">
            <Label htmlFor="release_no" value="Release No" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="release_no"
              type="text"
              placeholder="Enter Release No"
              value={releaseNo}
              onChange={(e) => setReleaseNo(e.target.value)}
              required
            />
          </div>

          <div className="col-span-12">
            <Label htmlFor="quantity" value="Release Quantity" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput id="quantity" type="number" min="0.01" max={remainingQuantity} step="0.01"
              value={quantity} onChange={(e) => setQuantity(e.target.value)} required disabled={remainingQuantity <= 0} />
          </div>

          {/* Release Date */}
          <div className="col-span-12">
            <Label htmlFor="release_date" value="Release Date" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="release_date"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-4">
            <Button type="button" color="error" onClick={() => setPlaceModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={remainingQuantity <= 0}>
              Add FPR
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default Addmodal;
