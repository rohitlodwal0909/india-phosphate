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
import TableComponent from 'src/utils/TableComponent';
import PaginationComponent from 'src/utils/PaginationComponent';

import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useMemo, useState } from 'react';

import { Icon } from '@iconify/react';
import { AppDispatch } from 'src/store';

import Addproductionmodal from './Addproductionmodal';
import {
  deleteProductionPlanning,
  getProductionPlanning,
} from 'src/features/Inventorymodule/planing/ProdutionPlaningSlice';

import { CustomizerContext } from 'src/context/CustomizerContext';
import { getPermissions } from 'src/utils/getPermissions';
import { formatDate } from 'src/utils/Datetimeformate';
import Editproductionmodal from './Editproductionmodal';
import { toast } from 'react-toastify';
import Viewmodel from './Viewmodel';

interface RowType {
  id: number;
  work_order_no: string;
  expected_fpr_date: string;
  // Equipment: any;
  Product: any;
}

const columnHelper = createColumnHelper<RowType>();

function ProductionPlaningTable() {
  const dispatch = useDispatch<AppDispatch>();

  const [addmodal, setaddmodal] = useState(false);
  const [editmodal, seteditmodal] = useState(false);
  const [viewmodal, setviewmodal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const logindata = useSelector((state: any) => state.authentication?.logindata);

  const productions = useSelector((state: any) => state.productionplanning?.data) || [];

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 14);
  }, [logindata, selectedIconId]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    dispatch(getProductionPlanning());
  }, [dispatch]);

  const handleConfirmDelete = async (row) => {
    if (!row?.id) return toast.error('No entry selected.');
    try {
      const res = await dispatch(deleteProductionPlanning(row?.id)).unwrap();
      if (res) {
        toast.success('Production Planning deleted successfully!');
        dispatch(getProductionPlanning());
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
    }
  };

  /* ================= SEARCH ================= */

  const searchInObject = (obj: any, keyword: string): boolean => {
    return Object.values(obj).some((value) => {
      if (!value) return false;

      if (typeof value === 'object') {
        return searchInObject(value, keyword);
      }

      return String(value).toLowerCase().includes(keyword);
    });
  };

  const filteredData = useMemo(() => {
    if (!searchText) return productions;

    const keyword = searchText.toLowerCase();

    return productions.filter((item: any) => searchInObject(item, keyword));
  }, [productions, searchText]);

  /* ================= COLUMNS ================= */

  const columns = [
    columnHelper.display({
      id: 'sr',
      header: 'S.No',
      cell: (info) => <span>#{info.row.index + 1}</span>,
    }),

    columnHelper.accessor('work_order_no', {
      header: 'Work Order',
      cell: (info) => info.getValue() || '---',
    }),

    // columnHelper.display({
    //   id: 'equipment',
    //   header: 'Equipment',
    //   cell: (info) => info.row.original?.Equipment?.name || '---',
    // }),

    columnHelper.display({
      id: 'material',
      header: 'Material Name',
      cell: (info) => info.row.original?.Product?.product_name || '---',
    }),

    columnHelper.accessor('expected_fpr_date', {
      header: 'Expected FPR Date',
      cell: (info) => (info.getValue() ? formatDate(info.getValue()) : '---'),
    }),

    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex gap-2 notranslate" translate="no">
            {permissions?.view && (
              <Tooltip content="view">
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => {
                    (setviewmodal(true), setSelectedRow(row));
                  }}
                >
                  <Icon icon="solar:eye-outline" height={18} />
                </Button>
              </Tooltip>
            )}
            {permissions?.edit && (
              <Tooltip content="Edit">
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success hover:bg-success hover:text-white"
                  onClick={() => {
                    (seteditmodal(true), setSelectedRow(row));
                  }}
                >
                  <Icon icon="solar:pen-outline" height={18} />
                </Button>
              </Tooltip>
            )}
            {permissions?.del && (
              <Tooltip content="Delete">
                <Button
                  size="sm"
                  color="lighterror"
                  className="p-0"
                  onClick={() => {
                    handleConfirmDelete(row);
                  }}
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    }),
  ];

  /* ================= TABLE ================= */

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ================= UI ================= */

  return (
    <>
      {permissions?.view ? (
        <>
          <div className="p-4 flex justify-between">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="p-2 border rounded-md border-gray-300"
            />

            {permissions?.add && (
              <Button onClick={() => setaddmodal(true)} color="primary">
                Create
              </Button>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            <TableComponent table={table} flexRender={flexRender} columns={columns} />
          </div>

          <PaginationComponent table={table} />
        </>
      ) : (
        <div className="text-center text-red-500 font-semibold my-20">
          No Permission To View Production Planning
        </div>
      )}

      {addmodal && <Addproductionmodal openModal={addmodal} setOpenModal={setaddmodal} />}
      {editmodal && (
        <Editproductionmodal
          openModal={editmodal}
          setOpenModal={seteditmodal}
          selectedRow={selectedRow}
        />
      )}

      {viewmodal && (
        <Viewmodel openModal={viewmodal} setOpenModal={setviewmodal} selectedRow={selectedRow} />
      )}
    </>
  );
}

export default ProductionPlaningTable;
