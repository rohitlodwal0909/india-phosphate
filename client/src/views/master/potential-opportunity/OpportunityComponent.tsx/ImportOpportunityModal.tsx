import { useEffect, useState } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';
import { getPotOppertunity, importPotentialOpportunities } from 'src/features/master/Customer/PotentialOpportunitySlice';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { GetGrade } from 'src/features/master/Grade/GradeSlice';

type Props = { show: boolean; onClose: () => void };

const templateHeaders = [
  'Company Name', 'Source', 'Customer Type', 'Company Address', 'Trader Names (comma separated)',
  'Open Field', 'Contact Person', 'Contact Email', 'Contact Number', 'Factory Address', 'City', 'Country',
  'Product Names (comma separated)', 'Grades (comma separated)', 'Note',
];

const readCell = (row: Record<string, any>, ...names: string[]) => {
  const normalized = new Map(Object.entries(row).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ''), value]));
  for (const name of names) {
    const value = normalized.get(name.toLowerCase().replace(/[^a-z0-9]/g, ''));
    if (value !== undefined && value !== null) return String(value).trim();
  }
  return '';
};

const splitList = (value: string) => value.split(/[,;|]/).map((item) => item.trim()).filter(Boolean);

const buildOpportunity = (row: Record<string, any>) => {
  const customerTypeValue = readCell(row, 'Customer Type', 'Type');
  const customerType = ['trader', 'end customer', 'open field'].find(
    (value) => value === customerTypeValue.toLowerCase(),
  );
  const typeLabel = customerType === 'trader' ? 'Trader' : customerType === 'end customer' ? 'End Customer' : customerType === 'open field' ? 'Open Field' : customerTypeValue;
  const person = readCell(row, 'Contact Person', 'Contact Name');
  const email = readCell(row, 'Contact Email', 'Email');
  const rawNumber = readCell(row, 'Contact Number', 'Mobile', 'Phone');
  const phoneDigits = rawNumber.replace(/\D/g, '');
  const number = phoneDigits.length === 12 && phoneDigits.startsWith('91') ? phoneDigits.slice(2) : phoneDigits;
  const factoryAddress = readCell(row, 'Factory Address');
  const city = readCell(row, 'City');
  const country = readCell(row, 'Country');
  const productNames = splitList(readCell(row, 'Product Names (comma separated)', 'Product Names', 'Product Name', 'Products'));
  const grades = splitList(readCell(row, 'Grades (comma separated)', 'Grades', 'Grade'));
  const products = productNames.map((product, index) => ({ product, grade: grades[index] || '' }));

  const opportunity = {
    company_name: readCell(row, 'Company Name', 'Company'),
    source: readCell(row, 'Source'),
    customer_type: typeLabel,
    company_address: readCell(row, 'Company Address', 'Address'),
    trader_names: splitList(readCell(row, 'Trader Names (comma separated)', 'Trader Names', 'Trader Name')),
    open_field: readCell(row, 'Open Field'),
    contacts: person || email || number ? [{ person, email, number }] : [],
    addresses: factoryAddress || city || country ? [{ factory_address: factoryAddress, city, country }] : [],
    products,
    note: readCell(row, 'Note', 'Remark'),
  };

  const errors: string[] = [];
  if (!opportunity.company_name) errors.push('Company Name is required');
  if (!opportunity.source) errors.push('Source is required');
  if (!['Trader', 'End Customer', 'Open Field'].includes(opportunity.customer_type)) errors.push('Customer Type must be Trader, End Customer, or Open Field');
  if (!opportunity.company_address) errors.push('Company Address is required');
  if (opportunity.customer_type === 'Trader' && !opportunity.trader_names.length) errors.push('Trader Name is required for Trader type');
  if (opportunity.customer_type === 'Open Field' && !opportunity.open_field) errors.push('Open Field is required for Open Field type');
  if (person || email || number) {
    if (!person || !email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) || !/^[0-9]{10}$/.test(number)) {
      errors.push('Contact requires a name, valid email, and 10-digit number');
    }
  }
  if (factoryAddress || city || country) {
    if (!factoryAddress || !city || !country) errors.push('Factory Address, City, and Country must all be provided');
  }
  if (productNames.length !== grades.length) errors.push('Each Product Name must have a matching Grade (use comma-separated lists)');
  if (grades.some((grade) => !grade)) errors.push('Grade is required for every product');

  return { opportunity, errors };
};

const ImportOpportunityModal = ({ show, onClose }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const productData = useSelector((state: any) => state.products?.productdata || []);
  const gradeData = useSelector((state: any) => state.grades?.gradedata || []);
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [rowErrors, setRowErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (show) {
      dispatch(GetProduct());
      dispatch(GetGrade());
    }
  }, [dispatch, show]);

  const reset = () => {
    setFile(null);
    setRows([]);
    setRowErrors([]);
    setBusy(false);
    onClose();
  };

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([templateHeaders]), 'Potential Customers');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
      ['Required: Company Name, Source, Customer Type, Company Address'],
      ['Customer Type values: Trader, End Customer, Open Field'],
      ['For multiple products, enter Product Names and Grades as comma-separated lists in matching order.'],
      ['Use exact Product and Grade names listed on the Dropdown Values sheet.'],
      ['Contact fields are optional, but if used provide name, valid email, and 10-digit number.'],
      ['Factory Address, City, and Country are optional, but provide all three together.'],
    ]), 'Instructions');
    const dropdownRows = Array.from(
      { length: Math.max(productData.length, gradeData.length) },
      (_, index) => [productData[index]?.product_name || '', gradeData[index]?.grade || ''],
    );
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([
      ['Product Names (copy exact name)', 'Grades (copy exact name)'],
      ...dropdownRows,
    ]), 'Dropdown Values');
    XLSX.writeFile(workbook, 'Potential-Customer-Template.xlsx');
  };

  const handleFile = async (selected: File | null) => {
    setFile(selected);
    setRows([]);
    setRowErrors([]);
    if (!selected) return;
    if (!/\.xlsx?$/i.test(selected.name)) {
      toast.error('Please select an .xlsx or .xls file');
      setFile(null);
      return;
    }

    try {
      const workbook = XLSX.read(await selected.arrayBuffer(), { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '', raw: true });
      const nonEmptyRows = sheetRows.filter((row) => Object.values(row).some((value) => String(value).trim()));
      if (!nonEmptyRows.length) throw new Error('The first sheet has no data rows');
      if (nonEmptyRows.length > 500) throw new Error('Import is limited to 500 rows per file');

      const prepared = nonEmptyRows.map((row, index) => {
        const result = buildOpportunity(row);
        return { ...result.opportunity, _rowNumber: index + 2, _errors: result.errors };
      });
      setRows(prepared);
      setRowErrors(prepared.filter((row) => row._errors.length).map((row) => `Row ${row._rowNumber}: ${row._errors.join('; ')}`));
    } catch (error: any) {
      toast.error(error?.message || 'Unable to read Excel file');
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!rows.length || rowErrors.length) return;
    setBusy(true);
    try {
      const response = await dispatch(importPotentialOpportunities(rows.map(({ _rowNumber, _errors, ...row }) => row))).unwrap();
      toast.success(response.message || 'Potential customers imported');
      await dispatch(getPotOppertunity());
      reset();
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : error?.message || 'Excel import failed');
      setBusy(false);
    }
  };

  return (
    <Modal show={show} onClose={reset} size="3xl">
      <Modal.Header>Import Potential Customers from Excel</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Download the template, fill one company per row, then upload the completed workbook. Valid rows are saved to the Potential Customer master.</p>
          <Button type="button" color="light" onClick={downloadTemplate}>Download Excel Template</Button>
          <div>
            <Label value="Excel File (.xlsx / .xls)" />
            <TextInput type="file" accept=".xlsx,.xls" className="mt-1" onChange={(event) => handleFile(event.target.files?.[0] || null)} />
          </div>
          {file && <p className="text-sm text-gray-600">Selected: {file.name} · {rows.length} data row(s)</p>}
          {rowErrors.length > 0 && (
            <div className="max-h-48 overflow-y-auto rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <p className="font-semibold mb-1">Correct these rows before importing:</p>
              {rowErrors.map((error) => <p key={error}>{error}</p>)}
            </div>
          )}
          {rows.length > 0 && rowErrors.length === 0 && <p className="text-sm text-green-700">All {rows.length} rows passed validation.</p>}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button type="button" color="gray" onClick={reset}>Cancel</Button>
        <Button type="button" disabled={!rows.length || !!rowErrors.length || busy} onClick={handleImport}>
          {busy ? 'Importing...' : `Import ${rows.length || ''} Rows`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportOpportunityModal;
