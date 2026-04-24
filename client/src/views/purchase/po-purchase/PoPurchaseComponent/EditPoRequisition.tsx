import { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { AppDispatch, RootState } from 'src/store';
import {
  getRemaningStock,
  updatePoRequisition,
} from 'src/features/purchase/porequisition/PoRequisitionSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { allUnits } from 'src/utils/AllUnit';

type Props = {
  editModal: boolean;
  setEditModal: (val: boolean) => void;
  editData: any;
};

const EditPoRequisitionModel = ({ editModal, setEditModal, editData }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  /* ================= STATE ================= */

  const [formData, setFormData] = useState<any>({
    product_id: '',
    address: '',
    application: '',
    expected_arrival_date: '',
    remark: '',

    rm_id: '',
    rm_qty: '',
    rm_unit: '',
    rm_stock: '',

    pm_id: '',
    pm_qty: '',
    pm_unit: '',
    pm_stock: '',

    equipment_id: '',
    equipment_qty: '',
    equipment_unit: '',
    equipment_stock: '',
  });

  const product = useSelector((state: RootState) => state.products.productdata) as any[];

  const remaining = useSelector((state: RootState) => state.requisition.remaining) as any;

  /* ================= LOAD MASTER DATA ================= */

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getRemaningStock());
  }, [dispatch]);

  /* ================= PREFILL DATA ================= */

  useEffect(() => {
    if (editData) {
      setFormData({
        product_id: editData.product_id || '',
        address: editData.address || '',
        application: editData.application || '',
        expected_arrival_date: editData.expected_arrival_date || '',
        remark: editData.remark || '',

        rm_id: editData.rm_id || '',
        rm_qty: editData.rm_qty || '',
        rm_unit: editData.rm_unit || '',
        rm_stock: editData.rm_stock || '',

        pm_id: editData.pm_id || '',
        pm_qty: editData.pm_qty || '',
        pm_unit: editData.pm_unit || '',
        pm_stock: editData.pm_stock || '',

        equipment_id: editData.equipment_id || '',
        equipment_qty: editData.equipment_qty || '',
        equipment_unit: editData.equipment_unit || '',
        equipment_stock: editData.equipment_stock || '',
      });
    }
  }, [editData]);

  /* ================= OPTIONS ================= */

  const rmOptions =
    remaining?.raw_material?.map((i: any) => ({
      value: i.id,
      label: `${i.code} - ${i.name}`,
      stock: i.remaining_quantity,
    })) || [];

  const pmOptions =
    remaining?.packing_material?.map((i: any) => ({
      value: i.id,
      label: i.name,
      stock: i.remaining_quantity,
    })) || [];

  const equipmentOptions =
    remaining?.equipment?.map((i: any) => ({
      value: i.id,
      label: i.name,
      stock: i.remaining_quantity,
    })) || [];

  const productOptions = product.map((i: any) => ({
    value: i.id,
    label: i.product_name,
  }));

  /* ================= HANDLERS ================= */

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleQtyUnitChange = (
    fieldQty: string,
    fieldUnit: string,
    type: 'qty' | 'unit',
    value: string,
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [type === 'qty' ? fieldQty : fieldUnit]: value,
    }));
  };

  /* ================= UPDATE ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await dispatch(
        updatePoRequisition({
          id: editData.id,
          data: formData,
        }),
      ).unwrap();

      toast.success('PO Requisition Updated ✅');
      setEditModal(false);
    } catch {
      toast.error('Update Failed');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={editModal} size="5xl" onClose={() => setEditModal(false)}>
      <Modal.Header>Edit PO Requisition</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* RM */}
          <div className="col-span-4">
            <Label value="RM Item" />
            <Select
              options={rmOptions}
              value={rmOptions.find((o) => o.value === formData.rm_id)}
              onChange={(s: any) =>
                setFormData({
                  ...formData,
                  rm_id: s.value,
                  rm_stock: s.stock,
                })
              }
            />
          </div>

          <div className="col-span-4">
            <Label value="Remaining Stock" />
            <TextInput value={formData.rm_stock} disabled />
          </div>

          <div className="col-span-4">
            <Label value="Quantity Required" />
            <div className="flex">
              <input
                type="number"
                className="w-full border px-3 py-2 rounded-l-md"
                value={formData.rm_qty}
                onChange={(e) => handleQtyUnitChange('rm_qty', 'rm_unit', 'qty', e.target.value)}
              />

              <select
                className="border border-l-0 px-2 rounded-r-md"
                value={formData.rm_unit}
                onChange={(e) => handleQtyUnitChange('rm_qty', 'rm_unit', 'unit', e.target.value)}
              >
                <option value="">Unit</option>
                {allUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PM */}
          <div className="col-span-4">
            <Label value="PM Item" />
            <Select
              options={pmOptions}
              value={pmOptions.find((o) => o.value === formData.pm_id)}
              onChange={(s: any) =>
                setFormData({
                  ...formData,
                  pm_id: s.value,
                  pm_stock: s.stock,
                })
              }
            />
          </div>

          <div className="col-span-4">
            <Label value="Remaining Stock" />
            <TextInput value={formData.pm_stock} disabled />
          </div>

          <div className="col-span-4">
            <Label value="Quantity Required" />
            <div className="flex">
              <input
                type="number"
                className="w-full border px-3 py-2 rounded-l-md"
                value={formData.pm_qty}
                onChange={(e) => handleQtyUnitChange('pm_qty', 'pm_unit', 'qty', e.target.value)}
              />

              <select
                className="border border-l-0 px-2 rounded-r-md"
                value={formData.pm_unit}
                onChange={(e) => handleQtyUnitChange('pm_qty', 'pm_unit', 'unit', e.target.value)}
              >
                <option value="">Unit</option>
                {allUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-4">
            <Label value="PM Item" />
            <Select
              options={equipmentOptions}
              value={equipmentOptions.find((o) => o.value === formData.equipment_id)}
              onChange={(s: any) =>
                setFormData({
                  ...formData,
                  equipment_id: s.value,
                  equipment_stock: s.stock,
                })
              }
            />
          </div>

          <div className="col-span-4">
            <Label value="Remaining Stock" />
            <TextInput value={formData.equipment_stock} disabled />
          </div>

          <div className="col-span-4">
            <Label value="Quantity Required" />
            <div className="flex">
              <input
                type="number"
                className="w-full border px-3 py-2 rounded-l-md"
                value={formData.equipment_qty}
                onChange={(e) =>
                  handleQtyUnitChange('equipment_qty', 'equipment_unit', 'qty', e.target.value)
                }
              />

              <select
                className="border border-l-0 px-2 rounded-r-md"
                value={formData.equipment_unit}
                onChange={(e) =>
                  handleQtyUnitChange('equipment_qty', 'equipment_unit', 'unit', e.target.value)
                }
              >
                <option value="">Unit</option>
                {allUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRODUCT */}
          <div className="col-span-6">
            <Label value="Product" />
            <Select
              options={productOptions}
              value={productOptions.find((o) => o.value === formData.product_id)}
              onChange={(s: any) => setFormData({ ...formData, product_id: s.value })}
            />
          </div>

          <div className="col-span-6">
            <Label value="Address" />
            <TextInput name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="col-span-12">
            <Label value="Application" />
            <Textarea name="application" value={formData.application} onChange={handleChange} />
          </div>

          <div className="col-span-6">
            <Label value="Expected Arrival Date" />
            <input
              type="date"
              name="expected_arrival_date"
              value={formData.expected_arrival_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-12">
            <Label value="Remark" />
            <Textarea name="remark" value={formData.remark} onChange={handleChange} />
          </div>

          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setEditModal(false)}>
              Cancel
            </Button>

            <Button type="submit" color="success">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPoRequisitionModel;
