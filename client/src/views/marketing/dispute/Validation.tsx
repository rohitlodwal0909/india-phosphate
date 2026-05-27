import { toast } from 'react-toastify';

export const validateEnquiryForm = (formData: any, products: any[]) => {
  // Company
  if (!formData.company_id) {
    toast.error('Company is required');
    return false;
  }

  // Followup Date
  // if (!formData.followup_date) {
  //   toast.error('Followup date required');
  //   return false;
  // }

  // Status
  // if (!formData.status) {
  //   toast.error('Status required');
  //   return false;
  // }

  // Products Exists
  if (!products || !products.length) {
    toast.error('Add at least one product');
    return false;
  }

  // Product Validation
  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    if (!p.product_id) {
      toast.error(`Product required in row ${i + 1}`);
      return false;
    }

    if (!p.grade) {
      toast.error(`Grade required in row ${i + 1}`);
      return false;
    }

    if (!p.sales_person) {
      toast.error(`Sales person required in row ${i + 1}`);
      return false;
    }
  }

  return true;
};
