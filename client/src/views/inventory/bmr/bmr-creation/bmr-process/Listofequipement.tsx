import { Accordion, Button, TextInput, Table, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { saveEquipmentList } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react/dist/iconify.js';

const Listofequipement = ({ data, isReadOnly }) => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();

  /* ================= ADDITIONAL EQUIPMENTS ================= */
  const additionalEquipmentsNames = [
    'Reaction Tank',
    'Collecting Vessel',
    'Centrifuge',
    'Filter Press',
    'Sparkler Filter',
    'Dryer',
    'Blender',
    'Sifter',
    'Metal Detector',
    'Cone Mill',
    'Multi Mill',
    'Air Classifying Machine',
    'Roll Compactor',
    'Bookner',
    'Vaccum pump',
    'Heating Mental',
    'Jet Mill',
    'SS vessel',
    'DeepFreezer',
    'Water Bath',
  ];

  const additionalEquipments = additionalEquipmentsNames.map((name, index) => {
    const idNum = index + 1;
    const paddedId = idNum.toString().padStart(3, '0');
    return { id: paddedId, name };
  });

  /* ================= STATE ================= */
  const [rows, setRows] = useState<any[]>([]);

  /* ================= INIT ================= */
  useEffect(() => {
    if (data?.length) {
      const mapped = data.map((item) => ({
        id: item?.id || null,
        equipment_id: item?.equipment_id || '',
        equipment_no: item?.equipment_no || '',
      }));
      setRows(mapped);
    } else {
      setRows([
        {
          id: null,
          equipment_id: '',
          equipment_no: '',
        },
      ]);
    }
  }, [data]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ================= ADD ROW ================= */
  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: null,
        equipment_id: '',
        equipment_no: '',
      },
    ]);
  };

  /* ================= DELETE ROW ================= */
  const handleDeleteRow = (index: number) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const payload = rows.map((row) => ({
      id: row?.id,
      bmr_id: id,
      equipment_id: row?.equipment_id,
      equipment_no: row?.equipment_no,
    }));

    try {
      await dispatch(saveEquipmentList(payload)).unwrap();
      toast.success('Equipment saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>3. List Of Equipment / Items</Accordion.Title>

          {isReadOnly && (
            <Accordion.Content>
              <div className="mt-6 overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell>S. No</Table.HeadCell>
                    <Table.HeadCell>Equipment / Items</Table.HeadCell>
                    <Table.HeadCell>Equipment ID No.</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                  </Table.Head>

                  <Table.Body className="divide-y">
                    {rows.map((row, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{index + 1}</Table.Cell>

                        {/* Equipment Select */}
                        <Table.Cell>
                          <Select
                            value={row?.equipment_id}
                            onChange={(e) => handleChange(index, 'equipment_id', e.target.value)}
                          >
                            <option value="">Select Equipment</option>

                            {additionalEquipments.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </Select>
                        </Table.Cell>

                        {/* Equipment No */}
                        <Table.Cell>
                          <TextInput
                            placeholder="Equipment ID No."
                            value={row?.equipment_no}
                            onChange={(e) => handleChange(index, 'equipment_no', e.target.value)}
                          />
                        </Table.Cell>

                        {/* Delete */}
                        <Table.Cell>
                          <Button size="xs" color="failure" onClick={() => handleDeleteRow(index)}>
                            <Icon icon="material-symbols:delete-outline" />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              <div className="mt-4">
                <Button color="success" onClick={handleAddRow}>
                  + Add New Row
                </Button>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button color="gray">Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>
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

export default Listofequipement;
