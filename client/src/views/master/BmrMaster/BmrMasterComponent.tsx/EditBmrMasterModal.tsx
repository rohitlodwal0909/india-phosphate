import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  Textarea,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  updateBmrMaster,
  GetBmrMaster,
} from 'src/features/master/BmrMaster/BmrMasterSlice';

/* ✅ SAFE ARRAY PARSER */
const toArray = (value: any): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed
        : value.split(',').map((v) => v.trim());
        
    } catch {
      return value.split(',').map((v) => v.trim());
    }
  }

  return [];
};

const EditBmrMasterModal = ({
  show,
  setShowmodal,
  BmrMasterData,
  rawMaterials = [],
  equipments = [],
  logindata,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    id: '',
    product_code: '',
    product_name: '',
    batch_size: '',
    shelf_life: '',
    storage_conditions: '',
    packaging: '',
    equipment_used: [],
    raw_materials: '',
    process_steps: '',
    packaging_details: '',
    qa_qc_signoff: '',
    remarks: '',
    created_by: logindata?.admin?.id,
  });

const rawMaterialOptions = rawMaterials.map((rm: any) => ({
  value: rm.id,                 // DB me store hoga
  label: `${rm.rm_code}`, // UI me show hoga
}));

const equipmentOptions = equipments.map((rm: any) => ({
  value: rm.id,                 // DB me store hoga
  label: `${rm.name}`, // UI me show hoga
}));

  useEffect(() => {
    if (BmrMasterData) {
      setFormData({
        id: BmrMasterData.id,
        product_code: BmrMasterData.product_code || '',
        product_name: BmrMasterData.product_name || '',
        batch_size: BmrMasterData.batch_size || '',
        shelf_life: BmrMasterData.shelf_life || '',
        storage_conditions: BmrMasterData.storage_conditions || '',
        packaging: BmrMasterData.packaging || '',
        equipment_used: toArray(BmrMasterData.equipment_used),
        raw_materials: BmrMasterData.raw_materials,
        process_steps: BmrMasterData.process_steps || '',
        packaging_details: BmrMasterData.packaging_details || '',
        qa_qc_signoff: BmrMasterData.qa_qc_signoff || '',
        remarks: BmrMasterData.remarks || '',
        created_by: logindata?.admin?.id,
      });
    }
  }, [BmrMasterData]);

  const handleChange = (field: string, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...formData,
      equipment_used: JSON.stringify(formData.equipment_used),
    };

    try {
      await dispatch(updateBmrMaster(payload)).unwrap();
      toast.success('BMR updated successfully');
      dispatch(GetBmrMaster());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Update failed');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Edit BMR Master</ModalHeader>

      <ModalBody>
        <form className="grid grid-cols-12 gap-4">

          {/* TEXT FIELDS */}
          {[
            ['product_name', 'Product Name'],
            ['batch_size', 'Batch Size'],
            ['product_code', 'Product Code'],
            ['shelf_life', 'Shelf Life'],
            ['storage_conditions', 'Storage Conditions'],
          ].map(([id, label]) => (
            <div key={id} className="col-span-12 md:col-span-6">
              <Label value={label} />
              <TextInput
                value={formData[id]}
                onChange={(e) => handleChange(id, e.target.value)}
              />
            </div>
          ))}

          {/* EQUIPMENT MULTI SELECT */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Equipment Used" />
            <Select
              isMulti
              options={equipmentOptions}
              value={equipmentOptions.filter((o) =>
                formData.equipment_used.includes(o.value)
              )}
              onChange={(selected) =>
                setFormData((p) => ({
                  ...p,
                  equipment_used: selected.map((s) => s.value),
                }))
              }
            />
          </div>

          {/* RAW MATERIAL MULTI SELECT */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Raw Materials" />
            <Select
              options={rawMaterialOptions}

              value={
                rawMaterialOptions.find(
                  (opt) => opt.value == formData.raw_materials
                ) || null
              }

              onChange={(selected: any) =>
                setFormData({
                  ...formData,
                  raw_materials: selected ? selected.value : '',
                })
              }
              placeholder="Select Raw Material"
            />
           </div>

          {/* TEXTAREAS */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Process Steps" />
            <TextInput
              value={formData.process_steps}
              onChange={(e) => handleChange('process_steps', e.target.value)}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <Label value="Packaging Details" />
            <TextInput
              value={formData.packaging_details}
              onChange={(e) =>
                handleChange('packaging_details', e.target.value)
              }
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <Label value="QA / QC Signoff" />
            <TextInput
              value={formData.qa_qc_signoff}
              onChange={(e) =>
                handleChange('qa_qc_signoff', e.target.value)
              }
            />
          </div>

          <div className="col-span-12">
            <Label value="Remarks" />
            <Textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
            />
          </div>

        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditBmrMasterModal;
