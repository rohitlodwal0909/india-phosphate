import { Accordion, Label, TextInput, Button } from 'flowbite-react';

const QualityControlIntimation = () => {
  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>8. Quality Control Intimation</Accordion.Title>

          <Accordion.Content>
            <div className="border p-4 rounded-md space-y-6">
              {/* TOP INFO */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-4">
                  <Label value="Sampled By" />
                  <TextInput />
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <Label value="Date" />
                  <TextInput type="date" />
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <Label value="Quantity Sampled" />
                  <TextInput />
                </div>
              </div>

              {/* RESULT */}
              <div>
                <h4 className="font-semibold mb-3">Result:</h4>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 sm:col-span-6">
                    <Label value="a. pH (Limit)" />
                    <TextInput />
                  </div>

                  <div className="col-span-12 sm:col-span-6">
                    <Label value="b. Water (Limit)" />
                    <TextInput />
                  </div>

                  <div className="col-span-12 sm:col-span-6">
                    <Label value="c. Loss on Drying (Limit)" />
                    <TextInput />
                  </div>

                  <div className="col-span-12 sm:col-span-6">
                    <Label value="d. Assay (Limit)" />
                    <TextInput />
                  </div>
                </div>
              </div>

              {/* CHECKED BY */}
              <div className="grid grid-cols-12 gap-4 pt-4 border-t">
                <div className="col-span-12 sm:col-span-6">
                  <Label value="Checked By (Date / Sign)" />
                  <TextInput />
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

export default QualityControlIntimation;
