import { Badge, Breadcrumb, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import * as XLSX from 'xlsx';
import CardBox from '../../../../components/shared/CardBox';

interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
  children?: JSX.Element;
}

const BreadcrumbComp = ({ items, title, children }: BreadCrumbType) => {
  // Print Table
  const handlePrint = () => {
    const table = document.querySelector('table');

    if (!table) {
      alert('No table found.');
      return;
    }

    const printWindow = window.open('', '', 'width=1200,height=800');

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body{
              font-family: Arial, sans-serif;
              margin:20px;
            }

            h2{
              text-align:center;
              margin-bottom:20px;
            }

            table{
              width:100%;
              border-collapse:collapse;
            }

            th,td{
              border:1px solid #000;
              padding:8px;
              text-align:left;
            }

            th{
              background:#f3f4f6;
            }

            button{
              display:none;
            }
          </style>
        </head>
        <body>

          <h2>${title}</h2>

          ${table.outerHTML}

        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Export Excel
  const handleExcel = () => {
    const table = document.querySelector('table');

    if (!table) {
      alert('No table found.');
      return;
    }

    const workbook = XLSX.utils.table_to_book(table, {
      sheet: title,
    });

    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return (
    <CardBox className="mb-[30px] py-4">
      <Breadcrumb className="flex justify-between items-center">
        <h6 className="text-base">{title}</h6>

        <div className="flex items-center gap-3 ms-auto">
          {items?.map((item) => (
            <div key={item.title}>
              <Breadcrumb.Item href={item.to}>
                <Icon icon="solar:home-2-line-duotone" height={20} />
                <span className="mx-3">/</span>
                <Badge color="lightprimary">{item.title}</Badge>
              </Breadcrumb.Item>
            </div>
          ))}

          {/* Excel Button */}
          <Button
            size="xs"
            color="success"
            onClick={handleExcel}
            className="flex items-center gap-1"
          >
            <Icon icon="mdi:file-excel-outline" width={18} />
            Excel
          </Button>

          {/* Print Button */}
          <Button size="xs" color="gray" onClick={handlePrint} className="flex items-center gap-1">
            <Icon icon="solar:printer-outline" width={18} />
            Print
          </Button>

          {children}
        </div>
      </Breadcrumb>
    </CardBox>
  );
};

export default BreadcrumbComp;
