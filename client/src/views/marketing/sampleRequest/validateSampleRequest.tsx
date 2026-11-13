export const validateSampleRequest = (formData: any, items: any[], setErrors: any) => {
  const newErrors: any = {};

  /* ================= COMPANY VALIDATION ================= */

  if (!formData.company_id) {
    newErrors.company_id = 'Please select company';
  }

  if (!String(formData.contact_person ?? '').trim()) {
    newErrors.contact_person = 'Contact person is required';
  }

  const mobile = String(formData.mobile ?? '').trim();

  if (!mobile) {
    newErrors.mobile = 'Mobile number is required';
  } else if (!/^[0-9]{10}$/.test(mobile)) {
    newErrors.mobile = 'Enter valid 10 digit mobile number';
  }

  if (!String(formData.address ?? '').trim()) {
    newErrors.address = 'Billing address is required';
  }

  if (!String(formData.delivery_address ?? '').trim()) {
    newErrors.delivery_address = 'Delivery address is required';
  }

  /* ================= PRODUCT VALIDATION ================= */

  items.forEach((item, index) => {
    if (!item.product_id) {
      newErrors[`product_${index}`] = 'Please select product';
    }

    if (!item.grade) {
      newErrors[`grade_${index}`] = 'Please select grade';
    }

    if (!item.qty) {
      newErrors[`qty_${index}`] = 'Please enter qty';
    }

    if (!item.sample_type) {
      newErrors[`sample_type_${index}`] = 'Please select sample type';
    }
  });

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
