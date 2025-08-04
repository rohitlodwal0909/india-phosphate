import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import UnitTable from './UnitComponent.tsx/UnitTable';
import CardBox from 'src/components/shared/CardBox';

const Unit = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Unit ", to: "/" }]}
        title="Unit"/>
         <CardBox>
        <UnitTable/>
        </CardBox>
        </>
  )
}

export default Unit