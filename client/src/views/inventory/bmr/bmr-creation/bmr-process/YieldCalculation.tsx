import { Accordion, Button, Label, TextInput, Textarea } from 'flowbite-react';
import Select from 'react-select';
import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router';
import { saveYieldCalculation } from 'src/features/Inventorymodule/BMR/BmrCreation/BmrReportSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const selectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const YieldCalculation = ({ users, data, isReadOnly }) => {
  const dispatch = useDispatch<any>();

  const { id } = useParams();
  const [totalQty, setTotalQty] = useState('');
  const [theoreticalYield, setTheoreticalYield] = useState('');
  const [performedBy, setPerformedBy] = useState(null);
  const [remark, setRemark] = useState('');

  // AUTO CALCULATION
  const actualYield = useMemo(() => {
    const total = parseFloat(totalQty) || 0;
    const theoretical = parseFloat(theoreticalYield) || 0;
    return ((total * theoretical) / 100).toFixed(2);
  }, [totalQty, theoreticalYield]);

  useEffect(() => {
    if (data) {
      setTotalQty(data.total_qty?.toString() || '');
      setTheoreticalYield(data.theoretical_yield?.toString() || '');
      setRemark(data.remark || '');

      // react-select expects { value, label }
      if (data.performed_by) {
        const user = users?.find((u) => u.id === data.performed_by);
        if (user) {
          setPerformedBy({
            value: user.id,
            label: user.name || user.username,
          });
        }
      }
    }
  }, [data, users]);

  const handleSubmit = async () => {
    if (!totalQty || !theoreticalYield || !performedBy) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      id: data?.id || null,
      bmr_id: id,
      total_qty: Number(totalQty),
      theoretical_yield: Number(theoreticalYield),
      actual_yield: Number(actualYield),
      remark,
      performed_by: performedBy.value,
    };

    try {
      await dispatch(saveYieldCalculation(payload)).unwrap();
      toast.success(
        data?.id
          ? 'Yield calculation updated successfully'
          : 'Yield calculation saved successfully',
      );
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  // USERS OPTIONS
  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: u.name || u.username,
    })) || [];

  return (
    <Accordion alwaysOpen>
      <Accordion.Panel>
        <Accordion.Title>11. Yield Calculation</Accordion.Title>

        {isReadOnly && (
          <Accordion.Content>
            <div className="border rounded-md p-4 space-y-6 text-dark">
              {/* INPUTS */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Label value="1. Total Qty (Kg)" />
                  <TextInput
                    step="0.01"
                    min="0"
                    value={totalQty}
                    onChange={(e) => setTotalQty(e.target.value)}
                  />
                </div>

                <div className="col-span-6">
                  <Label value="2. Theoretical Yield (%)" />
                  <TextInput
                    value={theoreticalYield}
                    onChange={(e) => setTheoreticalYield(e.target.value)}
                    placeholder="Enter theoretical yield"
                  />
                </div>
              </div>

              {/* ACTUAL YIELD */}
              <div>
                <Label value="3. Actual Yield (Kg)" />
                <p className="text-sm mt-1">(Total Qty × Theoretical Yield) / 100</p>
                <TextInput className="mt-2" value={actualYield} readOnly />
              </div>

              {/* REMARK */}
              <div>
                <Label value="Remark" />
                <Textarea rows={3} value={remark} onChange={(e) => setRemark(e.target.value)} />
              </div>

              {/* PERFORMED BY */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Label value="Performed By" />
                  <Select
                    placeholder="Select User"
                    options={userOptions}
                    value={performedBy}
                    onChange={setPerformedBy}
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-3 pt-4 border-t">
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

export default YieldCalculation;
