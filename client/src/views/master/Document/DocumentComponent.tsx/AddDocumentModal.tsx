import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
 
  Textarea
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addDocument, GetDocument } from 'src/features/master/Documents/DocumentSlice';

const AddDocumentModal = ({ show, setShowmodal,logindata,customerdata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    export_type: '',
    customer_name: '',
    export_status: 'Pending',
    remarks: '',
    document_file: null,
    created_by : logindata?.admin?.id, // Optional
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['export_type', 'customer_name',"document_file"];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const form = new FormData();
      for (let key in formData) {
        form.append(key, formData[key]);
      }

      const result = await dispatch(addDocument(form)).unwrap();
      toast.success(result.message || 'Document created successfully');
      dispatch(GetDocument());
      setFormData({
        export_type: '',
        customer_name: '',
        export_status: 'Pending',
        remarks: '',
        document_file: null,
        created_by:logindata?.admin?.id ,
      });
      setShowmodal(false);
    } catch (err) {
      toast.error(err || err.message || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Create Export Document</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {/* Export Type */}
          <div className="col-span-6">
            <Label htmlFor="export_type" value="Export Type" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="export_type"
              type="text"
              placeholder='Enter Export Type '
              value={formData.export_type}
              className='form-rounded-md'
              onChange={(e) => handleChange('export_type', e.target.value)}
              color={errors.export_type ? 'failure' : 'gray'}
            />
            {errors.export_type && (
              <p className="text-red-500 text-xs">{errors.export_type}</p>
            )}
          </div>

          {/* Customer Name */}
          <div className="col-span-6">
            <Label htmlFor="customer_name" value="Customer Name" />
            <span className="text-red-700 ps-1">*</span>
             <select
              id="customer_name"
              value={formData.customer_name}
              className="mt-1  rounded-md w-full  border border-gray-300"

              onChange={(e) => handleChange('customer_name', e.target.value)}
            >
              <option value="">Select Customer</option>
{
   customerdata?.map((items)=>(
    <option  key={items?.id} value={items?.id}>{items?.customer_name}</option>
  ))
}
            
            </select>
           
            {errors.customer_name && (
              <p className="text-red-500 text-xs">{errors.customer_name}</p>
            )}
          </div>

          {/* Export Status */}
          <div className="col-span-6">
            <Label htmlFor="export_status" value="Export Status" />
            <select
              id="export_status"
              value={formData.export_status}
              className="mt-1  rounded-md w-full  border border-gray-300"

              onChange={(e) => handleChange('export_status', e.target.value)}
            >
              <option value="">Select Status</option>

              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Shipped">Shipped</option>
            </select>
          </div>

        <div className="col-span-6">
            <Label htmlFor="document_file" value="Upload Document File" />
            <span className="text-red-700 ps-1">*</span>

            <input
              type="file"
              onChange={(e) => handleChange('document_file', e.target.files?.[0])}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50"
            />
          </div>

          {/* Remarks */}
          <div className="col-span-12">
            <Label htmlFor="remarks" value="Remarks" />
            <Textarea
              id="remarks"
              placeholder='Enter Notes  '

              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              rows={2}
            />
          </div>

          {/* Document File */}
          
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddDocumentModal;
