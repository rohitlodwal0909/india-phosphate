import { useEffect, useMemo, useState } from 'react';
import { Accordion, Button, Label, TextInput, Table } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';
import { useParams } from 'react-router';
import { saveLineClearanceProcessing } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const LineClearanceProcessingArea = ({ bmr, users = [], data, isReadOnly }) => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const { Equipmentdata } = useSelector((state: any) => state.equipment);

  const [previousProduct, setPreviousProduct] = useState('');

  /* ================= USERS OPTIONS ================= */
  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        value: u.id,
        label: u.name || u.username,
      })),
    [users],
  );

  /* ================= EQUIPMENT DROPDOWN ================= */
  const equipmentList = useMemo(() => {
    return [
      { value: 'processing', label: 'Processing Area' },
      ...(Equipmentdata || []).map((e) => ({
        value: e.id,
        label: e.name,
      })),
      { value: 'packaging', label: 'Packaging Area' },
    ];
  }, [Equipmentdata]);

  /* ================= EQUIPMENTS FROM BMR ================= */
  const equipmentsFromBmr = useMemo(() => {
    return (
      bmr?.records?.production_results
        ?.filter(
          (item) =>
            item?.equipment && item.equipment !== 'processing' && item.equipment !== 'packaging',
        )
        ?.map((item) => item.equipment) || []
    );
  }, [bmr]);

  /* ================= INITIAL ROWS ================= */
  const initialEquipmentRows = useMemo(() => {
    const middleRows = equipmentsFromBmr.map((eq) => ({
      equipmentId: eq.id || eq,
      equipmentName: eq.name || eq,
      date: '',
      doneBy: null,
      production: null,
      qa: null,
    }));

    return [
      {
        equipmentId: 'processing',
        equipmentName: 'Processing Area',
        date: '',
        doneBy: null,
        production: null,
        qa: null,
      },
      ...middleRows,
      {
        equipmentId: 'packaging',
        equipmentName: 'Packaging Area',
        date: '',
        doneBy: null,
        production: null,
        qa: null,
      },
    ];
  }, [equipmentsFromBmr]);

  const [equipmentRows, setEquipmentRows] = useState(initialEquipmentRows);

  /* ================= KEY POINTS ================= */
  const [keyPoints, setKeyPoints] = useState([
    { point: 'Absence of previous batch material', status: '' },
  ]);

  /* ================= LOAD MASTER EQUIPMENT ================= */
  useEffect(() => {
    dispatch(GetEquipment());
  }, []);

  /* ================= EDIT MODE DATA ================= */
  useEffect(() => {
    if (!data) return;

    setPreviousProduct(data.previous_product || '');

    /* ---- Key Points ---- */
    if (data.key_points) {
      try {
        const parsed =
          typeof data.key_points === 'string' ? JSON.parse(data.key_points) : data.key_points;

        setKeyPoints(parsed);
      } catch (e) {
        console.error('KeyPoints parse error');
      }
    }

    /* ---- Equipments ---- */
    if (data.equipments) {
      try {
        const parsed =
          typeof data.equipments === 'string' ? JSON.parse(data.equipments) : data.equipments;

        const filtered = parsed.filter(
          (eq) => eq.equipment_id !== 'processing' && eq.equipment_id !== 'packaging',
        );

        const processing = parsed.find((eq) => eq.equipment_id == 'processing') || [];
        const packaging = parsed.find((eq) => eq.equipment_id == 'packaging') || [];

        const rows = [
          {
            equipmentId: 'processing',
            equipmentName: 'Processing Area',
            date: processing?.date,
            doneBy: userOptions.find((u) => u.value === processing.done_by) || null,
            production: userOptions.find((u) => u.value === processing.production) || null,
            qa: userOptions.find((u) => u.value === processing.qa) || null,
          },

          ...filtered.map((eq) => ({
            equipmentId: eq.equipment_id,
            equipmentName: eq.equipment_name,
            date: eq.date || '',
            doneBy: userOptions.find((u) => u.value === eq.done_by) || null,
            production: userOptions.find((u) => u.value === eq.production) || null,
            qa: userOptions.find((u) => u.value === eq.qa) || null,
          })),

          {
            equipmentId: 'packaging',
            equipmentName: 'Packaging Area',
            date: packaging?.date,
            doneBy: userOptions.find((u) => u.value === packaging.done_by) || null,
            production: userOptions.find((u) => u.value === packaging.production) || null,
            qa: userOptions.find((u) => u.value === packaging.qa) || null,
          },
        ];

        setEquipmentRows(rows);
      } catch (e) {
        console.error('Equipments parse error');
      }
    }
  }, [data, userOptions]);

  /* ================= ROW HANDLERS ================= */
  const updateRow = (index, field, value) => {
    const updated = [...equipmentRows];
    updated[index][field] = value;
    setEquipmentRows(updated);
  };

  const addEquipmentRow = () => {
    const updated = [...equipmentRows];
    updated.splice(updated.length - 1, 0, {
      equipmentId: '',
      equipmentName: '',
      date: '',
      doneBy: null,
      production: null,
      qa: null,
    });
    setEquipmentRows(updated);
  };

  const removeEquipmentRow = (index) => {
    const row = equipmentRows[index];
    if (row.equipmentId === 'processing' || row.equipmentId === 'packaging') return;

    const updated = [...equipmentRows];
    updated.splice(index, 1);
    setEquipmentRows(updated);
  };

  /* ================= KEY POINT HANDLERS ================= */
  const addKeyPoint = () => setKeyPoints([...keyPoints, { point: '', status: '' }]);

  const updateKeyPoint = (index, field, value) => {
    const updated = [...keyPoints];
    updated[index][field] = value;
    setKeyPoints(updated);
  };

  const removeKeyPoint = (index) => {
    const updated = [...keyPoints];
    updated.splice(index, 1);
    setKeyPoints(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    const payload = {
      id: data?.id || null,
      bmr_id: id,
      previousProduct,
      keyPoints,
      equipments: equipmentRows.map((row) => ({
        equipment_id: row.equipmentId,
        equipment_name: row.equipmentName,
        date: row.date,
        done_by: row.doneBy?.value || null,
        production: row.production?.value || null,
        qa: row.qa?.value || null,
      })),
    };

    dispatch(saveLineClearanceProcessing(payload));
    toast.success('Line Clearance Saved');
  };

  /* ================= UI ================= */
  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>
          4. Line Clearance of Processing Area, Equipments & Packing Area
        </Accordion.Title>
        {isReadOnly && (
          <Accordion.Content>
            {/* Previous Product */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-6">
                <Label value="Previous Product" />
                <TextInput
                  value={previousProduct}
                  onChange={(e) => setPreviousProduct(e.target.value)}
                />
              </div>
              <div className="col-span-6">
                <Label value="Batch No" />
                <TextInput value={bmr?.records?.qc_batch_number} readOnly />
              </div>
            </div>

            {/* Key Points */}
            <div className="border p-4 rounded mb-6 bg-gray-50">
              <div className="flex justify-between mb-3">
                <h4 className="font-semibold">Key Points</h4>
                <Button size="xs" onClick={addKeyPoint}>
                  + Add
                </Button>
              </div>

              {keyPoints.map((kp, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 mb-2">
                  <div className="col-span-7">
                    <TextInput
                      value={kp.point}
                      onChange={(e) => updateKeyPoint(i, 'point', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 flex gap-4">
                    <label>
                      <input
                        type="radio"
                        checked={kp.status === 'yes'}
                        onChange={() => updateKeyPoint(i, 'status', 'yes')}
                      />{' '}
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={kp.status === 'no'}
                        onChange={() => updateKeyPoint(i, 'status', 'no')}
                      />{' '}
                      No
                    </label>
                  </div>
                  <div className="col-span-1">
                    {keyPoints.length > 1 && (
                      <Button size="xs" color="failure" onClick={() => removeKeyPoint(i)}>
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Equipment Table */}
            <Table striped>
              <Table.Head>
                <Table.HeadCell>#</Table.HeadCell>
                <Table.HeadCell>Equipment</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>Done By</Table.HeadCell>
                <Table.HeadCell>Production</Table.HeadCell>
                <Table.HeadCell>QA</Table.HeadCell>
                <Table.HeadCell />
              </Table.Head>

              <Table.Body>
                {equipmentRows.map((row, i) => {
                  const fixed = row.equipmentId === 'processing' || row.equipmentId === 'packaging';

                  return (
                    <Table.Row key={i}>
                      <Table.Cell>{i + 1}</Table.Cell>
                      <Table.Cell>
                        <Select
                          isDisabled={fixed}
                          options={equipmentList}
                          value={equipmentList.find((e) => e.value === row.equipmentId) || null}
                          onChange={(opt) => {
                            updateRow(i, 'equipmentId', opt.value);
                            updateRow(i, 'equipmentName', opt.label);
                          }}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput
                          type="date"
                          value={row.date}
                          onChange={(e) => updateRow(i, 'date', e.target.value)}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Select
                          options={userOptions}
                          value={row.doneBy}
                          onChange={(opt) => updateRow(i, 'doneBy', opt)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Select
                          options={userOptions}
                          value={row.production}
                          onChange={(opt) => updateRow(i, 'production', opt)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Select
                          options={userOptions}
                          value={row.qa}
                          onChange={(opt) => updateRow(i, 'qa', opt)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {!fixed && (
                          <Button size="xs" color="failure" onClick={() => removeEquipmentRow(i)}>
                            ✕
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>

            <div className="flex justify-end mt-4">
              <Button size="sm" onClick={addEquipmentRow}>
                + Add More Equipment
              </Button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button color="success" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </Accordion.Content>
        )}
      </Accordion.Panel>
    </Accordion>
  );
};

export default LineClearanceProcessingArea;
