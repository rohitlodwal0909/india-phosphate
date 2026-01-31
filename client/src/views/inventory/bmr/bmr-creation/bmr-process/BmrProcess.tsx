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
        <DispensingRawMaterial
          bmr={bmr}
          users={users}
          data={bmrreport?.dispensingRm}
          isReadOnly={Boolean(bmrreport?.lineClearance)}
        />
        <Listofequipement
          bmr={bmr}
          data={bmrreport?.equipmentno}
          isReadOnly={Boolean(bmrreport?.dispensingRm?.length > 0)}
        />
        <LineClearanceProcessingArea
          bmr={bmr}
          users={users}
          data={bmrreport?.lineClearanceProcessing}
          isReadOnly={Boolean(bmrreport?.equipmentno?.length > 0)}
        />
        <ManufacturingProcedure
          data={bmrreport?.procedureList}
          proce={bmrreport?.manufacturingprocedure}
          users={users}
          isReadOnly={Boolean(bmrreport?.lineClearanceProcessing)}
        />
        <SieveIntegrityRecord
          bmr={bmr}
          users={users}
          data={bmrreport?.sieveIntegiry}
          isReadOnly={Boolean(bmrreport?.manufacturingprocedure?.length > 0)}
        />
        <InprocessCheck
          users={users}
          data={bmrreport?.inprocesscheck}
          isReadOnly={Boolean(bmrreport?.sieveIntegiry?.length > 0)}
        />
        <QualityControlIntimation
          users={users}
          data={bmrreport?.qcintimation}
          isReadOnly={Boolean(bmrreport?.inprocesscheck)}
        />
        <PackingMaterialIssuance
          bmr={bmr}
          users={users}
          data={bmrreport?.pmIssuance}
          isReadOnly={Boolean(bmrreport?.qcintimation)}
        />
        <PackingRecord
          bmr={bmr}
          data={bmrreport?.packingrecords}
          isReadOnly={Boolean(bmrreport?.pmIssuance?.length > 0)}
        />
        <YieldCalculation
          users={users}
          data={bmrreport?.yieldcalculation}
          isReadOnly={Boolean(bmrreport?.packingrecords)}
        />
        <PostProductionReview
          users={users}
          data={bmrreport?.productionreviews}
          isReadOnly={Boolean(bmrreport?.yieldcalculation)}
        />
        <ProductRelease
          users={users}
          bmr={bmr}
          data={bmrreport?.productrelease}
          isReadOnly={Boolean(bmrreport?.productionreviews?.length > 0)}
        />
      </CardBox>
    </div>
  );
};

export default BmrProcess;
