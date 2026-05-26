import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  TextInput,
} from 'flowbite-react';
import Select from 'react-select';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
import { toast } from 'react-toastify';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { GetGrade } from 'src/features/master/Grade/GradeSlice';
import {
  getPotOppertunity,
  updatePotOppertunity,
} from 'src/features/master/Customer/PotentialOpportunitySlice';

const EditOppertunityModal = ({ show, setShowmodal, CustomerData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<any>({});

  const selectStyles = {
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const [formData, setFormData] = useState({
    id: '',
    company_name: '',
    source: '',
    // company_hq: '',
    company_address: '',
    customer_type: '',
    trader_names: [''],
    open_field: '',
    contacts: [{ person: '', email: '', number: '' }],
    addresses: [
      {
        factory_address: '',
        city: '',
        country: '',
      },
    ],
    products: [{ product: '', grade: '' }],
  });

  const product = useSelector((state: any) => state.products.productdata);
  const grades = useSelector((state: any) => state.grades.gradedata);
  // const usersdata = useSelector((state: RootState) => state.usermanagement?.userdata) ?? [];
  // const marketingPersons = usersdata.filter((u: any) => Number(u.role_id) === 9);

  useEffect(() => {
    dispatch(GetGrade());
    dispatch(GetProduct());
    // dispatch(GetUsermodule());
  }, [dispatch]);

  useEffect(() => {
    if (CustomerData) {
      let contacts = CustomerData.contacts;
      let addresses = CustomerData.addresses;
      let products = CustomerData.products;
      let traders = CustomerData.trader_names;

      try {
        if (typeof contacts === 'string') contacts = JSON.parse(contacts);
      } catch {
        contacts = [];
      }

      try {
        if (typeof addresses === 'string') addresses = JSON.parse(addresses);
      } catch {
        addresses = [];
      }

      try {
        if (typeof products === 'string') products = JSON.parse(products);
      } catch {
        products = [];
      }

      try {
        if (typeof traders === 'string') traders = JSON.parse(traders);
      } catch {
        traders = [];
      }

      setFormData({
        id: CustomerData.id,
        company_name: CustomerData.company_name || '',
        source: CustomerData.source || '',
        customer_type: CustomerData.customer_type || '',
        company_address: CustomerData.company_address || '',
        trader_names: Array.isArray(traders) ? traders : [''],
        open_field: CustomerData.open_field || '',
        contacts: Array.isArray(contacts) ? contacts : [{ person: '', email: '', number: '' }],
        addresses: Array.isArray(addresses)
          ? addresses
          : [{ factory_address: '', city: '', country: '' }],
        products: Array.isArray(products) ? products : [{ product: '', grade: '' }],
      });
    }
  }, [CustomerData]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };

      if (field === 'customer_type') {
        if (value !== 'Trader') updated.trader_names = [''];
        if (value !== 'Open Field') updated.open_field = '';
      }

      return updated;
    });
  };

  /* ---------------- TRADER ---------------- */

  const addTrader = () => {
    setFormData({
      ...formData,
      trader_names: [...formData.trader_names, ''],
    });
  };

  const removeTrader = (index) => {
    const updated = formData.trader_names.filter((_, i) => i !== index);
    setFormData({ ...formData, trader_names: updated });
  };

  const handleTraderChange = (index, value) => {
    const updated = [...formData.trader_names];
    updated[index] = value;
    setFormData({ ...formData, trader_names: updated });
  };

  /* ---------------- CONTACT ---------------- */

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { person: '', email: '', number: '' }],
    });
  };

  const validateForm = () => {
    let newErrors: any = {};

    if (!formData.company_name.trim()) newErrors.company_name = 'Company name required';

    if (!formData.customer_type) newErrors.customer_type = 'Select customer type';

    // trader validation
    if (formData.customer_type === 'Trader') {
      formData.trader_names.forEach((t, i) => {
        if (!t.trim()) newErrors[`trader_${i}`] = 'Trader name required';
      });
    }

    // contacts
    formData.contacts.forEach((c, i) => {
      if (!c.person.trim()) newErrors[`contact_person_${i}`] = 'Person required';

      if (!c.number.trim()) newErrors[`contact_number_${i}`] = 'Number required';
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const removeContact = (index) => {
    const updated = formData.contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, contacts: updated });
  };

  const handleContactChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const productOptions = product.map((p: any) => ({
    label: p.product_name,
    value: p.id,
  }));
  /* ---------------- ADDRESS ---------------- */

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { factory_address: '', city: '', country: '' }],
    });
  };

  const removeAddress = (index) => {
    const updated = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: updated });
  };

  const handleAddressChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  /* ---------------- PRODUCT ---------------- */

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product: '', grade: '' }],
    });
  };

  const removeProduct = (index) => {
    const updated = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updated });
  };

  const handleProductChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(updatePotOppertunity(formData)).unwrap();

      toast.success(result.message || 'Potential Oppertunity Updated');

      dispatch(getPotOppertunity());
      setShowmodal(false);
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>Edit Customer</ModalHeader>

      <ModalBody>
        <form className="grid grid-cols-12 gap-4">
          {/* Company Name */}

          <div className="col-span-6">
            <Label value="Company Name" />
            <TextInput
              value={formData.company_name}
              color={errors.company_name ? 'failure' : 'gray'}
              helperText={errors.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
            />
          </div>

          <div className="col-span-6">
            <Label value="Source" />
            <TextInput
              placeholder="Enter Source"
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
            />
          </div>

          {/* Customer Type */}

          <div className="col-span-6">
            <Label value="Customer Type" />
            <select
              value={formData.customer_type}
              onChange={(e) => handleChange('customer_type', e.target.value)}
              className={`w-full border rounded-md p-2 ${
                errors.customer_type ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select</option>
              <option value="Trader">Trader</option>
              <option value="End Customer">End Customer</option>
              <option value="Open Field">Open Field</option>
            </select>
          </div>

          <div className="col-span-6">
            <Label value="Company Address" />
            <TextInput
              placeholder="Company Address"
              value={formData.company_address}
              onChange={(e) => handleChange('company_address', e.target.value)}
            />
          </div>

          {/* <div className="col-span-6">
            <Label value="Company HQ" />
            <TextInput
              placeholder="Company HQ"
              value={formData.company_hq}
              onChange={(e) => handleChange('company_hq', e.target.value)}
            />
          </div> */}

          {/* Trader */}

          {formData.customer_type === 'Trader' &&
            formData.trader_names.map((trader, index) => (
              <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
                <div className="col-span-10">
                  <TextInput
                    value={trader}
                    color={errors[`trader_${index}`] ? 'failure' : 'gray'}
                    helperText={errors[`trader_${index}`]}
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

          {/* Open Field */}

          {formData.customer_type === 'Open Field' && (
            <div className="col-span-12">
              <Label value="Open Field" />
              <TextInput
                value={formData.open_field}
                onChange={(e) => handleChange('open_field', e.target.value)}
              />
            </div>
          )}

          {/* CONTACTS */}

          <div className="col-span-12">
            <Label value="Contact Persons" />
          </div>

          {formData.contacts.map((contact, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={`contact-${index}`}>
              <div className="col-span-3">
                <TextInput
                  placeholder="Contact Person"
                  color={errors[`contact_person_${index}`] ? 'failure' : 'gray'}
                  helperText={errors[`contact_person_${index}`]}
                  value={contact.person}
                  onChange={(e) => handleContactChange(index, 'person', e.target.value)}
                />
              </div>

              <div className="col-span-4">
                <TextInput
                  placeholder="Enter Email"
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                />
              </div>

              <div className="col-span-3">
                <TextInput
                  placeholder="Contact Number"
                  value={contact.number}
                  onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                />
              </div>

              <div className="col-span-2 flex gap-2">
                <Button type="button" color="primary" size="xs" onClick={addContact}>
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

          {/* ADDRESSES */}

          <div className="col-span-12">
            <Label value="Addresses" />
          </div>

          {formData.addresses.map((addr, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={`address-${index}`}>
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

          {/* PRODUCTS */}

          <div className="col-span-12">
            <Label value="Interested Products" />
          </div>

          {formData.products.map((item, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={`product-${index}`}>
              <div className="col-span-5">
                <Select
                  value={
                    productOptions.find((option: any) => option.value === item.product) || null
                  }
                  options={productOptions}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  onChange={(v: any) => handleProductChange(index, 'product', v?.value)}
                />
              </div>

              <div className="col-span-5">
                <select
                  className="w-full border rounded-md p-2"
                  value={item.grade}
                  onChange={(e) => handleProductChange(index, 'grade', e.target.value)}
                >
                  <option value="">Select Grade</option>

                  {Array.isArray(grades) &&
                    grades.map((g: any) => (
                      <option key={g.id} value={g.grade}>
                        {g.grade}
                      </option>
                    ))}
                </select>
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
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditOppertunityModal;
