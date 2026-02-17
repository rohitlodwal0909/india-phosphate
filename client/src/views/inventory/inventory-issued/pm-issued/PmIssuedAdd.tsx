import React, { useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  getIssuedPM,
  getStorePM,
  issuedPM,
} from 'src/features/Inventorymodule/InventoryIssued/PMIssueSlice';

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
    pm_id: '',
    quantity: '',
    issued_bag: '',
    ref_no: '',
    person_name: '',
    batch_no: '',
    date: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Prevent negative values
    if ((name === 'quantity' || name === 'issued_bag') && Number(value) < 0) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const rmOptions =
    storeRawMaterial?.map((item) => ({
      value: item.id,
      label: item.name,
      total_quantity: item.total_quantity,
    })) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['pm_id', 'quantity', 'issued_bag', 'person_name', 'ref_no', 'batch_no'];

    const newErrors: any = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    const quantity = Number(formData.quantity);
    const issuedBag = Number(formData.issued_bag);

    // Max stock validation
    if (quantity > maxQuantity) {
      newErrors.quantity = `Maximum allowed quantity is ${maxQuantity}`;
    }

    // Issued bag should not exceed printed quantity
    if (issuedBag > quantity) {
      newErrors.issued_bag = 'Issued bag cannot be greater than printed quantity';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(issuedPM(formData)).unwrap();

      toast.success('PM issued successfully');

      setFormData({
        user_id: logindata?.admin?.id,
        pm_id: '',
        quantity: '',
        issued_bag: '',
        ref_no: '',
        person_name: '',
        batch_no: '',
        date: '',
      });

      setMaxQuantity(0);
      setOpenModal(false);

      dispatch(getIssuedPM());
      dispatch(getStorePM());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to issue PM');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>PM Issued</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* PRODUCT */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Product Name" />
            <Select
              options={rmOptions}
              value={rmOptions.find((opt) => opt.value === formData.pm_id) || null}
              onChange={(selected: any) => {
                setFormData({ ...formData, pm_id: selected?.value });
                setMaxQuantity(selected?.total_quantity || 0);
                setErrors({ ...errors, pm_id: '' });
              }}
            />
            {errors.pm_id && <span className="text-red-500 text-sm">{errors.pm_id}</span>}
          </div>

          {/* PRINTED QUANTITY */}
          <div className="sm:col-span-6 col-span-12">
            <Label value={`Printed Bag (Max ${maxQuantity})`} />
            <TextInput
              type="number"
              name="quantity"
              placeholder="Enter printed quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
          </div>

          {/* ISSUED BAG */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Issued Bag" />
            <TextInput
              type="number"
              name="issued_bag"
              placeholder="Enter issued bag"
              value={formData.issued_bag}
              onChange={handleChange}
            />
            {errors.issued_bag && <span className="text-red-500 text-sm">{errors.issued_bag}</span>}
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

          {/* QC REF */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="QC Reference Number" />
            <TextInput
              name="ref_no"
              placeholder="Enter Reference Number"
              value={formData.ref_no}
              onChange={handleChange}
            />
            {errors.ref_no && <span className="text-red-500 text-sm">{errors.ref_no}</span>}
          </div>

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
