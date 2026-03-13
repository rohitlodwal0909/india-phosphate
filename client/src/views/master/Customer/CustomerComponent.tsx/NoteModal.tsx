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
import { addNote } from 'src/features/master/Customer/CustomerSlice';

interface AddModalProps {
  placeModal: boolean;
  setPlaceModal: (value: boolean) => void;
  selectedRow: any;
}

const Note: React.FC<AddModalProps> = ({ placeModal, setPlaceModal, selectedRow }) => {
  const dispatch = useDispatch<any>();

  const [note, setNote] = useState('');

  useEffect(() => {
    if (selectedRow?.note) {
      setNote(selectedRow.note);
    } else {
      setNote('');
    }
  }, [selectedRow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!note) {
      toast.error('Note is required');
      return;
    }

    try {
      const payload = {
        id: selectedRow?.id || null,
        note: note,
      };

      const result = await dispatch(addNote(payload)).unwrap();

      toast.success(result?.message || 'Note submitted!');
      setPlaceModal(false);
      setNote('');
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
      <ModalHeader className="pb-0">Add Note</ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Label htmlFor="note" value="Note" />
            <span className="text-red-700 ps-1">*</span>

            <Textarea
              id="note"
              placeholder="Enter Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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

export default Note;
