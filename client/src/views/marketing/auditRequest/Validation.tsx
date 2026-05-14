import { toast } from 'react-toastify';

export const validateForm = (formData: any, auditItems: any[]) => {
  // Company
  if (!formData.arrival_date) {
    toast.error('Arrival Date required');
    return false;
  }

  if (!formData.company_id) {
    toast.error('Company required');
    return false;
  }

  if (!auditItems.length) {
    toast.error('Add atleast one audit item');
    return false;
  }

  /* ---------- ITEM VALIDATION ---------- */
  for (let i = 0; i < auditItems.length; i++) {
    const item = auditItems[i];

    if (!item.product_id) {
      toast.error(`Product required in row ${i + 1}`);
      return false;
    }

    if (!item.grade) {
      toast.error(`Grade required in row ${i + 1}`);
      return false;
    }

    if (!item.auditor_name) {
      toast.error(`Auditor name required in row ${i + 1}`);
      return false;
    }
  }

  /* ---------- COMPLIANCE ---------- */

  if (!formData.compliance_status) {
    toast.error('Compliance status required');
    return false;
  }

  if (formData.compliance_status === 'Not Complied' && !formData.compliance_remark) {
    toast.error('Remark required when Not Complied');
    return false;
  }

  return true;
};
