import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import EnquiryTable from './EnquiryTable';

const Enquiry = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'Enquiry', to: '/' }]} title="Enquiry" />
      <CardBox>
        <EnquiryTable />
      </CardBox>
    </div>
  );
};

export default Enquiry;
