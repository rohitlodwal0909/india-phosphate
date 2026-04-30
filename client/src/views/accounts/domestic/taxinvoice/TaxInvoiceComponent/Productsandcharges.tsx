import { Button, Label, TextInput } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { AppDispatch } from 'src/store';

const Productsandcharges = ({ batches, products, setProducts, charges, setCharges }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productdata } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(GetProduct());
  }, [dispatch]);

  // console.log(dispatchBatches);

  const handleChange = (field: string, value: any) => {
    setCharges((prev) => ({ ...prev, [field]: value }));
  };
  const addBatch = (productIndex) => {
    const updated = [...products];

    updated[productIndex].batches.push({
      batch_no: '',
      mfg: '',
      exp: '',
      qty: '',
      amount: 0,
    });

    setProducts(updated);
  };

  const handleBatchChange = (pIndex, bIndex, field, value) => {
    const updated = [...products];

    updated[pIndex].batches[bIndex][field] = value;

    const qty = Number(updated[pIndex].batches[bIndex].qty || 0);
    const rate = Number(updated[pIndex].rate || 0);

    updated[pIndex].batches[bIndex].amount = qty * rate;

    setProducts(updated);
  };

  const addRow = () => {
    setProducts([
      ...products,
      {
        kind_of_pkgs: '',
        product_name: '',
        grade: '',
        hsn: '',
        rate: '',
        per: 'kg',
        batches: [
          {
            batch_no: '',
            mfg: '',
            exp: '',
            qty: '',
            amount: 0,
          },
        ],
      },
    ]);
  };

  const GST_TYPES = ['CGST', 'SGST', 'IGST', 'UTGST'];

  const addGST = () => {
    const currentGST = Array.isArray(charges.gst) ? charges.gst : [];

    const availableGST = GST_TYPES.find((type) => !currentGST.some((g) => g.type === type));

    if (!availableGST) return;

    setCharges((prev) => ({
      ...prev,
      gst: [...currentGST, { type: availableGST, rate: '' }],
    }));
  };

  const handleGSTChange = (index, field, value) => {
    const updated = [...charges.gst];
    updated[index][field] = value;

    setCharges((prev) => ({
      ...prev,
      gst: updated,
    }));
  };

  const removeGST = (index) => {
    setCharges((prev) => ({
      ...prev,
      gst: prev.gst.filter((_, i) => i !== index),
    }));
  };

  // 🔹 Remove Row
  const removeBatch = (productIndex, batchIndex) => {
    const updated = [...products];

    if (updated[productIndex].batches.length === 1) return;

    updated[productIndex].batches.splice(batchIndex, 1);

    setProducts(updated);
  };

  // 🔹 Product Change
  const handleProductChange = (index, field, value) => {
    const updated = [...products];

    if (field === 'product_name') {
      const selectedProduct = productdata.find((p) => p.id == value);

      updated[index].product_name = value;
      updated[index].hsn = selectedProduct?.ihs_code || '999799';

      updated[index].grade = selectedProduct?.grade || '';
    } else {
      updated[index][field] = value;
    }

    // ✅ Recalculate all batch amounts if rate changed
    if (field === 'rate') {
      updated[index].batches = updated[index].batches?.map((batch) => ({
        ...batch,
        amount: Number(batch.qty || 0) * Number(value || 0),
      }));
    }

    setProducts(updated);
  };

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // 🔥 Calculations
  const subTotal = products.reduce((total, product) => {
    const batchTotal = product?.batches?.reduce((sum, batch) => sum + Number(batch.amount || 0), 0);
    return total + batchTotal;
  }, 0);

  const insurance = charges.insurance === '0.10' ? subTotal * 0.001 : 0;

  const freight = Number(charges.freight || 0);

  const gstAmount = Array.isArray(charges.gst)
    ? charges.gst.reduce((total, gst) => {
        const rate = Number(gst.rate || 0);
        return total + ((subTotal + insurance + freight) * rate) / 100;
      }, 0)
    : 0;

  const roundOff = Number(charges.round_off || 0);

  const grandTotal =
    Number(subTotal) + Number(insurance) + Number(freight) + Number(gstAmount) + Number(roundOff);

  return (
    <div className="grid grid-cols-12 gap-4 text-gray-900">
      {/* 🔹 Product Table */}
      <div className="col-span-12 overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="border p-2">No. of Pkgs</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Batch No</th>
              <th className="border p-2">MFG</th>
              <th className="border p-2">EXP</th>
              <th className="border p-2">HSN</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Per</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((product, pIndex) =>
              product?.batches?.map((batch, bIndex) => (
                <tr key={`${pIndex}-${bIndex}`}>
                  {/* Package */}
                  {bIndex === 0 && (
                    <td rowSpan={product.batches.length} className="border p-2">
                      <TextInput
                        value={product.kind_of_pkgs}
                        onChange={(e) =>
                          handleProductChange(pIndex, 'kind_of_pkgs', e.target.value)
                        }
                      />
                    </td>
                  )}

                  {/* Product */}
                  {bIndex === 0 && (
                    <td rowSpan={product.batches.length} className="border p-2">
                      <select
                        className="w-full border p-2 rounded"
                        value={product.product_name}
                        onChange={(e) =>
                          handleProductChange(pIndex, 'product_name', e.target.value)
                        }
                      >
                        <option value="">Select Product</option>
                        {productdata.length > 0 &&
                          productdata?.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.product_name}
                            </option>
                          ))}
                      </select>
                    </td>
                  )}

                  {bIndex === 0 && (
                    <td rowSpan={product.batches.length} className="border p-2">
                      <select
                        className="w-full border p-2 rounded"
                        value={product.grade}
                        onChange={(e) => handleProductChange(pIndex, 'grade', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="IP">IP</option>
                        <option value="BP">BP</option>
                        <option value="EP">EP</option>
                        <option value="USP">USP</option>
                        <option value="FCC">FCC</option>
                        <option value="IHS">IHS</option>
                      </select>
                    </td>
                  )}

                  {/* Batch */}
                  <td className="border p-2">
                    <select
                      className="w-full border p-2 rounded"
                      value={batch.batch_no}
                      onChange={(e) =>
                        handleBatchChange(pIndex, bIndex, 'batch_no', e.target.value)
                      }
                    >
                      <option value="">Select Batch</option>
                      {batches.length > 0 &&
                        batches?.map((p) => (
                          <option key={p.id} value={p.batch?.batch_no}>
                            {p.batch?.batch_no}
                          </option>
                        ))}
                    </select>
                  </td>

                  {/* MFG */}
                  <td className="border p-2">
                    <TextInput
                      type="date"
                      value={batch.mfg}
                      onChange={(e) => handleBatchChange(pIndex, bIndex, 'mfg', e.target.value)}
                    />
                  </td>

                  {/* EXP */}
                  <td className="border p-2">
                    <TextInput
                      type="date"
                      value={batch.exp}
                      onChange={(e) => handleBatchChange(pIndex, bIndex, 'exp', e.target.value)}
                    />
                  </td>

                  {/* HSN */}
                  {bIndex === 0 && (
                    <td rowSpan={product.batches.length} className="border text-center">
                      {product.hsn}
                    </td>
                  )}

                  {/* Qty */}
                  <td className="border p-2">
                    <TextInput
                      type="number"
                      value={batch.qty}
                      onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value < 0) value = 0;

                        handleBatchChange(pIndex, bIndex, 'qty', value);
                      }}
                    />
                  </td>

                  {/* Rate */}
                  {bIndex === 0 && (
                    <td rowSpan={product.batches.length} className="border">
                      <TextInput
                        type="number"
                        value={product.rate}
                        onChange={(e) => handleProductChange(pIndex, 'rate', e.target.value)}
                      />
                    </td>
                  )}

                  {bIndex === 0 && (
                    <td rowSpan={product.batches.length} className="border">
                      <select
                        className="border p-1 w-full rounded"
                        value={product.per}
                        onChange={(e) => handleProductChange(pIndex, 'per', e.target.value)}
                      >
                        <option value="kg">Kg</option>
                        <option value="nos">Nos</option>
                        <option value="ltr">Ltr</option>
                      </select>
                    </td>
                  )}
                  {/* Amount */}
                  <td className="border text-right">₹ {batch?.amount?.toLocaleString()}</td>

                  {/* Actions */}
                  <td className="border text-center space-x-1">
                    <Button color="primary" size="xs" onClick={() => addBatch(pIndex)}>
                      +
                    </Button>

                    <Button size="xs" color="failure" onClick={() => removeBatch(pIndex, bIndex)}>
                      X
                    </Button>
                  </td>
                  {bIndex === 0 && (
                    <td rowSpan={product.batches.length} className="text-center">
                      <Button color="warning" size="xs" onClick={() => removeProduct(pIndex)}>
                        X
                      </Button>
                    </td>
                  )}
                </tr>
              )),
            )}
          </tbody>
        </table>

        <div className="mt-3">
          <Button color={'primary'} size="sm" onClick={addRow}>
            + Add Row
          </Button>
        </div>
      </div>

      {/* 🔹 Charges */}
      <div className="col-span-3">
        <Label value="Insurance" />
        <select
          className="w-full border p-2 rounded"
          value={charges.insurance}
          onChange={(e) => handleChange('insurance', e.target.value)}
        >
          <option value="0.10">0.10%</option>
          <option value="nil">Nil</option>
        </select>
      </div>

      <div className="col-span-2">
        <Label value="Freight & Packing" />
        <TextInput
          value={charges.freight}
          onChange={(e) => handleChange('freight', e.target.value)}
        />
      </div>
      <div className="col-span-3">
        <Label value="Round Off" />
        <TextInput
          value={charges.round_off}
          onChange={(e) => handleChange('round_off', e.target.value)}
        />
      </div>

      <div className="col-span-4 space-y-2">
        <Label value="GST Details" />

        {charges?.gst?.map((gst, index) => (
          <div key={index} className="flex gap-2 items-center">
            {/* GST TYPE */}
            <select
              className="border p-2 rounded"
              value={gst.type}
              onChange={(e) => handleGSTChange(index, 'type', e.target.value)}
            >
              {GST_TYPES?.map((type) => (
                <option
                  key={type}
                  value={type}
                  disabled={charges.gst.some((g, i) => g.type === type && i !== index)}
                >
                  {type}
                </option>
              ))}
            </select>

            {/* RATE */}
            <select
              className="border p-2 rounded"
              value={gst.rate}
              onChange={(e) => handleGSTChange(index, 'rate', e.target.value)}
            >
              <option value="">GST %</option>
              <option value="0.1">0.1%</option>
              <option value="0.5">0.5%</option>

              {/* Standard */}
              <option value="5">5%</option>
              <option value="6">6%</option>
              <option value="9">9%</option>
              <option value="12">12%</option>
              <option value="14">14%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>

            <Button size="xs" color="failure" onClick={() => removeGST(index)}>
              X
            </Button>
          </div>
        ))}

        {/* ADD GST */}
        <Button size="xs" color="success" onClick={addGST}>
          + Add GST
        </Button>
      </div>

      {/* 🔹 Total */}
      <div className="col-span-12 text-right mt-6 space-y-2">
        <div>Sub Total: ₹ {subTotal?.toLocaleString()}</div>
        <div>Insurance: ₹ {insurance?.toFixed(2)}</div>
        <div>Freight: ₹ {freight}</div>
        <div>GST: ₹ {gstAmount?.toFixed(2)}</div>
        <div>Round Off: ₹ {roundOff}</div>

        <div className="text-2xl font-bold border-t pt-3">
          Grand Total: ₹ {grandTotal?.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Productsandcharges;
