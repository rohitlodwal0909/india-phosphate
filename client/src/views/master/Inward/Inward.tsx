import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import InwardTable from './InwardComponent.tsx/InwardTable';
import CardBox from 'src/components/shared/CardBox';

const Inward = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Inward ", to: "/" }]}
        title="Inward"/>
         <CardBox>
        <InwardTable/>
        </CardBox>
        </>
  )
}

export default Inward