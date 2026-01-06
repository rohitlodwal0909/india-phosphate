import { Accordion, Button, Label, TextInput, Textarea } from 'flowbite-react';

const YieldCalculation = () => {
  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>11. Yield Calculation</Accordion.Title>

        <Accordion.Content>
          <div className="border rounded-md p-4 space-y-4 text-dark">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="1. Total Qty (Kg)" />
                <TextInput />
              </div>

              <div className="col-span-6">
                <Label value="2. Theoretical Yield (Kg)" />
                <TextInput />
              </div>
            </div>

            <div>
              <Label value="3. % Yield" />
              <p className="text-sm mt-1">Net Weight (kg) × 100 / Theoretical Weight (kg)</p>
              <TextInput className="mt-2" />
            </div>

            <div>
              <Label value="Calculation" />
              <Textarea rows={3} />
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3">
                <Label value="4. Actual Yield (Kg)" />
                <TextInput />
              </div>
              <div className="col-span-3 flex items-end text-sm font-medium">
                Permissible Limit NLT 97%
              </div>
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

export default YieldCalculation;
