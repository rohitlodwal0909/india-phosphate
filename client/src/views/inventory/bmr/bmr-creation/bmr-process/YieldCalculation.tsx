import { Accordion, Button, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useState, useMemo } from 'react';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const YieldCalculation = ({ users }) => {
  const [totalQty, setTotalQty] = useState('');
  const [theoreticalYield, setTheoreticalYield] = useState('');
  const [performedBy, setPerformedBy] = useState(null);

  // AUTO CALCULATION
  const actualYield = useMemo(() => {
    const total = parseFloat(totalQty) || 0;
    const theoretical = parseFloat(theoreticalYield) || 0;
    return ((total * theoretical) / 100).toFixed(2);
  }, [totalQty, theoreticalYield]);

  // USERS OPTIONS
  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>11. Yield Calculation</Accordion.Title>

        <Accordion.Content>
          <div className="border rounded-md p-4 space-y-6 text-dark">
            {/* INPUTS */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="1. Total Qty (Kg)" />
                <TextInput
                  value={totalQty}
                  onChange={(e) => setTotalQty(e.target.value)}
                  placeholder="Enter total qty"
                />
              </div>

              <div className="col-span-6">
                <Label value="2. Theoretical Yield (%)" />
                <TextInput
                  value={theoreticalYield}
                  onChange={(e) => setTheoreticalYield(e.target.value)}
                  placeholder="Enter theoretical yield"
                />
              </div>
            </div>

            {/* ACTUAL YIELD */}
            <div>
              <Label value="3. Actual Yield (Kg)" />
              <p className="text-sm mt-1">(Total Qty × Theoretical Yield) / 100</p>
              <TextInput className="mt-2" value={actualYield} readOnly />
            </div>

            {/* REMARK */}
            <div>
              <Label value="Remark" />
              <Textarea rows={3} />
            </div>

            {/* PERFORMED BY */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <Label value="Performed By" />
                <Select
                  placeholder="Select User"
                  options={userOptions}
                  value={performedBy}
                  onChange={setPerformedBy}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-3 pt-4 border-t">
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
