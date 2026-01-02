import CardBox from '../../components/shared/CardBox';

import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';

import Addusermodal from './Addusermodal';

import PaginationTable from './PaginationTable';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

import { triggerGoogleTranslateRescan } from 'src/utils/triggerTranslateRescan';
import { GetRole } from 'src/features/authentication/PermissionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/store';
const Usermanagment = () => {
  const [placeModal, setPlaceModal] = useState(false);
  let modalPlacement = 'center';
  const dispatch = useDispatch<AppDispatch>();

  const roleData = useSelector((state: any) => state.rolepermission.roledata);

  useEffect(() => {
    const fetchCheckinData = async () => {
      try {
        const resultAction = await dispatch(GetRole());

        if (GetRole.rejected.match(resultAction)) {
          console.error(
            'Error fetching check-in module:',
            resultAction.payload || resultAction.error.message,
          );
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };
    fetchCheckinData();
  }, []);

  return (
    <>
      <BreadcrumbComp items={[{ title: 'User Management', to: '/' }]} title="User Management" />
      <CardBox>
        <div className="flex justify-between items-center">
          <h5 className="card-title">User Management</h5>
          <Button
            onClick={() => {
              setPlaceModal(true), triggerGoogleTranslateRescan();
            }}
            className="w-fit"
            color="primary"
          >
            New Add User
          </Button>
        </div>
        <div>
          <PaginationTable roleData={roleData} />
        </div>
        <Addusermodal
          setPlaceModal={setPlaceModal}
          modalPlacement={modalPlacement}
          placeModal={placeModal}
          roleData={roleData}
        />
      </CardBox>
    </>
  );
};

export default Usermanagment;
