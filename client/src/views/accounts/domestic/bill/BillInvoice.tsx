import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import BillInvoiceTable from './BillInvoiceComponent/BillInvoiceTable';

const BillInvoice = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Bill Invoice', to: '/' }]} title="Bill Invoice" />
      <CardBox>
        <BillInvoiceTable />
      </CardBox>
    </>
  );
};

export default BillInvoice;
