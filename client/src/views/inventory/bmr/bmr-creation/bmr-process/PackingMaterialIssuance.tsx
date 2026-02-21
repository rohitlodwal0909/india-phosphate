import { Accordion, Table, TextInput, Button } from 'flowbite-react';
import Select from 'react-select';
import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { savePmIssuence } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { ImageUrl } from 'src/constants/contant';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const PackingMaterialIssuance = ({ bmr, users, data, isReadOnly }) => {
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
            qa_issuance: existing?.qa_issuance || null,
            actualQtyList: existing?.actual_qty ? JSON.parse(existing.actual_qty) : [''],

            qcRefList: existing?.qc_reference ? JSON.parse(existing.qc_reference) : [''],
            qr_upload: existing?.qr_upload || null, // ✅ add this

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
      const formData = new FormData();

      packingMaterials.forEach((item: any, index: number) => {
        formData.append(`data[${index}][id]`, rows[index]?.id || '');
        formData.append(`data[${index}][bmr_id]`, id || '');
        formData.append(`data[${index}][pm_id]`, item?.pmcodes?.id || '');
        formData.append(`data[${index}][issued_by]`, rows[index]?.issuedBy?.value || '');
        formData.append(`data[${index}][received_by]`, rows[index]?.receivedBy?.value || '');
        formData.append(`data[${index}][qa_issuance]`, rows[index]?.qa_issuance || '');

        formData.append(
          `data[${index}][actual_qty]`,
          JSON.stringify(rows[index]?.actualQtyList || []),
        );

        formData.append(
          `data[${index}][qc_reference]`,
          JSON.stringify(rows[index]?.qcRefList || []),
        );

        if (rows[index]?.qr_upload instanceof File) {
          formData.append(`data[${index}][qr_upload]`, rows[index].qr_upload);
        }
      });

      await dispatch(savePmIssuence(formData)).unwrap();
      toast.success('PM Issuance saved successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save PM Issuance');
    }
  };

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>10. Packing Material Issuance & Dispensing Record</Accordion.Title>

        {isReadOnly && (
          <Accordion.Content>
            <div className="border rounded-md p-4 space-y-6">
              <Table striped className="border">
                <Table.Head>
                  <Table.HeadCell>S.No</Table.HeadCell>
                  <Table.HeadCell>Material</Table.HeadCell>
                  <Table.HeadCell>Standard Qty</Table.HeadCell>
                  <Table.HeadCell>Actual Qty</Table.HeadCell>
                  <Table.HeadCell>QC Reference No.</Table.HeadCell>
                  <Table.HeadCell>QR Issuance.</Table.HeadCell>
                  <Table.HeadCell>QR Upload.</Table.HeadCell>
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
                        <TextInput
                          value={rows[i]?.qa_issuance || ''}
                          placeholder="QA Issuance"
                          onChange={(e) => {
                            setRows((prev) =>
                              prev.map((row, index) =>
                                index === i ? { ...row, qa_issuance: e.target.value } : row,
                              ),
                            );
                          }}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {rows[i]?.qr_upload && (
                          <img
                            src={
                              typeof rows[i].qr_upload === 'string'
                                ? ImageUrl + rows[i].qr_upload
                                : URL.createObjectURL(rows[i].qr_upload)
                            }
                            alt="QR"
                            className="w-16 h-16 border rounded mb-2"
                          />
                        )}

                        <input
                          id={`qr-upload-${i}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const updated = [...rows];
                              updated[i].qr_upload = file;
                              setRows(updated);
                            }
                          }}
                        />

                        <label
                          htmlFor={`qr-upload-${i}`}
                          className="cursor-pointer bg-gray-200 px-3 py-1 rounded"
                        >
                          Upload
                        </label>
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
        )}
      </Accordion.Panel>
    </Accordion>
  );
};

export default PackingMaterialIssuance;
