import CardBox from '../../components/shared/CardBox';
import logoimg from '../../assets/logoimg.png';
import { useLocation, useParams } from 'react-router';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetrawMaterial } from 'src/features/Inventorymodule/Qcinventorymodule/QcinventorySlice';
import html2pdf from 'html2pdf.js';
import { GetStoremodule } from 'src/features/Inventorymodule/storemodule/StoreInventorySlice';
import { Icon } from '@iconify/react';
import { AppDispatch } from 'src/store';
const ViewReport = () => {
  const { id } = useParams();
  const location = useLocation();

  const qcentry = location.state || [];
  const isPM = qcentry?.type === 'pm';

  const dispatch = useDispatch<AppDispatch>();
  const reportRef = useRef(null);
  const Rawmaterialrmcode = useSelector((state: any) => state.qcinventory.qcdata);

  const type1Tests = Rawmaterialrmcode?.filter((item) => item.type == 1);

  const type2Tests = Rawmaterialrmcode?.filter((item) => item.type == 2);

  const getResultValue = (item: any) => {
    const results = isPM ? item?.pmresult : item?.qc_results;
    if (!Array.isArray(results) || !results.length) return 'fail';

    return qcentry?.qa_qc_status === 'APPROVED' ? results[0]?.result_value : 'fail';
  };

  const testedByUser = isPM
    ? type1Tests?.[0]?.pmresult?.[0]?.testedBy
    : type1Tests?.[0]?.qc_results?.[0]?.testedBy;

  const testedDate = isPM
    ? type1Tests?.[0]?.pmresult?.[0]?.created_at
    : type1Tests?.[0]?.qc_results?.[0]?.created_at;

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        dispatch(GetrawMaterial({ id, qc_id: qcentry.id, status: qcentry.type }));
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };
    fetchStoreData();
    const fetchData = async () => {
      try {
        dispatch(GetStoremodule());
      } catch (error) {
        console.error('Unexpected Error:', error);
      }
    };

    fetchData();
  }, [dispatch, id]);

  return (
    <>
      <CardBox>
        <div className="mb-3 flex justify-end">
          <button
            onClick={() => {
              if (reportRef.current) {
                const printContent = reportRef.current.innerHTML;
                const originalContent = document.body.innerHTML;

                // Replace body with report
                document.body.innerHTML = `
        <html>
          <head>
            <title>Raw Material Test Report</title>
            <style>
              body { font-family: serif; padding: 20px; color: black; }
              table, th, td { border: 1px solid black; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `;

                // Trigger print
                window.print();

                // Restore original body after short delay
                setTimeout(() => {
                  document.body.innerHTML = originalContent;
                  window.location.reload(); // reload to restore React app properly
                }, 100);
              }
            }}
            className="bg-blue-400 text-white me-2 font-semibold py-2 px-4 rounded"
          >
            <Icon icon={'material-symbols:print'} fontSize={'20px'} />
          </button>
          <button
            onClick={() => {
              if (reportRef.current) {
                const element = reportRef.current;

                // Use setTimeout to ensure DOM is fully rendered before generating PDF
                setTimeout(() => {
                  html2pdf()
                    .set({
                      margin: 0.5,
                      filename: `Raw_Material_Report_${id}.pdf`,
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2, useCORS: true },
                      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                    })
                    .from(element)
                    .save();
                }, 100); // small delay ensures rendering
              }
            }}
            className="bg-gray-400  text-white font-semibold py-2 px-4 rounded"
          >
            <Icon icon={'line-md:download-loop'} fontSize={'22px'} />
          </button>
        </div>

        <div
          className="w-full mx-auto border border-black p-7 px-14 font-serif text-sm text-black"
          ref={reportRef}
        >
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
                {isPM ? 'PACKING' : 'RAW'} MATERIAL TEST REPORT MATERIAL TEST REPORT
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
                {' '}
                {isPM ? 'PM' : 'RM'} CODE CODE
              </div>
              <div className="col-span-2 border-r border-black p-1">
                {isPM ? qcentry?.pm_code?.name : qcentry?.rmcode?.rm_code}
              </div>
              <div className="col-span-2 font-semibold border-r border-black p-1">
                Date of Receipt
              </div>
              <div className="col-span-2 border-r border-black p-1">{qcentry?.grn_date}</div>
              <div className="col-span-2 font-semibold border-r border-black p-1">G.R.N. No.</div>
              <div className="col-span-2 p-1">{qcentry?.grn_number}</div>
              {/* No right border for the last cell in the grid row */}
              {/* Row 2 */}
              <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
                Quantity
              </div>
              <div className="col-span-2 border-r border-black border-t border-black p-1">
                {qcentry?.quantity} <span className="ms-2">{qcentry?.unit} </span>
              </div>
              <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
                QC Reference No.
              </div>
              <div className="col-span-2 border-r border-black border-t border-black p-1">
                {qcentry?.qc_ref || '---'}
              </div>
              <div className="col-span-2 font-semibold border-r border-black border-t border-black p-1">
                Truck No.
              </div>
              <div className="col-span-2 border-t border-black p-1">
                {qcentry?.guard_entry?.vehicle_number || ''}
              </div>{' '}
              {/* No right border for the last cell in the grid row */}
            </div>
          </div>

          <table className="w-full text-sm border border-black mt-4 text-black">
            <thead>
              <tr className="border border-black">
                <th className="border border-black px-2 py-2">S.NO.</th>
                <th className="border border-black px-2 py-2">TESTS</th>
                <th className="border border-black px-2 py-2">LIMITS</th>
                <th className="border border-black px-2 py-2">RESULTS</th>
              </tr>
            </thead>
            <tbody>
              {type1Tests?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="border border-black px-2 py-2 text-center">{index + 1}</td>
                    <td className="border border-black px-2 py-2">{item.test}</td>
                    <td className="border border-black px-2 py-2">{item.limit}</td>
                    <td className="border border-black px-2 py-2">{getResultValue(item)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {type2Tests?.length > 0 && (
            <table className="w-full text-sm border border-black mt-1 text-black">
              <thead>
                <tr>
                  <th className="border border-black px-2 py-2" colSpan={3}>
                    <h3 className="font-bold text-sm">PHYSICAL PROPERTIES</h3>
                  </th>
                  <th className="border border-black px-2 py-2">RESULTS</th>
                </tr>
              </thead>
              <tbody>
                {type2Tests.map((item, index) => {
                  const hasQcResults =
                    qcentry.type == 'pm'
                      ? Array.isArray(item.pmresult) && item.pmresult.length > 0
                      : Array.isArray(item.qc_results) && item.qc_results.length > 0;

                  const result =
                    qcentry.type == 'pm'
                      ? item.pmresult[0]?.result_value
                      : item.qc_results[0]?.result_value;

                  const resultValue =
                    hasQcResults && qcentry?.qa_qc_status === 'APPROVED' ? result : 'fail';

                  return (
                    <tr key={index}>
                      <td className="border border-black px-2 py-2 text-center">{index + 1}</td>
                      <td className="border border-black px-2 py-2">{item.test}</td>
                      <td className="border border-black px-2 py-2">{item.limit}</td>
                      <td className="border border-black px-2 py-2">{resultValue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <p className="mt-8 text-sm text-black ">
            Conclusion (Complies/Does not Complies):
            <strong className="inline-block border-b border-black w-64 ps-3">
              {qcentry?.qa_qc_status === 'APPROVED' ? 'Complies' : 'Not Complies'}
            </strong>
          </p>

          <div className="flex justify-between text-sm mt-16 text-black">
            <div>
              Tested By (Sign. /Date)
              <span className="inline-block border-b w-60 text-dark border-black ml-2">
                <strong>
                  {testedByUser?.username || ''}
                  {testedByUser && testedDate ? ' / ' : ''}
                  {testedDate
                    ? new Date(testedDate)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                        .replace(/ /g, '-')
                    : ''}
                </strong>
              </span>
            </div>
            <div>
              Checked By (Sign./Date)
              <span className="inline-block border-b w-40 border-black ml-2"></span>
            </div>
          </div>
          <p className="text-center text-xs mt-6 text-black">1</p>
        </div>
      </CardBox>
    </>
  );
};

export default ViewReport;
