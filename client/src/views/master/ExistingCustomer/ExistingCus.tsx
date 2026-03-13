import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CustomerTable from './ExistingComponent.tsx/CustomerTable';
import CardBox from 'src/components/shared/CardBox';

const ExistingCustomer = () => {
  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'Existing Customer ', to: '/' }]}
        title="Existing Customer"
      />
      <CardBox>
        <CustomerTable />
      </CardBox>
    </>
  );
};

export default ExistingCustomer;
