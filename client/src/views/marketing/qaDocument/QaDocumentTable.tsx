import { useContext, useEffect, useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table';
import { Button, Tooltip } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';
import ComonDeletemodal from 'src/utils/deletemodal/ComonDeletemodal';
import Portal from 'src/utils/Portal';
import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { AppDispatch, RootState } from 'src/store';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';

// import ViewAuditModal from './ViewAuditModal';
import QaDocumentModal from './QaDocumentModal';
import { deleteQaDocument, getQaDocument } from 'src/features/marketing/QaDocumentSlice';
import QaDocumentEditModal from './QaDocumentEditModal';

interface PurchaseOrderDataType {
  id: number;
  user_id: number;
  date: string;
  customers?: {
    id: number;
    company_name: string;
  };
  qa_document: any;
  audit_agenda: string;
  compliance_status: string;
  users?: {
    id: number;
    username: string;
  };
}

const columnHelper = createColumnHelper<PurchaseOrderDataType>();

const QaDocumentTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const logindata = useSelector((state: RootState) => state.authentication?.logindata) as any;

  const qadocuments = useSelector((state: RootState) => state.qadocuments.qadocuments) as any;

  const [data, setData] = useState<PurchaseOrderDataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modals, setModals] = useState({ add: false, edit: false, view: false, delete: false });
  const [selectedRow, setSelectedRow] = useState<PurchaseOrderDataType | null>(null);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 8);
  }, [logindata, selectedIconId]);

  useEffect(() => {
    setData(Array.isArray(qadocuments) ? qadocuments : []);
  }, [qadocuments]);

  useEffect(() => {
    dispatch(getQaDocument());
  }, [dispatch]);

  const handleModal = (type: keyof typeof modals, value: boolean, row?: PurchaseOrderDataType) => {
    setSelectedRow(row || null);
    setModals((prev) => ({ ...prev, [type]: value }));
    setTimeout(triggerGoogleTranslateRescan, 200);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) {
      return toast.error('No entry selected.');
    }
    try {
      const id = selectedRow.id;
      await dispatch(deleteQaDocument(id)).unwrap();
      toast.success('Qa Document entry delete!');
      dispatch(getQaDocument());
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      toast.error(err || 'Delete failed');
    } finally {
      handleModal('delete', false);
    }
  };

  const filteredData = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    // Search entire object including nested objects & arrays
    const deepSearch = (value: any): boolean => {
      if (!search) return true;

      if (value === null || value === undefined) {
        return false;
      }

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value.some((item) => deepSearch(item));
        }

        return Object.values(value).some((item) => deepSearch(item));
      }

      return String(value).toLowerCase().includes(search);
    };

    const filtered = data.filter((item) => deepSearch(item));

    return filtered.sort((a, b) => {
      const getPriority = (item: PurchaseOrderDataType) => {
        const documents = Array.isArray(item.qa_document) ? item.qa_document : [];

        // share_customer_by sabse last
        if (documents.some((doc: any) => doc?.share_customer_by)) {
          return 3;
        }

        // status uske pehle
        if (documents.some((doc: any) => doc?.status)) {
          return 2;
        }

        // normal
        return 1;
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      // Priority ke according
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Same priority -> latest date first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [data, searchText]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'S. No.',
        cell: (info) => (
          <div className="truncate max-w-56">
            <h6 className="text-base">#{info.row.index + 1}</h6>
          </div>
        ),
      }),

      columnHelper.accessor('date', { header: 'Date' }),

      columnHelper.accessor('customers', {
        header: 'Name of company',
        cell: (info) => (
          <div className="max-w-[350px] whitespace-normal break-words text-sm">
            <p>{info.row.original.customers?.company_name}</p>
          </div>
        ),
      }),

      columnHelper.accessor('qa_document', {
        header: 'COA Specifications',
        cell: (info) => {
          const products = info.row.original.qa_document || [];

          return (
            <div className="max-w-[350px] whitespace-normal text-sm space-y-1">
              {products.length > 0 ? (
                products.map((item: any, index: number) => (
                  <div key={index} className="border-b pb-1">
                    <p>
                      <strong>Doc Name:</strong> {item?.doc_name}
                    </p>

                    <p>
                      <strong>Qa Person:</strong> {item?.qa_persons?.username}
                    </p>

                    <p>
                      <strong>Status:</strong> {item?.status}
                    </p>
                    <p>
                      <strong>Received marketing:</strong> {item?.received_marketing?.username}
                    </p>
                    <p>
                      <strong>Share Customer:</strong> {item?.share_customer?.username}
                    </p>
                  </div>
                ))
              ) : (
                <span>-</span>
              )}
            </div>
          );
        },
      }),

      columnHelper.accessor('user_id', {
        header: 'Submitted by',
        cell: (info) => (
          <div className="truncate">
            <p>{info.row.original.users?.username}</p>
          </div>
        ),
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-wrap gap-2 justify-center notranslate" translate="no">
              {/* {permissions.view && (
                <Tooltip content="View">
                  <Button
                    onClick={() => handleModal('view', true, row)}
                    color="primary"
                    outline
                    size="xs"
                    className="text-primary bg-lightprimary hover:text-white"
                  >
                    <Icon icon="solar:eye-outline" height={18} />
                  </Button>
                </Tooltip>
              )} */}
              {permissions.edit && (
                <Tooltip content="Edit">
                  <Button
                    size="sm"
                    className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                    onClick={() => handleModal('edit', true, row)}
                  >
                    <Icon icon="solar:pen-outline" height={18} />
                  </Button>
                </Tooltip>
              )}
              {permissions.del && (
                <Tooltip content="Delete">
                  <Button
                    size="sm"
                    color="lighterror"
                    className="p-0"
                    onClick={() => handleModal('delete', true, row)}
                  >
                    <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                  </Button>
                </Tooltip>
              )}
            </div>
          );
        },
      }),
    ],
    [permissions],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="p-1">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
        {' '}
        {permissions.view && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="me-2 p-2 border rounded-md border-gray-300"
          />
        )}
        {permissions.add && (
          <Button
            onClick={() => handleModal('add', true)}
            color="primary"
            outline
            size="sm"
            className="border border-primary bg-primary text-white rounded-md"
          >
            Create QA Document
          </Button>
        )}
      </div>
      {permissions.view ? (
        <>
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <TableComponent
                table={table}
                flexRender={flexRender}
                columns={columns}
                rowClassName={(row: any) => {
                  const documents = Array.isArray(row.original.qa_document)
                    ? row.original.qa_document
                    : [];

                  const hasShareCustomerBy = documents.some((item: any) => item?.share_customer_by);

                  const hasStatus = documents.some((item: any) => item?.status);

                  if (hasShareCustomerBy) {
                    return 'bg-green-50';
                  }

                  if (hasStatus) {
                    return 'bg-yellow-50';
                  } else {
                    return 'bg-blue-50';
                  }
                }}
              />
            </div>
          </div>
          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center my-20 space-y-4">
          <Icon
            icon="fluent:person-prohibited-20-filled"
            className="text-red-500"
            width="60"
            height="60"
          />
          <div className="text-red-600 text-xl font-bold text-center px-4">
            You do not have permission to view this table.
          </div>
          <p className="text-sm text-gray-500 text-center px-6">
            Please contact your administrator.
          </p>
        </div>
      )}

      {modals.delete && (
        <Portal>
          <ComonDeletemodal
            isOpen={modals.delete}
            setIsOpen={() => handleModal('delete', false)}
            selectedUser={selectedRow}
            title="Are you sure you want to Delete this QA Document ?"
            handleConfirmDelete={handleConfirmDelete}
          />
        </Portal>
      )}
      {/* {modals.view && (
        <Portal>
          <ViewAuditModal
            placeModal={modals.view}
            setPlaceModal={() => handleModal('view', false)}
            selectedRow={selectedRow}
            modalPlacement="center"
          />
        </Portal>
      )} */}
      {modals.add && (
        <Portal>
          <QaDocumentModal openModal={modals.add} setOpenModal={() => handleModal('add', false)} />
        </Portal>
      )}
      {modals.edit && (
        <Portal>
          <QaDocumentEditModal
            openModal={modals.edit}
            setOpenModal={() => handleModal('edit', false)}
            selectedRow={selectedRow}
          />
        </Portal>
      )}
    </div>
  );
};

export default QaDocumentTable;
