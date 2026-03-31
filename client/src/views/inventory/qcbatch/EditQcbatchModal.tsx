import { Field } from '@headlessui/react';
import { Modal, ModalBody, ModalHeader, Button, TextInput, Label, Select } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  GetAllQcbatch,
  qcBatchUpdate,
} from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import { AppDispatch } from 'src/store';

const gradeOptions = ['IP', 'BP', 'EP', 'USP', 'FCC', 'Other'];

const EditQcbatchModal = ({ placeModal, setPlaceModal, logindata, row }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    id: '',
    batch_no: '',
    product_name: '',
    mfg_date: '',
    exp_date: '',
    grade: '',
    size: '',
    work_order_no: '',
  });

  const [manualGrade, setManualGrade] = useState('');

  // ✅ Auto detect grade
  useEffect(() => {
    if (row) {
      const existingGrade = row?.grade || '';

      if (gradeOptions.includes(existingGrade)) {
        // Dropdown me available hai
        setForm({
          id: row?.id || '',
          batch_no: row?.qc_batch_number || '',
          product_name: row?.product_name || '',
          mfg_date: row?.mfg_date || '',
          exp_date: row?.exp_date || '',
          work_order_no: row?.work_order_no || '',
          grade: existingGrade,
          size: row?.size || '',
        });
        setManualGrade('');
      } else {
        // Dropdown me nahi hai → Manual
        setForm({
          id: row?.id || '',
          batch_no: row?.qc_batch_number || '',
          product_name: row?.product_name || '',
          mfg_date: row?.mfg_date || '',
          exp_date: row?.exp_date || '',
          work_order_no: row?.work_order_no || '',
          grade: 'Manual',
          size: row?.size || '',
        });
        setManualGrade(existingGrade);
      }
    }
  }, [row]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Agar Manual select kare to manualGrade reset
    if (name === 'grade' && value !== 'Manual') {
      setManualGrade('');
    }
  };

  const handleSubmit = async () => {
    try {
      const finalGrade = form.grade === 'Manual' ? manualGrade : form.grade;

      if (!finalGrade) {
        toast.error('Please select or enter grade.');
        return;
      }

      const result = await dispatch(
        qcBatchUpdate({
          id: form.id,
          qc_batch_number: form.batch_no,
          product_name: form.product_name,
          mfg_date: form.mfg_date,
          exp_date: form.exp_date,
          work_order_no: form?.work_order_no || '',
          grade: finalGrade, // ✅ correct grade send
          size: form.size,
          user_id: logindata?.admin?.id,
        }),
      );

      if (result.payload?.message) {
        dispatch(GetAllQcbatch());
        toast.success('QC Batch updated successfully.');
        setPlaceModal(false);
      } else {
        toast.error('Update failed.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal
      show={placeModal}
      size="2xl"
      onClose={() => setPlaceModal(false)}
      popup
      className="rounded-t-md"
    >
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500">Edit Batch</h3>

          <div className="grid grid-cols-2 gap-4 text-left">
            <Field>
              <Label className="mb-2 block font-medium">Batch Number</Label>
              <TextInput name="batch_no" value={form.batch_no} onChange={handleChange} />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Product Name</Label>
              <TextInput name="product_name" value={form.product_name} onChange={handleChange} />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Mfg Date</Label>
              <TextInput
                type="date"
                name="mfg_date"
                value={form.mfg_date}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Exp Date</Label>
              <TextInput
                type="date"
                name="exp_date"
                value={form.exp_date}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Size</Label>
              <TextInput name="size" value={form.size} onChange={handleChange} />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Work order no.</Label>
              <TextInput name="work_order_no" value={form.work_order_no} onChange={handleChange} />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Grade</Label>
              <Select name="grade" value={form.grade} onChange={handleChange}>
                <option value="">Select Grade</option>
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="Manual">Manual</option>
              </Select>
            </Field>
          </div>

          {/* ✅ Manual Input Field */}
          {form.grade === 'Manual' && (
            <div className="mt-4 text-left">
              <Field>
                <Label className="mb-2 block font-medium">Enter Manual Grade</Label>
                <TextInput
                  placeholder="Enter Custom Grade"
                  value={manualGrade}
                  onChange={(e) => setManualGrade(e.target.value)}
                />
              </Field>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <Button color="success" onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EditQcbatchModal;
