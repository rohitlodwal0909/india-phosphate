import { Accordion, Button, Label, TextInput } from 'flowbite-react';

const ProductRelease = () => {
  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>13.Product Release</Accordion.Title>
        <Accordion.Content>
          <div className="border rounded-md p-4 space-y-4 text-dark">
            <p className="text-sm">
              The material produced through the execution of this Batch Record shall be
              dispositioned by QA according to Product Release Procedure.
            </p>

            <p className="text-sm">
              The product conforms to Finished Goods Specification:&nbsp;
              <span className="font-semibold underline">Sodium citrate IP/BP/EP/USP/FCC</span>
            </p>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Batch No." />
                <TextInput />
              </div>
              <div className="col-span-6">
                <Label value="Date" />
                <TextInput />
              </div>
            </div>

            <p className="text-sm font-medium">The Disposition shall be recorded below.</p>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">DEPARTMENT</th>
                    <th className="border p-2">NAME</th>
                    <th className="border p-2">SIGNATURE</th>
                    <th className="border p-2">DATE</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border p-2 font-medium">PRODUCTION</td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                  </tr>

                  <tr>
                    <td className="border p-2 font-medium">QUALITY CONTROL</td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                  </tr>

                  <tr>
                    <td className="border p-2 font-medium">QUALITY ASSURANCE</td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                    <td className="border p-2">
                      <TextInput />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button color="gray">Cancel</Button>
              <Button>Submit</Button>
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};

export default ProductRelease;
