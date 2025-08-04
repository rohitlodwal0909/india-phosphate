const unitMap = {
  // Length
  m: { factor: 1, type: "length" },
  cm: { factor: 0.01, type: "length" },
  mm: { factor: 0.001, type: "length" },
  km: { factor: 1000, type: "length" },
  inch: { factor: 0.0254, type: "length" },
  ft: { factor: 0.3048, type: "length" },

  // Mass/Weight
  kg: { factor: 1, type: "mass" },
  g: { factor: 0.001, type: "mass" },
  mg: { factor: 0.000001, type: "mass" },
  tonne: { factor: 1000, type: "mass" },
  lb: { factor: 0.453592, type: "mass" },

  // Volume
  ltr: { factor: 1, type: "volume" },
  ml: { factor: 0.001, type: "volume" },

  // Count (no conversion)
  pcs: { factor: 1, type: "count" },
  bag: { factor: 1, type: "count" },
};

function convertUnit(value, fromUnit, toUnit) {
  if (fromUnit.toLowerCase() === toUnit.toLowerCase()) {
    return parseFloat(value); // no conversion needed
  }

  const from = unitMap[fromUnit.toLowerCase()];
  const to = unitMap[toUnit.toLowerCase()];

  if (!from || !to) {
    throw new Error(`Invalid unit: '${fromUnit}' or '${toUnit}'`);
  }

  if (from.type !== to.type) {
    throw new Error(
      `Unit type mismatch: Cannot convert '${fromUnit}' (${from.type}) to '${toUnit}' (${to.type})`
    );
  }

  return (value * from.factor) / to.factor;
}

module.exports = { convertUnit };
