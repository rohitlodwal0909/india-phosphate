import { useSelector } from 'react-redux';
// import LogoIcon from '/src/assets/images/logos/logo-icon.svg';
import { Link } from 'react-router';
import { ImageUrl } from 'src/constants/contant';
import user1 from '/src/assets//images/profile/user-1.jpg';

const Logo = () => {
  const logindata = useSelector((state: any) => state.authentication?.logindata);

  return (
    <Link to={'/'}>
      <img
        src={
          logindata?.admin?.profile_image ? `${ImageUrl}${logindata.admin.profile_image}` : user1
        }
        alt="logo"
        height="80"
        width="80"
        className="rounded-full"
      />
      {/* <img src={LogoIcon} alt="logo" /> */}
    </Link>
  );
};

export default Logo;
