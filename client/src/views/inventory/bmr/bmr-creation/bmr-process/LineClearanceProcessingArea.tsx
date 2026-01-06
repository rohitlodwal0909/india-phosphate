import { Accordion, Button, Label, TextInput, Table } from 'flowbite-react';
import Select from 'react-select';

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const equipmentList = [
  'Processing Area',
  'Reaction Tank',
  'Pusher Centrifuge',
  'Dryer',
  'Conc Mill',
  'Sifter',
  'Packaging Area',
];

const LineClearanceProcessingArea = () => {
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>
            4. Line Clearance of Processing Area, Equipments & Packing Area
          </Accordion.Title>

          <Accordion.Content>
            {/* TOP INFO */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Previous Product" />
                <TextInput placeholder="Enter previous product" />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Batch No" />
                <TextInput placeholder="Enter batch no" />
              </div>
            </div>

            {/* KEY POINTS */}
            <div className="border p-4 rounded-md mb-6 bg-gray-50">
              <h4 className="font-semibold mb-2">Key Points:</h4>
              <ul className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                <li>Absence of previous batch material</li>
                <li>Ensure availability of Raw & Packing Materials with proper label</li>
                <li>Cleanliness of area and Equipment’s</li>
                <li>Sifter (Sieve status) – Broken / Not Broken</li>
              </ul>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <Table striped className="border">
                <Table.Head>
                  <Table.HeadCell rowSpan={2}>S. No</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Equipment Name & Area</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Date</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Done By</Table.HeadCell>
                  <Table.HeadCell colSpan={2} className="text-center">
                    Checked By (Sign / Date)
                  </Table.HeadCell>
                </Table.Head>

                <Table.Head>
                  <Table.HeadCell colSpan={5}>Production</Table.HeadCell>
                  <Table.HeadCell>QA</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {equipmentList.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>

                      <Table.Cell className="font-medium">{item}</Table.Cell>

                      <Table.Cell>
                        <TextInput type="date" />
                      </Table.Cell>

                      <Table.Cell className="min-w-[160px]">
                        <Select
                          placeholder="Select"
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      <Table.Cell className="min-w-[160px]">
                        <Select
                          placeholder="Production"
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      <Table.Cell className="min-w-[160px]">
                        <Select
                          placeholder="QA"
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

export default LineClearanceProcessingArea;
