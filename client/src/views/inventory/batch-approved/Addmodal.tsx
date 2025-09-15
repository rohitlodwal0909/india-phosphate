import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addRefrenceNumber } from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';

interface GuardAddModalProps {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  logindata: any;
  rowData: any;
  setOnreload: React.Dispatch<React.SetStateAction<boolean>>;
}

const Addmodal: React.FC<GuardAddModalProps> = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  logindata,
  rowData,
  setOnreload,
}) => {
  const dispatch = useDispatch<any>();

  const [referenceNumber, setReferenceNumber] = useState<string>(rowData?.reference_number);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!referenceNumber) {
      toast.error("Reference Number is required");
      return;
    }

    try {
      const payload = {
        user_id: logindata?.admin?.id || "",
        reference_number: referenceNumber,
        batch_id: rowData?.id || "",   
      };

      const result = await dispatch(addRefrenceNumber(payload)).unwrap();

      setPlaceModal(false);
      setOnreload(true);
      setReferenceNumber("");
      toast.success(result?.message || "Reference number submitted!");
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  return (
    <Modal show={placeModal} position={modalPlacement} onClose={() => setPlaceModal(false)} className="large">
      <ModalHeader className="pb-0">Add Reference Number</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          {/* Reference Number */}
          <div className="col-span-12">
            <Label htmlFor="reference_number" value="Reference Number" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="reference_number"
              type="text"
              placeholder="Enter Reference Number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-4">
            <Button type="reset" color="error" onClick={() => setPlaceModal(false)}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

export default Addmodal;


