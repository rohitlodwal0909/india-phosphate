import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import PackingMaterialTable from './PackingMaterialComponent.tsx/PackingMaterialTable';
import CardBox from 'src/components/shared/CardBox';

const PackingMaterial = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Packing Material ", to: "/" }]}
        title="Packing Material"/>
         <CardBox>
        <PackingMaterialTable/>
        </CardBox>
        </>
  )
}

export default PackingMaterial