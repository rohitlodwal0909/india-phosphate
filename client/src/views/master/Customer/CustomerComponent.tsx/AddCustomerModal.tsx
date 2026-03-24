import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { addCustomer, GetCustomer } from 'src/features/master/Customer/CustomerSlice';

const AddCustomerModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    company_name: '',
    application: '',
    customer_type: '',
    trader_names: [''],
    open_field: '',
    contacts: [{ person: '', number: '' }],
    addresses: [
      {
        company_address: '',
        factory_address: '',
        city: '',
        country: '',
      },
    ],
    products: [{ product: '', grade: '' }],
    convert_to_customer: false,
    note: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- TRADER FUNCTIONS -------------------- */

  const addTrader = () => {
    setFormData({
      ...formData,
      trader_names: [...formData.trader_names, ''],
    });
  };

  const handleTraderChange = (index, value) => {
    const updated = [...formData.trader_names];
    updated[index] = value;
    setFormData({ ...formData, trader_names: updated });
  };

  const removeTrader = (index) => {
    const updated = formData.trader_names.filter((_, i) => i !== index);
    setFormData({ ...formData, trader_names: updated });
  };

  /* -------------------- CONTACT FUNCTIONS -------------------- */

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { person: '', number: '' }],
    });
  };

  const removeContact = (index) => {
    const updated = formData.contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, contacts: updated });
  };

  const handleContactChange = (index, field, value) => {
    const updated = [...formData.contacts];
    updated[index][field] = value;
    setFormData({ ...formData, contacts: updated });
  };

  /* -------------------- ADDRESS FUNCTIONS -------------------- */

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { company_address: '', factory_address: '', city: '', country: '' },
      ],
    });
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index][field] = value;
    setFormData({ ...formData, addresses: updated });
  };

  const removeAddress = (index) => {
    const updated = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: updated });
  };

  /* -------------------- PRODUCT FUNCTIONS -------------------- */

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: '', grade: '' }],
    });
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value;
    setFormData({ ...formData, products: updated });
  };

  const removeProduct = (index) => {
    const updated = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updated });
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(addCustomer(formData)).unwrap();
      toast.success(result.message || 'Customer Created');

      dispatch(GetCustomer());

      setShowmodal(false);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>New Customer</ModalHeader>

      <ModalBody>
        <form className="grid grid-cols-12 gap-4">
          {/* Company Name */}

          <div className="col-span-6">
            <Label value="Company Name" />
            <TextInput
              placeholder="Enter Company Name"
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
            />
          </div>
          <div className="col-span-6">
            <Label value="Application" />
            <TextInput
              placeholder="Enter Application"
              value={formData.application}
              onChange={(e) => handleChange('application', e.target.value)}
            />
          </div>

          {/* Customer Type */}

          <div className="col-span-6">
            <Label value="Customer Type" />

            <select
              className="w-full border rounded-md p-2"
              value={formData.customer_type}
              onChange={(e) => handleChange('customer_type', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Trader">Trader</option>
              <option value="End Customer">End Customer</option>
              <option value="Open Field">Open Field</option>
            </select>
          </div>

          {/* ---------------- TRADER FIELD ---------------- */}

          {formData.customer_type === 'Trader' && (
            <>
              <div className="col-span-12">
                <Label value="Trader Name" />
              </div>

              {formData.trader_names.map((trader, index) => (
                <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
                  <div className="col-span-10">
                    <TextInput
                      placeholder="Enter Trader Name"
                      value={trader}
                      onChange={(e) => handleTraderChange(index, e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 flex gap-2">
                    <Button color="primary" size="xs" onClick={addTrader}>
                      +
                    </Button>

                    {index !== 0 && (
                      <Button size="xs" color="failure" onClick={() => removeTrader(index)}>
                        -
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ---------------- OPEN FIELD ---------------- */}

          {formData.customer_type === 'Open Field' && (
            <div className="col-span-6">
              <Label value="Open Field" />

              <TextInput
                placeholder="Enter Value"
                value={formData.open_field}
                onChange={(e) => handleChange('open_field', e.target.value)}
              />
            </div>
          )}

          {/* ---------------- CONTACT PERSON ---------------- */}

          <div className="col-span-12">
            <Label value="Contact Persons" />
          </div>

          {formData.contacts.map((contact, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
              <div className="col-span-5">
                <TextInput
                  placeholder="Contact Person"
                  value={contact.person}
                  onChange={(e) => handleContactChange(index, 'person', e.target.value)}
                />
              </div>

              <div className="col-span-5">
                <TextInput
                  placeholder="Contact Number"
                  value={contact.number}
                  onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                />
              </div>

              <div className="col-span-2 flex gap-2">
                <Button color="primary" size="xs" onClick={addContact}>
                  +
                </Button>

                {index !== 0 && (
                  <Button size="xs" color="failure" onClick={() => removeContact(index)}>
                    -
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* ---------------- ADDRESS ---------------- */}

          <div className="col-span-12">
            <Label value="Addresses" />
          </div>

          {formData.addresses.map((addr, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
              <div className="col-span-3">
                <TextInput
                  placeholder="Company Address"
                  value={addr.company_address}
                  onChange={(e) => handleAddressChange(index, 'company_address', e.target.value)}
                />
              </div>

              <div className="col-span-3">
                <TextInput
                  placeholder="Factory Address"
                  value={addr.factory_address}
                  onChange={(e) => handleAddressChange(index, 'factory_address', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <TextInput
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <TextInput
                  placeholder="Country"
                  value={addr.country}
                  onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                />
              </div>

              <div className="col-span-2 flex gap-2">
                <Button color="primary" size="xs" onClick={addAddress}>
                  +
                </Button>

                {index !== 0 && (
                  <Button size="xs" color="failure" onClick={() => removeAddress(index)}>
                    -
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* ---------------- PRODUCTS ---------------- */}

          <div className="col-span-12">
            <Label value="Interested Products" />
          </div>

          {formData.products.map((item, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
              <div className="col-span-5">
                <TextInput
                  placeholder="Interested Product"
                  value={item.product}
                  onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                />
              </div>

              <div className="col-span-5">
                <TextInput
                  placeholder="Grade"
                  value={item.grade}
                  onChange={(e) => handleProductChange(index, 'grade', e.target.value)}
                />
              </div>

              <div className="col-span-2 flex gap-2">
                <Button color="primary" size="xs" onClick={addProduct}>
                  +
                </Button>

                {index !== 0 && (
                  <Button size="xs" color="failure" onClick={() => removeProduct(index)}>
                    -
                  </Button>
                )}
              </div>
            </div>
          ))}
        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddCustomerModal;
