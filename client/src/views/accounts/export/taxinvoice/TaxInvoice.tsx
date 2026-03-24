import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import TaxInvoiceTable from './TaxInvoiceComponent/TaxInvoiceTable';

const TaxInvoice = () => {
  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'Tax Invoice Export', to: '/' }]}
        title="Tax Invoice Export"
      />
      <CardBox>
        <TaxInvoiceTable />
      </CardBox>
    </>
  );
};

export default TaxInvoice;
