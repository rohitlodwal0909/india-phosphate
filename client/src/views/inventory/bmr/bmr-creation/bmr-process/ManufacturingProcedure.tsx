import { Accordion, Button, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { saveManufacturingProcedure } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

const ManufacturingProcedure = ({ data = [], users = [], proce = [], isReadOnly }) => {
  const selectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };
  const dispatch = useDispatch<any>();

  const { id } = useParams();

  const [rows, setRows] = useState([
    {
      id: null,
      stepId: null,
      actualQty: '',
      value: '',
      timeFrom: '',
      timeTo: '',
      temp: '',
      ph: '',
      spGravity: '',
      doneBy: null,
      checkedBy: null,
    },
  ]);

  useEffect(() => {
    if (proce && proce.length > 0) {
      const mappedRows = proce.map((item) => ({
        id: item.id,
        stepId: processingSteps.find((s) => s.value === item.step_id) || null,
        value: item.value || '',
        actualQty: item.actual_qty || '',
        timeFrom: item.time_from || '',
        timeTo: item.time_to || '',
        temp: item.temp || '',
        ph: item.ph || '',
        spGravity: item.sp_gravity || '',
        doneBy: userOptions.find((u) => u.value === item.done_by) || null,
        checkedBy: userOptions.find((u) => u.value === item.checked_by) || null,
      }));

      setRows(mappedRows);
    }
  }, [proce]);

  /* ===== OPTIONS ===== */
  const userOptions = users.map((u) => ({
    value: u.id,
    label: u.name || u.username,
  }));

  const processingSteps = data.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  /* ===== HANDLERS ===== */
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: null,
        stepId: null,
        actualQty: '',
        value: '',
        timeFrom: '',
        timeTo: '',
        temp: '',
        ph: '',
        spGravity: '',
        doneBy: null,
        checkedBy: null,
      },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    const invalidRow = rows.find((row) => !row.stepId);
    if (invalidRow) {
      alert('Please select Processing Step in all rows');
      return;
    }

    const payload = {
      manufacturing_procedure: rows.map((row) => ({
        id: row.id || null,
        bmr_id: id,
        step_id: row.stepId.value,
        value: row.value,
        actual_qty: row.actualQty,
        time_from: row.timeFrom,
        time_to: row.timeTo,
        temp: row.temp,
        ph: row.ph,
        sp_gravity: row.spGravity,
        done_by: row.doneBy?.value || null,
        checked_by: row.checkedBy?.value || null,
      })),
    };

    try {
      await dispatch(saveManufacturingProcedure(payload)).unwrap();
      toast.success('Manufacturing Procedure');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>5. Manufacturing Procedure</Accordion.Title>
        {isReadOnly && (
          <Accordion.Content>
            <div className="border rounded-md p-4 overflow-x-auto text-dark">
              <table className="w-full text-sm border-collapse border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 min-w-[220px]">Processing Step</th>
                    <th className="border p-2">Value</th>
                    <th className="border p-2">Actual Qty</th>
                    <th className="border p-2">Time From</th>
                    <th className="border p-2">Time To</th>
                    <th className="border p-2">Temp</th>
                    <th className="border p-2">pH</th>
                    <th className="border p-2">Sp. Gravity</th>
                    <th className="border p-2 min-w-[160px]">Done By</th>
                    <th className="border p-2 min-w-[160px]">Checked By</th>
                    <th className="border p-2 w-[90px]">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-1">
                        <Select
                          options={processingSteps}
                          value={row.stepId}
                          onChange={(val) => handleChange(index, 'stepId', val)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </td>

                      <td className="border p-1">
                        <TextInput
                          sizing="sm"
                          value={row.value}
                          onChange={(e) => handleChange(index, 'value', e.target.value)}
                        />
                      </td>

                      <td className="border p-1">
                        <TextInput
                          sizing="sm"
                          value={row.actualQty}
                          onChange={(e) => handleChange(index, 'actualQty', e.target.value)}
                        />
                      </td>

                      <td className="border p-1">
                        <TextInput
                          type="time"
                          sizing="sm"
                          value={row.timeFrom}
                          onChange={(e) => handleChange(index, 'timeFrom', e.target.value)}
                        />
                      </td>

                      <td className="border p-1">
                        <TextInput
                          type="time"
                          sizing="sm"
                          value={row.timeTo}
                          onChange={(e) => handleChange(index, 'timeTo', e.target.value)}
                        />
                      </td>

                      <td className="border p-1">
                        <TextInput
                          sizing="sm"
                          value={row.temp}
                          onChange={(e) => handleChange(index, 'temp', e.target.value)}
                        />
                      </td>

                      <td className="border p-1">
                        <TextInput
                          sizing="sm"
                          value={row.ph}
                          onChange={(e) => handleChange(index, 'ph', e.target.value)}
                        />
                      </td>

                      <td className="border p-1">
                        <TextInput
                          sizing="sm"
                          value={row.spGravity}
                          onChange={(e) => handleChange(index, 'spGravity', e.target.value)}
                        />
                      </td>

                      <td className="border p-1 min-w-[140px]">
                        <Select
                          options={userOptions}
                          value={row.doneBy}
                          onChange={(val) => handleChange(index, 'doneBy', val)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </td>

                      <td className="border p-1 min-w-[140px]">
                        <Select
                          options={userOptions}
                          value={row.checkedBy}
                          onChange={(val) => handleChange(index, 'checkedBy', val)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </td>

                      <td className="border p-1 text-center">
                        <Button
                          size="xs"
                          color="failure"
                          disabled={rows.length === 1}
                          onClick={() => removeRow(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between pt-4">
                <Button color="gray" onClick={addRow}>
                  + Add More
                </Button>

                <Button color="success" onClick={handleSubmit}>
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

export default ManufacturingProcedure;
