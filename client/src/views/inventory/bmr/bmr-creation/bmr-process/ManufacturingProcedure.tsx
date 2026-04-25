import { Accordion, Button, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useEffect, useState, useRef } from 'react';
import { saveManufacturingProcedure } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

const ManufacturingProcedure = ({ data = [], users = [], proce = [], isReadOnly }) => {
  const dispatch = useDispatch<any>();
  const { id } = useParams();

  /* ================= REFS ================= */
  const timeFromRef = useRef<any>({});
  const timeToRef = useRef<any>({});
  const dateTimeRef = useRef<any>({});

  /* ================= OPTIONS ================= */
  const userOptions = users.map((u: any) => ({
    value: u.id,
    label: u.name || u.username,
  }));

  const processingSteps = data.map((s: any) => ({
    value: s.id,
    label: s.name,
    perameters: s.perameters,
  }));

  const selectStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  };

  /* ================= STATE ================= */
  const defaultRow = {
    id: null,
    step_name: '',
    value: '',
    actualQty: '',
    timeFrom: '',
    timeTo: '',
    datetime: '',
    temp: '',
    ph: '',
    spGravity: '',
    doneBy: '',
    checkedBy: null,
  };

  const [rows, setRows] = useState<any[]>([defaultRow]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!proce?.length) return;

    const mappedRows = proce.map((item: any) => ({
      id: item.id,
      step_name: item.step_name,
      value: item.value || '',
      actualQty: item.actual_qty || '',
      timeFrom: item.time_from || '',
      timeTo: item.time_to || '',
      datetime: item.datetime || '',
      temp: item.temp || '',
      ph: item.ph || '',
      spGravity: item.sp_gravity || '',
      doneBy: item.done_by || '',
      checkedBy: userOptions.find((u) => u.value === item.checked_by) || null,
    }));

    setRows(mappedRows);
  }, [proce]);

  /* ================= HANDLERS ================= */

  const handleChange = (index: number, field: string, value: any) => {
    setRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...defaultRow }]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  /* ===== Processing Step Auto Generate ===== */

  const handleChangePro = (selected: any) => {
    if (!selected?.perameters) return setRows([]);

    try {
      const parsed = JSON.parse(selected.perameters);

      const generatedRows = parsed.map((param: string) => ({
        ...defaultRow,
        step_name: param,
      }));

      setRows(generatedRows);
    } catch {
      setRows([]);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const invalid = rows.some((r) => !r.step_name);

    if (invalid) {
      toast.error('Processing Step missing');
      return;
    }

    const payload = {
      manufacturing_procedure: rows.map((row) => ({
        id: row.id || null,
        bmr_id: id,
        step_name: row.step_name,
        value: row.value,
        actual_qty: row.actualQty,
        time_from: row.timeFrom,
        time_to: row.timeTo,
        datetime: row.datetime,
        temp: row.temp,
        ph: row.ph,
        sp_gravity: row.spGravity,
        done_by: row.doneBy,
        checked_by: row.checkedBy?.value || null,
      })),
    };

    try {
      await dispatch(saveManufacturingProcedure(payload)).unwrap();
      toast.success('Manufacturing procedure saved');
    } catch {
      toast.error('Something went wrong');
    }
  };

  /* ================= UI ================= */

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>5. Manufacturing Procedure</Accordion.Title>

        {isReadOnly && (
          <Accordion.Content>
            {/* Processing Step Select */}
            <div className="m-3 w-[300px]">
              <Select
                options={processingSteps}
                onChange={handleChangePro}
                styles={selectStyles}
                menuPortalTarget={document.body}
              />
            </div>

            <div className="border rounded-md p-4 overflow-x-auto">
              <table className="w-full text-[14px] font-medium border">
                {' '}
                <thead className="bg-gray-100 font-semibold text-gray-700">
                  <tr>
                    <th className="border p-2 min-w-[280px]">Processing Step</th>
                    <th className="border p-2">Value</th>
                    <th className="border p-2">Actual Qty</th>
                    <th className="border p-2">Time From</th>
                    <th className="border p-2">Time To</th>
                    <th className="border p-2">Date & Time</th>
                    <th className="border p-2">Temp</th>
                    <th className="border p-2">pH</th>
                    <th className="border p-2">Sp. Gravity</th>
                    <th className="border p-2">Done By</th>
                    <th className="border p-2 min-w-[130px]">Checked By</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-1">
                        <TextInput
                          sizing="sm"
                          value={row.step_name}
                          readOnly
                          className="bg-gray-100"
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

                      {/* TIME FROM */}
                      <td className="border p-1">
                        <TextInput
                          ref={(el) => (timeFromRef.current[index] = el)}
                          type="time"
                          sizing="sm"
                          value={row.timeFrom}
                          onChange={(e) => handleChange(index, 'timeFrom', e.target.value)}
                          onFocus={(e) => e.target.showPicker?.()}
                        />
                      </td>

                      {/* TIME TO */}
                      <td className="border p-1">
                        <TextInput
                          ref={(el) => (timeToRef.current[index] = el)}
                          type="time"
                          sizing="sm"
                          value={row.timeTo}
                          onChange={(e) => handleChange(index, 'timeTo', e.target.value)}
                          onFocus={(e) => e.target.showPicker?.()}
                        />
                      </td>

                      {/* DATE TIME */}
                      <td className="border p-1">
                        <TextInput
                          ref={(el) => (dateTimeRef.current[index] = el)}
                          type="datetime-local"
                          sizing="sm"
                          value={row.datetime}
                          onChange={(e) => handleChange(index, 'datetime', e.target.value)}
                          onFocus={(e) => e.target.showPicker?.()}
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

                      <td className="border p-1">
                        <TextInput
                          sizing="sm"
                          value={row.doneBy}
                          onChange={(e) => handleChange(index, 'doneBy', e.target.value)}
                        />
                      </td>

                      <td className="border p-1">
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
