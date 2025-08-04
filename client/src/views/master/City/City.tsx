import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CityTable from './CityComponent.tsx/CityTable';
import CardBox from 'src/components/shared/CardBox';

const City = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "City ", to: "/" }]}
        title="City"/>
         <CardBox>
         <CityTable/>
        </CardBox>
        </>
  )
}

export default City