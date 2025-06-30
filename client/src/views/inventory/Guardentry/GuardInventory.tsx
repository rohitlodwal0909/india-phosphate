import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp"
import CardBox from "src/components/shared/CardBox";
import GuardTable from "./GuardTable";

const GuardInventory = () => {
    

  return (
    <div>
            <BreadcrumbComp    items={[{ title: "Inbound Gate Entry", to: "/" }]}
                title="Inbound Gate Entry"/>
                     <CardBox>
                       <div>
                         <div className="pb-6 flex justify-end">
                          {/* { hasAddPermission &&<Button color="primary" onClick={()=>{setPlaceModal(true),triggerGoogleTranslateRescan()}} >
                            <span className="font-medium"> New Entry </span>
                          </Button>} */}
                          </div>
                      </div>

                      <GuardTable  />
                      </CardBox>
                      {/* <GuardAddmodal setPlaceModal={setAddmodal} modalPlacement={modalPlacement}  placeModal={addModal}/> */}
                     
    </div>
  )
}

export default GuardInventory