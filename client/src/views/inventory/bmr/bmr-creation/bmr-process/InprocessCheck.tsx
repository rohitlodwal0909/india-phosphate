import { useEffect, useState } from 'react';
import { Accordion, Button, Label, TextInput, Table, Tooltip } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { inprocessCheck } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const InprocessCheck = ({ users, data }) => {
  const dispatch = useDispatch<any>();
  const { id } = useParams();
  const [date, setDate] = useState('');

  /* ================= USERS ================= */
  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  /* ================= KEY POINTS ================= */
  const [keyPoints, setKeyPoints] = useState([
    { point: 'Black Particle', status: '' },
    { point: 'pH', status: '' },
  ]);

  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, { point: '', status: '' }]);
  };

  const updateKeyPoint = (index, field, value) => {
    const updated = [...keyPoints];
    updated[index][field] = value;
    setKeyPoints(updated);
  };

  const removeKeyPoint = (index) => {
    if (keyPoints.length === 1) return;
    const updated = [...keyPoints];
    updated.splice(index, 1);
    setKeyPoints(updated);
  };

  /* ================= TABLE ROWS ================= */
  const [rows, setRows] = useState([
    {
      parameter: '',
      result: '',
      time: '',
      checkedBy: null,
    },
  ]);

  useEffect(() => {
    if (data) {
      if (data?.date) {
        setDate(data.date); // YYYY-MM-DD
      }
      // 🔹 key points
      if (data.key_points) {
        const parsedKeyPoints =
          typeof data.key_points === 'string' ? JSON.parse(data.key_points) : data.key_points;

        setKeyPoints(parsedKeyPoints);
      }

      // 🔹 records
      if (data.records) {
        const parsedRecords =
          typeof data.records === 'string' ? JSON.parse(data.records) : data.records;

        setRows(
          parsedRecords.map((r) => ({
            parameter: r.parameter || '',
            result: r.result || '',
            time: r.time || '',
            checkedBy: r.checked_by ? userOptions.find((u) => u.value === r.checked_by) : null,
          })),
        );
      }
    }
  }, [data, users]);

  const addRow = () => {
    setRows([...rows, { parameter: '', result: '', time: '', checkedBy: null }]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        id: data?.id,
        bmr_id: id,
        date,
        key_points: keyPoints,
        records: rows.map((r) => ({
          parameter: r.parameter,
          result: r.result,
          time: r.time,
          checked_by: r.checkedBy?.value || null,
        })),
      };

      await dispatch(inprocessCheck(payload)).unwrap();

      toast.success(
        data?.id ? 'Inprocess check updated successfully' : 'Inprocess check saved successfully',
      );
    } catch (error) {
      toast.error(error?.message || 'Failed to save inprocess check');
    }
  };

  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>7. Inprocess Check</Accordion.Title>

          <Accordion.Content>
            {/* ================= DATE ================= */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Date" />
                <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            {/* ================= KEY POINTS ================= */}
            <div className="border p-4 rounded-md mb-6 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Key Points</h4>
                <Button color="success" size="xs" onClick={addKeyPoint}>
                  + Add
                </Button>
              </div>

              <div className="space-y-3">
                {keyPoints.map((kp, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 md:col-span-6">
                      <TextInput
                        placeholder="Enter key point"
                        value={kp.point}
                        onChange={(e) => updateKeyPoint(index, 'point', e.target.value)}
                      />
                    </div>

                    <div className="col-span-8 md:col-span-4 flex gap-4">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name={`kp-${index}`}
                          checked={kp.status === 'yes'}
                          onChange={() => updateKeyPoint(index, 'status', 'yes')}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name={`kp-${index}`}
                          checked={kp.status === 'no'}
                          onChange={() => updateKeyPoint(index, 'status', 'no')}
                        />
                        No
                      </label>
                    </div>

                    <div className="col-span-4 md:col-span-2 text-right">
                      {keyPoints.length > 1 && (
                        <Button size="xs" color="failure" onClick={() => removeKeyPoint(index)}>
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">
              <Table striped className="border">
                <Table.Head>
                  <Table.HeadCell>S. No</Table.HeadCell>
                  <Table.HeadCell>Parameter</Table.HeadCell>
                  <Table.HeadCell>Result</Table.HeadCell>
                  <Table.HeadCell>Time</Table.HeadCell>
                  <Table.HeadCell>Checked By</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {rows.map((row, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>

                      <Table.Cell>
                        <TextInput
                          placeholder="Enter parameter"
                          value={row.parameter}
                          onChange={(e) => handleRowChange(index, 'parameter', e.target.value)}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <TextInput
                          placeholder="Result"
                          value={row.result}
                          onChange={(e) => handleRowChange(index, 'result', e.target.value)}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <TextInput
                          type="time"
                          value={row.time}
                          onChange={(e) => handleRowChange(index, 'time', e.target.value)}
                        />
                      </Table.Cell>

                      <Table.Cell className="min-w-[180px]">
                        <Select
                          placeholder="Checked By"
                          options={userOptions}
                          value={row.checkedBy}
                          onChange={(opt) => handleRowChange(index, 'checkedBy', opt)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        {rows.length > 1 && (
                          <Tooltip content="Remove Row">
                            <Button size="xs" color="failure" onClick={() => removeRow(index)}>
                              ✕
                            </Button>
                          </Tooltip>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <Button color="success" onClick={addRow}>
                + Add Row
              </Button>

              <div className="flex gap-3">
                <Button color="gray">Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default InprocessCheck;
