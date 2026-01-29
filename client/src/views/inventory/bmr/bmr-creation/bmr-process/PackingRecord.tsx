import { Accordion, Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Icon } from '@iconify/react';

const PackingRecord = () => {
  const [rows, setRows] = useState([{ gross: '', tare: '', net: 0 }]);

  // ADD ROW
  const addRow = () => {
    setRows([...rows, { gross: '', tare: '', net: 0 }]);
  };

  // REMOVE ROW
  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  // HANDLE CHANGE + AUTO CALC
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    const gross = parseFloat(updated[index].gross) || 0;
    const tare = parseFloat(updated[index].tare) || 0;

    updated[index].net = gross + tare;

    setRows(updated);
  };

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>10. Packing Record</Accordion.Title>

        <Accordion.Content>
          <div className="border rounded-md p-4 space-y-6 text-dark">
            <p className="text-sm">
              Pack the final product in 25/50 kg HDPE & LDPE bag / HDPE drum / White plain bag.
              Weigh randomly.
            </p>

            {/* HEADER */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Date" />
                <TextInput type="date" />
              </div>
              <div className="col-span-6">
                <Label value="Batch No." />
                <TextInput />
              </div>

              <div className="col-span-6">
                <Label value="Time From" />
                <TextInput type="time" />
              </div>
              <div className="col-span-6">
                <Label value="Time To" />
                <TextInput type="time" />
              </div>
            </div>

            {/* WEIGHT TABLE */}
            <div className="space-y-3">
              <Label value="Packing Weights (Kg)" />

              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-3">
                    <Label value="Gross Weight (Kg)" />
                    <TextInput
                      placeholder="Gross Weight"
                      value={row.gross}
                      onChange={(e) => handleChange(index, 'gross', e.target.value)}
                    />
                  </div>

                  <div className="col-span-3">
                    <Label value="Tare Weight (Kg)" />

                    <TextInput
                      placeholder="Tare Weight"
                      value={row.tare}
                      onChange={(e) => handleChange(index, 'tare', e.target.value)}
                    />
                  </div>

                  <div className="col-span-3">
                    <Label value="Net Weight (Kg)" />

                    <TextInput placeholder="Net Weight" value={row.net} readOnly />
                  </div>

                  <div className="col-span-3 flex gap-2">
                    <Button color="success" size="sm" onClick={addRow}>
                      <Icon icon="material-symbols:add-rounded" />
                    </Button>

                    {rows.length > 1 && (
                      <Button color="failure" size="sm" onClick={() => removeRow(index)}>
                        <Icon icon="material-symbols:delete-outline" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button color="gray">Cancel</Button>
              <Button>Submit</Button>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};

export default PackingRecord;
