import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import StateTable from './StateComponent.tsx/StateTable';
import CardBox from 'src/components/shared/CardBox';

const State = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "State ", to: "/" }]}
        title="State"/>
         <CardBox>
        <StateTable/>
        </CardBox>
        </>
  )
}

export default State