import React, { useEffect, useState } from 'react';
import { Button, Modal, Label } from 'flowbite-react';
import Select from 'react-select';
import { Icon } from '@iconify/react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import {
  editProduction,
  GetFetchQcProduction,
} from 'src/features/Inventorymodule/productionmodule/ProdutionSlice';
import { toast } from 'react-toastify';
import { GetAllrowmaterial } from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import { GetNotification } from 'src/features/Notifications/NotificationSlice';
import { allUnits } from 'src/utils/AllUnit';

interface Props {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  rmcodes: any[];
  pmcodes: any[];
  equipments: any[];
  selectedRow: any;
}

const Editproductionmodal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  rmcodes,
  pmcodes,
  equipments,
  selectedRow,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    id: '',
    batch_id: '',
    rm_items: [{ rm_code: '', quantity: '', unit: '' }],
    pm_items: [{ pm_code: '', quantity: '', unit: '' }],
    equipments: [''],
  });

  /* ================= INIT ================= */
  useEffect(() => {
    if (selectedRow && Array.isArray(selectedRow) && selectedRow.length > 0) {
      const rmItems = selectedRow
        .filter((i: any) => i.rm_code)
        .map((i: any) => ({
          rm_code: Number(i.rm_code),
          quantity: i.rm_quantity || '',
          unit: i.rm_unit || '',
        }));

      const pmItems = selectedRow
        .filter((i: any) => i.pm_code)
        .map((i: any) => ({
          pm_code: Number(i.pm_code),
          quantity: i.pm_quantity || '',
          unit: i.pm_unit || '',
        }));

      const equipmentItems = selectedRow
        .filter((i: any) => i.equipments)
        .map((i: any) => Number(i.equipments));

      setFormData({
        id: selectedRow[0]?.id || '',
        batch_id: selectedRow[0]?.batch_id || '',
        rm_items: rmItems.length ? rmItems : [{ rm_code: '', quantity: '', unit: '' }],
        pm_items: pmItems.length ? pmItems : [{ pm_code: '', quantity: '', unit: '' }],
        equipments: equipmentItems.length ? equipmentItems : [''],
      });
    }
  }, [selectedRow]);

  /* ================= OPTIONS ================= */
  const rmOptions = rmcodes.map((i) => ({
    value: i.id,
    label: i.rm_code,
  }));

  const pmOptions = pmcodes.map((i) => ({
    value: i.id,
    label: i.name,
  }));

  const equipmentOptions = equipments.map((i) => ({
    value: i.id,
    label: i.name,
  }));

  /* ================= HANDLERS ================= */
  const handleItemChange = (type: any, index: number, field: string, value: string) => {
    const updated = [...formData[type]];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, [type]: updated }));
  };

  const addRow = (type: 'rm_items' | 'pm_items') => {
    const newItem =
      type === 'rm_items'
        ? { rm_code: '', quantity: '', unit: '' }
        : { pm_code: '', quantity: '', unit: '' };

    setFormData((prev: any) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));
  };

  const deleteRow = (type: 'rm_items' | 'pm_items', index: number) => {
    if (formData[type].length === 1) return;
    const updated = [...formData[type]];
    updated.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, [type]: updated }));
  };

  /* ================= EQUIPMENT ================= */
  const handleEquipmentChange = (index: number, value: string) => {
    const updated = [...formData.equipments];
    updated[index] = value;
    setFormData((prev: any) => ({ ...prev, equipments: updated }));
  };

  const addEquipment = () => {
    setFormData((prev: any) => ({
      ...prev,
      equipments: [...prev.equipments, ''],
    }));
  };

  const deleteEquipment = (index: number) => {
    if (formData.equipments.length === 1) return;
    const updated = [...formData.equipments];
    updated.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, equipments: updated }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      id: formData.id, // ✅ important
      batch_id: formData.batch_id,

      rm_code: formData.rm_items.map((i: any) => i.rm_code),
      rm_quantity: formData.rm_items.map((i: any) => i.quantity),
      rm_unit: formData.rm_items.map((i: any) => i.unit),

      pm_code: formData.pm_items.map((i: any) => i.pm_code),
      pm_quantity: formData.pm_items.map((i: any) => i.quantity),
      pm_unit: formData.pm_items.map((i: any) => i.unit),

      equipments: formData.equipments,
    };

    try {
      await dispatch(editProduction(payload)).unwrap();

      toast.success('Production updated successfully');

      await Promise.all([
        dispatch(GetAllrowmaterial()),
        dispatch(GetFetchQcProduction()),
        dispatch(GetNotification()),
      ]);

      setOpenModal(false);
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    }
  };

  /* ================= UI ================= */
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)} size="5xl">
      <Modal.Header>Edit Production</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* RM */}
          {formData.rm_items.map((item: any, index: number) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
                <Label value="RM Code" />
                <Select
                  options={rmOptions}
                  value={rmOptions.find((opt) => opt.value === item.rm_code) || null}
                  onChange={(selected) =>
                    handleItemChange('rm_items', index, 'rm_code', selected?.value || '')
                  }
                  className="w-full"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className="col-span-5">
                <Label htmlFor="quantity" value="Quantity" />
                <span className="text-red-700 ps-1">*</span>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="Enter quantity"
                    className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange('rm_items', index, 'quantity', e.target.value)
                    }
                  />
                  <select
                    id="unit"
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleItemChange('rm_items', index, 'unit', e.target.value)}
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
              </div>

              <div className="col-span-2">
                {index == 0 ? (
                  <Button type="button" color="primary" onClick={() => addRow('rm_items')}>
                    <Icon icon="material-symbols:add-rounded" height={18} />
                  </Button>
                ) : (
                  <Button type="button" color="error" onClick={() => deleteRow('rm_items', index)}>
                    <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* PM */}
          {formData.pm_items.map((item: any, index: number) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
                <Label value="PM Code" />
                <Select
                  options={pmOptions}
                  value={pmOptions.find((opt) => opt.value === item.pm_code) || null}
                  onChange={(selected) =>
                    handleItemChange('pm_items', index, 'pm_code', selected?.value || '')
                  }
                  className="w-full"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <div className="col-span-5">
                <Label htmlFor="quantity" value="Quantity" />
                <span className="text-red-700 ps-1">*</span>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="Enter quantity"
                    className="w-full rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange('pm_items', index, 'quantity', e.target.value)
                    }
                  />
                  <select
                    id="unit"
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleItemChange('pm_items', index, 'unit', e.target.value)}
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
              </div>

              <div className="col-span-2">
                {index == 0 ? (
                  <Button type="button" color="primary" onClick={() => addRow('pm_items')}>
                    <Icon icon="material-symbols:add-rounded" height={18} />
                  </Button>
                ) : (
                  <Button type="button" color="error" onClick={() => deleteRow('pm_items', index)}>
                    <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* EQUIPMENT */}
          {formData.equipments.map((eq: string, index: number) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-4 items-end">
              <div className="col-span-5">
                <Label value="Equipment" />
                <Select
                  options={equipmentOptions}
                  value={equipmentOptions.find((o) => o.value === eq)}
                  onChange={(s) => handleEquipmentChange(index, s?.value || '')}
                  className="w-full"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>

              <div className="col-span-2">
                {index == 0 ? (
                  <Button type="button" color="primary" onClick={() => addEquipment()}>
                    <Icon icon="material-symbols:add-rounded" height={18} />
                  </Button>
                ) : (
                  <Button type="button" color="error" onClick={() => deleteEquipment(index)}>
                    <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* ACTION */}
          <div className="col-span-12 flex justify-end gap-2">
            <Button color="gray" onClick={() => setOpenModal(false)}>
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

export default Editproductionmodal;
