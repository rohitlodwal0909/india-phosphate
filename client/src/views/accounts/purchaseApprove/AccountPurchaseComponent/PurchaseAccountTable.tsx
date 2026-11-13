import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';
import Portal from 'src/utils/Portal';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getPermissions } from 'src/utils/getPermissions';
import axiosInstance from 'src/constants/axiosInstance';

type Followup = { id: number; note: string; follow_up_date: string };
type PurchaseAccountRow = {
  purchase_order: { id: number; po_no: string; bill_to?: string; expected_arrival_date?: string; payment_term?: string } | null;
  bill: { id: number; po_no?: string; invoice_no?: string; invoice_date?: string; currency?: string; Supplier?: { supplier_name?: string }; Customer?: { company_name?: string }; paymentFollowups?: Followup[] } | null;
  material_received: boolean;
  actual_amount: number;
  payment_amount: number;
  outstanding: number;
  payment_status: string;
};
const columnHelper = createColumnHelper<PurchaseAccountRow>();
const formatMoney = (value: number, currency?: string) => `${currency === 'USD' ? '$' : '₹'}${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const PurchaseAccountTable = () => {
  const logindata = useSelector((state: RootState) => state.authentication?.logindata);
  const { selectedIconId } = useContext(CustomizerContext) || {};
  const permissions = useMemo(() => getPermissions(logindata, selectedIconId, 4), [logindata, selectedIconId]);
  const [rows, setRows] = useState<PurchaseAccountRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [active, setActive] = useState<PurchaseAccountRow | null>(null);
  const [showFollowup, setShowFollowup] = useState(false);
  const [note, setNote] = useState('');
  const [followupDate, setFollowupDate] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/purchase-accounts');
      const nextRows = Array.isArray(response.data) ? response.data as PurchaseAccountRow[] : [];
      setRows(nextRows);
      const nextDrafts: Record<number, string> = {};
      nextRows.forEach((row) => { if (row.bill) nextDrafts[row.bill.id] = String(row.payment_amount || 0); });
      setDrafts(nextDrafts);
    } catch (error: any) { toast.error(error.response?.data?.message || 'Could not load Purchase Account.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const savePayment = async (row: PurchaseAccountRow) => {
    if (!row.bill) return;
    const amount = Number(drafts[row.bill.id]);
    if (!Number.isFinite(amount) || amount < 0) { toast.error('Enter a valid payment amount.'); return; }
    if (amount > Number(row.actual_amount || 0)) { toast.error('Payment amount cannot exceed the actual invoice amount.'); return; }
    try {
      await axiosInstance.put(`/purchase-accounts/bills/${row.bill.id}/payment`, { payment_amount: amount });
      toast.success('Payment amount updated.');
      await load();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Could not update payment amount.'); }
  };
  const openFollowup = (row: PurchaseAccountRow) => {
    setActive(row); setNote(''); setFollowupDate(''); setShowFollowup(true);
    setTimeout(triggerGoogleTranslateRescan, 200);
  };
  const saveFollowup = async () => {
    if (!active?.bill || !note.trim() || !followupDate) { toast.error('Enter a note and follow-up date.'); return; }
    try {
      await axiosInstance.post(`/purchase-accounts/bills/${active.bill.id}/followups`, { note: note.trim(), follow_up_date: followupDate });
      toast.success('Follow-up saved.'); setShowFollowup(false); await load();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Could not save follow-up.'); }
  };

  const columns = useMemo(() => [
    columnHelper.display({ id: 'sno', header: 'S.No', cell: (info) => info.row.index + 1 }),
    columnHelper.display({ id: 'invoice', header: 'Invoice No.', cell: (info) => info.row.original.bill?.invoice_no || '—' }),
    columnHelper.display({ id: 'po', header: 'PO No.', cell: (info) => info.row.original.purchase_order?.po_no || info.row.original.bill?.po_no || '—' }),
    columnHelper.display({ id: 'company', header: 'Company Name', cell: (info) => info.row.original.bill?.Supplier?.supplier_name || info.row.original.bill?.Customer?.company_name || info.row.original.purchase_order?.bill_to || '—' }),
    columnHelper.display({ id: 'delivery', header: 'Delivery Date', cell: (info) => formatDate(info.row.original.purchase_order?.expected_arrival_date || info.row.original.bill?.invoice_date) }),
    columnHelper.display({ id: 'terms', header: 'Payment Terms', cell: (info) => info.row.original.purchase_order?.payment_term || '—' }),
    columnHelper.display({ id: 'material', header: 'Material Received or Not', cell: (info) => info.row.original.material_received ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Material Received</span> : <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Pending</span> }),
    columnHelper.display({ id: 'actual', header: 'Actual Amount', cell: (info) => formatMoney(info.row.original.actual_amount, info.row.original.bill?.currency) }),
    columnHelper.display({ id: 'payment', header: 'Payment Amount', cell: (info) => {
      const row = info.row.original;
      if (!row.bill) return '—';
      return <div className="flex min-w-48 gap-2"><input aria-label={`Payment amount for ${row.bill.invoice_no || row.purchase_order?.po_no}`} type="number" min="0" max={row.actual_amount} step="0.01" value={drafts[row.bill.id] ?? '0'} onChange={(event) => setDrafts((prev) => ({ ...prev, [row.bill!.id]: event.target.value }))} className="w-28 rounded-md border border-gray-300 p-2" /><Button size="xs" color="primary" onClick={() => savePayment(row)}>Save</Button></div>;
    }}),
    columnHelper.display({ id: 'outstanding', header: 'Outstanding', cell: (info) => formatMoney(info.row.original.outstanding, info.row.original.bill?.currency) }),
    columnHelper.display({ id: 'status', header: 'Payment Status', cell: (info) => {
      const status = info.row.original.payment_status || 'Pending';
      const color = status === 'Paid' ? 'bg-green-100 text-green-700' : status === 'Partially Paid' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
      return <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{status}</span>;
    }}),
    columnHelper.display({ id: 'action', header: 'Action', cell: (info) => {
      const row = info.row.original;
      if (!row.bill || Number(row.outstanding) <= 0) return '—';
      return <div className="flex min-w-max gap-2"><Button size="xs" color="primary" onClick={() => openFollowup(row)}>Follow-up</Button>{row.bill.paymentFollowups?.length ? <Button size="xs" color="light" onClick={() => openFollowup(row)}><Icon icon="mdi:history" height={17} /> History ({row.bill.paymentFollowups.length})</Button> : null}</div>;
    }}),
  ], [drafts]);
  const filteredRows = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [rows, search]);
  const table = useReactTable({ data: filteredRows, columns, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize: 10 } } });

  return <div className="p-1">
    <div className="mb-3 flex items-center justify-between gap-2"><input placeholder="Search..." value={search} onChange={(event) => setSearch(event.target.value)} className="rounded-md border border-gray-300 p-2" />{loading && <span className="text-sm text-gray-500">Loading…</span>}</div>
    {permissions.view ? <><div className="w-full overflow-x-auto"><div className="min-w-full"><TableComponent table={table} flexRender={flexRender} columns={columns} /></div></div><PaginationComponent table={table} /></> : <div className="my-20 text-center text-red-600"><Icon icon="fluent:person-prohibited-20-filled" width="60" height="60" className="mx-auto" />You do not have permission to view this table.</div>}
    {showFollowup && active?.bill && <Portal><Modal show size="lg" onClose={() => setShowFollowup(false)}><ModalHeader>Follow-up · {active.bill.invoice_no || active.purchase_order?.po_no}</ModalHeader><ModalBody><div className="space-y-4"><div><label className="mb-1 block text-sm font-medium">Note</label><textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} className="w-full rounded-md border border-gray-300 p-2" placeholder="Enter follow-up note" /></div><div><label className="mb-1 block text-sm font-medium">Follow-up Date</label><input type="date" value={followupDate} onChange={(event) => setFollowupDate(event.target.value)} className="rounded-md border border-gray-300 p-2" /></div><div><h4 className="font-semibold">Previous Follow-ups</h4>{active.bill.paymentFollowups?.length ? <ul className="mt-2 max-h-48 space-y-2 overflow-auto">{active.bill.paymentFollowups.map((item) => <li key={item.id} className="rounded border p-2"><div className="text-sm font-medium">{item.follow_up_date}</div><div className="whitespace-pre-wrap text-sm">{item.note}</div></li>)}</ul> : <p className="mt-2 text-sm text-gray-500">No previous follow-ups.</p>}</div><div className="flex justify-end gap-2"><Button color="light" onClick={() => setShowFollowup(false)}>Cancel</Button><Button color="primary" onClick={saveFollowup}>Save Follow-up</Button></div></div></ModalBody></Modal></Portal>}
  </div>;
};

export default PurchaseAccountTable;
