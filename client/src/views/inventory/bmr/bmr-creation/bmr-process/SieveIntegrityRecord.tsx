import { Accordion, Button, Label, TextInput, Table } from 'flowbite-react';
import Select from 'react-select';

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const equipmentList = ['Processing Area', 'Reaction Tank', 'Pusher Centrifuge', 'Dryer'];

const SieveIntegrityRecord = () => {
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>6. Sieve Integrity Record</Accordion.Title>

          <Accordion.Content>
            {/* TOP INFO */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Product Name" />
                <TextInput placeholder="Enter product name" />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Batch No" />
                <TextInput placeholder="Enter batch no" />
              </div>
            </div>

            {/* KEY POINTS */}
            <div className="border p-4 rounded-md mb-6 bg-gray-50">
              <h4 className="font-semibold mb-2">Frequency:</h4>
              <ul className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                <li>Before Shifting</li>
                <li>Every 2 hr.</li>
                <li>End of sifting</li>
              </ul>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <Table striped className="border">
                <Table.Head>
                  <Table.HeadCell rowSpan={2}>S. No</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Time</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Sieve status broken / Not broken</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Pass/Fail</Table.HeadCell>
                  <Table.HeadCell colSpan={2}>Checked By</Table.HeadCell>
                  <Table.HeadCell colSpan={2}>Remark</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {equipmentList.map((_, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>
                        <TextInput type="time" />
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput type="text" placeholder="Enter broken / Not broken" />
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput type="text" placeholder="pass/fail" />
                      </Table.Cell>

                      <Table.Cell className="min-w-[160px]">
                        <Select
                          placeholder="checked by"
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <TextInput type="text" placeholder="remark" />
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

export default SieveIntegrityRecord;
