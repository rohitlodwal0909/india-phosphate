import { Accordion, Button, TextInput, Table } from 'flowbite-react';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { saveEquipmentList } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { toast } from 'react-toastify';

const Listofequipement = ({ bmr, data, isReadOnly }) => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();

  const equipments = useMemo(() => {
    return bmr?.records?.production_results?.filter((item) => item?.equipment) || [];
  }, [bmr]);

  const [rows, setRows] = useState([]);

  // INIT STATE
  useEffect(() => {
    if (equipments.length) {
      const mappedRows = equipments.map((item) => {
        const existing = data?.find((d) => d.equipment_id === item?.equipment?.id);

        return {
          id: existing?.id || null, // 👈 for update
          equipment_no: existing?.equipment_no || '',
        };
      });

      setRows(mappedRows);
    }
  }, [equipments, data]);

  // HANDLE CHANGE
  const handleChange = (index, value) => {
    const updated = [...rows];
    updated[index].equipment_no = value;
    setRows(updated);
  };

  // SUBMIT
  const handleSubmit = async () => {
    const payload = equipments.map((item, index) => ({
      id: rows[index]?.id,
      bmr_id: id,
      equipment_id: item?.equipment?.id,
      equipment_no: rows[index]?.equipment_no,
    }));

    try {
      await dispatch(saveEquipmentList(payload)).unwrap();
      toast.success('Equipment saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

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
                  </Table.Head>

                  <Table.Body className="divide-y">
                    {equipments.map((item, index) => (
                      <Table.Row key={item?.equipment?.id || index}>
                        <Table.Cell>{index + 1}</Table.Cell>

                        <Table.Cell className="font-medium">{item?.equipment?.name}</Table.Cell>

                        <Table.Cell>
                          <TextInput
                            placeholder="Equipment ID No."
                            value={rows[index]?.equipment_no || ''}
                            onChange={(e) => handleChange(index, e.target.value)}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              {/* ACTION BUTTONS */}
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
