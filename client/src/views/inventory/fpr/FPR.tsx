import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp"
import CardBox from "src/components/shared/CardBox";
import Table from "./Table";

const FPR = () => {
    
  return (
    <div>
            <BreadcrumbComp    items={[{ title: "Finished Product Release Note", to: "/" }]}
                title="Finished Product Release Note"/>
                     <CardBox>
                       <div>
                         <div className="pb-6 flex justify-end">
                          </div>
                      </div>

                      <Table  />
                      </CardBox>
                     
    </div>
  )
}

export default FPR