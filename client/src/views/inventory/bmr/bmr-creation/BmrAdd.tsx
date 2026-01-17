import React, { useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { saveBmrRecord } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrCreationSlice';

interface BmrAddProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  StoreData: any[];
  logindata: any;
}

const BmrAdd: React.FC<BmrAddProps> = ({ openModal, setOpenModal, StoreData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    user_id: logindata?.admin?.id,
    batch_id: '',
    product_name: '',
    mfg_date: '',
    exp_date: '',
    mfg_start: '',
    remarks: '',
  });

  const [errors, setErrors] = useState<any>({});

  // ------------------ INPUT CHANGE ------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // ------------------ BATCH OPTIONS ------------------
  const batchOptions =
    StoreData?.map((item: any) => ({
      value: item.id, // product / batch id
      label: item.qc_batch_number, // Batch No
      product_name: item.product_name,
      mfg_date: item.mfg_date,
      exp_date: item.exp_date,
    })) || [];

  // ------------------ SUBMIT ------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['batch_id', 'mfg_date', 'exp_date', 'mfg_start'];

    const newErrors: any = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await dispatch(saveBmrRecord(formData)).unwrap();
      if (res) {
        toast.success('BMR Added Successfully');

        setFormData({
          user_id: logindata?.admin?.id,
          batch_id: '',
          product_name: '',
          mfg_date: '',
          exp_date: '',
          mfg_start: '',
          remarks: '',
        });
        setOpenModal(false);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add BMR');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>BMR Details</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* BATCH NO */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Batch No" />
            <Select
              options={batchOptions}
              value={batchOptions.find((opt: any) => opt.value === formData.batch_id) || null}
              onChange={(selected: any) => {
                setFormData({
                  ...formData,
                  batch_id: selected?.value,
                  product_name: selected?.product_name,
                  mfg_date: selected?.mfg_date,
                  exp_date: selected?.exp_date,
                });
                setErrors({ ...errors, batch_id: '' });
              }}
            />
            {errors.batch_id && <span className="text-red-500 text-sm">{errors.batch_id}</span>}
          </div>

          {/* PRODUCT NAME */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Product Name" />
            <TextInput value={formData.product_name} readOnly />
          </div>

          {/* MFG DATE */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Mfg Date" />
            <TextInput
              type="date"
              name="mfg_date"
              value={formData.mfg_date}
              onChange={handleChange}
            />
            {errors.mfg_date && <span className="text-red-500 text-sm">{errors.mfg_date}</span>}
          </div>

          {/* EXP DATE */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Exp Date" />
            <TextInput
              type="date"
              name="exp_date"
              value={formData.exp_date}
              onChange={handleChange}
            />
            {errors.exp_date && <span className="text-red-500 text-sm">{errors.exp_date}</span>}
          </div>

          {/* MFG START */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Mfg Start" />
            <TextInput
              type="datetime-local"
              name="mfg_start"
              value={formData.mfg_start}
              onChange={handleChange}
            />
            {errors.mfg_start && <span className="text-red-500 text-sm">{errors.mfg_start}</span>}
          </div>

          {/* REMARKS */}
          <div className="col-span-12">
            <Label value="Remarks" />
            <Textarea
              name="remarks"
              placeholder="Enter remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default BmrAdd;
