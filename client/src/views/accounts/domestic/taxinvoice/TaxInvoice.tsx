import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import TaxInvoiceTable from './TaxInvoiceComponent/TaxInvoiceTable';

const TaxInvoice = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Tax Invoice ', to: '/' }]} title="Tax Invoice" />
      <CardBox>
        <TaxInvoiceTable />
      </CardBox>
    </>
  );
};

export default TaxInvoice;
