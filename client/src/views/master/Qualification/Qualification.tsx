import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import QualificationTable from './QualificationComponent.tsx/QualificationTable';
import CardBox from 'src/components/shared/CardBox';

const Qualification = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Qualification ", to: "/" }]}
        title="Qualification"/>
         <CardBox>
        <QualificationTable/>
        </CardBox>
        </>
  )
}

export default Qualification