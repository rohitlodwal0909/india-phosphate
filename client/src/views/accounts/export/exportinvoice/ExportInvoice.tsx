import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import ExportInvoiceTable from './ExportInvoiceComponent/ExportInvoiceTable';

const ExportInvoice = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Export Invoice', to: '/' }]} title="Export Invoice" />
      <CardBox>
        <ExportInvoiceTable />
      </CardBox>
    </>
  );
};

export default ExportInvoice;
