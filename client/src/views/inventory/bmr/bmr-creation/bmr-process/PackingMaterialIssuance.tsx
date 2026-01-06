import { Accordion, Table, TextInput, Label, Button } from 'flowbite-react';

const packingMaterials = ['HDPE bags / Drums', 'LDPE bags'];

const PackingMaterialIssuance = () => {
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>9. Packing Material Issuance & Dispensing Record</Accordion.Title>

          <Accordion.Content>
            <div className="border rounded-md p-4 space-y-6 text-dark">
              {/* TABLE */}
              <div className="overflow-x-auto">
                <Table striped className="border">
                  <Table.Head>
                    <Table.HeadCell>S. No</Table.HeadCell>
                    <Table.HeadCell>Name of Packaging Material</Table.HeadCell>
                    <Table.HeadCell>Specification</Table.HeadCell>
                    <Table.HeadCell>Standard Qty</Table.HeadCell>
                    <Table.HeadCell>Actual Qty</Table.HeadCell>
                    <Table.HeadCell>QC Reference No.</Table.HeadCell>
                    <Table.HeadCell>Issued By (Store)</Table.HeadCell>
                    <Table.HeadCell>Received By (Production)</Table.HeadCell>
                  </Table.Head>

                  <Table.Body className="divide-y">
                    {packingMaterials.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{index + 1}</Table.Cell>

                        <Table.Cell className="font-medium">{item}</Table.Cell>

                        <Table.Cell>
                          <TextInput />
                        </Table.Cell>

                        <Table.Cell>
                          <TextInput />
                        </Table.Cell>

                        <Table.Cell>
                          <TextInput />
                        </Table.Cell>

                        <Table.Cell>
                          <TextInput />
                        </Table.Cell>

                        <Table.Cell>
                          <TextInput />
                        </Table.Cell>

                        <Table.Cell>
                          <TextInput />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              {/* FOOTER SECTION */}
              <div className="grid grid-cols-12 gap-6 pt-4 border-t">
                <div className="col-span-12 sm:col-span-6">
                  <Label value="Checked By (Sign / Date)" />
                  <TextInput />
                </div>

                <div className="col-span-12 sm:col-span-6 border rounded-md flex items-center justify-center font-semibold text-gray-700">
                  QUALITY ASSURANCE
                </div>
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-3 pt-4">
                <Button color="gray">Cancel</Button>
                <Button>Submit</Button>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default PackingMaterialIssuance;
