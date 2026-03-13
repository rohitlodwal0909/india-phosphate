import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CustomerTable from './CustomerComponent.tsx/CustomerTable';
import CardBox from 'src/components/shared/CardBox';

const Customer = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'New Customer ', to: '/' }]} title="New Customer" />
      <CardBox>
        <CustomerTable />
      </CardBox>
    </>
  );
};

export default Customer;
