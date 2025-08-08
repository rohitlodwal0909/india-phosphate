import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import FormulaTable from './FormulaComponent.tsx/FormulaTable';
import CardBox from 'src/components/shared/CardBox';

const Formula = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Formula ", to: "/" }]}
        title="Formula"/>
         <CardBox>
        <FormulaTable/>
        </CardBox>
        </>
  )
}

export default Formula