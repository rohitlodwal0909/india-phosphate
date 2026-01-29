import { Accordion, Button, Label, TextInput, Select } from 'flowbite-react';

const ProductRelease = ({ users = [] }) => {
  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>13. Product Release</Accordion.Title>

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

            {/* Batch & Date */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Batch No." />
                <TextInput />
              </div>

              <div className="col-span-6">
                <Label value="Date" />
                <TextInput type="date" />
              </div>
            </div>

            <p className="text-sm font-medium">The Disposition shall be recorded below.</p>

            {/* Table */}
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
                  {['PRODUCTION', 'QUALITY CONTROL', 'QUALITY ASSURANCE'].map((dept) => (
                    <tr key={dept}>
                      <td className="border p-2 font-medium">{dept}</td>

                      {/* NAME dropdown */}
                      <td className="border p-2">
                        <Select>
                          <option value="">Select User</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.username}
                            </option>
                          ))}
                        </Select>
                      </td>

                      <td className="border p-2">
                        <TextInput placeholder="Signature" />
                      </td>

                      <td className="border p-2">
                        <TextInput type="date" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
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
