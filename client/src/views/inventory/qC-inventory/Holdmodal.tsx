import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { Field, Label, Textarea } from "@headlessui/react";

import { useState } from 'react';

const Holdmodal = ({ setIsOpen, isOpen, selectedUser, handleConfirmDelete }) => {
   const [remark, setRemark] = useState("")
  return (
    
        <Modal
          show={isOpen}
          size="md"
           onClose={() => setIsOpen(false)}
          popup
          className="rounded-t-md"
        >
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">

              If Holding, please provide a reason in the field below.
            </h3>

              <Field className="my-3 ">
          <Label className="text-ld mb-2 block font-medium">Reason</Label>
          <Textarea
            name="description"
            className="ui-form-control rounded-md"
             onChange={(e) => setRemark(e.target.value)} 
            rows={4}
          ></Textarea>
           </Field>
              <div className="flex justify-center gap-4">
                  <Button color="error" 
                  onClick={() => {
                  handleConfirmDelete(selectedUser, remark);
                  if(remark){

                    setIsOpen(false);
                  }
                }}>
                   {"Submit"}
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
     

  );
};

export default Holdmodal;
