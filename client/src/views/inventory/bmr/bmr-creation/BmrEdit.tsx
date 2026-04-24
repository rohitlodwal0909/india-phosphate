import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { AppDispatch } from 'src/store';
import {
  getBatches,
  updateBmrRecord,
} from 'src/features/Inventorymodule/BMR/BmrCreation/BmrCreationSlice';

interface BmrEditProps {
  openModal: boolean;
  data: any; // selected row
  setOpenModal: (val: boolean) => void;
}

const BmrEdit: React.FC<BmrEditProps> = ({ openModal, data, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { batches } = useSelector((state: any) => state.bmrRecords);

  useEffect(() => {
    dispatch(getBatches());
  }, [dispatch]);

  const [formData, setFormData] = useState<any>({
    id: '',
    bmr_product_id: '',
    batch_no: '',
    mfg_date: '',
    exp_date: '',
    mfg_start: '',
    mfg_complete: '',
    remarks: '',
  });

  const [errors, setErrors] = useState<any>({});

  /* =======================
     PREFILL FORM (🔥 KEY FIX)
  ======================= */
  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        product_name: data.product_name,
        batch_id: data.batch_id,
        mfg_date: data.mfg_date,
        exp_date: data.exp_date,
        mfg_start: data.mfg_start,
        mfg_complete: data.mfg_complete,
        remarks: data.remarks || '',
      });
    }
  }, [data]);

  /* =======================
     INPUT HANDLER
  ======================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  /* =======================
     PRODUCT OPTIONS
  ======================= */
  const batchOptions =
    batches?.map((item: any) => ({
      value: item.id, // product / batch id
      label: item.qc_batch_number, // Batch No
      product_name: item.product_name,
      mfg_date: item.mfg_date,
      exp_date: item.exp_date,
    })) || [];

  /* =======================
     UPDATE SUBMIT
  ======================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(updateBmrRecord(formData)).unwrap();
      toast.success('BMR Updated Successfully');
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="2xl">
      <Modal.Header>Edit BMR</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* PRODUCT */}
          <div className="col-span-6">
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
          </div>

          {/* BATCH NO */}
          <div className="col-span-6">
            <Label value="Product Name" />
            <TextInput name="product_name" value={formData.product_name} onChange={handleChange} />
          </div>

          {/* MFG DATE */}
          <div className="col-span-6">
            <Label value="Mfg Date" />
            <TextInput
              type="date"
              name="mfg_date"
              value={formData.mfg_date}
              onChange={handleChange}
            />
          </div>

          {/* EXP DATE */}
          <div className="col-span-6">
            <Label value="Exp Date" />
            <TextInput
              type="date"
              name="exp_date"
              value={formData.exp_date}
              onChange={handleChange}
            />
          </div>

          {/* MFG START */}
          <div className="col-span-6">
            <Label value="Mfg Start" />
            <TextInput
              type="datetime-local"
              name="mfg_start"
              value={formData.mfg_start}
              onChange={handleChange}
            />
          </div>

          {/* MFG COMPLETE */}
          <div className="col-span-6">
            <Label value="Mfg Complete" />
            <TextInput
              type="datetime-local"
              name="mfg_complete"
              value={formData.mfg_complete}
              onChange={handleChange}
            />
          </div>

          {/* REMARKS */}
          <div className="col-span-12">
            <Label value="Remarks" />
            <Textarea name="remarks" value={formData.remarks} onChange={handleChange} />
          </div>

          {/* ACTIONS */}
          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default BmrEdit;
