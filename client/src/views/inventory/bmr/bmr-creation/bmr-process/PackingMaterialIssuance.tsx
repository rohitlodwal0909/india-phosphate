import { Accordion, Table, TextInput, Button } from 'flowbite-react';
import Select from 'react-select';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { savePmIssuence } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const PackingMaterialIssuance = ({ bmr, users, data }) => {
  const dispatch = useDispatch<any>();

  const { id } = useParams();
  const packingMaterials = useMemo(() => {
    return bmr?.records?.production_results?.filter((item) => item?.pmcodes?.name) || [];
  }, [bmr]);

  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  const [rows, setRows] = useState([]);

  /** INIT */
  useEffect(() => {
    if (packingMaterials.length) {
      setRows(
        packingMaterials.map((pm) => {
          const existing = data?.find((d) => d.pm_id === pm?.pmcodes?.id);

          return {
            id: existing?.id || null,

            actualQtyList: existing?.actual_qty ? JSON.parse(existing.actual_qty) : [''],

            qcRefList: existing?.qc_reference ? JSON.parse(existing.qc_reference) : [''],

            issuedBy: existing?.issued_by
              ? userOptions.find((u) => u.value === existing.issued_by)
              : null,

            receivedBy: existing?.received_by
              ? userOptions.find((u) => u.value === existing.received_by)
              : null,
          };
        }),
      );
    }
  }, [packingMaterials, data, users]);

  /** ACTUAL QTY */
  const addActualQty = (i) => {
    const updated = [...rows];
    updated[i].actualQtyList.push('');
    setRows(updated);
  };

  const removeActualQty = (i, idx) => {
    const updated = [...rows];
    updated[i].actualQtyList.splice(idx, 1);
    setRows(updated);
  };

  /** QC REF */
  const addQcRef = (i) => {
    const updated = [...rows];
    updated[i].qcRefList.push('');
    setRows(updated);
  };

  const removeQcRef = (i, idx) => {
    const updated = [...rows];
    updated[i].qcRefList.splice(idx, 1);
    setRows(updated);
  };

  /** SUBMIT */
  const handleSubmit = async () => {
    try {
      const payload = packingMaterials.map((item, index) => ({
        id: rows[index]?.id || null,
        bmr_id: id,
        pm_id: item?.pmcodes?.id,
        issued_by: rows[index]?.issuedBy?.value || null,
        received_by: rows[index]?.receivedBy?.value || null,
        actual_qty: rows[index].actualQtyList,
        qc_reference: rows[index].qcRefList,
      }));

      await dispatch(savePmIssuence(payload)).unwrap();

      toast.success(
        rows[0]?.id ? 'PM Issuance updated successfully' : 'PM Issuance saved successfully',
      );
    } catch (error) {
      toast.error(error?.message || 'Failed to save QC Issuance');
    }
  };

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>9. Packing Material Issuance & Dispensing Record</Accordion.Title>

        <Accordion.Content>
          <div className="border rounded-md p-4 space-y-6">
            <Table striped className="border">
              <Table.Head>
                <Table.HeadCell>S.No</Table.HeadCell>
                <Table.HeadCell>Material</Table.HeadCell>
                <Table.HeadCell>Standard Qty</Table.HeadCell>
                <Table.HeadCell>Actual Qty</Table.HeadCell>
                <Table.HeadCell>QC Reference No.</Table.HeadCell>
                <Table.HeadCell>Issued By</Table.HeadCell>
                <Table.HeadCell>Received By</Table.HeadCell>
              </Table.Head>

              <Table.Body>
                {packingMaterials?.map((item, i) => (
                  <Table.Row key={i}>
                    <Table.Cell>{i + 1}</Table.Cell>

                    <Table.Cell className="font-medium">{item?.pmcodes?.name}</Table.Cell>

                    <Table.Cell>
                      {item?.pm_quantity} {item?.pm_unit}
                    </Table.Cell>

                    {/* ACTUAL QTY */}
                    <Table.Cell className="space-y-2 min-w-[180px]">
                      {rows[i]?.actualQtyList.map((val, idx) => (
                        <div key={idx} className="flex gap-2">
                          <TextInput
                            value={val}
                            placeholder="Actual Qty"
                            onChange={(e) => {
                              const updated = [...rows];
                              updated[i].actualQtyList[idx] = e.target.value;
                              setRows(updated);
                            }}
                          />
                          {idx === 0 ? (
                            <Button size="sm" color="primary" onClick={() => addActualQty(i)}>
                              +
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              color="failure"
                              onClick={() => removeActualQty(i, idx)}
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}
                    </Table.Cell>

                    {/* QC REF */}
                    <Table.Cell className="space-y-2 min-w-[180px]">
                      {rows[i]?.qcRefList.map((val, idx) => (
                        <div key={idx} className="flex gap-2">
                          <TextInput
                            value={val}
                            placeholder="QC Ref"
                            onChange={(e) => {
                              const updated = [...rows];
                              updated[i].qcRefList[idx] = e.target.value;
                              setRows(updated);
                            }}
                          />
                          {idx === 0 ? (
                            <Button size="sm" color="primary" onClick={() => addQcRef(i)}>
                              +
                            </Button>
                          ) : (
                            <Button size="sm" color="failure" onClick={() => removeQcRef(i, idx)}>
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}
                    </Table.Cell>

                    <Table.Cell className="min-w-[180px]">
                      <Select
                        options={userOptions}
                        value={rows[i]?.issuedBy}
                        onChange={(val) => {
                          const updated = [...rows];
                          updated[i].issuedBy = val;
                          setRows(updated);
                        }}
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </Table.Cell>

                    <Table.Cell className="min-w-[180px]">
                      <Select
                        options={userOptions}
                        value={rows[i]?.receivedBy}
                        onChange={(val) => {
                          const updated = [...rows];
                          updated[i].receivedBy = val;
                          setRows(updated);
                        }}
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <div className="flex justify-end gap-3 pt-4">
              <Button color="gray">Cancel</Button>
              <Button color="success" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};

export default PackingMaterialIssuance;
