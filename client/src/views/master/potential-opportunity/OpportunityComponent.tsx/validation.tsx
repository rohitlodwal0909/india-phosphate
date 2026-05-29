export const validateOpportunityForm = (formData: any) => {
  let errors: any = {};

  // Company Name
  if (!formData.company_name?.trim()) {
    errors.company_name = 'Company name is required';
  }

  // Source
  if (!formData.source?.trim()) {
    errors.source = 'Source is required';
  }

  // Customer Type
  if (!formData.customer_type) {
    errors.customer_type = 'Customer type is required';
  }

  // Company Address
  if (!formData.company_address?.trim()) {
    errors.company_address = 'Company address is required';
  }

  // Trader Validation
  if (formData.customer_type === 'Trader') {
    const traderError = formData.trader_names?.some((t: string) => !t.trim());

    if (traderError) {
      errors.trader_names = 'All trader names are required';
    }
  }

  // Open Field Validation
  if (formData.customer_type === 'Open Field') {
    if (!formData.open_field?.trim()) {
      errors.open_field = 'Open field is required';
    }
  }

  // Contacts Validation
  formData.contacts?.forEach((contact: any, index: number) => {
    if (!contact.person?.trim()) {
      errors[`person_${index}`] = 'Contact person required';
    }

    if (!contact.email?.trim()) {
      errors[`email_${index}`] = 'Email required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contact.email)) {
      errors[`email_${index}`] = 'Invalid email';
    }

    if (!contact.number?.trim()) {
      errors[`number_${index}`] = 'Mobile number required';
    } else if (!/^[0-9]{10}$/.test(contact.number)) {
      errors[`number_${index}`] = 'Invalid mobile number';
    }
  });

  // Address Validation
  formData.addresses?.forEach((addr: any, index: number) => {
    if (!addr.factory_address?.trim()) {
      errors[`factory_address_${index}`] = 'Factory address required';
    }

    if (!addr.city?.trim()) {
      errors[`city_${index}`] = 'City required';
    }

    if (!addr.country?.trim()) {
      errors[`country_${index}`] = 'Country required';
    }
  });

  // Product Validation
  formData.products?.forEach((p: any, index: number) => {
    if (!p.product) {
      errors[`product_${index}`] = 'Product required';
    }

    if (!p.grade) {
      errors[`grade_${index}`] = 'Grade required';
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
