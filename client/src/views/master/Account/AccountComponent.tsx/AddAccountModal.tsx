import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addAccount, GetAccount } from 'src/features/master/Account/AccountSlice';

const AddAccountModal = ({ show, setShowmodal, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    account_name: '',
    account_type: '',
    parent_account: '',
    opening_balance: '',
    balance_type: '',
    is_active: true,
    created_by: logindata?.admin?.id || '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['account_name', 'account_type', 'opening_balance', 'balance_type'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(addAccount(formData)).unwrap();
      toast.success(result.message || 'Account created successfully');
      dispatch(GetAccount());

      setFormData({
        account_name: '',
        account_type: '',
        parent_account: '',
        opening_balance: '',
        balance_type: '',
        is_active: true,
        created_by: logindata?.admin?.id || '',
      });

      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || err || 'Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="3xl">
      <ModalHeader>Create New Account</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {/* Account Name */}
          <div className="col-span-6">
            <Label htmlFor="account_name" value="Account Name" />
            <TextInput
              id="account_name"
              value={formData.account_name}
              onChange={(e) => handleChange('account_name', e.target.value)}
              placeholder="Enter Account Name"
              color={errors.account_name ? 'failure' : 'gray'}
            />
            {errors.account_name && <p className="text-red-500 text-xs">{errors.account_name}</p>}
          </div>

          {/* Account Type */}
          <div className="col-span-6">
            <Label htmlFor="account_type" value="Account Type" />
            <select
              id="account_type"
              value={formData.account_type}
              onChange={(e) => handleChange('account_type', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Account Type</option>
              {['Expense', 'Income', 'Asset', 'Liability'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.account_type && <p className="text-red-500 text-xs">{errors.account_type}</p>}
          </div>
      <div className="col-span-6">
            <Label htmlFor="parent_account" value="Parent Acccount" />
            <TextInput
              id="parent_account"
              type="number"
              value={formData.parent_account}
              onChange={(e) => handleChange('parent_account', e.target.value)}
              placeholder="Enter Parent Balance"
              color={errors.parent_account ? 'failure' : 'gray'}
            />
            {errors.parent_account && <p className="text-red-500 text-xs">{errors.parent_account}</p>}
          </div>
          {/* Parent Account */}
          {/* <div className="col-span-6">
            <Label htmlFor="parent_account" value="Parent Account (Optional)" />
            <select
              id="parent_account"
              value={formData.parent_account}
              onChange={(e) => handleChange('parent_account', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Parent Account</option>
              {accountList?.map((acc: any) => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.account_name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Opening Balance */}
          <div className="col-span-6">
            <Label htmlFor="opening_balance" value="Opening Balance" />
            <TextInput
              id="opening_balance"
              type="number"
              value={formData.opening_balance}
              onChange={(e) => handleChange('opening_balance', e.target.value)}
              placeholder="Enter Opening Balance"
              color={errors.opening_balance ? 'failure' : 'gray'}
            />
            {errors.opening_balance && <p className="text-red-500 text-xs">{errors.opening_balance}</p>}
          </div>

          {/* Balance Type */}
          <div className="col-span-6">
            <Label htmlFor="balance_type" value="Balance Type" />
            <select
              id="balance_type"
              value={formData.balance_type}
              onChange={(e) => handleChange('balance_type', e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Balance Type</option>
              {['Credit', 'Debit'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.balance_type && <p className="text-red-500 text-xs">{errors.balance_type}</p>}
          </div>

          {/* Status */}
          <div className="col-span-6">
            <Label htmlFor="is_active" value="Status" />
            <div className="pt-2">
              <ToggleSwitch
                checked={formData.is_active}
                label={formData.is_active ? 'Active' : 'Inactive'}
                onChange={(checked) => handleChange('is_active', checked)}
              />
            </div>
          </div>

        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit}>Submit</Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddAccountModal;
