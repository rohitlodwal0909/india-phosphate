import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { AppDispatch, RootState } from 'src/store';
import {
  getIssuedPM,
  getProductionBatch,
  getStorePM,
  updateIssuedPM,
} from 'src/features/Inventorymodule/InventoryIssued/PMIssueSlice';

interface PmIssuedEditProps {
  openModal: boolean;
  data: any; // selected row
  setOpenModal: (val: boolean) => void;
}

const PmIssuedEdit: React.FC<PmIssuedEditProps> = ({ openModal, data, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const batches = useSelector((state: RootState) => state.pmissue.batches) as any;

  const [formData, setFormData] = useState<any>({
    id: '',
    pm_id: '',
    quantity: '',
    person_name: '',
    batch_no: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [pmList, setPmList] = useState<any[]>([]);

  /* =======================
     PREFILL FORM
  ======================= */
  // useEffect(() => {
  //   if (data && batches?.length) {
  //     const selectedBatch = batches.find((b: any) => b.id === data.batch_id);

  //     const production = selectedBatch?.production_results || [];

  //     setPmList(production);

  //     // find selected PM
  //     const selectedPM = production.find((p: any) => p.pm_code == data.pm_id);

  //     setFormData({
  //       id: data.id,
  //       batch_id: data.batch_id,
  //       pm_id: data.pm_id,
  //       quantity: data.quantity,
  //       person_name: data.person_name,
  //       batch_no: data.batch_no,
  //       ref_no: data.ref_no,
  //     });

  //     // 🔥 max qty = available + already issued
  //     setMaxQuantity(Number(selectedPM?.pm_quantity || 0) + Number(data.quantity || 0));
  //   }
  // }, [data, batches]);

  useEffect(() => {
    if (!data) return;
    if (!batches?.length) return;

    const selectedBatch = batches.find((b: any) => b.id == data.batch_id);

    if (!selectedBatch) return;

    const production = selectedBatch.production_results || [];

    // ✅ set PM list
    setPmList(production);

    const selectedPM = production.find((p: any) => p.pm_code == data.pm_id);

    setFormData({
      id: data.id,
      batch_id: data.batch_id,
      pm_id: data.pm_id,
      quantity: data.quantity,
      person_name: data.person_name,
      ref_no: data.ref_no,
    });

    const producedQty = Number(selectedPM?.pm_quantity || 0);

    setMaxQuantity(producedQty);
  }, [data, batches]);

  useEffect(() => {
    dispatch(getProductionBatch());
  }, [dispatch]);

  /* =======================
     INPUT CHANGE
  ======================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  /* =======================
     RM OPTIONS
  ======================= */
  const batchOptions =
    batches?.map((item: any) => ({
      value: item.id,
      label: item.qc_batch_number,
      production_results: item.production_results,
    })) || [];

  const pmOptions =
    pmList?.map((item: any) => ({
      value: item.pm_code,
      label: item.pmcodes?.name,
      maxQty: Number(item.pm_quantity),
    })) || [];

  /* =======================
     UPDATE SUBMIT
  ======================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['pm_id', 'quantity', 'person_name', 'batch_id'];
    const newErrors: any = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Number(formData.quantity) > maxQuantity) {
      newErrors.quantity = `Maximum allowed quantity is ${maxQuantity}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(
        updateIssuedPM({
          ...formData,
        }),
      ).unwrap();

      toast.success('PM updated successfully');

      setOpenModal(false);
      dispatch(getIssuedPM());
      dispatch(getStorePM());
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit PM Issued</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* RM */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Batch No." />

            <Select
              options={batchOptions}
              value={batchOptions.find((opt) => opt.value === formData.batch_id) || null}
              onChange={(selected: any) => {
                setFormData({
                  ...formData,
                  batch_id: selected?.value,
                  pm_id: '',
                });

                setPmList(selected?.production_results || []);
                setMaxQuantity(0);
              }}
            />
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Product Name" />

            <Select
              options={pmOptions}
              value={pmOptions.find((opt) => opt.value == formData.pm_id) || null}
              onChange={(selected: any) => {
                setFormData({
                  ...formData,
                  pm_id: selected?.value,
                });

                setMaxQuantity(selected?.maxQty || 0);
              }}
            />

            {errors.pm_id && <span className="text-red-500 text-sm">{errors.pm_id}</span>}
          </div>

          {/* QUANTITY */}
          <div className="sm:col-span-6 col-span-12">
            <Label value={`Quantity (Max ${maxQuantity})`} />
            <TextInput
              type="number"
              name="quantity"
              max={maxQuantity}
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
          </div>

          {/* PERSON */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Person Name" />
            <TextInput name="person_name" value={formData.person_name} onChange={handleChange} />
            {errors.person_name && (
              <span className="text-red-500 text-sm">{errors.person_name}</span>
            )}
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Qc Reference Number." />
            <TextInput
              name="ref_no"
              placeholder="Enter Reference Number"
              value={formData.ref_no}
              onChange={handleChange}
            />
            {errors.ref_no && <span className="text-red-500 text-sm">{errors.ref_no}</span>}
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

export default PmIssuedEdit;
