import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import TransportTable from './TransportComponent.tsx/TransportTable';
import CardBox from 'src/components/shared/CardBox';

const Transport = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Transport ", to: "/" }]}
        title="Transport Mode"/>
         <CardBox>
       
         <TransportTable/>
        </CardBox>
        </>
  )
}

export default Transport