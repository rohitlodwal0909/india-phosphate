
import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';


interface FinishingEditModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;

  handleupdatedentry: any
}
const EditFinishingModal: React.FC<FinishingEditModalProps> = ({
  openModal,
  setOpenModal,
  selectedRow,
  handleupdatedentry
}) => {

  const [formData, setFormData] = useState({
    batch_number: '',
    finishing: '',
    unfinishing: '',
    finish_quantity: '',
    unfinish_quantity: '',
  });

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        batch_number: selectedRow?.finishing_entries[0]?.batch_number,
        finishing: selectedRow?.finishing_entries[0]?.finishing || '',
        unfinishing: selectedRow?.finishing_entries[0]?.unfinishing || '',
        finish_quantity: selectedRow?.finishing_entries[0]?.finish_quantity || '',
        unfinish_quantity: selectedRow?.finishing_entries[0]?.unfinish_quantity || ''
      });
    }
  }, [selectedRow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)

    handleupdatedentry(formData)
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Finishing Entry</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          <div className="col-span-6">
            <Label htmlFor="finishing" value="Finishing" />
            <TextInput
              id="finishing"
              name="finishing"
              value={formData.finishing}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-6">
            <Label htmlFor="finish_quantity" value="Finish Quantity" />
            <TextInput
              id="finish_quantity"
              name="finish_quantity"
              type="number"
              value={formData.finish_quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-6">
            <Label htmlFor="unfinishing" value="Unfinishing" />
            <TextInput
              id="unfinishing"
              name="unfinishing"
              value={formData.unfinishing}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-span-6">
            <Label htmlFor="unfinish_quantity" value="Unfinish Quantity" />
            <TextInput
              id="unfinish_quantity"
              name="unfinish_quantity"
              type="number"
              value={formData.unfinish_quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2 col-span-12">
            <Button type="button" color="gray" onClick={() => setOpenModal(false)}>
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

export default EditFinishingModal;