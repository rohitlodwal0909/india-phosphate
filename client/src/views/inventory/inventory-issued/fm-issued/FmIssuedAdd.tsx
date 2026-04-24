import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getBatches, issuedFM } from 'src/features/Inventorymodule/InventoryIssued/FMIssuedSlice';

interface FmIssuedAddProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const FmIssuedAdd: React.FC<FmIssuedAddProps> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { batches } = useSelector((state: RootState) => state.issuedFM) as any;

  const [formData, setFormData] = useState({
    finish_id: '',
    issued_qty: '',
    work_order_no: '',
    remark: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  /* ===============================
     LOAD BATCHES
  =============================== */
  useEffect(() => {
    dispatch(getBatches());
  }, [dispatch]);

  /* ===============================
     BATCH OPTIONS (USE remaining_qty)
  =============================== */

  const batchOptions =
    batches?.map((item: any) => ({
      value: item.finishing?.id,
      label: `${item.qc_batch_number}`,
      remaining_qty: item.remaining_qty,
    })) || [];

  /* ===============================
     INPUT CHANGE
  =============================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: '',
    }));
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.finish_id) newErrors.finish_id = 'Batch is required';
    if (!formData.issued_qty) newErrors.issued_qty = 'Quantity is required';

    if (Number(formData.issued_qty) > maxQuantity) {
      newErrors.issued_qty = `Maximum allowed quantity is ${maxQuantity}`;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(issuedFM(formData)).unwrap();

      toast.success('FM Issued Successfully');

      setFormData({
        finish_id: '',
        issued_qty: '',
        work_order_no: '',
        remark: '',
      });

      setMaxQuantity(0);
      setOpenModal(false);

      dispatch(getBatches()); // refresh remaining qty
    } catch (err: any) {
      toast.error(err?.message || 'Failed to issue FM');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>FM Issued</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* BATCH */}
          <div className="col-span-6">
            <Label value="Batch" />

            <Select
              options={batchOptions}
              value={batchOptions.find((opt) => opt.value === formData.finish_id) || null}
              onChange={(selected: any) => {
                setFormData({
                  ...formData,
                  finish_id: selected?.value,
                });

                setMaxQuantity(selected?.remaining_qty || 0);

                setErrors({ ...errors, finish_id: '' });
              }}
            />

            {errors.finish_id && <span className="text-red-500 text-sm">{errors.finish_id}</span>}
          </div>

          {/* QUANTITY */}
          <div className="col-span-6">
            <Label value={`Issued Quantity (Max ${maxQuantity})`} />

            <TextInput
              type="number"
              name="issued_qty"
              value={formData.issued_qty}
              placeholder="Enter Quantity"
              onChange={handleChange}
            />

            {errors.issued_qty && <span className="text-red-500 text-sm">{errors.issued_qty}</span>}
          </div>

          <div className="col-span-6">
            <Label value={'Work Order No.'} />

            <TextInput
              type="text"
              name="work_order_no"
              placeholder="Enter Work order no."
              value={formData.work_order_no}
              onChange={handleChange}
            />

            {errors.work_order_no && (
              <span className="text-red-500 text-sm">{errors.work_order_no}</span>
            )}
          </div>

          {/* REMARK */}
          <div className="col-span-12">
            <Label value="Remark" />

            <Textarea
              name="remark"
              rows={3}
              value={formData.remark}
              placeholder="Enter remark"
              onChange={handleChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default FmIssuedAdd;
