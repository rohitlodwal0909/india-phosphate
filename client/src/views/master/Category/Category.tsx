import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CategoryTable from './CategoryComponent.tsx/CategoryTable';
import CardBox from 'src/components/shared/CardBox';

const Category = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Category ", to: "/" }]}
        title="Category"/>
         <CardBox>
        <CategoryTable/>
        </CardBox>
        </>
  )
}

export default Category