import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { allUnits } from 'src/utils/AllUnit';
import {
  createProductionPlaning,
  getProductionPlanning,
} from 'src/features/Inventorymodule/planing/ProdutionPlaningSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

const Addproductionmodal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  /* ================= REDUX ================= */

  const equipments = useSelector((state: any) => state.equipment.Equipmentdata) || [];

  const materials = useSelector((state: any) => state.products.productdata) || [];

  /* ================= INITIAL STATE ================= */

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

  /* ================= OPTIONS ================= */

  const equipmentOptions = equipments.map((i: any) => ({
    value: i.id,
    label: i.name,
  }));

  const materialOptions = materials.map((i: any) => ({
    value: i.id,
    label: i.product_name,
  }));

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(GetEquipment());
    dispatch(GetProduct());
  }, [dispatch]);

  /* ================= RESET FORM ================= */

  useEffect(() => {
    if (!openModal) {
      setFormData(initialState);
      setErrors({});
    }
  }, [openModal]);

  /* ================= HANDLE CHANGE ================= */

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
    let newErrors: any = {};

    if (!formData.equipment_id) newErrors.equipment_id = 'Equipment is required';

    if (!formData.material_id) newErrors.material_id = 'Material is required';

    if (!formData.quantity) newErrors.quantity = 'Quantity required';
    else if (Number(formData.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than 0';

    if (!formData.unit) newErrors.unit = 'Unit required';

    if (!formData.quality) newErrors.quality = 'Quality required';

    if (!formData.batch_no) newErrors.batch_no = 'Batch number required';

    if (!formData.work_order_no) newErrors.work_order_no = 'Work order required';

    if (!formData.expected_fpr_date) newErrors.expected_fpr_date = 'Expected FPR date required';

    if (!formData.labours) newErrors.labours = 'Labours required';

    if (!formData.output) newErrors.output = 'Output required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(createProductionPlaning(formData)).unwrap();

      toast.success('Production Planning Added Successfully');
      dispatch(getProductionPlanning());

      setOpenModal(false);
      setFormData(initialState);
      setErrors({});
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
      <Modal.Header>Production Planning</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Equipment */}
          <div className="col-span-6">
            <Label value="Equipment" />
            <Select
              options={equipmentOptions}
              placeholder="Select Equipment"
              value={equipmentOptions.find((o) => o.value === formData.equipment_id) || null}
              onChange={(s) => handleChange('equipment_id', s?.value)}
            />
            {errors.equipment_id && <p className="text-red-500 text-xs">{errors.equipment_id}</p>}
          </div>

          {/* Material */}
          <div className="col-span-6">
            <Label value="Name of Material" />
            <Select
              options={materialOptions}
              placeholder="Select Material"
              value={materialOptions.find((o) => o.value === formData.material_id) || null}
              onChange={(s) => handleChange('material_id', s?.value)}
            />
            {errors.material_id && <p className="text-red-500 text-xs">{errors.material_id}</p>}
          </div>

          {/* Quantity */}
          <div className="col-span-4">
            <Label value="Quantity" />
            <div className="flex rounded-md shadow-sm">
              <input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="Enter quantity"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
              />
              <select
                id="unit"
                name="quantity_unit"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="rounded-r-md border border-l-0 border-gray-300 bg-white px-2 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Unit</option>
                {allUnits.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.value}
                  </option>
                ))}
              </select>
            </div>

            {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
            {errors.quantity_unit && <p className="text-red-500 text-xs">{errors.quantity_unit}</p>}
          </div>

          {/* Quality */}
          <div className="col-span-4">
            <Label value="Quality" />
            <TextInput
              placeholder="Enter Quality"
              value={formData.quality}
              onChange={(e) => handleChange('quality', e.target.value)}
            />
            {errors.quality && <p className="text-red-500 text-xs">{errors.quality}</p>}
          </div>

          {/* Batch */}
          <div className="col-span-4">
            <Label value="Batch No" />
            <TextInput
              placeholder="Enter Batch Number"
              value={formData.batch_no}
              onChange={(e) => handleChange('batch_no', e.target.value)}
            />
            {errors.batch_no && <p className="text-red-500 text-xs">{errors.batch_no}</p>}
          </div>

          {/* Work Order */}
          <div className="col-span-6">
            <Label value="Work Order No" />
            <TextInput
              placeholder="Enter Work Order"
              value={formData.work_order_no}
              onChange={(e) => handleChange('work_order_no', e.target.value)}
            />
            {errors.work_order_no && <p className="text-red-500 text-xs">{errors.work_order_no}</p>}
          </div>

          {/* Expected Date */}
          <div className="col-span-6">
            <Label value="Expected Date of FPR" />
            <TextInput
              type="date"
              value={formData.expected_fpr_date}
              onChange={(e) => handleChange('expected_fpr_date', e.target.value)}
            />
            {errors.expected_fpr_date && (
              <p className="text-red-500 text-xs">{errors.expected_fpr_date}</p>
            )}
          </div>

          {/* Labours */}
          <div className="col-span-6">
            <Label value="No of Labours" />
            <TextInput
              type="number"
              placeholder="Enter No of Labours"
              value={formData.labours}
              onChange={(e) => handleChange('labours', e.target.value)}
            />
            {errors.labours && <p className="text-red-500 text-xs">{errors.labours}</p>}
          </div>

          {/* Output */}
          <div className="col-span-6">
            <Label value="Output" />

            <TextInput
              placeholder="Enter Output"
              value={formData.output}
              onChange={(e) => handleChange('output', e.target.value)}
              className="rounded-r-none"
            />

            {errors.output && <p className="text-red-500 text-xs">{errors.output}</p>}
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-2 mt-4">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button type="submit" color="primary">
              Save Planning
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Addproductionmodal;
