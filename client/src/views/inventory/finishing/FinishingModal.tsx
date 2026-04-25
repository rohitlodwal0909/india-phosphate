import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';

interface VehicleDispatchModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
  handlesubmit: (data: any) => void;
}

const FinishingModal: React.FC<VehicleDispatchModalProps> = ({
  openModal,
  setOpenModal,
  selectedRow,
  handlesubmit,
}) => {
  const [batchNumber, setBatchNumber] = useState('');
  const qty = selectedRow?.rm_quantity;

  const [rows, setRows] = useState([{ finish_quantity: '', unfinish_quantity: '' }]);

  // Set batch number
  useEffect(() => {
    if (selectedRow?.batch_id) {
      setBatchNumber(selectedRow.batch_id);
    }
  }, [selectedRow]);

  // Change
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (Number(value) < 0) return;

    const updated = [...rows];
    updated[index][name] = value;
    setRows(updated);

    if (value > qty) {
      alert(`Total finished cannot exceed ${qty}`);
      return;
    }
  };

  // Add Row
  const addRow = () => {
    setRows([...rows, { finish_quantity: '', unfinish_quantity: '' }]);
  };

  // Remove Row
  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setOpenModal(false);
    setRows([{ finish_quantity: '', unfinish_quantity: '' }]);
    setBatchNumber('');
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = rows.some((r) => !r.finish_quantity || !r.unfinish_quantity);

    if (invalid) {
      alert('Fill all quantities');
      return;
    }

    handlesubmit({
      batch_number: batchNumber,
      finishing: rows,
    });

    closeModal();
  };

  return (
    <Modal show={openModal} onClose={closeModal} size="2xl">
      <Modal.Header>Check Finishing</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Multiple Rows */}
          {rows.map((row, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 border p-3 rounded">
              <div className="col-span-5">
                <Label value="Finish Quantity" />
                <TextInput
                  type="number"
                  name="finish_quantity"
                  value={row.finish_quantity}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              <div className="col-span-5">
                <Label value="Unfinish Quantity" />
                <TextInput
                  type="number"
                  name="unfinish_quantity"
                  value={row.unfinish_quantity}
                  onChange={(e) => handleChange(index, e)}
                  required
                />
              </div>

              <div className="col-span-2 flex items-end">
                {rows.length > 1 && (
                  <Button color="failure" type="button" onClick={() => removeRow(index)}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button type="button" color="success" onClick={addRow}>
            + Add More
          </Button>

          <div className="flex justify-end gap-2">
            <Button type="button" color="gray" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default FinishingModal;
