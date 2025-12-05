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
  updateCurrency,
  GetCurrency,
} from 'src/features/master/Currency/CurrencySlice';

const EditCurrencyModal = ({ show, setShowmodal, CurrencyData, logindata }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    id: '',
    currency_name: '',
    symbol: '',
    exchange_rate: '',
    country: '',
    is_active: true,
    created_by: logindata?.admin?.id,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (CurrencyData) {
      setFormData({
        id: CurrencyData?.id || '',
        currency_name: CurrencyData?.currency_name || '',
        symbol: CurrencyData?.symbol || '',
        exchange_rate: CurrencyData?.exchange_rate || '',
        country: CurrencyData?.country || '',
        is_active: CurrencyData?.is_active ?? true,
        created_by: logindata?.admin?.id,
      });
    }
  }, [CurrencyData, logindata]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const required = ['currency_name', 'exchange_rate', 'country'];
    const newErrors: any = {};
    required.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(updateCurrency(formData)).unwrap();
      toast.success(result.message || 'Currency updated successfully');
      dispatch(GetCurrency());
      setShowmodal(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update currency');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="2xl">
      <ModalHeader>Edit Currency</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">
          {[
            { id: 'currency_name', label: 'Currency Name', type: 'text' },
            { id: 'symbol', label: 'Currency Symbol', type: 'text' },
            { id: 'exchange_rate', label: 'Exchange Rate', type: 'number' },
            { id: 'country', label: 'Country', type: 'text' },
          ].map(({ id, label, type }) => (
            <div className="col-span-6" key={id}>
              <Label htmlFor={id} value={label} />
              {(id !== 'symbol') && <span className="text-red-700 ps-1">*</span>}
              <TextInput
                id={id}
                type={type}
                value={formData[id]}
                placeholder={`Enter ${label}`}
                onChange={(e) => handleChange(id, e.target.value)}
                color={errors[id] ? 'failure' : 'gray'}
                className="form-rounded-md"
              />
              {errors[id] && (
                <p className="text-red-500 text-xs">{errors[id]}</p>
              )}
            </div>
          ))}

          {/* Status Toggle */}
          <div className="col-span-6 mt-2">
            <Label htmlFor="is_active" value="Status" />
            <div className="mt-2">
              <ToggleSwitch
                id="is_active"
                checked={formData.is_active}
                onChange={(val) => handleChange('is_active', val)}
                label={formData.is_active ? 'Active' : 'Inactive'}
              />
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-end">
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditCurrencyModal;
