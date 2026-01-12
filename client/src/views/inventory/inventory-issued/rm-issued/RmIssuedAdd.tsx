import React, { useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  getIssuedRawMaterial,
  getStoreRM,
  issuedRawMaterial,
} from 'src/features/Inventorymodule/InventoryIssued/RMIssueSlice';

interface PmIssuedAddProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  storeRawMaterial: any[];
  logindata: any;
}

const PmIssuedAdd: React.FC<PmIssuedAddProps> = ({
  openModal,
  setOpenModal,
  storeRawMaterial,
  logindata,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<any>({
    user_id: logindata?.admin?.id,
    rm_id: '',
    quantity: '',
    person_name: '',
    batch_no: '',
    date: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  // 🔁 Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // ✅ Raw Material Options
  const rmOptions =
    storeRawMaterial?.map((item) => ({
      value: item.id,
      label: item.name,
      total_quantity: item.total_quantity,
    })) || [];

  // ✅ Submit
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
        issuedRawMaterial({
          ...formData,
        }),
      ).unwrap();

      toast.success('Raw material issued successfully');

      setFormData({
        user_id: logindata?.admin?.id,
        rm_id: '',
        quantity: '',
        person_name: '',
        batch_no: '',
        date: '',
      });

      setMaxQuantity(0);
      setOpenModal(false);
      dispatch(getIssuedRawMaterial());
      dispatch(getStoreRM());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add BMR');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>RM Issued</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* PRODUCT */}
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
              placeholder="Enter Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
          </div>

          {/* PERSON */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Person Name" />
            <TextInput
              name="person_name"
              placeholder="Enter name"
              value={formData.person_name}
              onChange={handleChange}
            />
            {errors.person_name && (
              <span className="text-red-500 text-sm">{errors.person_name}</span>
            )}
          </div>

          {/* BATCH */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Batch No." />
            <TextInput
              name="batch_no"
              placeholder="Enter Batch No."
              value={formData.batch_no}
              onChange={handleChange}
            />
            {errors.batch_no && <span className="text-red-500 text-sm">{errors.batch_no}</span>}
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

export default PmIssuedAdd;
