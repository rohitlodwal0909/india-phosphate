import { Button, Tooltip } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import noData from 'src/assets/images/svgs/no-data.webp';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import NotPermission from 'src/utils/NotPermission';
import CommonPagination from 'src/utils/CommonPagination';
import ComonDeletemodal from '../../../../../utils/deletemodal/ComonDeletemodal';
import CreateModel from './CreateModel';
import {
  getExcelInvoice,
  deleteExportInvoice,
  downloadInvoice,
} from 'src/features/account/exportinvoice/exportInvoice';
import EditModel from './EditModel';
import { toast } from 'react-toastify';

const ExportInvoiceTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const { excels, loading } = useSelector((state: RootState) => state.exportinvoices) as any;

  const dispatch = useDispatch<AppDispatch>();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [editModel, setEditModel] = useState(false);

  const [selectedRow, setSelectedRow] = useState<any>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 2);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    dispatch(getExcelInvoice());
  }, [dispatch]);

  // 🔍 Search Filter
  const filteredItems = (excels || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();
    return (item?.name || '').toLowerCase().includes(searchText);
  });

  // Reset page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const currentItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ✏️ Edit Handler
  const handleEdit = (item: any) => {
    setSelectedRow(item);
    setEditModel(true);
  };

  // 🗑 Delete Handler
  const handleDelete = async () => {
    await dispatch(deleteExportInvoice(selectedRow?.id));
    toast.success('Invoice deleted successfully');

    setDeleteModel(false);
  };

  const handleDownload = (id: number) => {
    dispatch(downloadInvoice(id));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between mb-4 gap-2 flex-wrap">
        {permissions?.view && (
          <input
            type="text"
            placeholder="Search by name..."
            className="border px-3 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {permissions?.add && (
          <Button color="primary" onClick={() => setAddModal(true)}>
            <Icon icon="mdi:upload" height={18} className="mr-1" />
            Upload Excel
          </Button>
        )}
      </div>

      {permissions?.view ? (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  {['#', 'Name', 'Actions'].map((title) => (
                    <th
                      key={title}
                      className="text-sm font-semibold py-3 text-left px-4 text-gray-700"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item: any, index: number) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">{(currentPage - 1) * pageSize + index + 1}</td>

                      <td className="py-3 px-4 text-dark font-medium">{item?.name || '-'}</td>

                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                          {permissions?.edit && (
                            <Tooltip content="Edit">
                              <Button
                                size="sm"
                                className="p-1 bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                                onClick={() => handleEdit(item)}
                              >
                                <Icon icon="solar:pen-outline" height={16} />
                              </Button>
                            </Tooltip>
                          )}

                          {permissions?.del && (
                            <Tooltip content="Delete">
                              <Button
                                size="sm"
                                color="failure"
                                className="p-1"
                                onClick={() => {
                                  setSelectedRow(item);
                                  setDeleteModel(true);
                                }}
                              >
                                <Icon icon="solar:trash-bin-minimalistic-outline" height={16} />
                              </Button>
                            </Tooltip>
                          )}

                          {item?.file ? (
                            <Tooltip content="Download">
                              <Button
                                size="sm"
                                color="primary"
                                className="p-1"
                                onClick={() => handleDownload(item.id)}
                              >
                                <Icon icon="mdi:download" height={16} />
                              </Button>
                            </Tooltip>
                          ) : (
                            <span className="text-gray-400 text-sm">No File</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-10">
                      <div className="flex flex-col items-center">
                        <img src={noData} height={90} width={90} />
                        <p className="text-gray-500 mt-2">No data available</p>
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

      {/* Add Modal */}
      {addModal && <CreateModel placeModal={addModal} setPlaceModal={setAddModal} />}
      {editModel && (
        <EditModel placeModal={editModel} setPlaceModal={setEditModel} editData={selectedRow} />
      )}

      {/* Delete Modal */}
      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deleteModel}
        setIsOpen={setDeleteModel}
        selectedUser={selectedRow}
        title="Are you sure you want to delete this file?"
      />
    </div>
  );
};

export default ExportInvoiceTable;
