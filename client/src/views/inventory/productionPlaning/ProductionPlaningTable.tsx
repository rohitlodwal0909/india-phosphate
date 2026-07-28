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
  date: string;
  equipment: string;
  material: string;
  quality: string;
  batch_no: string;
  work_order_no: string;
  labours: string;
  output_morning: string;
  output_evening: string;
  items: any[];
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

  const tableData = useMemo(() => {
    if (!productions || typeof productions !== 'object') {
      return [];
    }

    return Object.entries(productions).map(([date, items]: [string, any]) => {
      return {
        date,

        // Multiple Equipment
        equipment: items
          .map(
            (item: any) =>
              item?.Equipment?.name ||
              item?.Equipment?.equipment_name ||
              item?.equipment_id ||
              '---',
          )
          .join(', '),

        // Multiple Material
        material: items.map((item: any) => item?.Product?.product_name || '---').join(', '),

        // Multiple Quality
        quality: items.map((item: any) => item?.quality || '---').join(', '),

        // Multiple Batch
        batch_no: items.map((item: any) => item?.batch_no || '---').join(', '),

        // Multiple Work Order
        work_order_no: items.map((item: any) => item?.work_order_no || '---').join(', '),

        // Multiple Labours
        labours: items.map((item: any) => item?.labours || '---').join(', '),

        // Multiple Morning Output
        output_morning: items.map((item: any) => item?.output_morning || '---').join(', '),

        // Multiple Evening Output
        output_evening: items.map((item: any) => item?.output_evening || '---').join(', '),

        // Original items
        items,
      };
    });
  }, [productions]);

  const { selectedIconId } = useContext(CustomizerContext) || {};

  const permissions = useMemo(() => {
    return getPermissions(logindata, selectedIconId, 14);
  }, [logindata, selectedIconId]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    dispatch(getProductionPlanning());
  }, [dispatch]);

  const handleConfirmDelete = async (row: any) => {
    if (!row?.items || row.items.length === 0) {
      return toast.error('No production planning selected.');
    }

    try {
      // Date group ke andar sabhi IDs
      const ids = row.items.map((item: any) => item.id).filter(Boolean);

      if (ids.length === 0) {
        return toast.error('No records found to delete.');
      }

      // Ek-ek karke delete
      await Promise.all(ids.map((id: number) => dispatch(deleteProductionPlanning(id)).unwrap()));

      toast.success('Production Planning deleted successfully!');

      // Table refresh
      dispatch(getProductionPlanning());
    } catch (err: any) {
      console.error('Delete Production Planning Error:', err);

      toast.error(err?.message || 'Delete failed');
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
    if (!searchText) {
      return tableData;
    }

    const keyword = searchText.toLowerCase();

    return tableData.filter((item: any) => searchInObject(item, keyword));
  }, [tableData, searchText]);

  /* ================= COLUMNS ================= */

  const columns = [
    columnHelper.display({
      id: 'sr',

      header: 'S.No',

      cell: (info) => <span>#{info.row.index + 1}</span>,
    }),

    /* ================= DATE ================= */

    columnHelper.accessor('date', {
      header: 'Date',

      cell: (info) => <span className="font-medium text-black">{formatDate(info.getValue())}</span>,
    }),

    /* ================= EQUIPMENT ================= */

    columnHelper.accessor('equipment', {
      header: 'Equipment',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    /* ================= MATERIAL ================= */

    columnHelper.accessor('material', {
      header: 'Material Name',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    /* ================= QUALITY ================= */

    columnHelper.accessor('quality', {
      header: 'Quality',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    /* ================= BATCH ================= */

    columnHelper.accessor('batch_no', {
      header: 'Batch Number',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    /* ================= WORK ORDER ================= */

    columnHelper.accessor('work_order_no', {
      header: 'Workorder No.',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    /* ================= LABOURS ================= */

    columnHelper.accessor('labours', {
      header: 'No. of Labours',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    /* ================= MORNING OUTPUT ================= */

    columnHelper.accessor('output_morning', {
      header: '8:00-1:00',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    columnHelper.accessor('output_evening', {
      header: '1:30-6:00',

      cell: (info) => <div className="text-black whitespace-normal">{info.getValue()}</div>,
    }),

    /* ================= ACTION ================= */

    columnHelper.display({
      id: 'actions',

      header: 'Actions',

      cell: (info) => {
        const row = info.row.original;

        return (
          <div className="flex gap-2 notranslate">
            {permissions.del && (
              <Tooltip content="Delete">
                <Button
                  size="sm"
                  color="lighterror"
                  className="p-0"
                  onClick={() => handleConfirmDelete(row)}
                >
                  <Icon icon="solar:trash-bin-minimalistic-outline" height={18} />
                </Button>
              </Tooltip>
            )}

            {permissions?.edit && (
              <Tooltip content="Edit">
                <Button
                  size="sm"
                  className="p-0 bg-lightsuccess text-success"
                  onClick={() => {
                    seteditmodal(true);

                    setSelectedRow(row);
                  }}
                >
                  <Icon icon="solar:pen-outline" height={18} />
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
