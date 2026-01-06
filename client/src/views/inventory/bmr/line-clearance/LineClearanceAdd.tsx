import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  getLineClearance,
  saveLineClearance,
  updateLineClearance,
} from 'src/features/Inventorymodule/BMR/BmrCreation/BmrCreationSlice';

interface LineClearanceAddProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  priviousProduct: any[];
  staff: any[];
  logindata: any;
  recordId: any;
}

const yesNoNaOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'NA', label: 'NA' },
];

const selectStyles = {
  menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
};

const LineClearanceAdd: React.FC<LineClearanceAddProps> = ({
  openModal,
  setOpenModal,
  priviousProduct,
  logindata,
  staff,
  recordId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({
    user_id: logindata?.admin?.id,
    bmr_id: recordId,
    clearance_date: '',
    bmr_product_id: null,
    batch_no: '',
    cleaning_by: null,
    checked_by: null,
    key_points: {
      prev_batch_material: { cleaning: null, checked: null },
      prev_batch_labels: { cleaning: null, checked: null },
      area_cleanliness: { cleaning: null, checked: null },
      weighing_balance_calibration: { cleaning: null, checked: null },
    },
  });

  const productOptions =
    priviousProduct?.map((item: any) => ({
      value: item.id,
      label: item.product_name,
    })) || [];

  const staffOptions =
    staff?.map((item: any) => ({
      value: item.id,
      label: item.full_name,
    })) || [];

  const handleKeyPointChange = (key: string, type: 'cleaning' | 'checked', option: any) => {
    setFormData((prev: any) => ({
      ...prev,
      key_points: {
        ...prev.key_points,
        [key]: {
          ...prev.key_points[key],
          [type]: option,
        },
      },
    }));
  };

  useEffect(() => {
    if (!openModal || !recordId) return;

    dispatch(getLineClearance(recordId))
      .unwrap()
      .then((res) => {
        if (!res?.data) return;

        const response = res.data;

        setEditId(response.id);

        setFormData({
          user_id: response.user_id,
          bmr_id: response.bmr_id,
          clearance_date: response.clearance_date,
          batch_no: response.batch_no,

          bmr_product_id: productOptions.find((p) => p.value === response.bmr_product_id) || null,

          cleaning_by: staffOptions.find((s) => s.value === response.cleaning_by) || null,

          checked_by: staffOptions.find((s) => s.value === response.checked_by) || null,

          key_points: response.key_points.reduce((acc: any, kp: any) => {
            acc[kp.key_name] = {
              cleaning: yesNoNaOptions.find((o) => o.value === kp.cleaning_status) || null,
              checked: yesNoNaOptions.find((o) => o.value === kp.checked_status) || null,
            };
            return acc;
          }, {}),
        });
      });
  }, [openModal, recordId, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      cleaning_by: formData.cleaning_by?.value,
      checked_by: formData.checked_by?.value,
      bmr_product_id: formData.bmr_product_id?.value,
      key_points: Object.fromEntries(
        Object.entries(formData.key_points).map(([k, v]: any) => [
          k,
          {
            cleaning: v.cleaning?.value,
            checked: v.checked?.value,
          },
        ]),
      ),
    };

    try {
      if (editId) {
        await dispatch(updateLineClearance({ id: editId, payload })).unwrap();
        toast.success('Line Clearance Updated');
      } else {
        await dispatch(saveLineClearance(payload)).unwrap();
        toast.success('Line Clearance Saved');
      }
      setOpenModal(false);
    } catch {
      toast.error('Operation Failed');
    }
  };

  const KeyPointRow = ({ label, name }: any) => (
    <div className="grid grid-cols-12 gap-3 col-span-12">
      <div className="col-span-12 lg:col-span-4 font-medium">{label}</div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-4">
        <Label className="lg:hidden mb-1 block" value="Cleaning Done By (Production)" />
        <Select
          value={formData.key_points[name].cleaning}
          options={yesNoNaOptions}
          menuPortalTarget={document.body}
          styles={selectStyles}
          onChange={(opt) => handleKeyPointChange(name, 'cleaning', opt)}
        />
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-4">
        <Label className="lg:hidden mb-1 block" value="Checked By (QA)" />
        <Select
          value={formData.key_points[name].checked}
          options={yesNoNaOptions}
          menuPortalTarget={document.body}
          styles={selectStyles}
          onChange={(opt) => handleKeyPointChange(name, 'checked', opt)}
        />
      </div>
    </div>
  );

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="3xl">
      <Modal.Header>Line Clearance Dispensing</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <Label value="Clearance Date" />
            <TextInput
              type="date"
              value={formData.clearance_date}
              onChange={(e) => setFormData({ ...formData, clearance_date: e.target.value })}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Label value="Previous Product" />
            <Select
              value={formData.bmr_product_id}
              options={productOptions}
              menuPortalTarget={document.body}
              styles={selectStyles}
              onChange={(opt) => setFormData({ ...formData, bmr_product_id: opt })}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Label value="Batch No" />
            <TextInput
              value={formData.batch_no}
              onChange={(e) => setFormData({ ...formData, batch_no: e.target.value })}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Label value="Cleaning Done By" />
            <Select
              value={formData.cleaning_by}
              options={staffOptions}
              menuPortalTarget={document.body}
              styles={selectStyles}
              onChange={(opt) => setFormData({ ...formData, cleaning_by: opt })}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Label value="Checked By" />
            <Select
              value={formData.checked_by}
              options={staffOptions}
              menuPortalTarget={document.body}
              styles={selectStyles}
              onChange={(opt) => setFormData({ ...formData, checked_by: opt })}
            />
          </div>

          <div className="hidden lg:grid col-span-12 grid-cols-12 font-semibold border-b pb-2 mt-4">
            <div className="col-span-4">Key Points</div>
            <div className="col-span-4">Cleaning Done By</div>
            <div className="col-span-4">Checked By</div>
          </div>

          <KeyPointRow label="Absence of previous batch material" name="prev_batch_material" />
          <KeyPointRow label="Absence of previous batch labels" name="prev_batch_labels" />
          <KeyPointRow label="Cleanliness of area" name="area_cleanliness" />
          <KeyPointRow
            label="Calibration of weighing balances"
            name="weighing_balance_calibration"
          />

          <div className="col-span-12 flex justify-end gap-3 mt-4">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default LineClearanceAdd;
