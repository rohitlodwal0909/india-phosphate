import { Accordion, Button, Label, TextInput, Table } from 'flowbite-react';
import Select from 'react-select';

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const equipmentList = ['Processing Area', 'Reaction Tank', 'Pusher Centrifuge', 'Dryer'];

const InprocessCheck = () => {
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>7. Inprocess Check</Accordion.Title>

          <Accordion.Content>
            {/* TOP INFO */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Date" />
                <TextInput type="date" />
              </div>
            </div>

            {/* KEY POINTS */}
            <div className="border p-4 rounded-md mb-6 bg-gray-50">
              <h4 className="font-semibold mb-2">Key Points:</h4>
              <ul className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                <li>Black Particle</li>
                <li>pH</li>
              </ul>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <Table striped className="border">
                <Table.Head>
                  <Table.HeadCell rowSpan={2}>S. No</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Perameter</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Result</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Time</Table.HeadCell>
                  <Table.HeadCell colSpan={2}>Checked By</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {equipmentList.map((_, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>

                      <Table.Cell>
                        <TextInput type="text" placeholder="Enter Perameter" />
                      </Table.Cell>

                      <Table.Cell>
                        <TextInput type="text" placeholder="Result" />
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput type="time" />
                      </Table.Cell>

                      <Table.Cell className="min-w-[160px]">
                        <Select
                          placeholder="checked by"
                          styles={selectStyles}
                          menuPortalTarget={document.body}
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
              <Button>Submit</Button>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default InprocessCheck;
