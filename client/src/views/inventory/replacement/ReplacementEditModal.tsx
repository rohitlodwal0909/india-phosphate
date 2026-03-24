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
    batch_numbers: [],
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
      let batches: any[] = [];

      try {
        batches =
          typeof selectedRow.batch_numbers === 'string'
            ? JSON.parse(selectedRow.batch_numbers)
            : selectedRow.batch_numbers || [];
      } catch {
        batches = [];
      }

      setFormData({
        ...selectedRow,
        batch_numbers: batches || [],
      });
    }
  }, [selectedRow]);

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

    console.log();

    handleupdated({
      ...formData,
      batch_numbers: formData.batch_numbers,
    });

    setOpenModal(false);
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
            <Label value="Invoice no." />
            <TextInput
              name="invoice_no"
              placeholder="Enter Invoice no."
              value={formData.invoice_no}
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
          <div className="sm:col-span-6 col-span-12">
            <Label value="Batch Numbers" />

            <Select
              isMulti
              options={batchOptions}
              value={batchOptions.filter((opt: any) => formData.batch_numbers?.includes(opt.value))}
              onChange={(selected: any) =>
                setFormData({
                  ...formData,
                  batch_numbers: selected ? selected.map((s: any) => s.value) : [],
                })
              }
            />
          </div>

          {/* Quantity */}
          <div className="sm:col-span-6 col-span-12">
            <Label value="Quantity" />

            <div className="flex">
              <input
                type="text"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-l-md"
              />

              <select
                name="unit"
                value={formData.unit || ''}
                onChange={handleChange}
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
