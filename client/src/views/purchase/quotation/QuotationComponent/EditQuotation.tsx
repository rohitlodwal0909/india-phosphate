import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Label,
  TextInput,
  Textarea,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { updateQuotation } from 'src/features/purchase/quotation/quotationSlice';

type Props = {
  editModal: boolean;
  setEditModal: (val: boolean) => void;
  editData: any;
};

const EditModel = ({ editModal, setEditModal, editData }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<any>({
    company_name: '',
    contact_person: '',
    mobile: '',
    trade_type: '',
    country: '',
    inco_term: '',
    discharge_port: '',
    remark: '',
    products: [{ name: '', rate: '' }],
  });

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (editData) {
      setFormData({
        company_name: editData.company_name || '',
        contact_person: editData.contact_person || '',
        mobile: editData.mobile || '',
        trade_type: editData.trade_type || '',
        country: editData.country || '',
        inco_term: editData.inco_term || '',
        discharge_port: editData.discharge_port || '',
        remark: editData.remark || '',
        products:
          typeof editData.products === 'string'
            ? JSON.parse(editData.products)
            : editData.products || [{ name: '', rate: '' }],
      });
    }
  }, [editData]);

  /* ================= HANDLERS ================= */

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const updated = [...formData.products];
    updated[index][field] = value;

    setFormData((prev: any) => ({
      ...prev,
      products: updated,
    }));
  };

  const addProduct = () => {
    setFormData((prev: any) => ({
      ...prev,
      products: [...prev.products, { name: '', rate: '' }],
    }));
  };

  const removeProduct = (index: number) => {
    if (formData.products.length === 1) return;

    const updated = formData.products.filter((_: any, i: number) => i !== index);

    setFormData((prev: any) => ({
      ...prev,
      products: updated,
    }));
  };

  /* ================= UPDATE ================= */

  const handleSubmit = async () => {
    if (!formData.company_name) {
      toast.error('Company name required');
      return;
    }

    try {
      await dispatch(
        updateQuotation({
          id: editData.id,
          data: {
            ...formData,
            products: JSON.stringify(formData.products),
          },
        }),
      ).unwrap();

      toast.success('Quotation Updated Successfully ✅');
      setEditModal(false);
    } catch (error: any) {
      toast.error(error || 'Update failed');
    }
  };

  /* ================= UI ================= */

  return (
    <Modal show={editModal} size="5xl" popup onClose={() => setEditModal(false)}>
      <ModalHeader className="border-b">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:file-edit-outline" width={22} />
          Edit Quotation
        </div>
      </ModalHeader>

      <ModalBody className="p-6 text-[12px]">
        <div className="grid grid-cols-12 gap-4">
          {/* Company */}
          <div className="col-span-6">
            <Label value="Company Name" />
            <TextInput
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Contact Person" />
            <TextInput
              value={formData.contact_person}
              onChange={(e) => handleChange('contact_person', e.target.value)}
            />
          </div>

          <div className="col-span-3">
            <Label value="Mobile Number" />
            <TextInput
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
            />
          </div>

          {/* PRODUCTS */}
          {formData.products.map((product: any, index: number) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-3 items-end">
              <div className="col-span-6">
                <Label value={`Product ${index + 1}`} />
                <TextInput
                  value={product.name}
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                />
              </div>

              <div className="col-span-3">
                <Label value="Rate" />
                <TextInput
                  value={product.rate}
                  onChange={(e) => handleProductChange(index, 'rate', e.target.value)}
                />
              </div>

              <div className="col-span-3 flex gap-2">
                <Button size="sm" color="gray" onClick={addProduct}>
                  <Icon icon="mdi:plus" width={18} />
                </Button>

                <Button
                  size="sm"
                  color="failure"
                  onClick={() => removeProduct(index)}
                  disabled={formData.products.length === 1}
                >
                  <Icon icon="mdi:delete-outline" width={18} />
                </Button>
              </div>
            </div>
          ))}

          {/* Trade Type */}
          <div className="col-span-3">
            <Label value="Domestic / Export" />
            <select
              className="w-full border rounded-md p-2"
              value={formData.trade_type}
              onChange={(e) => handleChange('trade_type', e.target.value)}
            >
              <option value="">Select</option>
              <option value="domestic">Domestic</option>
              <option value="export">Export</option>
            </select>
          </div>

          {formData.trade_type === 'export' && (
            <>
              <div className="col-span-3">
                <Label value="Country" />
                <TextInput
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                />
              </div>

              <div className="col-span-3">
                <Label value="Inco Term" />
                <TextInput
                  value={formData.inco_term}
                  onChange={(e) => handleChange('inco_term', e.target.value)}
                />
              </div>

              <div className="col-span-3">
                <Label value="Discharge Port" />
                <TextInput
                  value={formData.discharge_port}
                  onChange={(e) => handleChange('discharge_port', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Remark */}
          <div className="col-span-12">
            <Label value="Remark" />
            <Textarea
              rows={3}
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="border-t flex justify-end gap-3">
        <Button color="gray" onClick={() => setEditModal(false)}>
          Cancel
        </Button>

        <Button color="success" onClick={handleSubmit}>
          <Icon icon="mdi:content-save-edit-outline" width={18} className="mr-2" />
          Update Quotation
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModel;
