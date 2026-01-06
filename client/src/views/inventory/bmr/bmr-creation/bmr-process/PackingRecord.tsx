import { Accordion, Button, Label, TextInput } from 'flowbite-react';

const PackingRecord = () => {
  return (
    <Accordion alwaysOpen>
      {/* ================== SECTION 10 ================== */}
      <Accordion.Panel>
        <Accordion.Title>10. Packing Record</Accordion.Title>

        <Accordion.Content>
          <div className="border rounded-md p-4 space-y-4 text-dark">
            <p className="text-sm">
              Pack the final product in 25/50 kg HDPE & LDPE bag / HDPE drum / White plain bag.
              Weigh the randomly.
            </p>

            {/* Header Fields */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Date" />
                <TextInput />
              </div>
              <div className="col-span-6">
                <Label value="Batch No." />
                <TextInput />
              </div>

              <div className="col-span-6">
                <Label value="Time From" />
                <TextInput />
              </div>
              <div className="col-span-6">
                <Label value="Time To" />
                <TextInput />
              </div>
            </div>

            {/* Gross Weight */}
            <div>
              <Label value="Gross Weight (Kg)" />
              <div className="grid grid-cols-5 gap-2 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <TextInput key={i} />
                ))}
              </div>
            </div>

            {/* Tare Weight */}
            <div>
              <Label value="Tare Weight (Kg)" />
              <div className="grid grid-cols-5 gap-2 mt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <TextInput key={i} />
                ))}
              </div>
            </div>

            {/* Net Weight */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label value="Net Weight (Kg)" />
                <TextInput />
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

export default PackingRecord;
