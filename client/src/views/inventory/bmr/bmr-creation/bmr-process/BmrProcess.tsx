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
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetUsermodule } from 'src/features/usermanagment/UsermanagmentSlice';
import { AppDispatch } from 'src/store';
import { useParams } from 'react-router';
import {
  getProductionBatch,
  getBmrReport,
} from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';

const BmrProcess = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: any) => state.usermanagement.userdata);
  const bmr = useSelector((state: any) => state.bmrReport.data);
  const { bmrreport } = useSelector((state: any) => state.bmrReport);

  const { id } = useParams();

  useEffect(() => {
    dispatch(GetUsermodule());
    dispatch(getProductionBatch(id));
    dispatch(getBmrReport(id));
  }, [dispatch]);

  return (
    <div>
      <BreadcrumbComp items={[{ title: 'BMR Process', to: '/' }]} title="BMR Process" />
      <CardBox>
        <LineClearanceAccordionDesign bmr={bmr} data={bmrreport?.lineClearance} />
        <DispensingRawMaterial bmr={bmr} users={users} data={bmrreport?.dispensingRm} />
        <Listofequipement bmr={bmr} data={bmrreport?.equipmentno} />
        <LineClearanceProcessingArea users={users} />
        <ManufacturingProcedure />
        <SieveIntegrityRecord bmr={bmr} users={users} data={bmrreport?.sieveIntegiry} />
        <InprocessCheck users={users} data={bmrreport?.inprocesscheck} />
        <QualityControlIntimation users={users} data={bmrreport?.qcintimation} />
        <PackingMaterialIssuance bmr={bmr} users={users} data={bmrreport?.pmIssuance} />
        <PackingRecord />
        <YieldCalculation users={users} />
        <PostProductionReview users={users} />
        <ProductRelease users={users} />
      </CardBox>
    </div>
  );
};

export default BmrProcess;
