import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { AppDispatch } from 'src/store';
import {
  getIssuedRawMaterial,
  getStoreRM,
  updateIssuedRawMaterial, // 👈 agar separate update action ho to use replace karein
} from 'src/features/Inventorymodule/InventoryIssued/RMIssueSlice';

interface PmIssuedEditProps {
  openModal: boolean;
  data: any; // selected row
  setOpenModal: (val: boolean) => void;
  storeRawMaterial: any[];
  logindata: any;
}

const PmIssuedEdit: React.FC<PmIssuedEditProps> = ({
  openModal,
  data,
  setOpenModal,
  storeRawMaterial,
  logindata,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    id: '',
    user_id: logindata?.admin?.id,
    rm_id: '',
    quantity: '',
    person_name: '',
    batch_no: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  /* =======================
     PREFILL FORM
  ======================= */
  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        user_id: logindata?.admin?.id,
        rm_id: data.rm_id,
        quantity: data.quantity,
        person_name: data.person_name,
        batch_no: data.batch_no,
      });

      const storeItem = storeRawMaterial?.find((i: any) => i.id === data.issueRm?.id);

      setMaxQuantity((storeItem?.total_quantity || 0) + Number(data.quantity));
    }
  }, [data, storeRawMaterial, logindata]);

  /* =======================
     INPUT CHANGE
  ======================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  console.log(storeRawMaterial);
  /* =======================
     RM OPTIONS
  ======================= */
  const rmOptions =
    storeRawMaterial?.map((item) => ({
      value: item.id,
      label: item.name,
      total_quantity: item.total_quantity,
    })) || [];

  /* =======================
     UPDATE SUBMIT
  ======================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['rm_id', 'quantity', 'person_name', 'batch_no'];
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
        updateIssuedRawMaterial({
          ...formData,
        }),
      ).unwrap();

      toast.success('Raw material updated successfully');

      setOpenModal(false);
      dispatch(getIssuedRawMaterial());
      dispatch(getStoreRM());
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit RM Issued</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* RM */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Product Name" />
            <Select
              options={rmOptions}
              value={rmOptions.find((opt) => opt.value === formData.rm_id) || null}
              onChange={(selected: any) => {
                setFormData({ ...formData, rm_id: selected?.value });
                setMaxQuantity(selected?.total_quantity || 0);
                setErrors({ ...errors, rm_id: '' });
              }}
            />
            {errors.rm_id && <span className="text-red-500 text-sm">{errors.rm_id}</span>}
          </div>

          {/* QUANTITY */}
          <div className="sm:col-span-6 col-span-12">
            <Label value={`Quantity (Max ${maxQuantity})`} />
            <TextInput
              type="number"
              name="quantity"
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

          {/* BATCH */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Batch No." />
            <TextInput name="batch_no" value={formData.batch_no} onChange={handleChange} />
            {errors.batch_no && <span className="text-red-500 text-sm">{errors.batch_no}</span>}
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
