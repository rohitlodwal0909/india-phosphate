import { Accordion, Button, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { savePostProductionReview } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const PostProductionReview = ({ users, data, isReadOnly }) => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();

  const [review, setReview] = useState({
    production: {
      user: null,
      signature: '',
      date: '',
    },
    qa: {
      user: null,
      signature: '',
      date: '',
    },
  });

  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  const handleChange = (dept, field, value) => {
    setReview((prev) => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!review.production.user || !review.production.date || !review.qa.user || !review.qa.date) {
      toast.error('Please complete all required fields');
      return;
    }

    const payload = {
      post_production_review: [
        {
          id: data?.find((d) => d.department === 'PRODUCTION')?.id || null,
          bmr_id: id,
          department: 'PRODUCTION',
          checked_by: review.production.user.value,
          signature: review.production.signature,
          date: review.production.date,
        },
        {
          id: data?.find((d) => d.department === 'QUALITY_ASSURANCE')?.id || null,
          bmr_id: id,
          department: 'QUALITY_ASSURANCE',
          checked_by: review.qa.user.value,
          signature: review.qa.signature,
          date: review.qa.date,
        },
      ],
    };

    try {
      await dispatch(savePostProductionReview(payload)).unwrap();
      toast.success(
        data?.length
          ? 'Post-production review updated successfully'
          : 'Post-production review saved successfully',
      );
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const production = data.find((d) => d.department === 'PRODUCTION');
      const qa = data.find((d) => d.department === 'QUALITY_ASSURANCE');

      if (production) {
        const user = users?.find((u) => u.id === production.created_by);

        setReview((prev) => ({
          ...prev,
          production: {
            user: user ? { value: user.id, label: user.name || user.username } : null,
            signature: production.signature || '',
            date: production.date || '',
          },
        }));
      }

      if (qa) {
        const user = users?.find((u) => u.id === qa.created_by);

        setReview((prev) => ({
          ...prev,
          qa: {
            user: user ? { value: user.id, label: user.name || user.username } : null,
            signature: qa.signature || '',
            date: qa.date || '',
          },
        }));
      }
    }
  }, [data, users]);

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>12. Post-Production Review</Accordion.Title>

        {isReadOnly && (
          <Accordion.Content>
            <div className="border rounded-md p-4 space-y-4 text-dark">
              <p className="text-sm">
                The complete Post-Production Batch Record has been reviewed for completeness and
                accuracy. All pages are complete and all entries conform to Good Documentation
                Practices.
              </p>

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
                    {/* PRODUCTION */}
                    <tr>
                      <td className="border p-2 font-medium">PRODUCTION</td>

                      <td className="border p-2 min-w-[200px]">
                        <Select
                          placeholder="Select User"
                          options={userOptions}
                          value={review.production.user}
                          onChange={(val) => handleChange('production', 'user', val)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </td>

                      <td className="border p-2">
                        <TextInput
                          placeholder="Signature"
                          value={review.production.signature}
                          onChange={(e) => handleChange('production', 'signature', e.target.value)}
                        />
                      </td>

                      <td className="border p-2">
                        <TextInput
                          type="date"
                          value={review.production.date}
                          onChange={(e) => handleChange('production', 'date', e.target.value)}
                        />
                      </td>
                    </tr>

                    {/* QUALITY ASSURANCE */}
                    <tr>
                      <td className="border p-2 font-medium">QUALITY ASSURANCE</td>

                      <td className="border p-2 min-w-[200px]">
                        <Select
                          placeholder="Select User"
                          options={userOptions}
                          value={review.qa.user}
                          onChange={(val) => handleChange('qa', 'user', val)}
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                        />
                      </td>

                      <td className="border p-2">
                        <TextInput
                          placeholder="Signature"
                          value={review.qa.signature}
                          onChange={(e) => handleChange('qa', 'signature', e.target.value)}
                        />
                      </td>

                      <td className="border p-2">
                        <TextInput
                          type="date"
                          value={review.qa.date}
                          onChange={(e) => handleChange('qa', 'date', e.target.value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-3 pt-4">
                <Button color="gray">Cancel</Button>
                <Button color="primary" onClick={handleSubmit}>
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

export default PostProductionReview;
