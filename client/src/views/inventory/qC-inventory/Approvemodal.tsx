import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';

import { Icon } from '@iconify/react';

const Approvemodal = ({ setIsOpen, isOpen, selectedUser, handleConfirmDelete }) => {
  return (
    <div className="mt-4">
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
            <Icon
              icon="akar-icons:chat-approve"
              className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
            />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to approve this GRN?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="error"
                onClick={() => {
                  handleConfirmDelete(selectedUser);
                  setIsOpen(false);
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setIsOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Approvemodal;
