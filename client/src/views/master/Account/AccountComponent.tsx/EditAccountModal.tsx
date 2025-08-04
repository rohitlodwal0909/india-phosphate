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
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import {
  updateAccount, 
  GetAccount,
} from 'src/features/master/Account/AccountSlice';

const EditAccountModal = ({ show, setShowmodal, logindata , AccountData} ) => {
  const dispatch = useDispatch<AppDispatch>();
const [formData, setFormData] = useState({
  account_id : '',
  account_name: '',
  account_type: '',
  parent_account: '',
  opening_balance: '',
  balance_type: '',
  is_active: false,
  created_by: logindata?.admin?.id || '',
});


  const [errors, setErrors] = useState<any>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

useEffect(() => {
  if (AccountData) {
    setFormData({
      account_id : AccountData.account_id  || '',
      account_name: AccountData.account_name || '',
      account_type: AccountData.account_type || '',
      parent_account: AccountData.parent_account || '',
      opening_balance: AccountData.opening_balance || '',
      balance_type: AccountData.balance_type || '',
      is_active: AccountData.is_active || false,
      created_by: logindata?.admin?.id || '',
    });
  }
}, [AccountData, logindata]);
  const validateForm = () => {
  const required = ['account_name', 'account_type', 'balance_type', 'created_by'];
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
    const payload = {
      ...formData,
      is_active: formData.is_active ? true : false,
    };

    const result = await dispatch(updateAccount(payload)).unwrap();
    toast.success(result.message || 'Account updated successfully');
    dispatch(GetAccount());

    setShowmodal(false);
  } catch (err: any) {
    toast.error(err?.message || err|| 'Something went wrong');
  }
};


  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Account</ModalHeader>
      <ModalBody>
<form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
  {[
    { id: 'account_name', label: 'Account Name', type: 'text' },
    { id: 'account_type', label: 'Account Type', type: 'select', options: ['Assets', 'Liabilities', 'Equity', 'Income', 'Expense'] },
    { id: 'parent_account', label: 'Parent Account', type: 'text' },
    { id: 'opening_balance', label: 'Opening Balance', type: 'number' },
    { id: 'balance_type', label: 'Balance Type', type: 'select', options: ['Credit', 'Debit'] },
  ].map(({ id, label, type, options }) => (
    <div className="col-span-6" key={id}>
      <Label htmlFor={id} value={label} />
      {type === 'select' ? (
        <select
          id={id}
          className="w-full border border-gray-300 p-2 rounded-md"
          value={formData[id]}
          onChange={(e) => handleChange(id, e.target.value)}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <TextInput
          id={id}
          type={type}
          value={formData[id]}
          onChange={(e) => handleChange(id, e.target.value)}
          placeholder={`Enter ${label}`}
          color={errors[id] ? 'failure' : 'gray'}
        />
      )}
      {errors[id] && <p className="text-red-500 text-xs">{errors[id]}</p>}
    </div>
  ))}

  {/* Toggle is_active */}
  <div className="col-span-6">
    <Label htmlFor="is_active" value="Is Active" />
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
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color='primary'onClick={handleSubmit}>
         Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditAccountModal;
