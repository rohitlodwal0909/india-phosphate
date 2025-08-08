import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import FinishGoodTable from './FinishGoodComponent.tsx/FinishGoodTable';
import CardBox from 'src/components/shared/CardBox';

const FinishGood = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Finish Good ", to: "/" }]}
        title="Finish Good"/>
         <CardBox>
        <FinishGoodTable/>
        </CardBox>
        </>
  )
}

export default FinishGood