import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  updateSupplier,
  GetSupplier,
} from 'src/features/master/Supplier/SupplierSlice';

const EditSupplierModal = ({ show, setShowmodal, SupplierData,logindata }) => {
  const dispatch = useDispatch<AppDispatch>();
const suppliertype = ['RM', 'PM', 'Machinery Lab', 'instrument','Stationery','Computer Peripherals'];
 const domesticOptions = ["National", "International"];
  const [formData, setFormData] = useState({
    id: '',
    user_id:logindata?.admin.id,
    supplier_name: '',
    email: '',
    address: '',
    contact_no: '',
    manufacturer_type:"",
         supplier_type:"",
    gst_number:"",
    invoice_no:"",
    domestic:"",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (SupplierData) {
      setFormData({
        id: SupplierData?.id || '',
        supplier_name: SupplierData?.supplier_name || '',
        email: SupplierData?.email || '',
        address: SupplierData?.address || '',
         contact_no: SupplierData?.contact_no || '',
         manufacturer_type:SupplierData?.manufacturer_type || '',
        user_id:logindata?.admin.id,
             supplier_type:SupplierData?.supplier_type ||"",
    gst_number:SupplierData?.gst_number ||"",
    invoice_no:SupplierData?.invoice_no ||"",
    domestic:SupplierData?.domestic ||"",
      });
    }
  }, [SupplierData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['supplier_name', 'email', 'address', 'contact_no','manufacturer_type','supplier_type','gst_number','invoice_no','domestic'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateSupplier(formData)).unwrap();
      toast.success(result.message || 'Supplier updated successfully');
      dispatch(GetSupplier());
      setShowmodal(false);
    } catch (err) {
      toast.error('Failed to update supplier');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Supplier</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            {
              id: 'supplier_name',
              label: 'Supplier Name',
              type: 'text',
              placeholder: 'Enter supplier name',
            },
             {
              id: 'contact_no',
              label: 'Contact No',
              type: 'text',
              placeholder: 'Enter contact number',
            },
            {
              id: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'Enter email',
            },
                       {
              id: 'manufacturer_type',
              label: 'Manufacturer Type',
              type: 'text',
              placeholder: 'Enter Manufacturer Type',
            },
              {
              id: 'gst_number',
              label: 'GST Number',
              type: 'text',
              placeholder: 'Enter GST Number',
            },
             {
              id: 'invoice_no',
              label: 'Invoice Number',
              type: 'text',
              placeholder: 'Enter Invoice Number',
            },
           
          ].map(({ id, label, type, placeholder }) => (
            <div className={`${type ==="email" ? "col-span-6" :"col-span-6"}`} key={id}>
              <Label htmlFor={id} value={label} />
              <span className="text-red-700 ps-1">*</span>
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={placeholder}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className='form-rounded-md'
              />
              {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
            </div>
          ))}


<div className="col-span-6">
            <Label htmlFor="supplier_type" value="Supplier Type" />
            <span className="text-red-700 ps-1">*</span>

            <select
              id="supplier_type"
              value={formData.supplier_type}
              onChange={(e) => handleChange('supplier_type', e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"

            >
              <option value="">Select Supplier type</option>
              {suppliertype.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
            {errors.supplier_type && <p className="text-red-500 text-xs">{errors.supplier_type}</p>}
          </div>

<div className="col-span-6">
            <Label htmlFor="domestic" value="Domestic" />
            <span className="text-red-700 ps-1">*</span>

            <select
              id="domestic"
              value={formData.domestic}
              onChange={(e) => handleChange('domestic', e.target.value)}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5"

            >
              <option value="">Select Domestic</option>
              {domesticOptions.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
            {errors.domestic && <p className="text-red-500 text-xs">{errors.domestic}</p>}
          </div>
          <div className="col-span-12">
            <Label htmlFor="address" value="Address" />
            <span className="text-red-700 ps-1">*</span>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter supplier address"
              className={`w-full border rounded-md p-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address}</p>
            )}
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditSupplierModal;
