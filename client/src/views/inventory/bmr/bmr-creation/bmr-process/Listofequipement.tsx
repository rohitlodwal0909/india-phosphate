import { Accordion, Button, TextInput, Table } from 'flowbite-react';

const rawMaterials = [
  { id: 1, name: 'Reactor', spec: 'RMS09', stdQty: '3450 Kg' },
  { id: 2, name: 'Pusher Centrifuge', spec: 'PW', stdQty: '8000 Liter' },
  { id: 3, name: 'Dryer', spec: 'RMS11', stdQty: '2600 Kg' },
  { id: 4, name: 'Cone Mill', spec: 'RMSC2', stdQty: '1 Kg' },
  { id: 5, name: 'Sifter', spec: 'RMSC2', stdQty: '1 Kg' },
];

const Listofequipement = () => {
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>3. List Of Equipement / Items</Accordion.Title>

          <Accordion.Content>
            {/* BOM TABLE */}
            <div className="mt-6 overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>S. No</Table.HeadCell>
                  <Table.HeadCell>Equipement / Items</Table.HeadCell>
                  <Table.HeadCell>Equipement ID No.</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {rawMaterials.map((item, index) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>

                      <Table.Cell>
                        <TextInput placeholder="Equipement ID No." />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button color="gray">Cancel</Button>
              <Button>Submit</Button>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default Listofequipement;
