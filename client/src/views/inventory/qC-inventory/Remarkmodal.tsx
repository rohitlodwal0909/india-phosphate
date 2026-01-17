import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { Field, Label, Textarea } from '@headlessui/react';
import { useState, useEffect } from 'react';

const Remarkmodal = ({ isOpen, setIsOpen, selectedRow, onSubmit, title = 'Add Remark' }) => {
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (isOpen) setRemark(selectedRow?.remarks);
  }, [isOpen]);

  return (
    <Modal show={isOpen} size="md" onClose={() => setIsOpen(false)} popup>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <h3 className="mb-4 text-lg font-medium text-gray-600">{title}</h3>

          <Field className="my-3">
            <Label className="mb-2 block font-medium">Remark</Label>
            <Textarea
              rows={4}
              className="ui-form-control rounded-md"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter remark here..."
            />
          </Field>

          <div className="flex justify-center gap-4">
            <Button
              color="primary"
              disabled={!remark.trim()}
              onClick={() => {
                onSubmit(selectedRow?.id, remark);
                setIsOpen(false);
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Remarkmodal;
