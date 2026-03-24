import CardBox from '../../../components/shared/CardBox';
import logoimg from '../../../assets/logoimg.png';
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import {
  createQcReport,
  getProductandSpecification,
  RawMaterialResult,
} from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import { toast } from 'react-toastify';
import { AppDispatch } from 'src/store';

const AddReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { batch, formula } = useSelector((state: any) => state.qcinventory.productSpecification);

  const [specification, setSpecification] = useState<any[]>([]);
  const [localBatch, setLocalBatch] = useState<any>({});

  /* ================= FETCH ================= */
  useEffect(() => {
    if (id) {
      dispatch(getProductandSpecification(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // 🔹 Edit Mode (Already Saved Data)
    if (batch?.items?.length > 0) {
      setSpecification(
        batch.items.map((item: any) => ({
          test: item.test,
          specification: item.specification,
          result: item.result,
          isNew: false,
        })),
      );
    }

    // 🔹 New Mode (Fresh from Formula)
    else if (formula?.specification?.length > 0) {
      setSpecification(
        formula.specification.map((item: any) => ({
          test: item.test,
          specification: item.specification,
          result: '',
          isNew: false,
        })),
      );
    }
  }, [batch, formula]);

  useEffect(() => {
    if (batch) {
      setLocalBatch(batch);
    }
  }, [batch]);

  /* ================= ADD ROW ================= */
  const handleAddRow = () => {
    const newRow = {
      test: '',
      specification: '',
      result: '',
      isNew: true,
    };
    setSpecification([...specification, newRow]);
  };

  /* ================= DELETE ROW ================= */
  const handleDeleteRow = (index: number) => {
    const updated = [...specification];
    updated.splice(index, 1);
    setSpecification(updated);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...specification];
    updated[index][field] = value;
    setSpecification(updated);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const isValid = specification.every((row) => row.result && row.result.trim() !== '');

    if (!isValid) {
      toast.error('Please fill all result fields.');
      return;
    }

    const formattedData = specification.map((row) => ({
      test: row.test,
      specification: row.specification,
      result: row.result,
    }));

    const payload = {
      qc_id: id,
      batch_number: localBatch?.qc_batch_number,
      mfg_date: localBatch?.mfg_date,
      exp_date: localBatch?.exp_date,
      mol_weight: localBatch?.mol_weight,
      data: formattedData,
    };

    try {
      const response = await dispatch(createQcReport(payload));

      if (RawMaterialResult.rejected.match(response)) {
        toast.error(response.payload?.message || 'Submission failed');
      } else {
        toast.success('QC report submitted successfully');
        navigate('/inventory/qa-qc-approval');
      }
    } catch (error) {
      toast.error('Unexpected error occurred.');
    }
  };

  return (
    <CardBox>
      <div className="w-full mx-auto border border-black p-7 px-14 font-serif text-sm text-black">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="text-xs">
            <p>
              19C-D-E/F/20A, Industrial Area, Maxi Rond,
              <br />
              Ujjain - 456001 (M.P.) INDIA
            </p>
          </div>

          <div className="text-center">
            <img src={logoimg} alt="Logo" className="h-16 mx-auto" />
          </div>

          <div className="text-right text-xs">
            <p>+91-9993622522</p>
            <p>indiaphosphate@gmail.com</p>
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="text-sm my-4">
          <div className="grid grid-cols-12 border border-black">
            {/* Product Name */}
            <div className="col-span-2 font-semibold border-r border-black p-1">
              Name Of Product
            </div>
            <div className="col-span-4 border-r border-black p-1">{batch?.product_name || ''}</div>

            {/* Formula */}
            <div className="col-span-2 font-semibold border-r border-black p-1">
              Chemical Formula
            </div>
            <div className="col-span-4 p-1">{formula?.formula_name || ''}</div>

            {/* Batch No */}
            <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
              Batch No.
            </div>
            <div className="col-span-4 border-r border-black border-t border-black p-1">
              <input
                type="text"
                value={localBatch?.qc_batch_number || ''}
                onChange={(e) =>
                  setLocalBatch({
                    ...localBatch,
                    qc_batch_number: e.target.value,
                  })
                }
                className="w-full outline-none"
              />
            </div>

            {/* Mol Wt */}
            <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
              Mol. Wt.
            </div>
            <div className="col-span-4 border-t border-black p-1">{formula?.mol_wt || ''}</div>

            {/* <div className="col-span-4 border-t border-black p-1">
              <input
                type="text"
                value={localBatch?.mol_weight || ''}
                onChange={(e) =>
                  setLocalBatch({
                    ...localBatch,
                    mol_weight: e.target.value,
                  })
                }
                className="w-full outline-none"
              />
            </div> */}

            {/* Date Of Mfg */}
            <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
              Date Of Mfg.
            </div>
            <div className="col-span-4 border-r border-black border-t border-black p-1">
              <input
                type="date"
                value={localBatch?.mfg_date || ''}
                onChange={(e) =>
                  setLocalBatch({
                    ...localBatch,
                    mfg_date: e.target.value,
                  })
                }
                className="w-full outline-none"
              />
            </div>

            {/* Date Of Exp */}
            <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
              Date Of Exp.
            </div>
            <div className="col-span-4 border-t border-black p-1">
              <input
                type="date"
                value={localBatch?.exp_date || ''}
                onChange={(e) =>
                  setLocalBatch({
                    ...localBatch,
                    exp_date: e.target.value,
                  })
                }
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        {specification.length > 0 && (
          <>
            <table className="w-full text-sm border border-black my-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-2">S.NO.</th>
                  <th className="border border-black px-2 py-2">TEST</th>
                  <th className="border border-black px-2 py-2">SPECIFICATION</th>
                  <th className="border border-black px-2 py-2">RESULT</th>
                  <th className="border border-black px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {specification.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-black px-2 py-2 text-center">{index + 1}</td>

                    <td className="border border-black px-2 py-2">
                      {row.isNew ? (
                        <input
                          type="text"
                          value={row.test}
                          onChange={(e) => handleChange(index, 'test', e.target.value)}
                          className="w-full border px-1 py-1"
                        />
                      ) : (
                        row.test
                      )}
                    </td>

                    <td className="border border-black px-2 py-2">
                      {row.isNew ? (
                        <input
                          type="text"
                          value={row.specification}
                          onChange={(e) => handleChange(index, 'specification', e.target.value)}
                          className="w-full border px-1 py-1"
                        />
                      ) : (
                        row.specification
                      )}
                    </td>

                    <td className="border border-black px-2 py-2">
                      <input
                        type="text"
                        value={row.result}
                        onChange={(e) => handleChange(index, 'result', e.target.value)}
                        className="w-full border px-1 py-1"
                      />
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      <Button size="xs" color="failure" onClick={() => handleDeleteRow(index)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <Button color="primary" size="xs" onClick={handleAddRow}>
                Add Row
              </Button>
            </div>
          </>
        )}

        <div className="flex justify-center mt-4">
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </CardBox>
  );
};

export default AddReport;
