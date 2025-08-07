import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import PurchaseTable from './PurchaseComponent.tsx/PurchaseTable';
import CardBox from 'src/components/shared/CardBox';

const Purchase = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Purchase ", to: "/" }]}
        title="Purchase"/>
         <CardBox>
        <PurchaseTable/>
        </CardBox>
        </>
  )
}

export default Purchase