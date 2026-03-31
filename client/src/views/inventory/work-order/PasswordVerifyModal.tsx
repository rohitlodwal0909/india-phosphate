import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'flowbite-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSuccess: () => void;
};

const PasswordVerifyModal = ({ open, setOpen, onSuccess }: Props) => {
  const [password, setPassword] = useState('');

  const handleVerify = () => {
    const SYSTEM_PASSWORD = 'Indiaphosphate@2007';

    if (password === SYSTEM_PASSWORD) {
      toast.success('Access Granted');
      setOpen(false);
      onSuccess();
      setPassword('');
    } else {
      toast.error('Invalid Password');
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="md">
      <ModalHeader>Enter Password</ModalHeader>

      <ModalBody>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={() => setOpen(false)}>
          Cancel
        </Button>

        <Button color="success" onClick={handleVerify}>
          Verify
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PasswordVerifyModal;
