import { useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Tooltip } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';
import Portal from 'src/utils/Portal';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import { getInvoicePayment } from 'src/features/account/invoice/taxinvoice';
import { paymentApprove } from 'src/features/marketing/PurchaseOrderSlice';
import ViewPurchaseOrderModal from 'src/views/marketing/purchaseorder/ViewPurchaseOrderModal';
import Remark from './AddRemark';
import axiosInstance from 'src/constants/axiosInstance';
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useContext } from 'react';

type Followup = { id: number; note: string; follow_up_date: string; created_at?: string };
type PaymentRow = {
  id: number; invoice_no: string; currency?: string; actual_amount?: number; received_amount?: number;
  account_payment_status?: string; InvoiceItems?: { amount: string }[];
  paymentFollowups?: Followup[];
  DispatchVehicle?: { dispatch_date?: string; poentry?: { po_no?: string; payment_terms?: string; expected_delivery_date?: string; customers?: { company_name?: string } } };
};
const columnHelper = createColumnHelper<PaymentRow>();
const money = (value: number, currency?: string) => `${currency === 'USD' ? '$' : '₹'}${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const AccountPaymentTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata);
  const invoices = useSelector((state: RootState) => state.taxinvoices.invoicepayment) as PaymentRow[];
  const [searchText, setSearchText] = useState('');
  const [amountDraft, setAmountDraft] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<PaymentRow | null>(null);
  const [showFollowup, setShowFollowup] = useState(false);
  const [note, setNote] = useState('');
  const [followupDate, setFollowupDate] = useState('');
  const [legacyModal, setLegacyModal] = useState<'view' | 'remark' | null>(null);
  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => getPermissions(logindata, selectedIconId, 1), [logindata, selectedIconId]);

  const refresh = () => dispatch(getInvoicePayment());
  useEffect(() => { refresh(); }, [dispatch]);
  useEffect(() => {
    const drafts: Record<number, string> = {};
    (Array.isArray(invoices) ? invoices : []).forEach((invoice) => { drafts[invoice.id] = String(invoice.received_amount || 0); });
    setAmountDraft(drafts);
  }, [invoices]);

  const saveReceived = async (row: PaymentRow) => {
    const amount = Number(amountDraft[row.id]);
    if (!Number.isFinite(amount) || amount < 0) { toast.error('Enter a valid received amount.'); return; }
    if (amount > Number(row.actual_amount || 0)) { toast.error('Received amount cannot exceed the actual invoice amount.'); return; }
    setBusyId(row.id);
    try {
      const response = await axiosInstance.put(`/invoice-payment/${row.id}/received`, { received_amount: amount });
      toast.success(response.data?.message || 'Received amount updated.');
      await refresh();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Could not update received amount.'); }
    finally { setBusyId(null); }
  };

  const openFollowup = (row: PaymentRow) => {
    setSelected(row); setNote(''); setFollowupDate(''); setShowFollowup(true);
    setTimeout(triggerGoogleTranslateRescan, 200);
  };
  const saveFollowup = async () => {
    if (!selected || !note.trim() || !followupDate) { toast.error('Enter a note and follow-up date.'); return; }
    try {
      await axiosInstance.post(`/invoice-payment/${selected.id}/followups`, { note: note.trim(), follow_up_date: followupDate });
      toast.success('Follow-up saved.'); setShowFollowup(false); await refresh();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Could not save follow-up.'); }
  };
  const updateLegacyPaymentStatus = async (row: PaymentRow, status: string) => {
    try {
      await dispatch(paymentApprove({ id: row.id, status })).unwrap();
      toast.success(`Payment ${status}`);
      await refresh();
    } catch (error: any) { toast.error(error?.message || 'Payment update failed.'); }
  };

  const columns = useMemo(() => [
    columnHelper.display({ id: 'serial', header: 'S.No', cell: (info) => info.row.index + 1 }),
    columnHelper.accessor('invoice_no', { header: 'Invoice No.' }),
    columnHelper.display({ id: 'po_no', header: 'PO No.', cell: (info) => info.row.original.DispatchVehicle?.poentry?.po_no || '—' }),
    columnHelper.display({ id: 'company', header: 'Company Name', cell: (info) => info.row.original.DispatchVehicle?.poentry?.customers?.company_name || '—' }),
    columnHelper.display({ id: 'delivery_date', header: 'Delivery Date', cell: (info) => info.row.original.DispatchVehicle?.poentry?.expected_delivery_date || info.row.original.DispatchVehicle?.dispatch_date?.slice(0, 10) || '—' }),
    columnHelper.display({ id: 'terms', header: 'Payment Terms', cell: (info) => info.row.original.DispatchVehicle?.poentry?.payment_terms || '—' }),
    columnHelper.display({ id: 'actual', header: 'Actual Amount', cell: (info) => money(Number(info.row.original.actual_amount || 0), info.row.original.currency) }),
    columnHelper.display({ id: 'received', header: 'Received Amount', cell: (info) => {
      const row = info.row.original;
      return <div className="flex min-w-48 gap-2"><input aria-label={`Received amount for ${row.invoice_no}`} type="number" min="0" max={row.actual_amount || 0} step="0.01" value={amountDraft[row.id] ?? '0'} onChange={(event) => setAmountDraft((prev) => ({ ...prev, [row.id]: event.target.value }))} className="w-28 rounded-md border border-gray-300 p-2" /><Button size="xs" color="primary" disabled={busyId === row.id} onClick={() => saveReceived(row)}>{busyId === row.id ? 'Saving' : 'Save'}</Button></div>;
    }}),
    columnHelper.display({ id: 'outstanding', header: 'Outstanding', cell: (info) => { const row = info.row.original; return money(Math.max(0, Number(row.actual_amount || 0) - Number(row.received_amount || 0)), row.currency); } }),
    columnHelper.display({ id: 'status', header: 'Payment Status', cell: (info) => {
      const status = info.row.original.account_payment_status || 'Pending';
      const style = status === 'Paid' ? 'bg-green-100 text-green-700' : status === 'Partially Paid' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
      return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{status}</span>;
    }}),
    columnHelper.display({ id: 'actions', header: 'Action', cell: (info) => {
      const row = info.row.original;
      const status = row.account_payment_status || 'Pending';
      return <div className="flex min-w-max flex-wrap items-center gap-2">{status !== 'Paid' && <Button size="xs" color="primary" onClick={() => openFollowup(row)}>Follow-up</Button>}{(row.paymentFollowups || []).length > 0 && <Tooltip content={`${row.paymentFollowups?.length} follow-up(s)`}><Button size="xs" color="light" onClick={() => openFollowup(row)}><Icon icon="mdi:history" height={18} /> History</Button></Tooltip>}<Button size="xs" color="success" onClick={() => updateLegacyPaymentStatus(row, 'Received')}>Received</Button><Button size="xs" color="failure" onClick={() => updateLegacyPaymentStatus(row, 'Notreceived')}>Not received</Button><Tooltip content="View PO"><Button size="xs" color="light" onClick={() => { setSelected(row); setLegacyModal('view'); }}><Icon icon="solar:eye-outline" height={18} /></Button></Tooltip><Tooltip content="Add Remark"><Button size="xs" color="light" onClick={() => { setSelected(row); setLegacyModal('remark'); }}><Icon icon="mdi:file-document-outline" height={18} /></Button></Tooltip></div>;
    }}),
  ], [amountDraft, busyId, invoices]);
  const data = useMemo(() => (Array.isArray(invoices) ? invoices : []).filter((row) => Object.values(row).some((value) => String(value || '').toLowerCase().includes(searchText.toLowerCase()))), [invoices, searchText]);
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize: 10 } } });

  return <div className="p-1">
    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><input type="text" placeholder="Search..." value={searchText} onChange={(event) => setSearchText(event.target.value)} className="me-2 rounded-md border border-gray-300 p-2" /></div>
    {permissions.view ? <><div className="w-full overflow-x-auto"><div className="min-w-full"><TableComponent table={table} flexRender={flexRender} columns={columns} /></div></div><PaginationComponent table={table} /></> : <div className="my-20 text-center text-red-600">You do not have permission to view this table.</div>}
    {showFollowup && selected && <Portal><Modal show size="lg" onClose={() => setShowFollowup(false)}><ModalHeader>Follow-up · {selected.invoice_no}</ModalHeader><ModalBody>
      <div className="space-y-4"><div><label className="mb-1 block text-sm font-medium">Note</label><textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} className="w-full rounded-md border border-gray-300 p-2" placeholder="Enter follow-up note" /></div><div><label className="mb-1 block text-sm font-medium">Follow-up Date</label><input type="date" value={followupDate} onChange={(event) => setFollowupDate(event.target.value)} className="rounded-md border border-gray-300 p-2" /></div><div><h4 className="font-semibold">Previous Follow-ups</h4>{selected.paymentFollowups?.length ? <ul className="mt-2 max-h-48 space-y-2 overflow-auto">{selected.paymentFollowups.map((entry) => <li key={entry.id} className="rounded border p-2"><div className="text-sm font-medium">{entry.follow_up_date}</div><div className="whitespace-pre-wrap text-sm">{entry.note}</div></li>)}</ul> : <p className="mt-2 text-sm text-gray-500">No previous follow-ups.</p>}</div><div className="flex justify-end gap-2"><Button color="light" onClick={() => setShowFollowup(false)}>Cancel</Button><Button color="primary" onClick={saveFollowup}>Save Follow-up</Button></div></div>
    </ModalBody></Modal></Portal>}
    {legacyModal === 'view' && selected && <Portal><ViewPurchaseOrderModal placeModal modalPlacement="center" setPlaceModal={() => setLegacyModal(null)} selectedRow={selected.DispatchVehicle?.poentry} /></Portal>}
    {legacyModal === 'remark' && selected && <Portal><Remark placeModal setPlaceModal={() => setLegacyModal(null)} selectedRow={selected} /></Portal>}
  </div>;
};

export default AccountPaymentTable;
