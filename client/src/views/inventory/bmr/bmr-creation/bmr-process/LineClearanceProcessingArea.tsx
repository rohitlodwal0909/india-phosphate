import { useState } from 'react';
import { Accordion, Button, Label, TextInput, Table } from 'flowbite-react';
import Select from 'react-select';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const equipmentList = [
  'Processing Area',
  'Reaction Tank',
  'Pusher Centrifuge',
  'Dryer',
  'Conc Mill',
  'Sifter',
  'Packaging Area',
];

const LineClearanceProcessingArea = ({ users }) => {
  /* ================= KEY POINTS STATE ================= */
  const [keyPoints, setKeyPoints] = useState([
    {
      point: 'Absence of previous batch material',
      status: '', // yes | no
    },
  ]);

  /* ================= USERS OPTIONS ================= */
  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  /* ================= KEY POINT HANDLERS ================= */
  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, { point: '', status: '' }]);
  };

  const updateKeyPoint = (index, field, value) => {
    const updated = [...keyPoints];
    updated[index][field] = value;
    setKeyPoints(updated);
  };

  const removeKeyPoint = (index) => {
    const updated = [...keyPoints];
    updated.splice(index, 1);
    setKeyPoints(updated);
  };

  return (
    <div className="space-y-6">
      <Accordion alwaysOpen>
        <Accordion.Panel>
          <Accordion.Title>
            4. Line Clearance of Processing Area, Equipments & Packing Area
          </Accordion.Title>

          <Accordion.Content>
            {/* ================= TOP INFO ================= */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Previous Product" />
                <TextInput placeholder="Enter previous product" />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Batch No" />
                <TextInput placeholder="Enter batch no" />
              </div>
            </div>

            {/* ================= KEY POINTS ================= */}
            <div className="border p-4 rounded-md mb-6 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Key Points</h4>
                <Button size="xs" color="primary" onClick={addKeyPoint}>
                  + Add
                </Button>
              </div>

              <div className="space-y-3">
                {keyPoints.map((kp, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-center">
                    {/* KEY POINT TEXT */}
                    <div className="col-span-12 md:col-span-7">
                      <TextInput
                        placeholder="Enter key point"
                        value={kp.point}
                        onChange={(e) => updateKeyPoint(index, 'point', e.target.value)}
                      />
                    </div>

                    {/* YES / NO */}
                    <div className="col-span-8 md:col-span-4 flex gap-4">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          color="success"
                          name={`status-${index}`}
                          checked={kp.status === 'yes'}
                          onChange={() => updateKeyPoint(index, 'status', 'yes')}
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="radio"
                          name={`status-${index}`}
                          checked={kp.status === 'no'}
                          onChange={() => updateKeyPoint(index, 'status', 'no')}
                        />
                        No
                      </label>
                    </div>

                    {/* CLOSE BUTTON */}
                    <div className="col-span-4 md:col-span-1 text-right">
                      {keyPoints.length > 1 && (
                        <Button size="xs" color="failure" onClick={() => removeKeyPoint(index)}>
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">
              <Table striped className="border">
                <Table.Head>
                  <Table.HeadCell rowSpan={2}>S. No</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Equipment Name & Area</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Date</Table.HeadCell>
                  <Table.HeadCell rowSpan={2}>Done By</Table.HeadCell>
                  <Table.HeadCell colSpan={2} className="text-center">
                    Checked By (Sign / Date)
                  </Table.HeadCell>
                </Table.Head>

                <Table.Head>
                  <Table.HeadCell colSpan={5}>Production</Table.HeadCell>
                  <Table.HeadCell>QA</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {equipmentList.map((item, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{index + 1}</Table.Cell>

                      <Table.Cell className="font-medium">{item}</Table.Cell>

                      <Table.Cell>
                        <TextInput type="date" />
                      </Table.Cell>

                      {/* DONE BY */}
                      <Table.Cell className="min-w-[180px]">
                        <Select
                          placeholder="Done By"
                          options={userOptions}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      {/* PRODUCTION */}
                      <Table.Cell className="min-w-[180px]">
                        <Select
                          placeholder="Production"
                          options={userOptions}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>

                      {/* QA */}
                      <Table.Cell className="min-w-[180px]">
                        <Select
                          placeholder="QA"
                          options={userOptions}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* ================= ACTIONS ================= */}
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

export default LineClearanceProcessingArea;
