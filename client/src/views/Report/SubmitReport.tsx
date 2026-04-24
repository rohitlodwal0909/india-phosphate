import CardBox from '../../components/shared/CardBox';
import logoimg from '../../assets/logoimg.png';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import {
  getTestReport,
  RawMaterialResult,
} from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';

import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';
import Spinner from '../spinner/Spinner';

import { clearTestReport } from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';

const SubmitReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { testReports, loading } = useSelector((state: any) => state.qcinventory);

  const [grn, setGrn] = useState(null);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!id) return;

    dispatch(getTestReport({ id: Number(id) }));

    return () => {
      dispatch(clearTestReport());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const grn = testReports?.grn ?? null;
    const tests = testReports?.tests ?? [];
    setGrn(grn);
    setTests(tests);
  }, [testReports]);

  useEffect(() => {
    if (!tests?.length) return;

    const type1 = tests
      .filter((row) => Number(row.type) === 1)
      .map((row) => ({ ...row, source: 'api' }));

    const type2 = tests
      .filter((row) => Number(row.type) === 2)
      .map((row) => ({ ...row, source: 'api' }));

    setType1Rows(type1);
    setType2Rows(type2);
  }, [tests]);

  const navigate = useNavigate();

  const [type1Rows, setType1Rows] = useState([]);
  const [type2Rows, setType2Rows] = useState([]);

  const [addedType1Rows, setAddedType1Rows] = useState([]);
  const [addedType2Rows, setAddedType2Rows] = useState([]);

  const handleAddType1Row = () => {
    const newRow = { test: '', limit: '', result: '', type: '1' };
    setAddedType1Rows([...addedType1Rows, newRow]);
    //  setType1Rows([...type1Rows, newRow]);
  };
  const handleDeleteType1Row = () => {
    if (addedType1Rows.length > 0) {
      const updatedRows = [...addedType1Rows];
      updatedRows.pop();
      setAddedType1Rows(updatedRows);
    }
  };

  const handleAddType2Row = () => {
    const newRow = { test: '', limit: '', result: '', type: '2' };
    setAddedType2Rows([...addedType2Rows, newRow]);
    //  setType2Rows([...type2Rows, newRow]);
  };

  const handleDeleteType2Row = () => {
    if (addedType2Rows.length > 0) {
      const updated = [...addedType2Rows];
      updated.pop();
      setAddedType2Rows(updated);
    }
  };

  useEffect(() => {
    // ignore empty resets
    if (!Array.isArray(tests) || tests.length === 0) return;

    const type1 = tests
      .filter((row) => Number(row.type) === 1)
      .map((row) => ({ ...row, source: 'api' }));

    const type2 = tests
      .filter((row) => Number(row.type) === 2)
      .map((row) => ({ ...row, source: 'api' }));

    setType1Rows(type1);
    setType2Rows(type2);
  }, [tests]);

  const handleSubmit = async () => {
    if (!grn?.id) return;
    const allRows = [...type1Rows, ...addedType1Rows, ...type2Rows, ...addedType2Rows];
    const isValid = allRows.every((row) => row.result && row.result.trim() !== '');

    if (!isValid) {
      toast.error("Please fill the 'Result' field for all rows before submitting.");
      return;
    }

    if (type1Rows?.length === 0 && type2Rows?.length === 0) {
      toast.error('Please create specification and test in master');
      return;
    }

    const formattedData = allRows.map((row) => ({
      raw_material_id: row.id || '',
      test: row.test,
      limit: row.limit,
      result: row.result,
      type: row.type,
    }));

    const submissionPayload = {
      qc_id: grn?.id,
      data: formattedData,
      code: grn?.type == 'pm' ? grn?.store_pm_code : grn?.store_rm_code,
      type: grn?.type,
    };

    try {
      const response = await dispatch(RawMaterialResult(submissionPayload));

      if (RawMaterialResult.rejected.match(response)) {
        const message =
          response.payload?.message || response.error?.message || 'Submission failed.';
        toast.error(`Error: ${message}`);
      } else {
        const successMessage = response.payload?.message || 'QC results submitted successfully!';
        toast.success(successMessage);
        navigate('/inventory/qc');
      }
    } catch (error) {
      toast.error('Unexpected error occurred during submission.');
    }
  };

  return (
    <CardBox>
      {loading && <Spinner />}
      <div className="w-full mx-auto border border-black p-7 px-14 font-serif text-sm text-black">
        <div className="flex justify-between items-start">
          <div className="text-black text-xs">
            <p>
              19C-D-E/F/20A, Industrial Area, Maxi Rond,
              <br />
              Ujjain - 456001 (M.P.) INDIA
            </p>
          </div>
          <div className="text-center text-black">
            <img src={logoimg} alt="India Phosphate Logo" className="h-17 mx-auto" />

            <h2 className="font-bold text-base mt-4 underline">
              {' '}
              {grn?.type == 'pm' ? 'PACKING' : 'RAW'} MATERIAL TEST REPORT
            </h2>
          </div>
          <div className="text-right text-xs text-black">
            <p>+91-9993622522</p>
            <p>indiaphosphate@gmail.com</p>
          </div>
        </div>

        <div className="text-sm text-black my-3">
          <div className="grid grid-cols-12 border border-black">
            {/* Row 1 */}
            <div className="col-span-2 font-semibold border-r border-black p-1">
              {grn?.type == 'pm' ? 'PM' : 'RM'} CODE
            </div>
            <div className="col-span-2 border-r border-black p-1">
              {grn?.type == 'pm' ? grn?.pm_code?.name : grn?.rmcode?.rm_code}
            </div>
            <div className="col-span-2 font-semibold border-r border-black p-1">
              Date of Receipt
            </div>
            <div className="col-span-2 border-r border-black p-1">{grn?.grn_date}</div>
            <div className="col-span-2 font-semibold border-r border-black p-1">G.R.N. No.</div>
            <div className="col-span-2 p-1">{grn?.grn_number}</div>
            {/* Row 2 */}
            <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
              Quantity
            </div>
            <div className="col-span-2 border-r border-black border-t border-black p-1">
              {' '}
              {grn?.quantity} <span className="ms-2">{grn?.unit} </span>
            </div>
            <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
              QC Reference No.
            </div>
            <div className="col-span-2 border-r border-black border-t border-black p-1">
              {`IPH/QC/${new Date().getFullYear().toString().slice(-2)}/${
                grn?.type === 'pm' ? grn?.pm_code?.name : grn?.rmcode?.rm_code
              }/${grn?.guard_entry?.inward_number?.slice(-2) || '00'}`}

              {/* <input
                type="text"
                value={qcRef}
                onChange={(e) => setQcRef(e.target.value)}
                className="w-full outline-none"
                placeholder="Enter QC Ref No."
              /> */}
            </div>
            <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
              Truck No.
            </div>
            <div className="col-span-2 border-t border-black p-1">
              {grn?.guard_entry?.vehicle_number || ''}
            </div>{' '}
            {/* No right border for the last cell in the grid row */}
          </div>
        </div>
        {type1Rows.length > 0 && (
          <>
            <table className="w-full text-sm border border-black my-4 text-black">
              <thead>
                <tr className="border border-black bg-gray-100">
                  <th className="border border-black px-2 py-2">S.NO.</th>
                  <th className="border border-black px-2 py-2">TESTS</th>
                  <th className="border border-black px-2 py-2">LIMITS</th>
                  <th className="border border-black px-2 py-2">RESULTS</th>
                </tr>
              </thead>
              <tbody>
                {[...type1Rows, ...addedType1Rows].map((row, index) => {
                  const isEditable = !row.id; // Only newly added are editable
                  return (
                    <tr key={index} className="">
                      <td className="border border-black px-2 py-2 text-center">{index + 1}</td>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="text"
                          value={row.test}
                          readOnly={!isEditable}
                          onChange={(e) => {
                            if (isEditable) {
                              const updated = [...addedType1Rows];
                              updated[index - type1Rows.length].test = e.target.value;
                              setAddedType1Rows(updated);
                            }
                          }}
                          className="w-full border border-pink-300 px-1 py-1 text-sm focus:ring-pink-400 focus:border-pink-500"
                        />
                      </td>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="text"
                          value={row.limit}
                          readOnly={!isEditable}
                          onChange={(e) => {
                            if (isEditable) {
                              const updated = [...addedType1Rows];
                              updated[index - type1Rows.length].limit = e.target.value;
                              setAddedType1Rows(updated);
                            }
                          }}
                          className="w-full border border-pink-300 px-1 py-1 text-sm focus:ring-pink-400 focus:border-pink-500"
                        />
                      </td>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="text"
                          value={row.result}
                          onChange={(e) => {
                            const isFromAPI = row.id;
                            if (isFromAPI) {
                              const updated = [...type1Rows];
                              updated[index].result = e.target.value;
                              setType1Rows(updated);
                            } else {
                              const updated = [...addedType1Rows];
                              updated[index - type1Rows.length].result = e.target.value;
                              setAddedType1Rows(updated);
                            }
                          }}
                          className="w-full border border-pink-300 px-1 py-1 text-sm focus:ring-pink-400 focus:border-pink-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        {type1Rows.length > 0 && (
          <div className="flex justify-end">
            <Button
              size="xs"
              color="lighterror"
              className="border border-error text-error hover:bg-error me-2 hover:text-white rounded-md"
              onClick={() => handleDeleteType1Row()}
            >
              Delete
            </Button>
            <Button
              size="xs"
              onClick={handleAddType1Row}
              color="lightsecondary"
              className="border border-info text-primary hover:bg-primary hover:text-white rounded-md"
              // outline
            >
              Add Row
            </Button>
          </div>
        )}
        {type2Rows.length > 0 && (
          <>
            <table className="w-full text-sm border border-black my-4 text-black">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-2" colSpan={3}>
                    <h3 className="font-bold text-sm">PHYSICAL PROPERTIES</h3>
                  </th>
                  <th className="border border-black px-2 py-2">RESULTS</th>
                </tr>
              </thead>
              <tbody>
                {[...type2Rows, ...addedType2Rows].map((row, index) => {
                  const isEditable = !row.id;
                  return (
                    <tr key={index}>
                      <td className="border border-black px-2 py-2 text-center">{index + 1}</td>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="text"
                          value={row.test}
                          readOnly={!isEditable}
                          onChange={(e) => {
                            if (isEditable) {
                              const updated = [...addedType2Rows];
                              updated[index - type2Rows.length].test = e.target.value;
                              setAddedType2Rows(updated);
                            }
                          }}
                          className="w-full border border-pink-300 px-1 py-1 text-sm focus:ring-pink-400 focus:border-pink-500"
                        />
                      </td>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="text"
                          value={row.limit}
                          readOnly={!isEditable}
                          onChange={(e) => {
                            if (isEditable) {
                              const updated = [...addedType2Rows];
                              updated[index - type2Rows.length].limit = e.target.value;
                              setAddedType2Rows(updated);
                            }
                          }}
                          className="w-full border border-pink-300 px-1 py-1 text-sm focus:ring-pink-400 focus:border-pink-500"
                        />
                      </td>
                      <td className="border border-black px-2 py-2">
                        <input
                          type="text"
                          value={row.result}
                          onChange={(e) => {
                            const isFromAPI = row.id;
                            if (isFromAPI) {
                              const updated = [...type2Rows];
                              updated[index].result = e.target.value;
                              setType2Rows(updated);
                            } else {
                              const updated = [...addedType2Rows];
                              updated[index - type2Rows.length].result = e.target.value;
                              setAddedType2Rows(updated);
                            }
                          }}
                          className="w-full border border-pink-300 px-1 py-1 text-sm focus:ring-pink-400 focus:border-pink-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
        {type2Rows.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleDeleteType2Row}
              size="xs"
              color="lighterror"
              className="border border-error text-error hover:bg-error me-2 hover:text-white rounded-md"
            >
              Delete
            </Button>
            <Button
              onClick={handleAddType2Row}
              color="info"
              size="xs"
              className="border border-info text-info hover:bg-info hover:text-white rounded-md"
              outline
            >
              Add Row
            </Button>
          </div>
        )}
        <div className="flex justify-center">
          <Button
            color="info"
            className="border border-primary  text-white bg-primary  rounded-sm"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </CardBox>
  );
};

export default SubmitReport;
