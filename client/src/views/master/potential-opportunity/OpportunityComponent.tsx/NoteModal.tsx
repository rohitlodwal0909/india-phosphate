import { Button, Modal, ModalBody, ModalHeader, Label, Textarea, Select } from 'flowbite-react';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addpotentialNote } from 'src/features/master/Customer/PotentialOpportunitySlice';

interface AddModalProps {
  placeModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
}

const Note: React.FC<AddModalProps> = ({ placeModal, setPlaceModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'Enquiry' | 'Close' | ''>('');

  useEffect(() => {
    if (selectedRow?.note) {
      setNote(selectedRow.note);
    } else {
      setNote('');
    }

    setStatus(selectedRow?.status || '');
  }, [selectedRow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!status) {
      toast.error('Status is required');
      return;
    }

    if (!note) {
      toast.error('Note is required');
      return;
    }

    try {
      const payload = {
        id: selectedRow?.id || null,
        note,
        status,
      };

      const result = await dispatch(addpotentialNote(payload)).unwrap();

      toast.success(result?.message || 'Saved successfully!');
      setPlaceModal(false);
      setNote('');
      setStatus('');
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <Modal show={placeModal} position="center" onClose={() => setPlaceModal(false)}>
      <ModalHeader className="pb-0">Add Note</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          {/* STATUS */}
          <div className="col-span-12">
            <Label value="Status" />
            <span className="text-red-700 ps-1">*</span>

            <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="">Select Status</option>
              <option value="Enquiry">Enquiry</option>
              <option value="Close">Close</option>
            </Select>
          </div>

          {/* NOTE */}
          <div className="col-span-12">
            <Label value="Note" />
            <span className="text-red-700 ps-1">*</span>

            <Textarea
              placeholder="Enter Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          {/* BUTTONS */}
          <div className="col-span-12 flex justify-end gap-4">
            <Button type="button" color="failure" onClick={() => setPlaceModal(false)}>
              Cancel
            </Button>

            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default Note;
