import { Field } from "@headlessui/react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  TextInput,
  Label
} from "flowbite-react"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { GetAllQcbatch, qcBatchadd } from "src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice";
import { AppDispatch } from "src/store";


const AddQcbatchModal = ( {placeModal, setPlaceModal}) => {
    const dispatch = useDispatch<AppDispatch>()
       const [remark, setRemark] = useState("")
       const handlesubmit = async () => {
  try {
    const result = await dispatch(qcBatchadd({ qc_batch_number: remark }));

    if (result.payload) {
      toast.success('Qc batch number created successfully!');
      dispatch(GetAllQcbatch())
      setRemark(''); 
    } else {
      toast.error('Failed to create QC Batch.');
    }
  } catch (error) {
    console.error("Error while submitting QC batch:", error);
    toast.error('Something went wrong while creating batch.');
  }
};
  return (

            <Modal
              show={placeModal}
              size="md"
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
             
                           <Field className="my-3 ">
                       <Label className="text-start mb-2 block font-medium">Batch Number</Label>
                       <TextInput
                         name="description"
                         className="form-rounded-md"
                         placeholder="Enter Batch Number"
                          onChange={(e) => setRemark(e.target.value)} 
                       
                       ></TextInput>
                        </Field>
                           <div className="flex justify-center gap-4">
                               <Button color="success" 
                               onClick={() => {
                               handlesubmit();
                               if(remark){
                                 setPlaceModal(false);
                               }
                             }}>
                                {"Submit"}
                             </Button>
                           </div>
                         </div>
                       </ModalBody>
            </Modal>
         
  )
}

export default AddQcbatchModal