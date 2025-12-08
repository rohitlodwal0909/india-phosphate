import React, { useEffect, useState } from "react";
import { Button, Modal, Label, TextInput } from "flowbite-react";

interface VehicleDispatchModalProps {
  openModal: boolean;
  setOpenModal: (val: boolean) => void;
  selectedRow: any;
  handlesubmit: (data: any) => void;
  logindata: any;
}

const FinishingModal: React.FC<VehicleDispatchModalProps> = ({
  openModal,
  setOpenModal,
  selectedRow,
  handlesubmit,
  logindata,
}) => {

  const [formData, setFormData] = useState({
    finish_quantity: "",
    unfinish_quantity: "",
    batch_number: "",
    user_id: logindata?.admin?.id,
  });


  // Load batch number when modal opens / row changes
  useEffect(() => {
    if (selectedRow?.batch_id) {
      setFormData((prev) => ({
        ...prev,
        batch_number: selectedRow.batch_id,
      }));
    }
  }, [selectedRow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Prevent negative values
    if (Number(value) < 0) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setOpenModal(false);
    setFormData({
      finish_quantity: "",
      unfinish_quantity: "",
      batch_number: "",
      user_id: logindata?.admin?.id,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.finish_quantity || !formData.unfinish_quantity) {
      alert("Please enter both quantities");
      return;
    }

    handlesubmit(formData);
    closeModal();
  };

  return (
    <Modal show={openModal} onClose={closeModal}>
      <Modal.Header>Check Finishing</Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-5">
          {/* Finish Quantity */}
          <div className="col-span-6">
            <Label htmlFor="finish_quantity" value="Finish Quantity" />
            <TextInput
              id="finish_quantity"
              name="finish_quantity"
              type="number"
              className="form-rounded-md"
              placeholder="Enter Quantity"
              value={formData.finish_quantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* Unfinish Quantity */}
          <div className="col-span-6">
            <Label htmlFor="unfinish_quantity" value="Unfinish Quantity" />
            <TextInput
              id="unfinish_quantity"
              name="unfinish_quantity"
              type="number"
              className="form-rounded-md"
              placeholder="Enter Quantity"
              value={formData.unfinish_quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-2 col-span-12">
            <Button type="button" color="gray" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default FinishingModal;
