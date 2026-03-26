import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import noData from 'src/assets/images/svgs/no-data.webp';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import NotPermission from 'src/utils/NotPermission';
import CommonPagination from 'src/utils/CommonPagination';
import { getentryinvoice } from 'src/features/account/invoice/taxinvoice';
import ViewDispatchModal from 'src/views/inventory/dispatch-inventory/ViewDispatchModal';
import ViewPurchaseOrderModal from 'src/views/marketing/purchaseorder/ViewPurchaseOrderModal';
import AddInvoiceTaxModel from './AddInvoiceTaxModel';
import InvoiceViewModel from './InvoiceViewModel';

const TaxInvoiceTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const { invoiceentry, loading } = useSelector((state: RootState) => state.taxinvoices) as any;

  const dispatch = useDispatch<AppDispatch>();
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(false);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 1);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    dispatch(getentryinvoice(1));
  }, [dispatch]);
  const [dispatchModal, setDispatchModal] = useState(false);

  const filteredItems = (invoiceentry || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();

    const company_name = item?.poentry?.customers?.company_name || '';
    const po_no = item?.poentry?.po_no || '';
    const invoice_no = item?.invoice_no || '';

    return (
      company_name.toString().toLowerCase().includes(searchText) ||
      po_no.toString().toLowerCase().includes(searchText) ||
      invoice_no.toString().toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-end mb-3 gap-2">
        {permissions?.view && (
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
      </div>
      {permissions?.view ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {['Sr.No', 'Company Name', 'Invoice No.', 'Po No.', 'Action'].map((title) => (
                    <th
                      key={title}
                      className="text-base font-semibold py-3 text-left border-b px-4 text-gray-700 dark:text-gray-200"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item: any, index: number) => (
                    <tr key={item.id} className="bg-white dark:bg-gray-900">
                      <td className="py-3 px-4 text-base">
                        {' '}
                        <h6 className="text-base">#{(currentPage - 1) * pageSize + index + 1}</h6>
                      </td>

                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {(item?.poentry?.customers?.company_name || '-').replace(
                          /^\w/,
                          (c: string) => c.toUpperCase(),
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {(item?.invoice_no || '-').replace(/^\w/, (c: string) => c.toUpperCase())}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {(item?.poentry?.po_no || '-').replace(/^\w/, (c: string) =>
                          c.toUpperCase(),
                        )}
                      </td>

                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        <div className="flex justify-start gap-2">
                          {/* PO Details View */}

                          <Button
                            size="sm"
                            color={'lightsecondary'}
                            className="p-0"
                            onClick={() => {
                              setViewInvoice(true);
                              setSelectedRow(item);
                            }}
                            title="View Invoice"
                          >
                            <Icon icon="mdi:file-document-outline" height={18} />{' '}
                          </Button>

                          <Button
                            size="sm"
                            color={'lightsecondary'}
                            className="p-0"
                            onClick={() => {
                              setAddModal(true);
                              setSelectedRow(item);
                            }}
                            title="Add Invoice"
                          >
                            <Icon icon="mdi:plus" height={18} />
                          </Button>

                          <Button
                            size="sm"
                            color={'lightsecondary'}
                            className="p-0"
                            onClick={() => {
                              setViewModal(true);
                              setSelectedRow(item);
                            }}
                            title="View PO Details"
                          >
                            <Icon icon="hugeicons:view" height={18} />
                          </Button>

                          {/* Dispatch Details View */}
                          <Button
                            size="sm"
                            color={'lightsuccess'}
                            className="p-0"
                            onClick={() => {
                              setDispatchModal(true);
                              setSelectedRow(item);
                            }}
                            title="View Dispatch Details"
                          >
                            <Icon icon="hugeicons:truck" height={18} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 px-4">
                      <div className="flex flex-col items-center">
                        <img src={noData} alt="No data" height={100} width={100} className="mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
          />
        </>
      ) : (
        <NotPermission />
      )}
      {viewModal && (
        <ViewPurchaseOrderModal
          placeModal={viewModal}
          setPlaceModal={() => setViewModal(false)}
          selectedRow={selectedrow?.poentry}
          modalPlacement="center"
        />
      )}

      {addModal && (
        <AddInvoiceTaxModel
          show={addModal}
          data={selectedrow}
          setShowmodal={() => setAddModal(false)}
          type="domestic"
        />
      )}

      {dispatchModal && (
        <ViewDispatchModal
          placeModal={dispatchModal}
          setPlaceModal={() => setDispatchModal(false)}
          selectedRow={selectedrow}
          StoreDatas={[]}
          modalPlacement="center"
        />
      )}
      {viewInvoice && (
        <InvoiceViewModel
          placeModal={viewInvoice}
          setPlaceModal={() => setViewInvoice(false)}
          selectedRow={selectedrow}
        />
      )}
    </div>
  );
};

export default TaxInvoiceTable;
