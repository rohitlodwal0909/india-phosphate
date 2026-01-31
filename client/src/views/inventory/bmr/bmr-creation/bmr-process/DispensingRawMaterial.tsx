import { useState, useEffect, useMemo } from 'react';
import { Accordion, Button, TextInput, Table, Tooltip } from 'flowbite-react';
import Select from 'react-select';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useParams } from 'react-router';
import { saveDispensingRawMaterial } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const DispensingRawMaterial = ({ bmr, users, data, isReadOnly }) => {
  const dispatch = useDispatch<any>();

  const { id } = useParams();
  const rawMaterials = useMemo(() => {
    return bmr?.records?.production_results?.filter((item) => item?.rmcodes?.rm_code) || [];
  }, [bmr]);

  const [rows, setRows] = useState([]);

  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  // Initialize state
  useEffect(() => {
    if (rawMaterials.length) {
      setRows(
        rawMaterials.map((item) => {
          const existing = data?.find((d) => d.rm_id === item?.rmcodes?.id);

          return {
            actualQty: existing?.actual_qty ? JSON.parse(existing.actual_qty) : [''],

            qcRef: existing?.qc_reference ? JSON.parse(existing.qc_reference) : [''],

            issuedBy: existing?.issued_by
              ? userOptions.find((u) => u.value === existing.issued_by)
              : null,

            checkedBy: existing?.checked_by || '',
            checkedDate: existing?.checked_date || '',
            recordId: existing?.id || null, // 👈 important for UPDATE
          };
        }),
      );
    }
  }, [rawMaterials, data]);

  // ADD FIELD
  const addField = (rowIndex, field) => {
    const updated = [...rows];
    updated[rowIndex][field].push('');
    setRows(updated);
  };

  // REMOVE FIELD
  const removeField = (rowIndex, field, fieldIndex) => {
    const updated = [...rows];
    if (updated[rowIndex][field].length > 1) {
      updated[rowIndex][field].splice(fieldIndex, 1);
      setRows(updated);
    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (rowIndex, field, index, value) => {
    const updated = [...rows];
    updated[rowIndex][field][index] = value;
    setRows(updated);
  };

  // HANDLE ISSUED BY
  const handleIssuedByChange = (rowIndex, selected) => {
    const updated = [...rows];
    updated[rowIndex].issuedBy = selected;
    setRows(updated);
  };
  const handleSimpleChange = (rowIndex, field, value) => {
    const updated = [...rows];
    updated[rowIndex][field] = value;
    setRows(updated);
  };

  // SUBMIT
  const handleSubmit = async () => {
    const payload = rawMaterials.map((item, index) => ({
      id: rows[index]?.recordId || null, // 👈 agar hai to UPDATE
      bmr_id: id,
      rm_id: item?.rmcodes?.id,
      actual_qty: rows[index]?.actualQty,
      qc_reference: rows[index]?.qcRef,
      issued_by: rows[index]?.issuedBy?.value || null,
      checked_by: rows[index]?.checkedBy,
      checked_date: rows[index]?.checkedDate,
    }));

    try {
      await dispatch(saveDispensingRawMaterial(payload)).unwrap();
      toast.success('Dispensing Raw Material saved successfully');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>2. Dispensing Of Raw Materials – Bill Of Material</Accordion.Title>
          {isReadOnly && (
            <Accordion.Content>
              {/* TABLE */}
              <div className="mt-6 overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>S. No</Table.HeadCell>
                    <Table.HeadCell>Name of Raw Material</Table.HeadCell>
                    <Table.HeadCell>Specification No.</Table.HeadCell>
                    <Table.HeadCell>Standard Qty</Table.HeadCell>
                    <Table.HeadCell>Actual Qty</Table.HeadCell>
                    <Table.HeadCell>QC Reference No.</Table.HeadCell>
                    <Table.HeadCell>Issued By</Table.HeadCell>
                    <Table.HeadCell>Checked By / Date</Table.HeadCell>
                  </Table.Head>

                  <Table.Body className="divide-y">
                    {rawMaterials.map((item, index) => (
                      <Table.Row key={item?.id || index}>
                        <Table.Cell>{index + 1}</Table.Cell>

                        <Table.Cell className="font-medium">{item?.rmcodes?.rm_code}</Table.Cell>

                        <Table.Cell>{item?.rmcodes?.rm_code}</Table.Cell>

                        <Table.Cell>
                          {item?.rm_quantity} {item?.rm_unit}
                        </Table.Cell>

                        {/* ACTUAL QTY */}
                        <Table.Cell>
                          <div className="space-y-2">
                            {rows[index]?.actualQty.map((val, i) => {
                              const isLast = i === rows[index].actualQty.length - 1;

                              return (
                                <div key={i} className="flex items-center gap-2">
                                  <TextInput
                                    placeholder="Qty"
                                    value={val}
                                    onChange={(e) =>
                                      handleChange(index, 'actualQty', i, e.target.value)
                                    }
                                  />

                                  {rows[index].actualQty.length > 1 && (
                                    <Tooltip content="Remove">
                                      <Button
                                        size="xs"
                                        color="failure"
                                        onClick={() => removeField(index, 'actualQty', i)}
                                      >
                                        <Icon icon="material-symbols:delete-outline" height={14} />
                                      </Button>
                                    </Tooltip>
                                  )}

                                  {isLast && (
                                    <Tooltip content="Add Qty">
                                      <Button
                                        size="xs"
                                        color="success"
                                        onClick={() => addField(index, 'actualQty')}
                                      >
                                        <Icon icon="material-symbols:add-rounded" height={14} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </Table.Cell>

                        {/* QC REF */}
                        <Table.Cell>
                          <div className="space-y-2">
                            {rows[index]?.qcRef.map((val, i) => {
                              const isLast = i === rows[index].qcRef.length - 1;

                              return (
                                <div key={i} className="flex items-center gap-2">
                                  <TextInput
                                    placeholder="QC Ref"
                                    value={val}
                                    onChange={(e) =>
                                      handleChange(index, 'qcRef', i, e.target.value)
                                    }
                                  />

                                  {rows[index].qcRef.length > 1 && (
                                    <Tooltip content="Remove">
                                      <Button
                                        size="xs"
                                        color="failure"
                                        onClick={() => removeField(index, 'qcRef', i)}
                                      >
                                        <Icon icon="material-symbols:delete-outline" height={14} />
                                      </Button>
                                    </Tooltip>
                                  )}

                                  {isLast && (
                                    <Tooltip content="Add QC Ref">
                                      <Button
                                        size="xs"
                                        color="success"
                                        onClick={() => addField(index, 'qcRef')}
                                      >
                                        <Icon icon="material-symbols:add-rounded" height={14} />
                                      </Button>
                                    </Tooltip>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </Table.Cell>

                        {/* ISSUED BY */}
                        <Table.Cell className="min-w-[180px]">
                          <Select
                            placeholder="Select User"
                            options={userOptions}
                            value={rows[index]?.issuedBy}
                            onChange={(selected) => handleIssuedByChange(index, selected)}
                            styles={selectStyles}
                            menuPortalTarget={document.body}
                          />
                        </Table.Cell>

                        {/* CHECKED */}
                        <Table.Cell>
                          <div className="space-y-2">
                            <TextInput
                              placeholder="Checked By"
                              value={rows[index]?.checkedBy}
                              onChange={(e) =>
                                handleSimpleChange(index, 'checkedBy', e.target.value)
                              }
                            />
                            <TextInput
                              type="date"
                              value={rows[index]?.checkedDate}
                              onChange={(e) =>
                                handleSimpleChange(index, 'checkedDate', e.target.value)
                              }
                            />
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button color="gray">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">
                  Submit
                </Button>
              </div>
            </Accordion.Content>
          )}
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default DispensingRawMaterial;
