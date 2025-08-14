import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import PendingOrderTable from './PendingOrderComponent.tsx/PendingOrderTable';
import CardBox from 'src/components/shared/CardBox';

const PendingOrder = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Pending Order ", to: "/" }]}
        title="Pending Order"/>
         <CardBox>
        <PendingOrderTable/>
        </CardBox>
        </>
  )
}

export default PendingOrder