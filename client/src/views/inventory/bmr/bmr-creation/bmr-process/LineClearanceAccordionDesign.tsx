import { Accordion, Button, Label, TextInput } from 'flowbite-react';
import Select from 'react-select';

const yesNoNaOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'NA', label: 'NA' },
];

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const LineClearanceAccordionDesign = () => {
  const KeyPointRow = ({ label }: any) => (
    <div className="grid grid-cols-12 gap-3 py-2">
      <div className="col-span-12 lg:col-span-4 font-medium text-gray-700">{label}</div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-4">
        <Label className="lg:hidden mb-1 block" value="Cleaning Done By" />
        <Select
          options={yesNoNaOptions}
          styles={selectStyles}
          menuPortalTarget={document.body}
          placeholder="Select"
        />
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-4">
        <Label className="lg:hidden mb-1 block" value="Checked By" />
        <Select
          options={yesNoNaOptions}
          styles={selectStyles}
          menuPortalTarget={document.body}
          placeholder="Select"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>1. Line Clearance Dispensing (Raw Material)</Accordion.Title>

          <Accordion.Content>
            {/* BASIC DETAILS */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Clearance Date" />
                <TextInput type="date" />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Previous Product" />
                <Select
                  placeholder="Select Product"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Batch No" />
                <TextInput placeholder="Enter batch number" />
              </div>
            </div>

            {/* STAFF DETAILS */}
            <div className="grid grid-cols-12 gap-4 pt-4">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Cleaning Done By" />
                <Select
                  placeholder="Select Staff"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Checked By" />
                <Select
                  placeholder="Select Staff"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* KEY POINT HEADER */}
            <div className="hidden lg:grid grid-cols-12 font-semibold text-gray-600 border-b pb-2 mb-3 pt-4">
              <div className="col-span-4">Key Point</div>
              <div className="col-span-4">Cleaning Done</div>
              <div className="col-span-4">Checked</div>
            </div>

            {/* KEY POINT ROWS */}
            <KeyPointRow label="Absence of previous batch material" />
            <KeyPointRow label="Absence of previous batch labels" />
            <KeyPointRow label="Cleanliness of area" />
            <KeyPointRow label="Calibration of weighing balances" />

            {/* ACTION BUTTONS – INSIDE ACCORDION */}
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

export default LineClearanceAccordionDesign;
