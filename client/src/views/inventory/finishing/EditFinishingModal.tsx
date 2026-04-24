import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';

interface FinishingEditModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
  handleupdatedentry: any;
  permissions: any;
}

const EditFinishingModal: React.FC<FinishingEditModalProps> = ({
  openModal,
  setOpenModal,
  selectedRow,
  handleupdatedentry,
  permissions,
}) => {
  const [batchNumber, setBatchNumber] = useState('');
  const canAdd = permissions?.add;
  const canEdit = permissions?.edit;
  const qty = selectedRow?.rm_quantity;

  const [rows, setRows] = useState<any[]>([
    {
      id: null,
      finish_quantity: '',
      unfinish_quantity: '',
      time: '',
      isNew: true,
    },
  ]);

  // LOAD EDIT DATA
  useEffect(() => {
    if (selectedRow?.finishing_entries?.length) {
      const row = selectedRow.finishing_entries[0];

      setBatchNumber(row?.batch_number || '');

      const mappedRows =
        row.FinishQties?.map((f: any) => ({
          id: f.id,
          finish_quantity: f.finishing_qty,
          unfinish_quantity: f.unfinishing_qty,
          time: f.time,
          isNew: false,
        })) || [];

      setRows(mappedRows);
    }
  }, [selectedRow]);

  // CHANGE HANDLER
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name !== 'time' && Number(value) < 0) return;

    const updated = [...rows];
    updated[index][name] = value;

    // 👉 Calculate total after change
    const totalFinished = updated.reduce((sum, r) => sum + Number(r.finish_quantity || 0), 0);

    if (totalFinished > qty) {
      alert(`Total finished cannot exceed ${qty}`);
      return;
    }

    setRows(updated);
  };

  // ADD ROW
  const addRow = () => {
    setRows([
      ...rows,
      {
        id: null,
        finish_quantity: '',
        unfinish_quantity: '',
        time: '',
        isNew: true, // 👈 new row
      },
    ]);
  };

  // REMOVE ROW
  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setOpenModal(false);

    // Reset Properly
    setRows([
      {
        id: null,
        finish_quantity: '',
        unfinish_quantity: '',
        time: '',
      },
    ]);

    setBatchNumber('');
  };

  const totalFinished = rows.reduce((sum, r) => sum + Number(r.finish_quantity || 0), 0);

  // SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const invalid = rows.some((r) => !r.finish_quantity || !r.unfinish_quantity);

    if (invalid) {
      alert('Fill all quantities');
      return;
    }

    const totalFinished = rows.reduce((sum, r) => sum + Number(r.finish_quantity || 0), 0);

    if (totalFinished > qty) {
      alert(`Finished quantity cannot exceed ${qty}`);
      return;
    }

    handleupdatedentry({
      batch_number: batchNumber,
      finishing: rows,
    });

    closeModal();
  };

  return (
    <Modal show={openModal} onClose={closeModal} size="3xl">
      <Modal.Header>Edit Finishing Entry</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Batch Number */}

          <p className="text-sm text-gray-600">Remaining: {qty - totalFinished}</p>

          {rows.map((row, index) => (
            <div
              key={index}
              className={`grid gap-4 border p-3 rounded ${
                row.isNew ? 'grid-cols-8' : 'grid-cols-12'
              }`}
            >
              {/* Finish Qty */}
              <div className="col-span-3">
                <Label value="Finish Qty" />
                <TextInput
                  type="number"
                  name="finish_quantity"
                  disabled={!row.isNew && !canEdit}
                  value={row.finish_quantity}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              {/* Unfinish Qty */}
              <div className="col-span-3">
                <Label value="Unfinish Qty" />
                <TextInput
                  type="number"
                  name="unfinish_quantity"
                  disabled={!row.isNew && !canEdit}
                  value={row.unfinish_quantity}
                  onChange={(e) => handleChange(index, e)}
                />
              </div>

              {/* Date Time */}
              {!row.isNew && (
                <div className="col-span-5">
                  <Label value="Date Time" />
                  <TextInput
                    type="datetime-local"
                    name="time"
                    disabled={!canEdit}
                    value={row.time ? row.time.replace(' ', 'T') : ''}
                    onChange={(e) => handleChange(index, e)}
                  />
                </div>
              )}

              {/* Remove */}
              <div className="col-span-1 flex items-end">
                {row.isNew && rows.length > 1 && (
                  <Button color="failure" type="button" onClick={() => removeRow(index)}>
                    <Icon icon="solar:trash-bin-minimalistic-outline" height={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {canAdd && (
            <Button type="button" color="success" onClick={addRow}>
              + Add More
            </Button>
          )}

          <div className="flex justify-end gap-2">
            <Button color="gray" onClick={closeModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditFinishingModal;
