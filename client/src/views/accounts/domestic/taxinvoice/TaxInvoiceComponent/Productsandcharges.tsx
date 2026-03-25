import { Button, Label, TextInput } from 'flowbite-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProduct } from 'src/features/master/Product/ProductSlice';
import { AppDispatch } from 'src/store';

const Productsandcharges = ({ products, setProducts, charges, setCharges }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productdata } = useSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(GetProduct());
  }, [dispatch]);

  const handleChange = (field: string, value: any) => {
    setCharges((prev) => ({ ...prev, [field]: value }));
  };

  const addRow = () => {
    setProducts([
      ...products,
      {
        kind_of_pkgs: '',
        product_name: '',
        hsn: '',
        qty: '',
        rate: '',
        per: 'kg',
        amount: 0,
        batch_no: '',
        mfg: '',
        exp: '',
      },
    ]);
  };

  // 🔹 Remove Row
  const removeRow = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // 🔹 Product Change
  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];

    if (field === 'product_name') {
      const selectedProduct = productdata.find((p: any) => p.id == value);

      updated[index].product_name = value;
      updated[index].hsn = selectedProduct?.ihs_code || '999799';
    } else {
      updated[index][field] = value;
    }

    // 🔥 Auto Amount
    const qty = Number(updated[index].qty || 0);
    const rate = Number(updated[index].rate || 0);
    updated[index].amount = qty * rate;

    setProducts(updated);
  };

  // 🔥 Calculations
  const subTotal = products?.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const insurance = charges.insurance === '0.10%' ? subTotal * 0.001 : 0;

  const freight = Number(charges.freight || 0);

  const gstRate = Number(charges.gst_rate || 0);

  const gstAmount = ((subTotal + insurance + freight) * gstRate) / 100;

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
            {products.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* No. of Pkgs */}
                <td className="border p-2">
                  <TextInput
                    value={item.kind_of_pkgs}
                    onChange={(e) => handleProductChange(index, 'kind_of_pkgs', e.target.value)}
                  />
                </td>

                {/* Product Dropdown */}
                <td className="border p-2">
                  <select
                    className="w-full border p-2 rounded"
                    value={item.product_name || ''}
                    onChange={(e) => handleProductChange(index, 'product_name', e.target.value)}
                  >
                    <option value="">Select Product</option>
                    {productdata?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Batch */}
                <td className="border p-2">
                  <TextInput
                    value={item.batch_no}
                    onChange={(e) => handleProductChange(index, 'batch_no', e.target.value)}
                  />
                </td>

                {/* MFG */}
                <td className="border p-2">
                  <TextInput
                    type="date"
                    value={item.mfg}
                    onChange={(e) => handleProductChange(index, 'mfg', e.target.value)}
                  />
                </td>

                {/* EXP */}
                <td className="border p-2">
                  <TextInput
                    type="date"
                    value={item.exp}
                    onChange={(e) => handleProductChange(index, 'exp', e.target.value)}
                  />
                </td>

                {/* HSN */}
                <td className="border p-2 text-center font-medium">{item.hsn}</td>

                {/* Qty */}
                <td className="border p-2">
                  <TextInput
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleProductChange(index, 'qty', e.target.value)}
                  />
                </td>

                {/* Rate */}
                <td className="border p-2">
                  <TextInput
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleProductChange(index, 'rate', e.target.value)}
                  />
                </td>

                {/* Per */}
                <td className="border p-2">
                  <select
                    className="border p-1 w-full rounded"
                    value={item.per}
                    onChange={(e) => handleProductChange(index, 'per', e.target.value)}
                  >
                    <option value="kg">Kg</option>
                    <option value="nos">Nos</option>
                    <option value="ltr">Ltr</option>
                  </select>
                </td>

                {/* Amount */}
                <td className="border p-2 text-right font-semibold">
                  ₹ {item.amount.toLocaleString()}
                </td>

                {/* Action */}
                <td className="border p-2 text-center">
                  <Button size="xs" color="failure" onClick={() => removeRow(index)}>
                    X
                  </Button>
                </td>
              </tr>
            ))}
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
          <option value="0.10%">0.10%</option>
          <option value="nil">Nil</option>
        </select>
      </div>

      <div className="col-span-3">
        <Label value="Freight & Packing" />
        <TextInput
          value={charges.freight}
          onChange={(e) => handleChange('freight', e.target.value)}
        />
      </div>

      <div className="col-span-3">
        <Label value="GST %" />
        <select
          className="w-full border p-2 rounded"
          value={charges.gst_rate}
          onChange={(e) => handleChange('gst_rate', e.target.value)}
        >
          <option value="">Select GST %</option>

          {/* Low GST */}
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
      </div>

      <div className="col-span-3">
        <Label value="Round Off" />
        <TextInput
          value={charges.round_off}
          onChange={(e) => handleChange('round_off', e.target.value)}
        />
      </div>

      {/* 🔹 Total */}
      <div className="col-span-12 text-right mt-6 space-y-2">
        <div>Sub Total: ₹ {subTotal.toLocaleString()}</div>
        <div>Insurance: ₹ {insurance.toFixed(2)}</div>
        <div>Freight: ₹ {freight}</div>
        <div>GST: ₹ {gstAmount.toFixed(2)}</div>
        <div>Round Off: ₹ {roundOff}</div>

        <div className="text-2xl font-bold border-t pt-3">
          Grand Total: ₹ {grandTotal.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Productsandcharges;
