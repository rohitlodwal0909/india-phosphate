import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  getIssuedPM,
  getProductionBatch,
  issuedPM,
} from 'src/features/Inventorymodule/InventoryIssued/PMIssueSlice';

interface PmIssuedAddProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const PmIssuedAdd: React.FC<PmIssuedAddProps> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const batches = useSelector((state: RootState) => state.pmissue.batches) as any;

  const [formData, setFormData] = useState<any>({
    pm_id: '',
    quantity: '',
    issued_bag: '',
    ref_no: '',
    person_name: '',
    batch_id: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [pmList, setPmList] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getProductionBatch());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Prevent negative values
    if ((name === 'quantity' || name === 'issued_bag') && Number(value) < 0) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const BatchOptions =
    batches?.map((item) => ({
      value: item.id,
      label: item.qc_batch_number,
      production_results: item.production_results,
    })) || [];

  const pmOptions =
    pmList?.map((item) => ({
      value: item.pm_code,
      label: item.pmcodes?.name,
      maxQty: Number(item.pm_quantity),
    })) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['pm_id', 'quantity', 'issued_bag', 'person_name', 'ref_no', 'batch_id'];

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
        pm_id: '',
        quantity: '',
        issued_bag: '',
        ref_no: '',
        person_name: '',
        batch_id: '',
        date: '',
      });

      setMaxQuantity(0);
      setOpenModal(false);

      dispatch(getIssuedPM());
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
            <Label value="Batch No." />
            <Select
              options={BatchOptions}
              value={BatchOptions.find((opt) => opt.value === formData.batch_id) || null}
              onChange={(selected: any) => {
                // Batch set
                setFormData({
                  ...formData,
                  batch_id: selected?.value,
                  pm_id: '',
                });
                setPmList(selected?.production_results || []);
                setMaxQuantity(0);
                setErrors({ ...errors, batch_id: '' });
              }}
            />
            {errors.batch_id && <span className="text-red-500 text-sm">{errors.batch_id}</span>}
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Product Name" />
            <Select
              options={pmOptions}
              value={pmOptions.find((opt) => opt.value === formData.pm_id) || null}
              onChange={(selected: any) => {
                setFormData({ ...formData, pm_id: selected?.value });
                setMaxQuantity(selected?.maxQty || 0);
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
