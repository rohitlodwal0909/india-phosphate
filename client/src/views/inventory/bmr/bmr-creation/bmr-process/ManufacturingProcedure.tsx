import { Accordion, Button, TextInput } from 'flowbite-react';

const ManufacturingProcedure = () => {
  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>5. Manufacturing Procedure</Accordion.Title>

        <Accordion.Content>
          <div className="border rounded-md p-4 overflow-x-auto text-dark">
            <table className="w-full text-sm border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 w-[320px]">Processing Step</th>
                  <th className="border p-2">Actual Qty</th>
                  <th className="border p-2">Time From</th>
                  <th className="border p-2">Time To</th>
                  <th className="border p-2">Temp</th>
                  <th className="border p-2">pH</th>
                  <th className="border p-2">Sp. Gravity</th>
                  <th className="border p-2">
                    Done By
                    <br />
                    (Sign / Date)
                  </th>
                  <th className="border p-2">
                    Checked By
                    <br />
                    (Sign / Date)
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  `1. Charge following materials stepwise at RT in Reactor R___
Reactor ID No R____
1. Purified Water
2. RM 9`,

                  `2. After charging the material, stir the material for 1 hr.`,

                  `3. After then, slowly add the RM 11 in reactor R____ with stirring for 1 hr.`,

                  `4. Continue stir the material until the pH attend 7-9.`,

                  `5. Add the catalyst in reactor & stir the material for 30 min.`,

                  `6. Centrifuge the material through pusher centrifuge.`,

                  `7. Dry the material in FBD at 90° - 110°C
Check the water content during drying
(Limit: 11.0% - 13.0%)`,

                  `8. Mill the material through cone mill.`,

                  `9. Sift the material through sifter
Mesh size __________
(20#/30#/60#/100#)
(Ok / Not Ok)`,
                ].map((step, index) => (
                  <tr key={index}>
                    <td className="border p-2 whitespace-pre-line align-top">{step}</td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                    <td className="border p-1">
                      <TextInput sizing="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default ManufacturingProcedure;
