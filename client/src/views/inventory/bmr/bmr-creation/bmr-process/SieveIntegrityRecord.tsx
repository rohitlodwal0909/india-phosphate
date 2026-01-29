import { useEffect, useState } from 'react';
import { Accordion, Button, Label, TextInput, Table, Tooltip } from 'flowbite-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { saveSieveIntegrityRecord } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { useParams } from 'react-router';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const SieveIntegrityRecord = ({ bmr, users, data }) => {
  const { id } = useParams();
  /* ================= USERS OPTIONS ================= */

  const dispatch = useDispatch<any>();

  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  /* ================= ROW STATE ================= */
  const [rows, setRows] = useState([
    {
      id: null,
      time: '',
      status: '',
      result: '',
      checkedBy: null,
      remark: '',
    },
  ]);

  useEffect(() => {
    if (data?.length) {
      setRows(
        data.map((item) => ({
          id: item.id, // 👈 IMPORTANT for update
          time: item.time || '',
          status: item.sieve_status || '',
          result: item.result || '',
          checkedBy:
            users
              ?.map((u) => ({ value: u.id, label: u.name || u.username }))
              .find((u) => u.value === item.checked_by) || null,
          remark: item.remark || '',
        })),
      );
    }
  }, [data, users]);

  /* ================= HANDLERS ================= */
  const addRow = () => {
    setRows([
      ...rows,
      {
        id: null,
        time: '',
        status: '',
        result: '',
        checkedBy: null,
        remark: '',
      },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSubmit = async () => {
    const payload = rows.map((r) => ({
      id: r.id || null, // 👈 id aaya to UPDATE
      bmr_id: id,
      time: r.time,
      sieve_status: r.status,
      result: r.result,
      checked_by: r.checkedBy?.value || null,
      remark: r.remark,
    }));

    try {
      await dispatch(saveSieveIntegrityRecord(payload)).unwrap();
      toast.success('Sieve integrity record saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>6. Sieve Integrity Record</Accordion.Title>

          <Accordion.Content>
            {/* ================= TOP INFO ================= */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Product Name" />
                <TextInput
                  placeholder="Enter product name"
                  value={bmr?.records?.product_name || ''}
                  readOnly
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Batch No" />
                <TextInput
                  placeholder="Enter batch no"
                  value={bmr?.records?.qc_batch_number || ''}
                  readOnly
                />
              </div>
            </div>

            {/* ================= FREQUENCY ================= */}
            <div className="border p-4 rounded-md mb-6 bg-gray-50">
              <h4 className="font-semibold mb-2">Frequency:</h4>
              <ul className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                <li>Before Shifting</li>
                <li>Every 1 hr.</li>
                <li>End of sifting</li>
              </ul>
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">
              <Table striped className="border">
                <Table.Head>
                  <Table.HeadCell>S. No</Table.HeadCell>
                  <Table.HeadCell>Time</Table.HeadCell>
                  <Table.HeadCell>Sieve Status (Broken / Not Broken)</Table.HeadCell>
                  <Table.HeadCell>Pass / Fail</Table.HeadCell>
                  <Table.HeadCell>Checked By</Table.HeadCell>
                  <Table.HeadCell>Remark</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {rows.map((row, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>

                      <Table.Cell>
                        <TextInput
                          type="time"
                          value={row.time}
                          onChange={(e) => handleChange(index, 'time', e.target.value)}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <TextInput
                          placeholder="Broken / Not Broken"
                          value={row.status}
                          onChange={(e) => handleChange(index, 'status', e.target.value)}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <Select
                          placeholder="Pass / Fail"
                          options={[
                            { value: 'pass', label: 'Pass' },
                            { value: 'fail', label: 'Fail' },
                          ]}
                          value={row.result ? { value: row.result, label: row.result } : null}
                          onChange={(opt) => handleChange(index, 'result', opt.value)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      <Table.Cell className="min-w-[180px]">
                        <Select
                          placeholder="Checked By"
                          options={userOptions}
                          value={row.checkedBy}
                          onChange={(opt) => handleChange(index, 'checkedBy', opt)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <TextInput
                          placeholder="Remark"
                          value={row.remark}
                          onChange={(e) => handleChange(index, 'remark', e.target.value)}
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

export default SieveIntegrityRecord;
