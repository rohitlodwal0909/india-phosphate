
import Bgimg from "/src/assets/images/logos/logo-icon.svg";


const LeftSidebarPart = () => {
  return (
    <>
      <div className="circle-top"></div>
      <div>
        <img src={Bgimg} alt="materilm" className="circle-bottom" />
      </div>
      <div className="flex justify-center h-screen items-center z-10 relative">
        <div className="xl:w-7/12 xl:px-0 px-6">
          <h2 className="text-white text-[40px] font-bold leading-[normal]">
         
         India Phosphate
          </h2>
          <p className="opacity-75 text-white my-4 text-base font-medium">
          Login to manage your data with industry-standard encryption and real-time protection.
          </p>
          {/* <Button className="mt-6" color={"primary"}>Learn More </Button> */}
        </div>
      </div>
    </>
  );
};

export default LeftSidebarPart;
