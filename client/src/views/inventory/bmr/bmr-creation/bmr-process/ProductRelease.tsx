import { Accordion, Button, Label, TextInput, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { saveProductRelease } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';

const ProductRelease = ({ users = [], bmr, data, isReadOnly }) => {
  const dispatch = useDispatch<any>();
  const { id } = useParams();

  const [review, setReview] = useState({
    PRODUCTION: { user_id: '', signature: '', date: '' },
    'QUALITY CONTROL': { user_id: '', signature: '', date: '' },
    'QUALITY ASSURANCE': { user_id: '', signature: '', date: '' },
  });

  const handleChange = (dept, field, value) => {
    setReview((prev) => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const updated = { ...review };

      data.forEach((row) => {
        if (updated[row.department]) {
          updated[row.department] = {
            id: row.id,
            user_id: row.created_by || '',
            signature: row.signature || '',
            date: row.product_release || row.product_release || '',
          };
        }
      });

      setReview(updated);
    }
  }, [data]);

  const handleSubmit = async () => {
    try {
      const payload = Object.keys(review).map((dept) => ({
        id: review[dept].id || null,
        bmr_id: id,
        department: dept,
        user_id: review[dept].user_id,
        signature: review[dept].signature,
        release_date: review[dept].date,
      }));

      await dispatch(saveProductRelease(payload)).unwrap();

      toast.success('Product Release saved successfully');
    } catch (error) {
      toast.error('Failed to save Product Release');
    }
  };

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>13. Product Release</Accordion.Title>
        {isReadOnly && (
          <Accordion.Content>
            <div className="border rounded-md p-4 space-y-4 text-dark">
              <p className="text-sm">
                The material produced through the execution of this Batch Record shall be
                dispositioned by QA according to Product Release Procedure.
              </p>

              <p className="text-sm">
                The product conforms to Finished Goods Specification:&nbsp;
                <span className="font-semibold underline">Sodium citrate IP/BP/EP/USP/FCC</span>
              </p>

              {/* Batch & Date */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Label value="Batch No." />
                  <TextInput value={bmr?.records?.qc_batch_number} readOnly />
                </div>

                <div className="col-span-6">
                  <Label value="Date" />
                  <TextInput type="date" />
                </div>
              </div>

              <p className="text-sm font-medium">The Disposition shall be recorded below.</p>

              {/* Table */}
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">DEPARTMENT</th>
                      <th className="border p-2">NAME</th>
                      <th className="border p-2">SIGNATURE</th>
                      <th className="border p-2">DATE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.keys(review).map((dept) => (
                      <tr key={dept}>
                        <td className="border p-2 font-medium">{dept}</td>

                        <td className="border p-2">
                          <Select
                            value={review[dept].user_id}
                            onChange={(e) => handleChange(dept, 'user_id', e.target.value)}
                          >
                            <option value="">Select User</option>
                            {users.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.username}
                              </option>
                            ))}
                          </Select>
                        </td>

                        <td className="border p-2">
                          <TextInput
                            value={review[dept].signature}
                            onChange={(e) => handleChange(dept, 'signature', e.target.value)}
                            placeholder="Signature"
                          />
                        </td>

                        <td className="border p-2">
                          <TextInput
                            type="date"
                            value={review[dept].date}
                            onChange={(e) => handleChange(dept, 'date', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button color="gray">Cancel</Button>
                <Button color="success" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </Accordion.Content>
        )}
      </Accordion.Panel>
    </Accordion>
  );
};

export default ProductRelease;
