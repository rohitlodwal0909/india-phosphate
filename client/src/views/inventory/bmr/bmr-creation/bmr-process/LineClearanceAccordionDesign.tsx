import { Accordion, Button, Label, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveLineClearance } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

const yesNoNaOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'NA', label: 'NA' },
];

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const LineClearanceAccordionDesign = ({ bmr, data }: any) => {
  const { id } = useParams();

  const [form, setForm] = useState({
    id: null,
    bmr_id: id,
    clearance_date: '',
    previous_product: null,
    cleaning_done_by: '',
    checked_by: '',
    key_points: {
      absence_material: { cleaning: null, checked: null },
      absence_labels: { cleaning: null, checked: null },
      cleanliness_area: { cleaning: null, checked: null },
      calibration_balance: { cleaning: null, checked: null },
    },
  });

  useEffect(() => {
    if (data) {
      const lc = data;

      const updatedKeyPoints = { ...form.key_points };

      lc.key_points.forEach((kp: any) => {
        updatedKeyPoints[kp.key_name] = {
          cleaning: yesNoNaOptions.find((o) => o.value === kp.cleaning_status) || null,
          checked: yesNoNaOptions.find((o) => o.value === kp.checked_status) || null,
        };
      });

      setForm({
        ...form,
        id: lc.id, // 🔥 IMPORTANT (for update)
        bmr_id: lc.bmr_id,
        clearance_date: lc.clearance_date,
        cleaning_done_by: lc.cleaning_by,
        checked_by: lc.checked_by,
        key_points: updatedKeyPoints,
      });
    }
  }, [data]);

  // 🔹 KEY POINT ROW COMPONENT
  const KeyPointRow = ({ label, keyName }: any) => (
    <div className="grid grid-cols-12 gap-3 py-2">
      <div className="col-span-12 lg:col-span-4 font-medium text-gray-700">{label}</div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-4">
        <Select
          options={yesNoNaOptions}
          value={form.key_points[keyName].cleaning}
          onChange={(val) =>
            setForm((prev) => ({
              ...prev,
              key_points: {
                ...prev.key_points,
                [keyName]: {
                  ...prev.key_points[keyName],
                  cleaning: val,
                },
              },
            }))
          }
          styles={selectStyles}
          menuPortalTarget={document.body}
        />
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-4">
        <Select
          options={yesNoNaOptions}
          value={form.key_points[keyName].checked}
          onChange={(val) =>
            setForm((prev) => ({
              ...prev,
              key_points: {
                ...prev.key_points,
                [keyName]: {
                  ...prev.key_points[keyName],
                  checked: val,
                },
              },
            }))
          }
          styles={selectStyles}
          menuPortalTarget={document.body}
        />
      </div>
    </div>
  );

  const dispatch = useDispatch<any>();
  // 🔹 SUBMIT HANDLER
  const handleSubmit = async () => {
    const payload = {
      id: form.id, // 🔥 backend update ke liye
      bmr_id: form.bmr_id,
      clearance_date: form.clearance_date,
      previous_product: form.previous_product,
      cleaning_done_by: form.cleaning_done_by,
      checked_by: form.checked_by,
      key_points: Object.entries(form.key_points).map(([key, value]: any) => ({
        key_name: key,
        cleaning_status: value.cleaning?.value,
        checked_status: value.checked?.value,
      })),
    };

    try {
      await dispatch(saveLineClearance(payload)).unwrap();
      toast.success(form.id ? 'Line Clearance Updated' : 'Line Clearance Saved');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

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
                <TextInput
                  type="date"
                  value={form?.clearance_date}
                  onChange={(e) => setForm({ ...form, clearance_date: e.target.value })}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Previous Product" />
                <Select
                  placeholder="Select Product"
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  onChange={(val) => setForm({ ...form, previous_product: val })}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Batch No" />
                <TextInput value={bmr?.records?.qc_batch_number} readOnly />
              </div>
            </div>

            {/* STAFF DETAILS */}
            <div className="grid grid-cols-12 gap-4 pt-4">
              <div className="col-span-12 sm:col-span-6">
                <Label value="Cleaning Done By" />
                <TextInput
                  value={form?.cleaning_done_by}
                  placeholder="Cleaning By"
                  onChange={(e) => setForm({ ...form, cleaning_done_by: e.target.value })}
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <Label value="Checked By" />
                <TextInput
                  value={form?.checked_by}
                  placeholder="Checked By"
                  onChange={(e) => setForm({ ...form, checked_by: e.target.value })}
                />
              </div>
            </div>

            {/* HEADER */}
            <div className="hidden lg:grid grid-cols-12 font-semibold text-gray-600 border-b pb-2 mb-3 pt-4">
              <div className="col-span-4">Key Point</div>
              <div className="col-span-4">Cleaning Done</div>
              <div className="col-span-4">Checked</div>
            </div>

            {/* KEY POINT ROWS */}
            <KeyPointRow label="Absence of previous batch material" keyName="absence_material" />
            <KeyPointRow label="Absence of previous batch labels" keyName="absence_labels" />
            <KeyPointRow label="Cleanliness of area" keyName="cleanliness_area" />
            <KeyPointRow label="Calibration of weighing balances" keyName="calibration_balance" />

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button color="gray">Cancel</Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default LineClearanceAccordionDesign;
