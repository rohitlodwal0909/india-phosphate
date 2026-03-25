import { Icon } from '@iconify/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import noData from 'src/assets/images/svgs/no-data.webp';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import NotPermission from 'src/utils/NotPermission';
import CommonPagination from 'src/utils/CommonPagination';
import { getInvoices, uploadEwayPdf } from '../../../../../features/account/invoice/taxinvoice';
import { ImageUrl } from '../../../../../constants/contant';

const EwaybillTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const invoices = useSelector((state: RootState) => state.taxinvoices.invoices) as any;

  const dispatch = useDispatch<AppDispatch>();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 1);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  // 🔍 Filter
  const filteredItems = (invoices || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();

    return (
      item?.invoice_no?.toLowerCase().includes(searchText) ||
      item?.eway_bill?.toLowerCase().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 🔥 Upload handler
  const handleUpload = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('eway_pdf', file);
    formData.append('invoice_id', String(id));

    try {
      // 👉 API call here

      await dispatch(uploadEwayPdf(formData)).unwrap();

      dispatch(getInvoices());
    } catch (err) {
      alert('Upload Failed');
    }
  };

  return (
    <div>
      {/* 🔹 Search */}
      <div className="flex justify-end mb-3 gap-2">
        {permissions?.view && (
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-md border-gray-300 px-3 py-2 text-sm"
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
                  {['Sr.No', 'Invoice No.', 'E-way bill No.', 'Action'].map((title) => (
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
                {currentItems.length > 0 ? (
                  currentItems.map((item: any, index: number) => (
                    <tr key={item.id} className="bg-white dark:bg-gray-900">
                      {/* Sr No */}
                      <td className="py-3 px-4">#{(currentPage - 1) * pageSize + index + 1}</td>

                      {/* Invoice */}
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {item?.invoice_no || '-'}
                      </td>

                      {/* Eway */}
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {item?.eway_bill || '-'}
                      </td>

                      {/* 🔥 Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {/* 📤 Upload PDF */}
                          <label className="group cursor-pointer">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 transition shadow-sm">
                              <Icon
                                icon="mdi:cloud-upload-outline"
                                height={25}
                                className="text-blue-600 group-hover:scale-110 transition"
                              />
                            </div>

                            <input
                              type="file"
                              accept="application/pdf"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUpload(item.id, file);
                                }
                              }}
                            />
                          </label>

                          {/* 📄 Download PDF */}
                          {item?.eway_pdf && (
                            <a
                              href={ImageUrl + item.eway_pdf}
                              target="_blank"
                              rel="noreferrer"
                              className="group"
                            >
                              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 transition shadow-sm">
                                <Icon
                                  icon="mdi:file-pdf-box"
                                  height={25}
                                  className="text-red-600 group-hover:scale-110 transition"
                                />
                              </div>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <img src={noData} height={100} width={100} />
                        <p className="text-gray-500 mt-2">No data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* 🔹 Modal */}
    </div>
  );
};

export default EwaybillTable;
