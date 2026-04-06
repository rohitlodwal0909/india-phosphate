import React, { useEffect, useState } from 'react';
import { Button, Modal, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { allUnits } from 'src/utils/AllUnit';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store';
import { getPurchaseOrders } from 'src/features/marketing/PurchaseOrderSlice';

interface VehicleDispatchEditModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
  handleupdated: any;
  StoreDatas: any;
}

const VehicleDispatchEditModal: React.FC<VehicleDispatchEditModalProps> = ({
  openModal,
  setOpenModal,
  selectedRow,
  handleupdated,
  StoreDatas,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    batches: [{ batch_no: '', quantity: '', unit: '', max_quantity: 0 }],
  });

  const purchaseOrder = useSelector(
    (state: RootState) => state.purchaseOrder.purchaseOrders,
  ) as any[];

  const purchaseOrders = purchaseOrder.filter(
    (d) => d.workNo !== null && d.workNo.status == 'Approved',
  );
  useEffect(() => {
    dispatch(getPurchaseOrders());
  }, [dispatch]);

  // Batch options
  const batchOptions =
    StoreDatas?.map((item: any) => ({
      value: item.id,
      label: item.qc_batch_number,
    })) || [];

  // PO options
  const po_nos =
    purchaseOrders?.map((po: any) => ({
      value: po.id,
      label: po.po_no,
    })) || [];

  // Selected row load
  useEffect(() => {
    if (selectedRow) {
      setFormData({
        ...selectedRow,
        batches: selectedRow.batches?.map((b: any) => ({
          batch_no: b.batch_id || b.batch_no,
          quantity: b.quantity,
          unit: b.unit,
          max_quantity: batchMap[b.batch_id]?.total_issued_qty || 0,
        })) || [{ batch_no: '', quantity: '', unit: '', max_quantity: 0 }],
      });
    }
  }, [selectedRow, StoreDatas]);

  const batchMap =
    StoreDatas?.reduce((acc: any, item: any) => {
      acc[item.id] = item;
      return acc;
    }, {}) || {};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleupdated({
      ...formData,
      batches: formData.batches,
    });

    setOpenModal(false);
  };

  const addBatchRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      batches: [...prev.batches, { batch_no: '', quantity: '', unit: '', max_quantity: 0 }],
    }));
  };

  const removeBatchRow = (index: number) => {
    const updated = [...formData.batches];
    updated.splice(index, 1);
    setFormData({ ...formData, batches: updated });
  };
  const handleBatchChange = (index: number, field: string, value: any) => {
    const updated = [...formData.batches];

    updated[index][field] = value;

    if (field === 'batch_no') {
      const batch = batchMap[value];
      updated[index].max_quantity = batch?.finishing?.finish_quantity || 0;
    }

    if (field === 'batch_no') {
      const exists = updated.some((b, i) => b.batch_no === value && i !== index);

      if (exists) {
        alert('Batch already selected');
        return;
      }
    }

    setFormData({ ...formData, batches: updated });
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="4xl">
      <Modal.Header>Edit Dispatch Details</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* PO */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="PO No." />
            <Select
              options={po_nos}
              value={po_nos.find((opt) => opt.value === formData.po_id) || null}
              onChange={(selected: any) => setFormData({ ...formData, po_id: selected?.value })}
            />
          </div>

          {/* Vehicle */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Vehicle Number" />
            <TextInput
              name="vehicle_number"
              value={formData.vehicle_number || ''}
              onChange={handleChange}
            />
          </div>

          {/* Driver */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Driver Details" />
            <TextInput
              name="driver_details"
              value={formData.driver_details || ''}
              onChange={handleChange}
            />
          </div>

          <div className="sm:col-span-6 col-span-12">
            <Label value="Product Name" />
            <TextInput
              name="product_name"
              placeholder="Enter Product Name"
              value={formData.product_name}
              onChange={handleChange}
            />
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
            <Label value="Date of booking" />

            <input
              type="date"
              name="booking_date"
              value={formData.booking_date || ''}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 "
            />
          </div>
          <div className="sm:col-span-6 col-span-12">
            <Label value="Arrived Booking Date" />

            <input
              type="date"
              name="arrived_booking"
              value={formData.arrived_booking || ''}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Batch */}
          <div className="col-span-12">
            <Label value="Batch Dispatch Details" />

            {formData?.batches.map((batch: any, index: number) => (
              <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-end">
                {/* Batch */}
                <div className="col-span-6">
                  <Select
                    options={batchOptions}
                    value={batchOptions.find((opt) => opt.value === batch.batch_no)}
                    onChange={(selected: any) =>
                      handleBatchChange(index, 'batch_no', selected?.value)
                    }
                  />
                </div>

                <div className="sm:col-span-5 col-span-12">
                  {' '}
                  <Label value="Quantity" />{' '}
                  <div className="flex">
                    {' '}
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={batch.quantity}
                      max={batch.max_quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);

                        if (val > batch.max_quantity) return;

                        handleBatchChange(index, 'quantity', val);
                      }}
                      className="w-full border px-3 py-2 rounded-l-md"
                    />
                    <select
                      value={batch.unit}
                      onChange={(e) => handleBatchChange(index, 'unit', e.target.value)}
                      className="border border-l-0 px-2 rounded-r-md"
                    >
                      <option value="">Unit</option>
                      {allUnits.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Add Remove */}
                <div className="col-span-1 flex gap-2">
                  <Button color="primary" size="xs" onClick={addBatchRow}>
                    +
                  </Button>

                  {formData.batches.length > 1 && (
                    <Button size="xs" color="failure" onClick={() => removeBatchRow(index)}>
                      -
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Delivery Location" />
            <TextInput
              name="delivery_location"
              value={formData.delivery_location || ''}
              onChange={handleChange}
            />
          </div>

          {/* Delivered By */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Delivered By" />
            <TextInput
              name="delivered_by"
              value={formData.delivered_by || ''}
              onChange={handleChange}
            />
          </div>

          {/* Remarks */}
          <div className="col-span-12">
            <Label value="Remarks" />
            <Textarea name="remarks" value={formData.remarks || ''} onChange={handleChange} />
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end gap-2">
            <Button color="gray" type="button" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button color="primary" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default VehicleDispatchEditModal;
