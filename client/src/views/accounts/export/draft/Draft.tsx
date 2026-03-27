import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import DraftTable from './DraftComponent/DraftTable';

const DraftList = () => {
  return (
    <>
      <BreadcrumbComp
        items={[{ title: 'Draft Packing List', to: '/' }]}
        title="Draft Packing List"
      />
      <CardBox>
        <DraftTable />
      </CardBox>
    </>
  );
};

export default DraftList;
