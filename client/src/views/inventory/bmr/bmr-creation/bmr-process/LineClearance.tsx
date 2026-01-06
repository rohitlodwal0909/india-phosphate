import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import LineClearanceAccordionDesign from './LineClearanceAccordionDesign';
import DispensingRawMaterial from './DispensingRawMaterial';
import Listofequipement from './Listofequipement';
import LineClearanceProcessingArea from './LineClearanceProcessingArea';
import SieveIntegrityRecord from './SieveIntegrityRecord';
import InprocessCheck from './InprocessCheck';
import QualityControlIntimation from './QualityControlIntimation';
import PackingMaterialIssuance from './PackingMaterialIssuance';
import PackingRecord from './PackingRecord';
import YieldCalculation from './YieldCalculation';
import PostProductionReview from './PostProductionReview';
import ProductRelease from './ProductRelease';
import ManufacturingProcedure from './ManufacturingProcedure';

const LineClearance = () => {
  return (
    <div>
      <BreadcrumbComp items={[{ title: 'BMR Process', to: '/' }]} title="BMR Process" />
      <CardBox>
        <LineClearanceAccordionDesign />
        <DispensingRawMaterial />
        <Listofequipement />
        <LineClearanceProcessingArea />
        <ManufacturingProcedure />
        <SieveIntegrityRecord />
        <InprocessCheck />
        <QualityControlIntimation />
        <PackingMaterialIssuance />
        <PackingRecord />
        <YieldCalculation />
        <PostProductionReview />
        <ProductRelease />
      </CardBox>
    </div>
  );
};

export default LineClearance;
