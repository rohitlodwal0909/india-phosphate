import { Accordion, Label, TextInput, Button, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createQCIntimation } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { useParams } from 'react-router';
// import { createQualityControlIntimation } from '...'; // thunk

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const QualityControlIntimation = ({ users, data, isReadOnly }) => {
  const dispatch = useDispatch<any>();
  const { id } = useParams();

  /* ================= USERS OPTIONS ================= */
  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  /* ================= TOP INFO ================= */
  const [sampledBy, setSampledBy] = useState('');
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [checkedBy, setCheckedBy] = useState(null);

  /* ================= TABLE ================= */
  const [rows, setRows] = useState([
    { parameter: 'pH', limit: '', result: '' },
    { parameter: 'Water', limit: '', result: '' },
    { parameter: 'Loss on Drying', limit: '', result: '' },
    { parameter: 'Assay', limit: '', result: '' },
  ]);

  useEffect(() => {
    if (data) {
      // TOP INFO
      setSampledBy(data.sample_by || '');
      setDate(data.date || '');
      setQuantity(data.quantity_sampled || '');

      // CHECKED BY
      if (data.checked_by) {
        const user = userOptions.find((u) => u.value === data.checked_by);
        setCheckedBy(user || null);
      }

      // RESULTS TABLE
      if (data.results) {
        const parsedResults =
          typeof data.results === 'string' ? JSON.parse(data.results) : data.results;

        setRows(parsedResults.length ? parsedResults : [{ parameter: '', limit: '', result: '' }]);
      }
    }
  }, [data, users]);

  const removeRow = (index) => {
    if (rows.length === 1) return; // at least one row required
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { parameter: '', limit: '', result: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        id: data?.id || null,
        bmr_id: id,
        sampled_by: sampledBy,
        date,
        quantity_sampled: quantity,
        results: rows,
        checked_by: checkedBy?.value || null,
      };

      await dispatch(createQCIntimation(payload)).unwrap();

      toast.success(
        data?.id
          ? 'Quality Control Intimation updated successfully'
          : 'Quality Control Intimation saved successfully',
      );
    } catch (error) {
      toast.error(error?.message || 'Failed to save QC Intimation');
    }
  };

  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>8. Quality Control Intimation</Accordion.Title>

          {isReadOnly && (
            <Accordion.Content>
              <div className="border p-4 rounded-md space-y-6">
                {/* TOP INFO */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-4">
                    <Label value="Sampled By" />
                    <TextInput value={sampledBy} onChange={(e) => setSampledBy(e.target.value)} />
                  </div>

                  <div className="col-span-12 sm:col-span-4">
                    <Label value="Date" />
                    <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>

                  <div className="col-span-12 sm:col-span-4">
                    <Label value="Quantity Sampled" />
                    <TextInput value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                </div>

                {/* RESULT TABLE */}
                <div>
                  <h4 className="font-semibold mb-3">Result:</h4>

                  <div className="overflow-x-auto">
                    <Table striped className="border">
                      <Table.Head>
                        <Table.HeadCell>Parameter</Table.HeadCell>
                        <Table.HeadCell>Limit</Table.HeadCell>
                        <Table.HeadCell>Result</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                      </Table.Head>

                      <Table.Body className="divide-y">
                        {rows.map((row, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>
                              <TextInput
                                value={row.parameter}
                                onChange={(e) => handleChange(index, 'parameter', e.target.value)}
                              />
                            </Table.Cell>

                            <Table.Cell>
                              <TextInput
                                value={row.limit}
                                onChange={(e) => handleChange(index, 'limit', e.target.value)}
                              />
                            </Table.Cell>

                            <Table.Cell>
                              <TextInput
                                value={row.result}
                                onChange={(e) => handleChange(index, 'result', e.target.value)}
                              />
                            </Table.Cell>

                            {/* 🔴 DELETE */}
                            <Table.Cell className="text-center">
                              {rows.length > 1 && (
                                <Button size="xs" color="failure" onClick={() => removeRow(index)}>
                                  ✕
                                </Button>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </div>

                  <div className="mt-3">
                    <Button size="sm" color="success" onClick={addRow}>
                      + Add Parameter
                    </Button>
                  </div>
                </div>

                {/* CHECKED BY */}
                <div className="grid grid-cols-12 gap-4 pt-4 border-t">
                  <div className="col-span-12 sm:col-span-6">
                    <Label value="Checked By" />
                    <Select
                      options={userOptions}
                      value={checkedBy}
                      onChange={setCheckedBy}
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      placeholder="Select user"
                    />
                  </div>
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-3 pt-4">
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

export default QualityControlIntimation;
