import { Accordion, Button, TextInput, Table } from 'flowbite-react';
import Select from 'react-select';

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const rawMaterials = [
  { id: 1, name: 'RM9', spec: 'RMS09', stdQty: '3450 Kg' },
  { id: 2, name: 'Water', spec: 'PW', stdQty: '8000 Liter' },
  { id: 3, name: 'RM11', spec: 'RMS11', stdQty: '2600 Kg' },
  { id: 4, name: 'Catalyst', spec: 'RMSC2', stdQty: '1 Kg' },
];

const DispensingRawMaterial = () => {
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>2. Dispensing Of Raw Materials – Bill Of Material</Accordion.Title>

          <Accordion.Content>
            {/* BOM TABLE */}
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
                    <Table.Row key={item.id}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell className="font-medium">{item.name}</Table.Cell>
                      <Table.Cell>{item.spec}</Table.Cell>
                      <Table.Cell>{item.stdQty}</Table.Cell>

                      <Table.Cell>
                        <TextInput placeholder="Qty" />
                      </Table.Cell>

                      <Table.Cell>
                        <TextInput placeholder="QC Ref" />
                      </Table.Cell>

                      <Table.Cell className="min-w-[150px]">
                        <Select
                          placeholder="Select"
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      <Table.Cell>
                        <div className="space-y-2">
                          <TextInput placeholder="Checked By" />
                          <TextInput type="date" />
                        </div>
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

export default DispensingRawMaterial;
