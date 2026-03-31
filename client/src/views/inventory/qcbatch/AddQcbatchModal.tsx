import { Field } from '@headlessui/react';
import { Modal, ModalBody, ModalHeader, Button, TextInput, Label, Select } from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  GetAllQcbatch,
  qcBatchadd,
} from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import { AppDispatch } from 'src/store';

const AddQcbatchModal = ({ placeModal, setPlaceModal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    batch_no: '',
    product_name: '',
    mfg_date: '',
    exp_date: '',
    grade: '',
    size: '',
    work_order_no: '',
  });

  const [manualGrade, setManualGrade] = useState('');

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const finalGrade = form.grade === 'Manual' ? manualGrade : form.grade;

      if (!finalGrade) {
        toast.error('Please select or enter grade.');
        return;
      }

      const result = await dispatch(
        qcBatchadd({
          qc_batch_number: form.batch_no,
          product_name: form.product_name,
          mfg_date: form.mfg_date,
          exp_date: form.exp_date,
          grade: finalGrade,
          size: form.size,
          work_order_no: form.work_order_no,
          user_id: logindata?.admin?.id,
        }),
      );

      if (result.payload) {
        if (result.payload.message) {
          dispatch(GetAllQcbatch());

          setForm({
            batch_no: '',
            product_name: '',
            work_order_no: '',
            mfg_date: '',
            exp_date: '',
            grade: '',
            size: '',
          });

          setManualGrade('');

          toast.success('QC Batch created successfully.');
          setPlaceModal(false);
        } else {
          toast.error(result.payload);
        }
      } else {
        toast.error('Failed to create QC Batch.');
      }
    } catch (error: any) {
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
          <h3 className="mb-5 text-lg font-normal text-gray-500">Add Batch Number</h3>

          <div className="grid grid-cols-2 gap-4 text-left">
            {/* Batch Number */}
            <Field>
              <Label className="mb-2 block font-medium">Batch Number</Label>
              <TextInput
                name="batch_no"
                placeholder="Enter Batch Number"
                value={form.batch_no}
                onChange={handleChange}
              />
            </Field>

            {/* Product Name */}
            <Field>
              <Label className="mb-2 block font-medium">Product Name</Label>
              <TextInput
                name="product_name"
                placeholder="Enter Product Name"
                value={form.product_name}
                onChange={handleChange}
              />
            </Field>

            {/* MFG Date */}
            <Field>
              <Label className="mb-2 block font-medium">Mfg Date</Label>
              <TextInput
                type="date"
                name="mfg_date"
                value={form.mfg_date}
                onChange={handleChange}
              />
            </Field>

            {/* EXP Date */}
            <Field>
              <Label className="mb-2 block font-medium">Exp Date</Label>
              <TextInput
                type="date"
                name="exp_date"
                value={form.exp_date}
                onChange={handleChange}
              />
            </Field>

            {/* Size */}
            <Field>
              <Label className="mb-2 block font-medium">Size</Label>
              <TextInput
                type="text"
                name="size"
                placeholder="Enter Size"
                value={form.size}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <Label className="mb-2 block font-medium">Work order no.</Label>
              <TextInput
                type="text"
                name="work_order_no"
                placeholder="Enter Work order no."
                value={form.work_order_no}
                onChange={handleChange}
              />
            </Field>

            {/* Grade Select */}
            <Field>
              <Label className="mb-2 block font-medium">Grade</Label>
              <Select
                name="grade"
                value={form.grade}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    grade: value,
                  }));

                  if (value !== 'Manual') {
                    setManualGrade('');
                  }
                }}
              >
                <option value="">Select Grade</option>
                <option value="IP">IP</option>
                <option value="BP">BP</option>
                <option value="EP">EP</option>
                <option value="USP">USP</option>
                <option value="FCC">FCC</option>
                <option value="Other">Other</option>
                <option value="Manual">Manual</option>
              </Select>
            </Field>

            {/* Manual Grade Input */}
            {form.grade === 'Manual' && (
              <Field className="col-span-2">
                <Label className="mb-2 block font-medium">Enter Manual Grade</Label>
                <TextInput
                  placeholder="Enter Custom Grade"
                  value={manualGrade}
                  onChange={(e) => setManualGrade(e.target.value)}
                />
              </Field>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center gap-4 mt-6">
            <Button color="success" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AddQcbatchModal;
