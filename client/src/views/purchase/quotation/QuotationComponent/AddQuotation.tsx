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
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { createQuotation, getQuotation } from 'src/features/purchase/quotation/quotationSlice';

type Props = {
  placeModal: boolean;
  setPlaceModal: (val: boolean) => void;
};

const CreateModel = ({ placeModal, setPlaceModal }: Props) => {
  const [formData, setFormData] = useState({
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

  const dispatch = useDispatch<AppDispatch>();

  /* ================= HANDLERS ================= */

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const updated = [...formData.products];
    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      products: updated,
    }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { name: '', rate: '' }],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.company_name) {
      toast.error('Company name required');
      return;
    }

    try {
      await dispatch(createQuotation(formData)).unwrap();
      dispatch(getQuotation());
      toast.success('Quotation Created Successfully ✅');

      // reset form
      setFormData({
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

      setPlaceModal(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error || 'Quotation creation failed');
    }
  };

  const removeProduct = (index: number) => {
    if (formData.products.length === 1) return;

    const updated = formData.products.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      products: updated,
    }));
  };
  /* ================= UI ================= */

  return (
    <Modal
      show={placeModal}
      size="5xl"
      position="center"
      popup
      onClose={() => setPlaceModal(false)}
    >
      <ModalHeader className="border-b">
        <div className="flex items-center">
          <Icon icon="mdi:file-document-edit-outline" width={22} />
          Create Quotation
        </div>
      </ModalHeader>

      <ModalBody className="bg-white text-[12px] p-6 text-gray-800">
        <div className="grid grid-cols-12 gap-4">
          {/* ================= BASIC ================= */}

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

          {/* ================= PRODUCTS ================= */}

          {formData.products.map((product, index) => (
            <div key={index} className="col-span-12 grid grid-cols-12 gap-3 items-end">
              <div className="col-span-6">
                <Label value={`Product ${index + 1}`} />
                <TextInput
                  value={product.name}
                  placeholder="Product Name"
                  onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                />
              </div>

              <div className="col-span-3">
                <Label value="Rate" />
                <TextInput
                  value={product.rate}
                  placeholder="Rate"
                  onChange={(e) => handleProductChange(index, 'rate', e.target.value)}
                />
              </div>

              {/* DELETE BUTTON */}
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

          {/* ================= TRADE TYPE ================= */}

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
                <Label value="Country Name" />
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

          {/* ================= REMARK ================= */}

          <div className="col-span-12 font-semibold border-b pt-4 pb-2">Remark</div>

          <div className="col-span-12">
            <Textarea
              rows={3}
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
            />
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="border-t flex justify-end gap-3">
        <Button color="gray" onClick={() => setPlaceModal(false)}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSubmit}>
          <Icon icon="mdi:content-save-outline" width={18} className="mr-2" />
          Save Quotation
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModel;
