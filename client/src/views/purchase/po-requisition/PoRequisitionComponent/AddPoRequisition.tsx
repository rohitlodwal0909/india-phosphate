import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { GetProduct } from 'src/features/master/Product/ProductSlice';
import {
  getRemaningStock,
  createPoRequisition,
} from 'src/features/purchase/porequisition/PoRequisitionSlice';
import { allUnits } from 'src/utils/AllUnit';

interface Props {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
}

const CreateModel: React.FC<Props> = ({ placeModal, setPlaceModal }) => {
  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getRemaningStock());
  }, [dispatch]);

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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      console.log(formData);
      dispatch(createPoRequisition(formData));

      toast.success('PO Requisition Created');
      setPlaceModal(false);
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <Modal show={placeModal} onClose={() => setPlaceModal(false)} size="5xl">
      <Modal.Header>PO Requisition</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* ================= RM ================= */}

          <div className="col-span-4">
            <Label value="RM Item" />
            <Select
              options={rmOptions}
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
                placeholder="Qty"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2"
                value={formData.rm_qty}
                onChange={(e) => handleQtyUnitChange('rm_qty', 'rm_unit', 'qty', e.target.value)}
              />

              <select
                className="rounded-r-md border border-l-0 border-gray-300 px-2"
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

          {/* ================= PM ================= */}

          <div className="col-span-4">
            <Label value="PM Item" />
            <Select
              options={pmOptions}
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

            <div className="flex rounded-md shadow-sm mt-1">
              <input
                type="number"
                className="w-full rounded-l-md border border-gray-300 px-3 py-2"
                value={formData.pm_qty}
                onChange={(e) => handleQtyUnitChange('pm_qty', 'pm_unit', 'qty', e.target.value)}
              />

              <select
                className="rounded-r-md border border-l-0 border-gray-300 px-2"
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

          {/* ================= EQUIPMENT ================= */}

          <div className="col-span-4">
            <Label value="Equipment" />
            <Select
              options={equipmentOptions}
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
                className="w-full rounded-l-md border border-gray-300 px-3 py-2"
                value={formData.equipment_qty}
                onChange={(e) =>
                  handleQtyUnitChange('equipment_qty', 'equipment_unit', 'qty', e.target.value)
                }
              />

              <select
                className="rounded-r-md border border-l-0 border-gray-300 px-2"
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

          {/* ================= COMMON ================= */}

          <div className="col-span-6">
            <Label value="Product" />
            <Select
              options={productOptions}
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
            <Button color="gray" onClick={() => setPlaceModal(false)}>
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

export default CreateModel;
