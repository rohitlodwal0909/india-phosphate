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
import { Icon } from '@iconify/react/dist/iconify.js';

interface Props {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
}

const CreateModel: React.FC<Props> = ({ placeModal, setPlaceModal }) => {
  const dispatch = useDispatch<AppDispatch>();

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

  const handleArrayChange = (section: string, index: number, field: string, value: any) => {
    const updated = [...formData[section]];
    updated[index][field] = value;

    setFormData({
      ...formData,
      [section]: updated,
    });
  };

  // RM section
  const addRM = () => {
    setFormData((prev: any) => ({
      ...prev,
      raw_materials: [...prev.raw_materials, { rm_id: '', qty: '', unit: '', stock: '' }],
    }));
  };

  const removeRM = (index: number) => {
    const updated = [...formData.raw_materials];
    updated.splice(index, 1);
    setFormData({ ...formData, raw_materials: updated });
  };

  const addPM = () => {
    setFormData((prev: any) => ({
      ...prev,
      packing_materials: [...prev.packing_materials, { pm_id: '', qty: '', unit: '', stock: '' }],
    }));
  };

  const removePM = (index: number) => {
    const updated = [...formData.packing_materials];
    updated.splice(index, 1);
    setFormData({ ...formData, packing_materials: updated });
  };

  const addEquipment = () => {
    setFormData((prev: any) => ({
      ...prev,
      equipments: [...prev.equipments, { equipment_id: '', qty: '', unit: '', stock: '' }],
    }));
  };

  const removeEquipment = (index: number) => {
    const updated = [...formData.equipments];
    updated.splice(index, 1);
    setFormData({ ...formData, equipments: updated });
  };

  const addProduct = () => {
    setFormData((prev: any) => ({
      ...prev,
      products: [...prev.products, { product_id: '' }],
    }));
  };

  const removeProduct = (index: number) => {
    const updated = [...formData.products];
    updated.splice(index, 1);
    setFormData({ ...formData, products: updated });
  };

  const product = useSelector((state: RootState) => state.products.productdata) as any[];

  const remaining = useSelector((state: RootState) => state.requisition.remaining) as any;

  useEffect(() => {
    dispatch(GetProduct());
    dispatch(getRemaningStock());
  }, [dispatch]);

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
      await dispatch(createPoRequisition(formData)).unwrap(); // ⭐ important

      toast.success('PO Requisition Created Successfully');

      setPlaceModal(false);
    } catch (error: any) {
      console.error(error);

      toast.error(error?.message || 'PO Requisition Creation Failed');
    }
  };

  return (
    <Modal show={placeModal} onClose={() => setPlaceModal(false)} size="5xl">
      <Modal.Header>PO Requisition</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* ================= RM ================= */}

          <h3 className="col-span-12 font-semibold text-lg">Raw Materials</h3>

          {formData.raw_materials.map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-3 col-span-12">
              <div className="col-span-4">
                <Label value="RM Item" />

                <Select
                  options={rmOptions}
                  onChange={(s: any) => {
                    handleArrayChange('raw_materials', index, 'rm_id', s.value);
                    handleArrayChange('raw_materials', index, 'stock', s.stock);
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
                    onChange={(e) =>
                      handleArrayChange('raw_materials', index, 'qty', e.target.value)
                    }
                  />

                  <select
                    value={item.unit}
                    className="rounded-r-md border border-l-0 border-gray-300"
                    onChange={(e) =>
                      handleArrayChange('raw_materials', index, 'unit', e.target.value)
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

              <div className="col-span-1 mt-5">
                <Button size="sm" color="lighterror" onClick={() => removeRM(index)}>
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </div>
              <div className="col-span-1 mt-5">
                <Button color="primary" size="sm" onClick={addRM}>
                  +
                </Button>
              </div>
            </div>
          ))}

          {/* ================= PM ================= */}

          {formData.packing_materials.map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-3 col-span-12">
              <div className="col-span-4">
                <Label value="PM Item" />

                <Select
                  options={pmOptions}
                  onChange={(s: any) => {
                    handleArrayChange('packing_materials', index, 'pm_id', s.value);
                    handleArrayChange('packing_materials', index, 'stock', s.stock);
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
                    onChange={(e) =>
                      handleArrayChange('packing_materials', index, 'qty', e.target.value)
                    }
                  />

                  <select
                    value={item.unit}
                    className="rounded-r-md border border-l-0 border-gray-300"
                    onChange={(e) =>
                      handleArrayChange('packing_materials', index, 'unit', e.target.value)
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

              <div className="col-span-1 mt-5">
                <Button size="sm" color="lighterror" onClick={() => removePM(index)}>
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </div>

              <div className="col-span-1 mt-5">
                <Button color="primary" size="sm" onClick={addPM}>
                  +
                </Button>
              </div>
            </div>
          ))}
          {formData.equipments.map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-3 col-span-12">
              <div className="col-span-4">
                <Label value="Equipments" />

                <Select
                  options={equipmentOptions}
                  onChange={(s: any) => {
                    handleArrayChange('equipments', index, 'equipment_id', s.value);
                    handleArrayChange('equipments', index, 'stock', s.stock);
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
                    onChange={(e) => handleArrayChange('equipments', index, 'qty', e.target.value)}
                  />

                  <select
                    value={item.unit}
                    className="rounded-r-md border border-l-0 border-gray-300"
                    onChange={(e) => handleArrayChange('equipments', index, 'unit', e.target.value)}
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
                <Button size="sm" color="lighterror" onClick={() => removeEquipment(index)}>
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </div>
              <div className="col-span-1 mt-5">
                <Button color="primary" size="sm" onClick={addEquipment}>
                  +
                </Button>
              </div>
            </div>
          ))}

          {/* ================= EQUIPMENT ================= */}

          {/* ================= COMMON ================= */}

          {/* ================= PRODUCTS ================= */}

          {formData.products.map((p: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-3 col-span-12 items-end">
              {/* PRODUCT SELECT */}
              <div className="col-span-6">
                {index === 0 && <Label value="Product" />}

                <Select
                  options={productOptions}
                  value={productOptions.find((opt) => opt.value === p.product_id)}
                  onChange={(s: any) => handleArrayChange('products', index, 'product_id', s.value)}
                />
              </div>

              {/* REMOVE */}
              <div className="col-span-1">
                <Button size="sm" color="lighterror" onClick={() => removeProduct(index)}>
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </div>

              {/* ADD */}
              <div className="col-span-1">
                <Button color="primary" onClick={addProduct} className="sm">
                  +
                </Button>
              </div>
            </div>
          ))}
          <div className="col-span-4">
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
            <Label value="Address" />
            <Textarea name="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="col-span-12">
            <Label value="Application" />
            <Textarea name="application" value={formData.application} onChange={handleChange} />
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
