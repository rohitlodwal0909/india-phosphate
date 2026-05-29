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

import { GetCustomer } from 'src/features/master/Customer/CustomerSlice';
import { GetGrade } from 'src/features/master/Grade/GradeSlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { addPotOppertunity } from 'src/features/master/Customer/PotentialOpportunitySlice';

import { validateOpportunityForm } from './validation';

const AddOpportunityModal = ({ show, setShowmodal }) => {
  const dispatch = useDispatch<AppDispatch>();

  const product = useSelector((state: any) => state.products.productdata || []);
  const grades = useSelector((state: any) => state.grades.gradedata || []);

  const [errors, setErrors] = useState<any>({});

  const selectStyles = {
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  useEffect(() => {
    dispatch(GetGrade());
    dispatch(GetProduct());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    company_name: '',
    source: '',
    customer_type: '',
    trader_names: [''],
    open_field: '',
    company_address: '',
    contacts: [{ person: '', email: '', number: '' }],
    addresses: [
      {
        factory_address: '',
        city: '',
        country: '',
      },
    ],
    products: [{ product: '', grade: '' }],
    convert_to_customer: false,
    note: '',
  });

  const productOptions = product.map((p: any) => ({
    label: p.product_name,
    value: p.product_name,
  }));

  /* -------------------- HANDLE CHANGE -------------------- */

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [field]: '',
    }));
  };

  /* -------------------- TRADER FUNCTIONS -------------------- */

  const addTrader = () => {
    setFormData((prev) => ({
      ...prev,
      trader_names: [...prev.trader_names, ''],
    }));
  };

  const handleTraderChange = (index: number, value: string) => {
    const updated = [...formData.trader_names];
    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      trader_names: updated,
    }));
  };

  const removeTrader = (index: number) => {
    const updated = formData.trader_names.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      trader_names: updated,
    }));
  };

  /* -------------------- CONTACT FUNCTIONS -------------------- */

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { person: '', email: '', number: '' }],
    }));
  };

  const removeContact = (index: number) => {
    const updated = formData.contacts.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      contacts: updated,
    }));
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const updated = [...formData.contacts];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      contacts: updated,
    }));
  };

  /* -------------------- ADDRESS FUNCTIONS -------------------- */

  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          factory_address: '',
          city: '',
          country: '',
        },
      ],
    }));
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    const updated = [...formData.addresses];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      addresses: updated,
    }));
  };

  const removeAddress = (index: number) => {
    const updated = formData.addresses.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      addresses: updated,
    }));
  };

  /* -------------------- PRODUCT FUNCTIONS -------------------- */

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { product: '', grade: '' }],
    }));
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...formData.products];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      products: updated,
    }));
  };

  const removeProduct = (index: number) => {
    const updated = formData.products.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      products: updated,
    }));
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { errors, isValid } = validateOpportunityForm(formData);

    setErrors(errors);

    if (!isValid) {
      toast.error('Please fill all required fields properly');
      return;
    }

    try {
      const result = await dispatch(addPotOppertunity(formData)).unwrap();

      toast.success(result.message || 'Customer Created');

      dispatch(GetCustomer());

      setShowmodal(false);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Modal show={show} onClose={() => setShowmodal(false)} size="4xl">
      <ModalHeader>New Potential Opportunity</ModalHeader>

      <ModalBody>
        <form className="grid grid-cols-12 gap-4">
          {/* Company Name */}

          <div className="col-span-6">
            <Label value="Company Name *" />

            <TextInput
              placeholder="Enter Company Name"
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              color={errors.company_name ? 'failure' : undefined}
            />

            {errors.company_name && (
              <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
            )}
          </div>

          {/* Source */}

          <div className="col-span-6">
            <Label value="Source *" />

            <TextInput
              placeholder="Enter Source"
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              color={errors.source ? 'failure' : undefined}
            />

            {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
          </div>

          {/* Customer Type */}

          <div className="col-span-6">
            <Label value="Customer Type *" />

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

            {errors.customer_type && (
              <p className="text-red-500 text-sm mt-1">{errors.customer_type}</p>
            )}
          </div>

          {/* Company Address */}

          <div className="col-span-6">
            <Label value="Company Address *" />

            <TextInput
              placeholder="Company Address"
              value={formData.company_address}
              onChange={(e) => handleChange('company_address', e.target.value)}
              color={errors.company_address ? 'failure' : undefined}
            />

            {errors.company_address && (
              <p className="text-red-500 text-sm mt-1">{errors.company_address}</p>
            )}
          </div>

          {/* Trader */}

          {formData.customer_type === 'Trader' && (
            <>
              <div className="col-span-12">
                <Label value="Trader Name *" />
              </div>

              {formData.trader_names.map((trader, index) => (
                <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
                  <div className="col-span-10">
                    <TextInput
                      placeholder="Enter Trader Name"
                      value={trader}
                      onChange={(e) => handleTraderChange(index, e.target.value)}
                    />

                    {errors.trader_names && (
                      <p className="text-red-500 text-sm mt-1">{errors.trader_names}</p>
                    )}
                  </div>

                  <div className="col-span-2 flex gap-2">
                    <Button color="primary" size="xs" type="button" onClick={addTrader}>
                      +
                    </Button>

                    {index !== 0 && (
                      <Button
                        size="xs"
                        color="failure"
                        type="button"
                        onClick={() => removeTrader(index)}
                      >
                        -
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Open Field */}

          {formData.customer_type === 'Open Field' && (
            <div className="col-span-6">
              <Label value="Open Field *" />

              <TextInput
                placeholder="Enter Value"
                value={formData.open_field}
                onChange={(e) => handleChange('open_field', e.target.value)}
                color={errors.open_field ? 'failure' : undefined}
              />

              {errors.open_field && (
                <p className="text-red-500 text-sm mt-1">{errors.open_field}</p>
              )}
            </div>
          )}

          {/* Contacts */}

          <div className="col-span-12">
            <Label value="Contact Persons" />
          </div>

          {formData.contacts.map((contact, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
              <div className="col-span-3">
                <TextInput
                  placeholder="Contact Person"
                  value={contact.person}
                  onChange={(e) => handleContactChange(index, 'person', e.target.value)}
                />

                {errors[`person_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`person_${index}`]}</p>
                )}
              </div>

              <div className="col-span-4">
                <TextInput
                  placeholder="Enter Email"
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                />

                {errors[`email_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`email_${index}`]}</p>
                )}
              </div>

              <div className="col-span-3">
                <TextInput
                  placeholder="Contact Number"
                  value={contact.number}
                  onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                />

                {errors[`number_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`number_${index}`]}</p>
                )}
              </div>

              <div className="col-span-2 flex gap-2">
                <Button color="primary" size="xs" type="button" onClick={addContact}>
                  +
                </Button>

                {index !== 0 && (
                  <Button
                    size="xs"
                    color="failure"
                    type="button"
                    onClick={() => removeContact(index)}
                  >
                    -
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Addresses */}

          <div className="col-span-12">
            <Label value="Addresses" />
          </div>

          {formData.addresses.map((addr, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
              <div className="col-span-4">
                <TextInput
                  placeholder="Factory Address"
                  value={addr.factory_address}
                  onChange={(e) => handleAddressChange(index, 'factory_address', e.target.value)}
                />

                {errors[`factory_address_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`factory_address_${index}`]}</p>
                )}
              </div>

              <div className="col-span-3">
                <TextInput
                  placeholder="City"
                  value={addr.city}
                  onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                />

                {errors[`city_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`city_${index}`]}</p>
                )}
              </div>

              <div className="col-span-3">
                <TextInput
                  placeholder="Country"
                  value={addr.country}
                  onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                />

                {errors[`country_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`country_${index}`]}</p>
                )}
              </div>

              <div className="col-span-2 flex gap-2">
                <Button color="primary" size="xs" type="button" onClick={addAddress}>
                  +
                </Button>

                {index !== 0 && (
                  <Button
                    size="xs"
                    color="failure"
                    type="button"
                    onClick={() => removeAddress(index)}
                  >
                    -
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Products */}

          <div className="col-span-12">
            <Label value="Interested Products" />
          </div>

          {formData.products.map((item, index) => (
            <div className="grid grid-cols-12 gap-2 col-span-12" key={index}>
              <div className="col-span-5">
                <Select
                  options={productOptions}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  value={productOptions.find((opt: any) => opt.value === item.product) || null}
                  onChange={(v: any) => handleProductChange(index, 'product', v?.value)}
                />

                {errors[`product_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`product_${index}`]}</p>
                )}
              </div>

              <div className="col-span-5">
                <select
                  className="w-full border rounded-md p-2"
                  value={item.grade}
                  onChange={(e) => handleProductChange(index, 'grade', e.target.value)}
                >
                  <option value="">Select Grade</option>

                  {grades.map((g: any) => (
                    <option key={g.id} value={g.grade}>
                      {g.grade}
                    </option>
                  ))}
                </select>

                {errors[`grade_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`grade_${index}`]}</p>
                )}
              </div>

              <div className="col-span-2 flex gap-2">
                <Button color="primary" size="xs" type="button" onClick={addProduct}>
                  +
                </Button>

                {index !== 0 && (
                  <Button
                    size="xs"
                    color="failure"
                    type="button"
                    onClick={() => removeProduct(index)}
                  >
                    -
                  </Button>
                )}
              </div>
            </div>
          ))}
        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="gray" type="button" onClick={() => setShowmodal(false)}>
          Cancel
        </Button>

        <Button color="primary" type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddOpportunityModal;
