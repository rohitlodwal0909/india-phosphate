import { useEffect, useState } from 'react';
import { Badge, Modal, Spinner } from 'flowbite-react';
import { Icon } from '@iconify/react';
import axiosInstance from 'src/constants/axiosInstance';

type Props = {
  open: boolean;
  poId?: number;
  onClose: () => void;
};

const formatDate = (value?: string) => {
  if (!value) return 'Date not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getRecordLabel = (stageKey: string, record: any) => {
  switch (stageKey) {
    case 'po': return record.po_no || 'Purchase Order';
    case 'work_order': return record.work_order_no || 'Work Order';
    case 'planning': return [record.work_order_no, record.date, record.target ? `Target ${record.target}` : ''].filter(Boolean).join(' · ');
    case 'material_issue': return [record.work_order_no, record.quantity ? `Quantity ${record.quantity}` : ''].filter(Boolean).join(' · ');
    case 'batch': return record.qc_batch_number || record.work_order_no || 'QC Batch';
    case 'manufacturing': return record.batch_id ? `Batch ${record.batch_id}` : 'Production recorded';
    case 'finishing': return record.batch_number ? `Batch ${record.batch_number}` : 'Finishing recorded';
    case 'dispatch': return [record.work_order_no, record.vehicle_number, record.lr_no ? `LR ${record.lr_no}` : ''].filter(Boolean).join(' · ');
    case 'accounts': return record.invoice_no || record.po_no || record.delivery_note || 'Account document';
    case 'replacement': return `${record.replacement_type || 'Replacement'}${record.quantity ? ` · Qty ${record.quantity}` : ''}`;
    case 'dispute': return record.dispute_reason || 'Dispute raised';
    default: return 'Record';
  }
};

const POTrackerModal = ({ open, poId, onClose }: Props) => {
  const [tracker, setTracker] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !poId) return;
    let active = true;
    setLoading(true);
    setError('');
    axiosInstance.get(`/get-po-tracker/${poId}`)
      .then((response) => { if (active) setTracker(response.data); })
      .catch((requestError) => {
        console.error('PO Tracker request failed:', requestError);
        if (active) {
          const status = requestError.response?.status;
          const message = requestError.response?.data?.message;
          setError(
            status === 404
              ? 'PO Tracker API is not available on the server yet. Deploy or restart the backend with the latest code.'
              : message || (status ? `Could not load PO Tracker (HTTP ${status}).` : 'Could not connect to the server. Check the backend connection.'),
          );
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [open, poId]);

  const stages = tracker?.stages || [];
  const mainStages = stages.filter((stage: any) => !['replacement', 'dispute'].includes(stage.key));
  const completion = mainStages.length
    ? Math.round((mainStages.filter((stage: any) => stage.completed).length / mainStages.length) * 100)
    : 0;

  return (
    <Modal show={open} size="5xl" onClose={onClose}>
      <Modal.Header>PO Tracker · {tracker?.po?.po_no || ''}</Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="xl" /></div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
        ) : tracker ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-semibold text-gray-900">{tracker.po?.customers?.company_name || tracker.po?.customer_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Stage</p>
                <Badge color="info">{tracker.current_stage}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">PO Created</p>
                <p className="font-semibold text-gray-900">{formatDate(tracker.po?.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Journey Completion</p>
                <p className="font-semibold text-gray-900">{completion}%</p>
              </div>
            </div>

            <div className="space-y-3">
              {stages.map((stage: any, index: number) => (
                <div key={stage.key} className="flex gap-3 rounded-xl border border-gray-200 p-4">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${stage.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon icon={stage.completed ? 'solar:check-circle-outline' : 'solar:clock-circle-outline'} height={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{index + 1}. {stage.title}</h3>
                      <span className={`text-xs font-medium ${stage.completed ? 'text-green-700' : 'text-gray-500'}`}>
                        {stage.completed ? `Completed · ${stage.records.length} record${stage.records.length === 1 ? '' : 's'}` : 'Pending'}
                      </span>
                    </div>
                    {stage.completed && (
                      <div className="mt-2 space-y-1">
                        {stage.records.map((record: any, recordIndex: number) => (
                          <div key={record.id || recordIndex} className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-gray-600">
                            <span className="break-words">{getRecordLabel(stage.key, record)}{record.status ? ` · ${record.status}` : ''}{record.payment_status ? ` · Payment ${record.payment_status}` : ''}</span>
                            <span className="shrink-0">{formatDate(record.created_at || record.date || record.dispatch_date || record.invoice_date)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default POTrackerModal;
