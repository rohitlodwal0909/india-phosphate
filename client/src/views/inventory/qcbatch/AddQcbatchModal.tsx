import { Field } from "@headlessui/react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  TextInput,
  Label,
  Select,
} from "flowbite-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  GetAllQcbatch,
  qcBatchadd,
} from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";
import { AppDispatch } from "src/store";

const AddQcbatchModal = ({ placeModal, setPlaceModal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    batch_no: "",
    product_name: "",
    mfg_date: "",
    exp_date: "",
    grade: "",
    size: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await dispatch(
        qcBatchadd({
          qc_batch_number: form.batch_no,
          product_name: form.product_name,
          mfg_date: form.mfg_date,
          exp_date: form.exp_date,
          grade: form.grade,
          size: form.size,
          user_id: logindata?.admin?.id,
        })
      );

      if (result.payload) {
        if (result.payload.message) {
          dispatch(GetAllQcbatch());
          setForm({
            batch_no: "",
            product_name: "",
            mfg_date: "",
            exp_date: "",
            grade: "",
            size: "",
          });
          toast.success("QC Batch created successfully.");
          setPlaceModal(false);
        } else {
          toast.error(result.payload);
        }
      } else {
        toast.error("Failed to create QC Batch.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Modal
      show={placeModal}
      size="2xl"
      onClose={() => setPlaceModal(false)}
      popup
      className="rounded-t-md"
    >
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Add Batch Number
          </h3>

          <div className="grid grid-cols-2 gap-4 text-left">
            <Field>
              <Label className="mb-2 block font-medium">Batch Number</Label>
              <TextInput
                name="batch_no"
                placeholder="Enter Batch Number"
                value={form.batch_no}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Product Name</Label>
              <TextInput
                name="product_name"
                placeholder="Enter Product Name"
                value={form.product_name}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Mfg Date</Label>
              <TextInput
                type="date"
                name="mfg_date"
                value={form.mfg_date}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Exp Date</Label>
              <TextInput
                type="date"
                name="exp_date"
                value={form.exp_date}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label className="mb-2 block font-medium">Size</Label>
              <TextInput
                type="text"
                name="size"
                placeholder="Enter Size"
                value={form.size}
                onChange={handleChange}
              />
            </Field>

            <Field className="col-span-1">
              <Label className="mb-2 block font-medium">Grade</Label>
              <Select
                name="grade"
                value={form.grade}
                onChange={handleChange}
              >
                <option value="">Select Grade</option>
                <option value="IP">IP</option>
                <option value="BP">BP</option>
                <option value="EP">EP</option>
                <option value="USP">USP</option>
                <option value="FCC">FCC</option>
              </Select>
            </Field>

             
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button color="success" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AddQcbatchModal;
