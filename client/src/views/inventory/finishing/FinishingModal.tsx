  import React, { useEffect, useState } from 'react';
  import { Button, Modal, Label, TextInput } from 'flowbite-react';
  interface VehicleDispatchModalProps {
    openModal: boolean;
    setOpenModal: (val: boolean) => void;
    selectedRow:any,
    handlesubmit:any
  }

  const FinishingModal: React.FC<VehicleDispatchModalProps> = ({ openModal, setOpenModal, selectedRow,handlesubmit }) => {
    const [formData, setFormData] = useState({
      finishing: "",
      unfinishing: "",
      finish_quantity: "",
      unfinish_quantity: "",
      batch_number: "",
    });
  useEffect(() => {
    if (selectedRow?.id) {
      setFormData((prev) => ({
        ...prev,
        batch_number:selectedRow.id
      }));
    }
  }, [selectedRow]);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
      handlesubmit(formData)
      setFormData({
        finishing: "",
        unfinishing: "",
        finish_quantity: "",
        unfinish_quantity: "",
        batch_number: "",
      });
  };
    return (
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header> Check Finishing Modal</Modal.Header>
        <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
  
      
            <div className='col-span-6'>
              <Label htmlFor="finishing" value="Finishing" />
              <TextInput
                id="finishing"
                name="finishing"
                className='form-rounded-md'
                    placeholder='Enter finishing'
                value={formData.finishing}
                onChange={handleChange}
                required
              />
            </div>
            <div className='col-span-6'>
              <Label htmlFor="finish_quantity" value="Finish Quantity" />
              <TextInput
                id="finish_quantity"
                name="finish_quantity"
                type="number"
                className='form-rounded-md'
                placeholder='Enter Quantity'
                value={formData.finish_quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className='col-span-6'>
              <Label htmlFor="unfinishing" value="Unfinishing" />
              <TextInput
                id="unfinishing"
                name="unfinishing"
                className='form-rounded-md'
                placeholder='Enter unfinishing'
                value={formData.unfinishing}
                onChange={handleChange}
                required
              />
            </div>
          
            <div className='col-span-6'>
              <Label htmlFor="unfinish_quantity" value="Unfinish Quantity" />
              <TextInput
                id="unfinish_quantity"
                name="unfinish_quantity"
                type="number"
                className='form-rounded-md'
                placeholder='Enter Quantity'
                value={formData.unfinish_quantity}
                onChange={handleChange}
                required
              />
            </div>
    <div className="flex justify-end gap-2 col-span-12">
      <Button type="button" color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
      <Button type="submit" color="primary" >Submit</Button>
    </div>

  </form>
        </Modal.Body>
      </Modal>
    );
  };

  export default FinishingModal;
