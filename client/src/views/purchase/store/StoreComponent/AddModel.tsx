import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { GetProduct } from 'src/features/master/Product/ProductSlice';
import {
  createTransport,
  updateTransport,
  findStore,
} from 'src/features/purchase/store/StoreSlice';
import { allUnits } from 'src/utils/AllUnit';

interface VehicleDispatchModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  po_id: any;
}

const AddModel: React.FC<VehicleDispatchModalProps> = ({ openModal, setOpenModal, po_id }) => {
  const dispatch = useDispatch<AppDispatch>();

  /* ================= STORE DATA ================= */

  const [data, setData] = useState<any[]>([]);

  /* ================= FIND STORE ================= */

  useEffect(() => {
    if (openModal && po_id) {
      dispatch(findStore(po_id)).then((res: any) => {
        setData(res.payload || []);
      });
    }
  }, [openModal, po_id]);

  /* ================= EDIT MODE ================= */

  const isEdit = data.length > 0;

  /* ================= INITIAL STATE ================= */

  const initialState = {
    po_id,
    transporter_name: '',
    driver_name: '',
    driver_number: '',
    vehicle_number: '',
    lr_no: '',
    expected_arrival_date: '',

    // ✅ MULTIPLE PRODUCTS
    items: [
      {
        product_id: '',
        quantity: '',
        unit: '',
      },
    ],
  };

  const [formData, setFormData] = useState<any>(initialState);

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (isEdit) {
      const row = data[0]; // ✅ FIRST RECORD ONLY

      const products = JSON.parse(row?.products) || [];

      setFormData({
        id: row.id,
        po_id: row.po_id,
        transporter_name: row.transporter_name || '',
        driver_name: row.driver_name || '',
        driver_number: row.driver_number || '',
        vehicle_number: row.vehicle_number || '',
        lr_no: row.lr_no || '',
        expected_arrival_date: row.expected_arrival_date?.split('T')[0] || '',

        items: products?.map((i: any) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          unit: i.unit,
        })) || [{ product_id: '', quantity: '', unit: '' }],
      });
    } else {
      setFormData(initialState);
    }
  }, [data]);

  /* ================= PRODUCTS ================= */

  const product = useSelector((state: RootState) => state.products.productdata) as any[];

  useEffect(() => {
    dispatch(GetProduct());
  }, []);

  const productOptions = product.map((i: any) => ({
    value: i.id,
    label: i.product_name,
  }));

  /* ================= CHANGE ================= */

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItemRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: '', unit: '' }],
    }));
  };

  const removeItemRow = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);

    setFormData({
      ...formData,
      items: updated,
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...formData.items];
    updated[index][field] = value;

    setFormData({
      ...formData,
      items: updated,
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let res;

      if (isEdit) {
        res = await dispatch(updateTransport(formData)).unwrap();
        toast.success(res?.message || 'Updated Successfully');
      } else {
        res = await dispatch(createTransport(formData)).unwrap();
        toast.success(res?.message || 'Created Successfully');
      }

      dispatch(findStore(po_id));

      setOpenModal(false);
      setFormData(initialState);
    } catch (err: any) {
      toast.error(err?.message || 'Operation Failed');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
      <Modal.Header>{isEdit ? 'Edit Store' : 'Create Store'}</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          <div className="sm:col-span-6 col-span-12">
            <Label value="Transporter Name" />
            <TextInput
              name="transporter_name"
              placeholder="Enter Transporter Name"
              value={formData.transporter_name}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Driver Name" />
            <TextInput
              placeholder="Enter Driver Name"
              name="driver_name"
              value={formData.driver_name}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Driver Number" />
            <TextInput
              name="driver_number"
              placeholder="Enter Driver Number"
              value={formData.driver_number}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Vehicle Number" />
            <TextInput
              placeholder="Enter Vehicle Number"
              name="vehicle_number"
              value={formData.vehicle_number}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-12">
            <Label value="Products & Quantity" />

            {formData.items.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-end">
                {/* PRODUCT */}
                <div className="col-span-6">
                  <Select
                    options={productOptions}
                    value={productOptions.find((p) => p.value === item.product_id)}
                    onChange={(selected: any) =>
                      handleItemChange(index, 'product_id', selected?.value)
                    }
                  />
                </div>

                {/* QUANTITY */}
                <div className="col-span-5">
                  <div className="flex">
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full border px-3 py-2 rounded-l-md"
                    />

                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      className="border border-l-0 px-2 rounded-r-md"
                    >
                      <option value="">Unit</option>
                      {allUnits.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ADD REMOVE */}
                <div className="col-span-1 flex gap-2">
                  <Button color="primary" size="xs" onClick={addItemRow}>
                    +
                  </Button>

                  {formData.items.length > 1 && (
                    <Button size="xs" color="failure" onClick={() => removeItemRow(index)}>
                      -
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="LR No." />
            <TextInput
              name="lr_no"
              placeholder="Enter LR No."
              value={formData.lr_no}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Expected Arrival" />
            <input
              type="date"
              name="expected_arrival_date"
              value={formData.expected_arrival_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-12 flex justify-end gap-3">
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              {isEdit ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModel;
