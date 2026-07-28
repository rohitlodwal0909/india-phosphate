import React, { useEffect, useState } from 'react';
import { Button, Modal, TextInput } from 'flowbite-react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';

import { GetProduct } from 'src/features/master/Product/ProductSlice';
import {
  createProductionPlaning,
  getProductionPlanning,
} from 'src/features/Inventorymodule/planing/ProdutionPlaningSlice';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
}

/* =====================================================
   MULTIPLE ROW DATA
===================================================== */

interface ProductionRow {
  equipment_id: string;
  material_id: string;
  quality: string;
  batch_no: string;
  work_order_no: string;
  labours: string;
  output_morning: string;
  output_evening: string;
}

/* =====================================================
   INITIAL ROW
===================================================== */

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

const Addproductionmodal: React.FC<Props> = ({ openModal, setOpenModal }) => {
  const dispatch = useDispatch<AppDispatch>();

  /* =====================================================
     PRODUCTS
  ===================================================== */

  const materials = useSelector((state: any) => state.products.productdata) || [];

  /* =====================================================
     DATE - SINGLE
  ===================================================== */

  const [date, setDate] = useState('');

  /* =====================================================
     MULTIPLE ROWS
  ===================================================== */

  const [rows, setRows] = useState<ProductionRow[]>([{ ...initialRow }]);

  const [errors, setErrors] = useState<any>({});

  /* =====================================================
     MATERIAL OPTIONS
  ===================================================== */

  const materialOptions = materials.map((item: any) => ({
    value: item.id,
    label: item.product_name,
  }));

  /* =====================================================
     EQUIPMENT OPTIONS

     Replace this with your Equipment API data
  ===================================================== */

  const equipmentOptions = [
    {
      value: 'equipment_1',
      label: 'Equipment 1',
    },
    {
      value: 'equipment_2',
      label: 'Equipment 2',
    },
    {
      value: 'equipment_3',
      label: 'Equipment 3',
    },
  ];

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    dispatch(GetProduct());

    // dispatch(GetEquipment());
  }, [dispatch]);

  /* =====================================================
     RESET
  ===================================================== */

  useEffect(() => {
    if (!openModal) {
      setDate('');
      setRows([{ ...initialRow }]);
      setErrors({});
    }
  }, [openModal]);

  /* =====================================================
     DATE CHANGE
  ===================================================== */

  const handleDateChange = (value: string) => {
    setDate(value);

    setErrors((prev: any) => ({
      ...prev,
      date: '',
    }));
  };

  /* =====================================================
     ROW CHANGE
  ===================================================== */

  const handleRowChange = (index: number, field: keyof ProductionRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });

    setErrors((prev: any) => ({
      ...prev,
      [`${field}_${index}`]: '',
    }));
  };

  /* =====================================================
     ADD ROW
  ===================================================== */

  const addRow = () => {
    setRows((prev) => [...prev, { ...initialRow }]);
  };

  /* =====================================================
     REMOVE ROW
  ===================================================== */

  const removeRow = (index: number) => {
    if (rows.length === 1) {
      toast.warning('At least one row is required');
      return;
    }

    setRows((prev) => prev.filter((_, i) => i !== index));

    setErrors({});
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    const newErrors: any = {};

    if (!date) {
      newErrors.date = 'Date is required';
    }

    rows.forEach((row, index) => {
      if (!row.equipment_id) {
        newErrors[`equipment_id_${index}`] = 'Required';
      }

      if (!row.material_id) {
        newErrors[`material_id_${index}`] = 'Required';
      }

      if (!row.quality.trim()) {
        newErrors[`quality_${index}`] = 'Required';
      }

      if (!row.batch_no.trim()) {
        newErrors[`batch_no_${index}`] = 'Required';
      }

      if (!row.work_order_no.trim()) {
        newErrors[`work_order_no_${index}`] = 'Required';
      }

      if (!row.labours) {
        newErrors[`labours_${index}`] = 'Required';
      }

      if (!row.output_morning && !row.output_evening) {
        newErrors[`output_${index}`] = 'Enter output quantity';
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        date: date,

        items: rows,
      };

      console.log('Production Planning Payload:', payload);

      await dispatch(createProductionPlaning(payload)).unwrap();

      toast.success('Production Planning Added Successfully');

      dispatch(getProductionPlanning());

      setOpenModal(false);

      setDate('');

      setRows([{ ...initialRow }]);

      setErrors({});
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="8xl">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Modal.Header>Production Planning</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* =====================================================
              DATE - SINGLE
          ===================================================== */}

          <div className="mb-5 flex items-end gap-4">
            <div className="w-64">
              <label className="mb-1 block text-dark font-medium text-gray-700">
                Production Date
              </label>

              <TextInput
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
              />

              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>
          </div>

          {/* =====================================================
              TABLE
          ===================================================== */}

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1500px] border-collapse border border-gray-800 ">
              {/* =================================================
                  HEADER
              ================================================= */}

              <thead>
                {/* FIRST HEADER ROW */}

                <tr className="bg-gray-50">
                  <th
                    rowSpan={2}
                    className="w-[80px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    Date
                  </th>

                  <th
                    rowSpan={2}
                    className="min-w-[160px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    EQUIPMENT
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  <th
                    rowSpan={2}
                    className="min-w-[180px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    NAME OF
                    <br />
                    MATERIAL
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  <th
                    rowSpan={2}
                    className="min-w-[150px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    QUALITY
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  <th
                    rowSpan={2}
                    className="min-w-[150px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    BATCH
                    <br />
                    NUMBER
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  <th
                    rowSpan={2}
                    className="min-w-[150px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    Workorder
                    <br />
                    no
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  <th
                    rowSpan={2}
                    className="min-w-[150px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    NO. OF
                    <br />
                    LABOURS
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  <th
                    colSpan={2}
                    className="border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    OUTPUT QUANTITY
                    <br />
                    <span className="font-normal">(Multiple)</span>
                  </th>

                  <th
                    rowSpan={2}
                    className="w-[100px] border border-gray-800 px-2 py-3 text-center text-dark font-semibold"
                  >
                    ACTION
                  </th>
                </tr>

                {/* SECOND HEADER ROW */}

                <tr className="bg-gray-50">
                  <th className="w-[100px] border border-gray-800 px-2 py-2 text-center text-xs font-semibold">
                    8:00-1:00
                  </th>

                  <th className="w-[100px] border border-gray-800 px-2 py-2 text-center text-xs font-semibold">
                    1:30-6:00
                  </th>
                </tr>
              </thead>

              {/* =================================================
                  BODY
              ================================================= */}

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="align-top">
                    {/* DATE SINGLE */}

                    {index === 0 && (
                      <td
                        rowSpan={rows.length}
                        className="border border-gray-800 px-2 py-3 text-black text-center align-middle"
                      >
                        {date ? new Date(date).toLocaleDateString('en-GB') : '-'}
                      </td>
                    )}

                    {/* EQUIPMENT */}

                    <td className="border border-gray-800 p-2">
                      <Select
                        options={equipmentOptions}
                        placeholder="Select"
                        value={
                          equipmentOptions.find((option) => option.value === row.equipment_id) ||
                          null
                        }
                        onChange={(selected) =>
                          handleRowChange(index, 'equipment_id', selected?.value || '')
                        }
                        isClearable
                      />

                      {errors[`equipment_id_${index}`] && (
                        <p className="mt-1 text-xs text-red-500">Required</p>
                      )}
                    </td>

                    {/* MATERIAL */}

                    <td className="border border-gray-800 p-2">
                      <Select
                        options={materialOptions}
                        placeholder="Select"
                        value={
                          materialOptions.find((option) => option.value === row.material_id) || null
                        }
                        onChange={(selected) =>
                          handleRowChange(index, 'material_id', selected?.value || '')
                        }
                        isClearable
                      />

                      {errors[`material_id_${index}`] && (
                        <p className="mt-1 text-xs text-red-500">Required</p>
                      )}
                    </td>

                    {/* QUALITY */}

                    <td className="border border-gray-800 p-2">
                      <TextInput
                        placeholder="Quality"
                        value={row.quality}
                        onChange={(e) => handleRowChange(index, 'quality', e.target.value)}
                      />
                    </td>

                    {/* BATCH */}

                    <td className="border border-gray-800 p-2">
                      <TextInput
                        placeholder="Batch No."
                        value={row.batch_no}
                        onChange={(e) => handleRowChange(index, 'batch_no', e.target.value)}
                      />
                    </td>

                    {/* WORK ORDER */}

                    <td className="border border-gray-800 p-2">
                      <TextInput
                        placeholder="Workorder No."
                        value={row.work_order_no}
                        onChange={(e) => handleRowChange(index, 'work_order_no', e.target.value)}
                      />
                    </td>

                    {/* LABOURS */}

                    <td className="border border-gray-800 p-2">
                      <TextInput
                        type="number"
                        min="1"
                        placeholder="No."
                        value={row.labours}
                        onChange={(e) => handleRowChange(index, 'labours', e.target.value)}
                      />
                    </td>

                    {/* OUTPUT 8:00-1:00 */}

                    <td className="border border-gray-800 p-2">
                      <TextInput
                        type="number"
                        min="0"
                        placeholder="Qty"
                        value={row.output_morning}
                        onChange={(e) => handleRowChange(index, 'output_morning', e.target.value)}
                      />
                    </td>

                    {/* OUTPUT 1:30-6:00 */}

                    <td className="border border-gray-800 p-2">
                      <TextInput
                        type="number"
                        min="0"
                        placeholder="Qty"
                        value={row.output_evening}
                        onChange={(e) => handleRowChange(index, 'output_evening', e.target.value)}
                      />
                    </td>

                    {/* ACTION */}

                    <td className="border border-gray-800 p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-dark font-medium text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =====================================================
              ADD ROW
          ===================================================== */}

          <div className="mt-4">
            <Button type="button" color="light" onClick={addRow}>
              + Add Row
            </Button>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>

            <Button type="submit" color="primary">
              Save Production Planning
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Addproductionmodal;
