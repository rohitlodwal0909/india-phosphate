import { Accordion, Button, TextInput } from 'flowbite-react';

const PostProductionReview = () => {
  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>12. Post-Production Review</Accordion.Title>
        <Accordion.Content>
          <div className="border rounded-md p-4 space-y-4 text-dark">
            <p className="text-sm">
              The complete Post-Production Batch Record has been reviewed for completeness and
              accuracy. All pages are complete and all entries conform to Good Documentation
              Practices.
            </p>

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

export default PostProductionReview;
