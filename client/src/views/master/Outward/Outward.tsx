import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import OutwardTable from './OutwardComponent.tsx/OutwardTable';
import CardBox from 'src/components/shared/CardBox';

const Outward = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Outward ", to: "/" }]}
        title="Outward"/>
         <CardBox>
        <OutwardTable/>
        </CardBox>
        </>
  )
}

export default Outward