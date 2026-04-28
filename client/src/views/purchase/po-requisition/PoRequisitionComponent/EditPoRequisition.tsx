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
import { Icon } from '@iconify/react/dist/iconify.js';

type Props = {
  editModal: boolean;
  setEditModal: (val: boolean) => void;
  editData: any;
};

const EditPoRequisitionModel = ({ editModal, setEditModal, editData }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  /* ================= STATE ================= */

  const [formData, setFormData] = useState<any>({
    address: '',
    application: '',
    expected_arrival_date: '',
    remark: '',

    products: [{ product_id: '' }],
    raw_materials: [{ rm_id: '', qty: '', unit: '', stock: '' }],
    packing_materials: [{ pm_id: '', qty: '', unit: '', stock: '' }],
    equipments: [{ equipment_id: '', qty: '', unit: '', stock: '' }],
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
    if (!editData) return;

    setFormData({
      address: editData.address || '',
      application: editData.application || '',
      expected_arrival_date: editData.expected_arrival_date || '',
      remark: editData.remark || '',

      products: editData.products?.map((p: any) => ({
        product_id: p.product_id,
      })) || [{ product_id: '' }],

      raw_materials: editData.raw_materials?.map((r: any) => ({
        rm_id: r.rm_id,
        qty: r.qty,
        unit: r.unit,
        stock: '',
      })) || [{ rm_id: '', qty: '', unit: '', stock: '' }],

      packing_materials: editData.packing_materials?.map((p: any) => ({
        pm_id: p.pm_id,
        qty: p.qty,
        unit: p.unit,
        stock: '',
      })) || [{ pm_id: '', qty: '', unit: '', stock: '' }],

      equipments: editData.equipments?.map((e: any) => ({
        equipment_id: e.equipment_id,
        qty: e.qty,
        unit: e.unit,
        stock: '',
      })) || [{ equipment_id: '', qty: '', unit: '', stock: '' }],
    });
  }, [editData]);

  useEffect(() => {
    if (!remaining) return;

    const fillStock = (items: any[], options: any[], idKey: string) =>
      items.map((item) => {
        const found = options.find((o) => o.value === item[idKey]);

        return {
          ...item,
          stock: found?.stock || '',
        };
      });

    setFormData((prev: any) => ({
      ...prev,
      raw_materials: fillStock(prev.raw_materials, rmOptions, 'rm_id'),
      packing_materials: fillStock(prev.packing_materials, pmOptions, 'pm_id'),
      equipments: fillStock(prev.equipments, equipmentOptions, 'equipment_id'),
    }));
  }, [remaining]);

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

  const handleArrayChange = (key: string, index: number, field: string, value: any) => {
    const updated = [...formData[key]];
    updated[index][field] = value;

    setFormData({ ...formData, [key]: updated });
  };

  const addRow = (key: string, emptyRow: any) => {
    setFormData({
      ...formData,
      [key]: [...formData[key], emptyRow],
    });
  };

  const removeRow = (key: string, index: number) => {
    const updated = [...formData[key]];
    updated.splice(index, 1);
    setFormData({ ...formData, [key]: updated });
  };

  /* ================= HANDLERS ================= */

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const updateArray = (key: string, index: number, field: string, value: any) => {
    const updated = [...formData[key]];
    updated[index][field] = value;
    setFormData({ ...formData, [key]: updated });
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

  const renderSection = (title: string, key: string, options: any[], idField: string) =>
    formData[key]?.map((item: any, index: number) => (
      <div key={index} className="grid grid-cols-12 gap-3 col-span-12">
        <div className="col-span-4">
          <Label value={title} />

          <Select
            options={options}
            value={options.find((o) => o.value === item[idField])}
            onChange={(s: any) => {
              updateArray(key, index, idField, s.value);
              updateArray(key, index, 'stock', s.stock);
            }}
          />
        </div>

        <div className="col-span-2">
          <Label value="Remaining Stock" />
          <TextInput value={item.stock} disabled />
        </div>

        <div className="col-span-4">
          <Label value="Quantity Required" />

          <div className="flex rounded-md shadow-sm mt-1">
            <input
              type="number"
              className="w-full rounded-l-md border border-gray-300 px-3 py-2"
              value={item.qty}
              onChange={(e) => updateArray(key, index, 'qty', e.target.value)}
            />

            <select
              className="rounded-r-md border border-l-0 border-gray-300"
              value={item.unit}
              onChange={(e) => updateArray(key, index, 'unit', e.target.value)}
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

        <div className="col-span-1 mt-5">
          <Button size="sm" color="failure" onClick={() => removeRow(key, index)}>
            <Icon icon="solar:trash-bin-minimalistic-outline" />
          </Button>
        </div>

        {index === formData[key].length - 1 && (
          <div className="col-span-1 mt-5">
            <Button
              size="sm"
              color="primary"
              onClick={() => addRow(key, { [idField]: '', qty: '', unit: '', stock: '' })}
            >
              +
            </Button>
          </div>
        )}
      </div>
    ));

  /* ================= UI ================= */

  return (
    <Modal show={editModal} size="5xl" onClose={() => setEditModal(false)}>
      <Modal.Header>Edit PO Requisition</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* RM */}

          {renderSection('RM Item', 'raw_materials', rmOptions, 'rm_id')}
          {renderSection('PM Item', 'packing_materials', pmOptions, 'pm_id')}
          {renderSection('Equipment', 'equipments', equipmentOptions, 'equipment_id')}

          {/* PRODUCT */}
          <div className="col-span-8">
            {formData.products.map((p: any, index: number) => (
              <div key={index} className="flex gap-3">
                <Select
                  className="flex-1"
                  options={productOptions}
                  value={productOptions.find((o) => o.value === p.product_id)}
                  onChange={(s: any) => handleArrayChange('products', index, 'product_id', s.value)}
                />

                <Button color="failure" onClick={() => removeRow('products', index)}>
                  <Icon icon="solar:trash-bin-minimalistic-outline" />
                </Button>

                {index === formData.products.length - 1 && (
                  <Button color="primary" onClick={() => addRow('products', { product_id: '' })}>
                    +
                  </Button>
                )}
              </div>
            ))}
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
