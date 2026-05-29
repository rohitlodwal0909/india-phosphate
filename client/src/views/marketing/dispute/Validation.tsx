import { toast } from 'react-toastify';

export const validateDisputeForm = (formData: any, followups: any[]) => {
  /* ================= DISPUTE TYPE ================= */

  if (!formData.dispute_type) {
    toast.error('Dispute type is required');
    return false;
  }

  /* ================= DISPUTE TYPE ID ================= */

  if (!formData.dispute_type_id) {
    toast.error('Please select PO / Sample');
    return false;
  }

  /* ================= PRIORITY ================= */

  if (!formData.priority) {
    toast.error('Priority is required');
    return false;
  }

  /* ================= ASSIGNED TO ================= */

  if (!formData.assigned_to) {
    toast.error('Assigned sales person is required');
    return false;
  }

  /* ================= DISPUTE REASON ================= */

  if (!formData.dispute_reason) {
    toast.error('Dispute reason is required');
    return false;
  }

  /* ================= FOLLOWUPS ================= */

  if (!followups || !followups.length) {
    toast.error('Add at least one followup');
    return false;
  }

  for (let i = 0; i < followups.length; i++) {
    const f = followups[i];

    if (!f.followup_date) {
      toast.error(`Followup date required in row ${i + 1}`);
      return false;
    }

    if (!f.status) {
      toast.error(`Status required in row ${i + 1}`);
      return false;
    }

    if (!f.note) {
      toast.error(`Note required in row ${i + 1}`);
      return false;
    }
  }

  return true;
};
