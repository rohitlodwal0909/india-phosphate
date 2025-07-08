import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp"
import CardBox from "src/components/shared/CardBox"

import QcbatchTable from "./QcbatchTable"


const Qcbatch = () => {
  return (
        <div> 
                <BreadcrumbComp    items={[{ title: "Batch", to: "/" }]}
                title=" Batch"/>
                <CardBox>
                <QcbatchTable/>
                </CardBox>
                </div>

  )
}

export default Qcbatch