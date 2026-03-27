import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import SampleInvoiceTable from './SampleInvoiceComponent/SampleInvoiceTable';

const SampleInvoice = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Sample Invoice', to: '/' }]} title="Sample Invoice" />
      <CardBox>
        <SampleInvoiceTable />
      </CardBox>
    </>
  );
};

export default SampleInvoice;
