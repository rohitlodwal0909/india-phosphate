import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import PmCodeTable from './PmCodeComponent.tsx/PmCodeTable';

const PmCode = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "PM Code ", to: "/" }]}
        title="Pm Code"/>
         <CardBox>
        <PmCodeTable/>
        </CardBox>
        </>
  )
}

export default PmCode