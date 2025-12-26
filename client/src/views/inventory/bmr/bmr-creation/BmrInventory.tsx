import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp"
import CardBox from "src/components/shared/CardBox"
import BmrCreateTable from "./bmrTable"



const BmrInventory = () => {
  return (
        <div> 
                <BreadcrumbComp    items={[{ title: "BMR", to: "/" }]}
                title="BMR"/>
                <CardBox>
                <BmrCreateTable/>
                </CardBox>
                </div>

  )
}

export default BmrInventory