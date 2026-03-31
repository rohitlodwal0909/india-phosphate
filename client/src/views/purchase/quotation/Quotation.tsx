import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import QuotationTable from './QuotationComponent/QuotationTable';

const Quotation = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Quotation', to: '/' }]} title="Quotation" />
      <CardBox>
        <QuotationTable />
      </CardBox>
    </>
  );
};

export default Quotation;
