import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import PackingListTable from './PackingListComponent/PackingListTable';

const PackingList = () => {
  return (
    <>
      <BreadcrumbComp items={[{ title: 'Packing List', to: '/' }]} title="Packing List" />
      <CardBox>
        <PackingListTable />
      </CardBox>
    </>
  );
};

export default PackingList;
