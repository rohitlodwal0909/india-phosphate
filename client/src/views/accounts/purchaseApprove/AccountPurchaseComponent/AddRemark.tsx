import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addRemarkPurchasePo, getPurchasePo } from 'src/features/purchase/po/PurchasePoSlice';

interface RemarkProps {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
  selectedRow: any;
}

const Remark = ({ placeModal, setPlaceModal, selectedRow }: RemarkProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [remark, setRemark] = useState('');

  // ✅ Set remark when modal opens
  useEffect(() => {
    if (placeModal) {
      setRemark(selectedRow?.purchase_remark || '');
    }
  }, [placeModal, selectedRow]);

  // ✅ Submit handler
  const handleSubmit = async () => {
    if (!remark.trim()) return;

    try {
      await dispatch(
        addRemarkPurchasePo({
          id: selectedRow?.id,
          remark: remark.trim(),
        }),
      ).unwrap();
      toast.success('Remark added successfully!');
      dispatch(getPurchasePo());

      setPlaceModal(false); // close modal after success
    } catch (error) {
      console.error('Remark submit failed', error);
    }
  };

  return (
    <Modal show={placeModal} size="md" onClose={() => setPlaceModal(false)} popup>
      <ModalHeader />

      <ModalBody>
        <div className="text-center">
          <h3 className="mb-4 text-lg font-medium text-gray-700">Add Remark</h3>

          <textarea
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remark here..."
          />

          <div className="flex justify-center gap-4 mt-4">
            <Button color="gray" onClick={() => setPlaceModal(false)}>
              Cancel
            </Button>

            <Button color="primary" disabled={!remark.trim()} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Remark;
