import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';


const Logoutmodel = ({isOpen,setIsOpen ,handlelogout}) => {
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
            
              <h3 className="mb-5 text-xl font-normal text-gray-500 dark:text-gray-400">
              Do you Want you Logout 
              </h3>
              <div className="flex justify-center gap-4">
                  <Button color="primary" 
                  onClick={() => {
                  handlelogout();
                  setIsOpen(false);
                 }} className=' px-8'>
                   {"Yes"}
                </Button>
                <Button color="error" className=' px-8' onClick={() => setIsOpen(false)}>
                 cancel 
                </Button>
              
              </div>
            </div>
          </ModalBody>
        </Modal>
  )
}

export default Logoutmodel 

