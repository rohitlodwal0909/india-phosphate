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
import CreateModel from './AddPoRequisition';
import EditModel from './EditPoRequisition';
import ViewModal from './ViewPoRequisition';
import ComonDeletemodal from '../../../../utils/deletemodal/ComonDeletemodal';
import { toast } from 'react-toastify';
import {
  deletePoRequisition,
  getPoRequisition,
} from 'src/features/purchase/porequisition/PoRequisitionSlice';

const formatDate = (date: string) => {
  if (!date) return '-';

  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const PoRequisitionTable = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);
  const { requisitions, loading } = useSelector((state: RootState) => state.requisition) as any;

  const dispatch = useDispatch<AppDispatch>();
  const [selectedrow, setSelectedRow] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeletemodal] = useState(false);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 2);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    dispatch(getPoRequisition());
  }, [dispatch]);

  const handleDelete = async (selectedrow: any) => {
    if (!selectedrow) return;
    try {
      await dispatch(deletePoRequisition(selectedrow?.id)).unwrap();
      dispatch(getPoRequisition());
      toast.success('Po Requisition successfully deleted.');
    } catch (error: any) {
      console.error('Delete failed:', error);
      if (error?.response?.status === 404) toast.error('User not found.');
      else if (error?.response?.status === 500) toast.error('Server error. Try again later.');
      else toast.error('Failed to delete user.');
    }
  };

  const filteredItems = (requisitions || []).filter((item: any) => {
    const searchText = searchTerm.toLowerCase();

    return Object.values(item).join(' ').toLowerCase().includes(searchText);
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
        {permissions?.add && (
          <Button
            size="sm"
            className="p-0 bg-primary border rounded-md"
            onClick={() => {
              setAddModal(true);
            }}
          >
            Create Po Requisition
            <Icon icon="ic:baseline-plus" height={18} />
          </Button>
        )}
      </div>
      {permissions?.view ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {[
                    'Sr.No',
                    'Product Name',
                    'RM (Qty)',
                    'PM (Qty)',
                    'Equipment (Qty)',
                    'Date',
                    'Action',
                  ].map((title) => (
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
                        {(item?.Product?.product_name || '-').replace(/^\w/, (c: string) =>
                          c.toUpperCase(),
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {(item?.RmCode?.rm_code || '-').replace(/^\w/, (c: string) =>
                          c.toUpperCase(),
                        )}{' '}
                        ({item?.rm_qty}
                        {item?.rm_unit})
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {(item?.PmCode?.name || '-').replace(/^\w/, (c: string) => c.toUpperCase())}{' '}
                        ({item?.pm_qty}
                        {item?.pm_unit})
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {(item?.Equipment?.name || '-').replace(/^\w/, (c: string) =>
                          c.toUpperCase(),
                        )}{' '}
                        ({item?.equipment_qty}
                        {item?.equipment_unit})
                      </td>

                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        {formatDate(item?.created_at)}
                      </td>

                      <td className="py-3 px-4 text-gray-900 dark:text-gray-300">
                        <div className="flex justify-start gap-2">
                          {/* PO Details View */}

                          <Button
                            size="sm"
                            color={'lightsecondary'}
                            className="p-0"
                            onClick={() => {
                              (setViewModal(true), setSelectedRow(item));
                            }}
                          >
                            <Icon icon="hugeicons:view" height={18} />
                          </Button>
                          {permissions?.edit && (
                            <Tooltip content="Edit" placement="bottom">
                              <Button
                                size="sm"
                                className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                                onClick={() => {
                                  setEditModal(true);
                                  setSelectedRow(item);
                                }}
                              >
                                <Icon icon="solar:pen-outline" height={18} />
                              </Button>
                            </Tooltip>
                          )}
                          {permissions?.del && (
                            <Tooltip content="Delete" placement="bottom">
                              <Button
                                size="sm"
                                color="lighterror"
                                className="p-0"
                                onClick={() => {
                                  setDeletemodal(true);
                                  setSelectedRow(item);
                                }}
                              >
                                <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                              </Button>
                            </Tooltip>
                          )}
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
      <ComonDeletemodal
        handleConfirmDelete={handleDelete}
        isOpen={deleteModal}
        setIsOpen={setDeletemodal}
        selectedUser={selectedrow}
        title="Are you sure you want to Delete this Po Requisition?"
      />

      {addModal && <CreateModel placeModal={addModal} setPlaceModal={() => setAddModal(false)} />}
      {editModal && (
        <EditModel editModal={editModal} setEditModal={setEditModal} editData={selectedrow} />
      )}
      {viewModal && (
        <ViewModal placeModal={viewModal} setPlaceModal={setViewModal} selectedRow={selectedrow} />
      )}
    </div>
  );
};

export default PoRequisitionTable;
