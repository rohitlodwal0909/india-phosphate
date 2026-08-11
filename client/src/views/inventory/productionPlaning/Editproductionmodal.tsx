import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';

import { GetProduct } from 'src/features/master/Product/ProductSlice';
import {
  getProductionPlanning,
  updateProductionPlaning,
} from 'src/features/Inventorymodule/planing/ProdutionPlaningSlice';

import { GetEquipment } from 'src/features/master/Equipment/EquipmentSlice';

const selectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '38px',
    color: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    boxShadow: 'none',
  }),

  valueContainer: (base: any) => ({
    ...base,
    color: '#000000',
  }),

  singleValue: (base: any) => ({
    ...base,
    color: '#000000',
  }),

  placeholder: (base: any) => ({
    ...base,
    color: '#000000',
  }),

  input: (base: any) => ({
    ...base,
    color: '#000000',
  }),

  option: (base: any, state: any) => ({
    ...base,
    color: '#000000',
    backgroundColor: state.isFocused ? '#f3f4f6' : '#ffffff',
    cursor: 'pointer',
  }),

  menu: (base: any) => ({
    ...base,
    backgroundColor: '#ffffff',
    zIndex: 9999999,
  }),

  menuList: (base: any) => ({
    ...base,
    backgroundColor: '#ffffff',
    maxHeight: '250px',
    overflowY: 'auto',
  }),

  menuPortal: (base: any) => ({
    ...base,
    zIndex: 99999999,
  }),

  dropdownIndicator: (base: any) => ({
    ...base,
    color: '#000000',
  }),

  clearIndicator: (base: any) => ({
    ...base,
    color: '#000000',
  }),
};

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
}

interface ProductionRow {
  id?: number;

  equipment_id: string | number;
  material_id: string | number;

  quality: string;
  batch_no: string;
  work_order_no: string;

  labours: string | number;

  output_morning: string | number;
  output_evening: string | number;
}

const initialRow: ProductionRow = {
  equipment_id: '',
  material_id: '',
  quality: '',
  batch_no: '',
  work_order_no: '',
  labours: '',
  output_morning: '',
  output_evening: '',
};

const Editproductionmodal: React.FC<Props> = ({ openModal, setOpenModal, selectedRow }) => {
  const dispatch = useDispatch<AppDispatch>();

  const materials = useSelector((state: any) => state.products?.productdata) || [];

  const equipments = useSelector((state: any) => state.equipment?.Equipmentdata) || [];

  const [date, setDate] = useState<string>('');

  const [rows, setRows] = useState<ProductionRow[]>([{ ...initialRow }]);

  const [errors, setErrors] = useState<any>({});

  const materialOptions = materials.map((item: any) => ({
    value: item.id,
    label: item.product_name,
  }));

  const equipmentOptions = equipments.map((item: any) => ({
    value: item.id,
    label: item.name,
  }));

  useEffect(() => {
    if (openModal) {
      dispatch(GetProduct());
      dispatch(GetEquipment());
    }
  }, [dispatch, openModal]);

  useEffect(() => {
    if (!openModal || !selectedRow) {
      return;
    }

    setDate(selectedRow?.date || '');

    const existingItems = Array.isArray(selectedRow?.items) ? selectedRow.items : [];

    if (existingItems.length > 0) {
      setRows(
        existingItems.map((item: any) => ({
          id: item.id,

          equipment_id: item.equipment_id ?? '',

          material_id: item.material_id ?? '',

          quality: item.quality ?? '',

          batch_no: item.batch_no ?? '',

          work_order_no: item.work_order_no ?? '',

          labours: item.labours ?? '',

          output_morning: item.output_morning ?? '',

          output_evening: item.output_evening ?? '',
        })),
      );
    } else {
      setRows([{ ...initialRow }]);
    }

    setErrors({});
  }, [selectedRow, openModal]);

  /* =======================================================
     RESET WHEN MODAL CLOSES
  ======================================================= */

  useEffect(() => {
    if (!openModal) {
      setDate('');

      setRows([{ ...initialRow }]);

      setErrors({});
    }
  }, [openModal]);

  /* =======================================================
     DATE CHANGE
  ======================================================= */

  const handleDateChange = (value: string) => {
    setDate(value);

    setErrors((prev: any) => ({
      ...prev,
      date: '',
    }));
  };

  /* =======================================================
     ROW CHANGE
  ======================================================= */

  const handleRowChange = (index: number, field: keyof ProductionRow, value: any) => {
    setRows((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value ?? '',
      };

      return updated;
    });

    setErrors((prev: any) => ({
      ...prev,
      [`${field}_${index}`]: '',
    }));
  };

  /* =======================================================
     ADD NEW ROW
  ======================================================= */

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        ...initialRow,
      },
    ]);
  };

  /* =======================================================
     REMOVE ROW
  ======================================================= */

  const removeRow = (index: number) => {
    if (rows.length === 1) {
      toast.warning('At least one row is required');

      return;
    }

    setRows((prev) => prev.filter((_, i) => i !== index));

    setErrors({});
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const newErrors: any = {};

    /* DATE */

    if (!date) {
      newErrors.date = 'Date is required';
    }

    /* ROWS */

    if (!rows || rows.length === 0) {
      newErrors.items = 'At least one row is required';
    }

    rows.forEach((row, index) => {
      if (!row.equipment_id) {
        newErrors[`equipment_id_${index}`] = 'Equipment is required';
      }

      if (!row.material_id) {
        newErrors[`material_id_${index}`] = 'Material is required';
      }

      if (!String(row.quality || '').trim()) {
        newErrors[`quality_${index}`] = 'Quality is required';
      }

      if (!String(row.batch_no || '').trim()) {
        newErrors[`batch_no_${index}`] = 'Batch number is required';
      }

      if (!String(row.work_order_no || '').trim()) {
        newErrors[`work_order_no_${index}`] = 'Workorder number is required';
      }

      if (row.labours === '' || row.labours === null || row.labours === undefined) {
        newErrors[`labours_${index}`] = 'Labours is required';
      }

      // if (row.output_morning === '' && row.output_evening === '') {
      //   newErrors[`output_${index}`] = 'Enter at least one output quantity';
      // }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     SUBMIT UPDATE
  ======================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      /*
        Payload:

        {
          date: "2026-07-29",

          items: [
            {
              id: 1,
              equipment_id: 260,
              material_id: 121,
              ...
            }
          ]
        }
      */

      const payload = {
        date,

        items: rows.map((row) => ({
          ...(row.id
            ? {
                id: row.id,
              }
            : {}),

          equipment_id: row.equipment_id,

          material_id: row.material_id,

          quality: row.quality,

          batch_no: row.batch_no,

          work_order_no: row.work_order_no,

          labours: row.labours,

          output_morning: row.output_morning,

          output_evening: row.output_evening,
        })),
      };

      /*
        IMPORTANT:
        selectedRow should contain the date group.
      */

      await dispatch(
        updateProductionPlaning({
          id: selectedRow?.id || selectedRow?.items?.[0]?.id,
          formdata: payload,
        }),
      ).unwrap();

      toast.success('Production Planning Updated Successfully');

      await dispatch(getProductionPlanning());

      setOpenModal(false);

      setDate('');

      setRows([{ ...initialRow }]);

      setErrors({});
    } catch (err: any) {
      console.error('Update Production Planning Error:', err);

      toast.error(err?.message || err?.error || 'Something went wrong');
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="8xl">
      <Modal.Header>Edit Production Planning</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* =================================================
              DATE
          ================================================= */}

          <div className="mb-5">
            <div className="w-64">
              <label className="mb-1 block font-medium text-black">Production Date</label>

              <TextInput
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
              />

              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1600px] border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  {/* EQUIPMENT */}

                  <th className="min-w-[200px] border border-black px-2 py-3 text-center font-semibold text-black">
                    EQUIPMENT
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  {/* MATERIAL */}

                  <th className="min-w-[220px] border border-black px-2 py-3 text-center font-semibold text-black">
                    NAME OF MATERIAL
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  {/* QUALITY */}

                  <th className="min-w-[160px] border border-black px-2 py-3 text-center font-semibold text-black">
                    QUALITY
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  {/* BATCH */}

                  <th className="min-w-[160px] border border-black px-2 py-3 text-center font-semibold text-black">
                    BATCH NUMBER
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  {/* WORKORDER */}

                  <th className="min-w-[160px] border border-black px-2 py-3 text-center font-semibold text-black">
                    WORKORDER NO.
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  {/* LABOURS */}

                  <th className="min-w-[150px] border border-black px-2 py-3 text-center font-semibold text-black">
                    NO. OF LABOURS
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  {/* OUTPUT */}

                  <th
                    colSpan={2}
                    className="border border-black px-2 py-3 text-center font-semibold text-black"
                  >
                    OUTPUT QUANTITY
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  {/* ACTION */}

                  <th className="w-[100px] border border-black px-2 py-3 text-center font-semibold text-black">
                    ACTION
                  </th>
                </tr>

                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    &nbsp;
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    &nbsp;
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    &nbsp;
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    &nbsp;
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    &nbsp;
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    &nbsp;
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    8:00-1:00
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    1:30-6:00
                  </th>

                  <th className="border border-black px-2 py-2 text-center text-xs font-semibold text-black">
                    &nbsp;
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id || index}>
                    {/* =================================================
                          EQUIPMENT
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <Select
                        options={equipmentOptions}
                        placeholder="Select Equipment"
                        value={
                          equipmentOptions.find(
                            (option) => String(option.value) === String(row.equipment_id),
                          ) || null
                        }
                        onChange={(selected) =>
                          handleRowChange(index, 'equipment_id', selected?.value || '')
                        }
                        isClearable
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuPlacement="auto"
                      />

                      {errors[`equipment_id_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`equipment_id_${index}`]}
                        </p>
                      )}
                    </td>

                    {/* =================================================
                          MATERIAL
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <Select
                        options={materialOptions}
                        placeholder="Select Material"
                        value={
                          materialOptions.find(
                            (option) => String(option.value) === String(row.material_id),
                          ) || null
                        }
                        onChange={(selected) =>
                          handleRowChange(index, 'material_id', selected?.value || '')
                        }
                        isClearable
                        isSearchable
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        menuPlacement="auto"
                      />

                      {errors[`material_id_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`material_id_${index}`]}
                        </p>
                      )}
                    </td>

                    {/* =================================================
                          QUALITY
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <TextInput
                        value={row.quality || ''}
                        placeholder="Enter Quality"
                        onChange={(e) => handleRowChange(index, 'quality', e.target.value)}
                      />

                      {errors[`quality_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`quality_${index}`]}</p>
                      )}
                    </td>

                    {/* =================================================
                          BATCH
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <TextInput
                        value={row.batch_no || ''}
                        placeholder="Enter Batch Number"
                        onChange={(e) => handleRowChange(index, 'batch_no', e.target.value)}
                      />

                      {errors[`batch_no_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`batch_no_${index}`]}</p>
                      )}
                    </td>

                    {/* =================================================
                          WORKORDER
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <TextInput
                        value={row.work_order_no || ''}
                        placeholder="Enter Workorder No."
                        onChange={(e) => handleRowChange(index, 'work_order_no', e.target.value)}
                      />

                      {errors[`work_order_no_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`work_order_no_${index}`]}
                        </p>
                      )}
                    </td>

                    {/* =================================================
                          LABOURS
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <TextInput
                        type="number"
                        value={row.labours ?? ''}
                        placeholder="No. of Labours"
                        onChange={(e) => handleRowChange(index, 'labours', e.target.value)}
                      />

                      {errors[`labours_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`labours_${index}`]}</p>
                      )}
                    </td>

                    {/* =================================================
                          MORNING OUTPUT
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <TextInput
                        type="number"
                        value={row.output_morning ?? ''}
                        placeholder="8:00-1:00"
                        onChange={(e) => handleRowChange(index, 'output_morning', e.target.value)}
                      />
                    </td>

                    {/* =================================================
                          EVENING OUTPUT
                      ================================================= */}

                    <td className="border border-black p-2 align-top">
                      <TextInput
                        type="number"
                        value={row.output_evening ?? ''}
                        placeholder="1:30-6:00"
                        onChange={(e) => handleRowChange(index, 'output_evening', e.target.value)}
                      />

                      {errors[`output_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`output_${index}`]}</p>
                      )}
                    </td>

                    {/* =================================================
                          ACTION
                      ================================================= */}

                    <td className="border border-black p-2 text-center align-top">
                      <Button
                        type="button"
                        color="failure"
                        size="sm"
                        onClick={() => removeRow(index)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =================================================
              ADD ROW
          ================================================= */}

          <div className="mt-4">
            <Button type="button" color="light" onClick={addRow}>
              + Add Row
            </Button>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button type="submit" color="primary">
              Update Production Planning
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Editproductionmodal;
