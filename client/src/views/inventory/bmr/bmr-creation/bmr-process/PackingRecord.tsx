import { Accordion, Button, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { savePackingRecord } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

const PackingRecord = ({ bmr, data, isReadOnly }) => {
  const dispatch = useDispatch<any>();

  const { id } = useParams();

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

  const [form, setForm] = useState({
    id: null,
    date: '',
    timeFrom: '',
    timeTo: '',
  });
  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        date: data.date || '',
        timeFrom: data.time_from || '',
        timeTo: data.time_to || '',
      });

      if (data.packing_weights) {
        const parsedWeights =
          typeof data.packing_weights === 'string'
            ? JSON.parse(data.packing_weights)
            : data.packing_weights;

        setRows(
          parsedWeights.map((row) => ({
            gross: row.gross || '',
            tare: row.tare || '',
            net: row.net || 0,
          })),
        );
      }
    }
  }, [data]);

  // HANDLE CHANGE + AUTO CALC
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    const gross = parseFloat(updated[index].gross) || 0;
    const tare = parseFloat(updated[index].tare) || 0;

    updated[index].net = gross - tare;

    setRows(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      id: form.id,
      bmr_id: id,
      date: form.date,
      time_from: form.timeFrom,
      time_to: form.timeTo,
      packing_weights: rows,
    };

    try {
      await dispatch(savePackingRecord(payload)).unwrap();
      toast.success(
        form.id ? 'Packing record updated successfully' : 'Packing record saved successfully',
      );
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>10. Packing Record</Accordion.Title>

        {isReadOnly && (
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
                  <TextInput
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="col-span-6">
                  <Label value="Batch No." />
                  <TextInput value={bmr?.records?.qc_batch_number} readOnly />
                </div>

                <div className="col-span-6">
                  <Label value="Time From" />
                  <input
                    type="time"
                    value={form.timeFrom}
                    onChange={(e) => setForm({ ...form, timeFrom: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  />
                </div>
                <div className="col-span-6">
                  <Label value="Time To" />
                  <input
                    type="time"
                    value={form.timeTo}
                    onChange={(e) => setForm({ ...form, timeTo: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  />
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
                <Button color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </Accordion.Content>
        )}
      </Accordion.Panel>
    </Accordion>
  );
};

export default PackingRecord;
