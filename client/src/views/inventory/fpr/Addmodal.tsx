import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from "flowbite-react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addFpr } from "src/features/Inventorymodule/FPR/FprSlice";

interface AddModalProps {
  placeModal: boolean;
  modalPlacement: string;
  setPlaceModal: (value: boolean) => void;
  logindata: any;
  rowData: any;
  setOnreload: React.Dispatch<React.SetStateAction<boolean>>;
}

const Addmodal: React.FC<AddModalProps> = ({
  placeModal,
  modalPlacement,
  setPlaceModal,
  logindata,
  rowData,
  setOnreload,
}) => {
  const dispatch = useDispatch<any>();

  const data = rowData?.batch_releases;

  const [releaseNo, setReleaseNo] = useState(data?.release_no || "");
  const [releaseDate, setReleaseDate] = useState(data?.release_date || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!releaseNo) {
      toast.error("Release No is required");
      return;
    }
    if (!releaseDate) {
      toast.error("Release Date is required");
      return;
    }

    try {
      const payload = {
        user_id: logindata?.admin?.id || "",
        batch_id: rowData?.id || "",
        release_no: releaseNo,
        release_date: releaseDate,
      };

      const result = await dispatch(addFpr(payload)).unwrap();

      toast.success(result?.message || "Release data submitted!");
      setPlaceModal(false);
      setOnreload(true);
      setReleaseNo("");
      setReleaseDate("");
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  return (
    <Modal
      show={placeModal}
      position={modalPlacement}
      onClose={() => setPlaceModal(false)}
      className="large"
    >
      <ModalHeader className="pb-0">Add Release Details</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
          {/* Release No */}
          <div className="col-span-12">
            <Label htmlFor="release_no" value="Release No" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="release_no"
              type="text"
              placeholder="Enter Release No"
              value={releaseNo}
              onChange={(e) => setReleaseNo(e.target.value)}
              required
            />
          </div>

          {/* Release Date */}
          <div className="col-span-12">
            <Label htmlFor="release_date" value="Release Date" />
            <span className="text-red-700 ps-1">*</span>
            <TextInput
              id="release_date"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="col-span-12 flex justify-end items-center gap-4">
            <Button
              type="button"
              color="error"
              onClick={() => setPlaceModal(false)}
            >
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
