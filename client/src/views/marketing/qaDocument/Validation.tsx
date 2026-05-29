import { toast } from 'react-toastify';

export const validateQaDocument = (formData: any, coaItems: any[]) => {
  /* ---------- BASIC DETAILS ---------- */

  if (!formData.company_id) {
    toast.error('Company is required');
    return false;
  }

  /* ---------- COA ITEMS ---------- */

  if (!coaItems || coaItems.length === 0) {
    toast.error('Add at least one COA document');
    return false;
  }

  /* ---------- ROW VALIDATION ---------- */

  for (let i = 0; i < coaItems.length; i++) {
    const item = coaItems[i];

    if (!item.doc_name) {
      toast.error(`Document name required in row ${i + 1}`);
      return false;
    }

    if (!item.qa_person_id) {
      toast.error(`QA person required in row ${i + 1}`);
      return false;
    }
  }

  return true;
};
