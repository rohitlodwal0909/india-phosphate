import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  logindata: any;
  onSuccess: () => void;
};

const PasswordVerifyModal = ({ open, setOpen, logindata, onSuccess }: Props) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleVerify = () => {
    const SYSTEM_PASSWORD = logindata?.admin?.po_password || 'null';

    if (!password) {
      toast.error('Password required');
      return;
    }

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
        <Label value="Password" />

        <div className="relative mt-1">
          <TextInput
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            sizing="md"
          />

          <div
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IconEye size={20} /> : <IconEyeOff size={20} />}
          </div>
        </div>
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
