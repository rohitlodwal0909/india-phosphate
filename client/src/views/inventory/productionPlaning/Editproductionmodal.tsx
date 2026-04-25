import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';

import { GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import {
  getProductionPlanning,
  updateProductionPlaning,
} from 'src/features/Inventorymodule/planing/ProdutionPlaningSlice';

import { allUnits } from 'src/utils/AllUnit';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow?: any;
}

const Addproductionmodal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();

  /* ================= REDUX ================= */

  const equipments = useSelector((state: any) => state.equipment.Equipmentdata) || [];

  const materials = useSelector((state: any) => state.products.productdata) || [];

  /* ================= INITIAL ================= */

  const initialState = {
    equipment_id: '',
    material_id: '',
    quantity: '',
    unit: '',
    quality: '',
    batch_no: '',
    work_order_no: '',
    expected_fpr_date: '',
    labours: '',
    output: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<any>({});

  const isEdit = Boolean(selectedRow);

  /* ================= LOAD MASTER ================= */

  useEffect(() => {
    dispatch(GetEquipment());
    dispatch(GetProduct());
  }, [dispatch]);

  /* ================= PREFILL EDIT ================= */

  useEffect(() => {
    if (selectedRow) {
      setFormData({
        equipment_id: selectedRow.equipment_id ?? '',
        material_id: selectedRow.material_id ?? '',
        quantity: selectedRow.quantity ?? '',
        unit: selectedRow.unit ?? '',
        quality: selectedRow.quality ?? '',
        batch_no: selectedRow.batch_no ?? '',
        work_order_no: selectedRow.work_order_no ?? '',
        expected_fpr_date: selectedRow.expected_fpr_date?.split('T')[0] ?? '',
        labours: selectedRow.labours ?? '',
        output: selectedRow.output ?? '',
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedRow, openModal]);

  /* ================= CHANGE ================= */

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? '',
    }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: '',
    }));
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.equipment_id) newErrors.equipment_id = 'Required';
    if (!formData.material_id) newErrors.material_id = 'Required';
    if (!formData.quantity) newErrors.quantity = 'Required';
    if (!formData.unit) newErrors.unit = 'Required';
    if (!formData.batch_no) newErrors.batch_no = 'Required';
    if (!formData.work_order_no) newErrors.work_order_no = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(
          updateProductionPlaning({
            id: selectedRow.id,
            formdata: formData, // ✅ FIXED KEY
          }),
        ).unwrap();

        toast.success('Production Planning Updated');
        dispatch(getProductionPlanning());
      }

      setOpenModal(false);
      setFormData(initialState);
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    }
  };

  /* ================= OPTIONS ================= */

  const equipmentOptions = equipments.map((e: any) => ({
    value: e.id,
    label: e.name,
  }));

  const materialOptions = materials.map((m: any) => ({
    value: m.id,
    label: m.product_name,
  }));

  /* ================= UI ================= */

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
      <Modal.Header>{isEdit ? 'Edit Production Planning' : 'Add Production Planning'}</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Equipment */}
          <div className="col-span-6">
            <Label value="Equipment" />
            <Select
              placeholder="Select Equipment"
              options={equipmentOptions}
              value={equipmentOptions.find((o) => o.value === formData.equipment_id) || null}
              onChange={(s) => handleChange('equipment_id', s?.value)}
            />
            <p className="text-red-500 text-sm">{errors.equipment_id}</p>
          </div>

          {/* Material */}
          <div className="col-span-6">
            <Label value="Material" />
            <Select
              placeholder="Select Material"
              options={materialOptions}
              value={materialOptions.find((o) => o.value === formData.material_id) || null}
              onChange={(s) => handleChange('material_id', s?.value)}
            />
            <p className="text-red-500 text-sm">{errors.material_id}</p>
          </div>

          {/* Quantity + Unit */}
          <div className="col-span-4">
            <Label value="Quantity" />
            <div className="flex">
              <input
                type="number"
                placeholder="Enter quantity"
                className="w-full border rounded-l-md px-3 py-2"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
              />

              <select
                className="border rounded-r-md px-2"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
              >
                <option value="">Unit</option>
                {allUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.value}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-red-500 text-sm">{errors.unit}</p>
          </div>

          {/* Quality */}
          <div className="col-span-4">
            <Label value="Quality" />
            <TextInput
              placeholder="Enter Quality"
              value={formData.quality}
              onChange={(e) => handleChange('quality', e.target.value)}
            />
          </div>

          {/* Batch */}
          <div className="col-span-4">
            <Label value="Batch No" />
            <TextInput
              placeholder="Batch Number"
              value={formData.batch_no}
              onChange={(e) => handleChange('batch_no', e.target.value)}
            />
            <p className="text-red-500 text-sm">{errors.batch_no}</p>
          </div>

          {/* Work Order */}
          <div className="col-span-6">
            <Label value="Work Order No" />
            <TextInput
              placeholder="WO-001"
              value={formData.work_order_no}
              onChange={(e) => handleChange('work_order_no', e.target.value)}
            />
            <p className="text-red-500 text-sm">{errors.work_order_no}</p>
          </div>

          {/* Date */}
          <div className="col-span-6">
            <Label value="Expected FPR Date" />
            <TextInput
              type="date"
              value={formData.expected_fpr_date}
              onChange={(e) => handleChange('expected_fpr_date', e.target.value)}
            />
          </div>

          {/* Labours */}
          <div className="col-span-6">
            <Label value="Labours" />
            <TextInput
              type="number"
              placeholder="No of labours"
              value={formData.labours}
              onChange={(e) => handleChange('labours', e.target.value)}
            />
          </div>

          {/* Output */}
          <div className="col-span-6">
            <Label value="Output" />
            <TextInput
              placeholder="Expected Output"
              value={formData.output}
              onChange={(e) => handleChange('output', e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-2 mt-4">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              {isEdit ? 'Update Planning' : 'Save Planning'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Addproductionmodal;
