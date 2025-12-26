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
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';
import {
  addBmrMaster,
  GetBmrMaster,
} from 'src/features/master/BmrMaster/BmrMasterSlice';

const AddBmrMasterModal = ({ show, setShowmodal,rawMaterials, equipments, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  /* ======================
     MASTER DATA
  ====================== */



  /* ======================
     FORM STATE
  ====================== */
const [formData, setFormData] = useState<any>({
  product_code: '',
  product_name: '',
  batch_size: '',
  shelf_life: '',
  storage_conditions: '',
  packaging_details: '',
  equipment_used: [],
  raw_materials: '',
  process_steps: '',
  qa_qc_signoff: '',
  remarks: '',
  created_by: logindata?.admin?.id,
});


  const [errors, setErrors] = useState<any>({});

  /* ======================
     OPTIONS
  ====================== */
  const rawMaterialOptions =
    rawMaterials?.map((item: any) => ({
      value: item.id,
      label: item.rm_code,
    })) || [];

  const equipmentOptions =
    equipments?.map((item: any) => ({
      value: item.id,
      label: item.name,
    })) || [];

  /* ======================
     HANDLERS
  ====================== */
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
   const required = [
  'product_code',
  'product_name',
  'batch_size',
  'shelf_life',
  'raw_materials',
  'equipment_used',
  'process_steps',
  'qa_qc_signoff',
];

    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field] || formData[field]?.length === 0) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ======================
     SUBMIT
  ====================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      equipment_used: formData.equipment_used.map((e: any) => e.value), // ✅ array
      raw_materials: formData.raw_materials.value, // ✅ single
    };

    try {
      const res = await dispatch(addBmrMaster(payload)).unwrap();
      toast.success(res.message || 'BMR Master created');
      dispatch(GetBmrMaster());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong');
    }
  };

  /* ======================
     JSX
  ====================== */
  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Create New BMR Master</ModalHeader>

      <ModalBody>
        <form className="grid grid-cols-12 gap-4">

          {/* PRODUCT NAME */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Product Name" />
            <TextInput
              placeholder="Enter product name"
              value={formData.product_name}
              onChange={(e) => handleChange('product_name', e.target.value)}
            />
          </div>

          {/* BATCH SIZE */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Batch Size" />
            <TextInput
              placeholder="Enter batch size"
              value={formData.batch_size}
              onChange={(e) => handleChange('batch_size', e.target.value)}
            />
          </div>

          {/* RAW MATERIAL (SINGLE SELECT) */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Raw Materials" />
            <Select
              options={rawMaterialOptions}
              value={formData.raw_materials}
              onChange={(val) => handleChange('raw_materials', val)}
            />
            {errors.raw_materials && (
              <p className="text-red-500 text-xs">{errors.raw_materials}</p>
            )}
          </div>

          {/* EQUIPMENT (MULTI SELECT) */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Equipment Used" />
            <Select
              options={equipmentOptions}
              isMulti
              value={formData.equipment_used}
              onChange={(val) => handleChange('equipment_used', val)}
            />
            {errors.equipment_used && (
              <p className="text-red-500 text-xs">{errors.equipment_used}</p>
            )}
          </div>
          <div className="col-span-12 md:col-span-6">
  <Label value="Product Code" />
  <TextInput
    placeholder="Enter product code (e.g. BMR-001)"
    value={formData.product_code}
    onChange={(e) => handleChange('product_code', e.target.value)}
  />
</div>
<div className="col-span-12 md:col-span-6">
  <Label value="Shelf Life" />
  <TextInput
    placeholder="e.g. 24 Months"
    value={formData.shelf_life}
    onChange={(e) => handleChange('shelf_life', e.target.value)}
  />
</div>
<div className="col-span-12 md:col-span-6">
  <Label value="Storage Conditions" />
  <TextInput
    
    placeholder="e.g. Store in a cool & dry place"
    value={formData.storage_conditions}
    onChange={(e) => handleChange('storage_conditions', e.target.value)}
  />
</div>

<div className="col-span-12 md:col-span-6">
  <Label value="Packaging" />
  <TextInput
    placeholder="Describe packaging details"
    value={formData.packaging}
    onChange={(e) => handleChange('packaging_details', e.target.value)}
  />
</div>


          {/* PROCESS STEPS */}
          <div className="col-span-12 md:col-span-6">
            <Label value="Process Steps" />
            <TextInput
               placeholder="Enter Process Steps"

              value={formData.process_steps}
              onChange={(e) => handleChange('process_steps', e.target.value)}
            />
          </div>

          {/* QA/QC */}
          <div className="col-span-12 md:col-span-6">
            <Label value="QA / QC Signoff" />
            <TextInput
              placeholder="Enter QA / QC Signoff"

              value={formData.qa_qc_signoff}
              onChange={(e) => handleChange('qa_qc_signoff', e.target.value)}
            />
          </div>

          {/* REMARKS */}
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

      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddBmrMasterModal;
