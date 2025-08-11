import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import DocumentTable from './DocumentComponent.tsx/DocumentTable';
import CardBox from 'src/components/shared/CardBox';

const Document = () => {
  
  return (
    <>
      <BreadcrumbComp    items={[{ title: "Document", to: "/" }]}
        title="Document"/>
         <CardBox>
        <DocumentTable/>
        </CardBox>
        </>
  )
}

export default Document