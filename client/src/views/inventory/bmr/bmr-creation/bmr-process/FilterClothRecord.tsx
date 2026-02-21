import { useEffect, useState } from 'react';
import { Accordion, Button, Label, TextInput, Table, Tooltip } from 'flowbite-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { saveFilterClothRecord } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { useParams } from 'react-router';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const FilterClothRecord = ({ bmr, users, data, isReadOnly }) => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();

  const userOptions = users?.map((u) => ({ value: u.id, label: u.name || u.username })) || [];
  const [recordDate, setRecordDate] = useState('');

  const [rows, setRows] = useState([
    {
      id: null,
      time: '',
      statusCracked: '',
      statusClean: '',
      result: '',
      checkedBy: null,
      remark: '',
    },
  ]);

  useEffect(() => {
    if (data?.length) {
      setRecordDate(data[0]?.date || '');

      setRows(
        data.map((item) => ({
          id: item.id,
          time: item.time || '',
          statusCracked: item.status_cracked || '',
          statusClean: item.status_clean || '',
          result: item.result || '',
          checkedBy: userOptions.find((u) => u.value === item.checked_by) || null,
          remark: item.remark || '',
        })),
      );
    }
  }, [data]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: null,
        time: '',
        statusCracked: '',
        statusClean: '',
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
      id: r.id || null,
      bmr_id: id,
      time: r.time,
      status_cracked: r.statusCracked,
      status_clean: r.statusClean,
      result: r.result,
      checked_by: r.checkedBy?.value || null,
      remark: r.remark,
      date: recordDate,
    }));

    try {
      await dispatch(saveFilterClothRecord(payload)).unwrap();
      toast.success('Filter Cloth record saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>7. Filter Cloth Record</Accordion.Title>

          {isReadOnly && (
            <Accordion.Content>
              {/* TOP INFO */}
              <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-12 sm:col-span-4">
                  <Label value="Product Name" />
                  <TextInput
                    placeholder="Enter product name"
                    value={bmr?.records?.product_name || ''}
                    readOnly
                  />
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <Label value="Batch No" />
                  <TextInput
                    placeholder="Enter batch no"
                    value={bmr?.records?.qc_batch_number || ''}
                    readOnly
                  />
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <Label value="Date" />
                  <TextInput
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                  />
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <Table striped className="border">
                  <Table.Head>
                    <Table.HeadCell>S. No</Table.HeadCell>
                    <Table.HeadCell>Time</Table.HeadCell>
                    <Table.HeadCell>Filter Cloth Status (Cracked / Not Cracked)</Table.HeadCell>
                    <Table.HeadCell>Filter Cloth Status (Clean / Not Clean)</Table.HeadCell>
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
                            placeholder="Cracked / Not Cracked"
                            value={row.statusCracked}
                            onChange={(e) => handleChange(index, 'statusCracked', e.target.value)}
                          />
                        </Table.Cell>

                        <Table.Cell>
                          <TextInput
                            placeholder="Clean / Not Clean"
                            value={row.statusClean}
                            onChange={(e) => handleChange(index, 'statusClean', e.target.value)}
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

              {/* ACTIONS */}
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
          )}
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default FilterClothRecord;
