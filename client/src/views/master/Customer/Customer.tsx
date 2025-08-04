import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CustomerTable from './CustomerComponent.tsx/CustomerTable';
import CardBox from 'src/components/shared/CardBox';

const Customer = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Customer ", to: "/" }]}
        title="Customer"/>
         <CardBox>
        <CustomerTable/>
        </CardBox>
        </>
  )
}

export default Customer