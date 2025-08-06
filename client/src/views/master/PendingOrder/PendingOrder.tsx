import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import PendingOrderTable from './PendingOrderComponent.tsx/PendingOrderTable';
import CardBox from 'src/components/shared/CardBox';

const PendingOrder = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Batch Master ", to: "/" }]}
        title="Batch Master"/>
         <CardBox>
        <PendingOrderTable/>
        </CardBox>
        </>
  )
}

export default PendingOrder