function parseDate(dateStr) {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
}

function buildFullAddress(addr = {}) {
  return [
    addr.bno,
    addr.bnm,
    addr.flno,
    addr.st,
    addr.loc,
    addr.dst,
    addr.stcd,
    addr.pncd
  ]
    .filter(Boolean)
    .join(", ");
}

function normalizeGstResponse(apiResponse) {
  const root = apiResponse?.data || {};
  const gst = root?.data || {};
  const addr = gst?.pradr?.addr || {};

  return {
    gstin: gst.gstin || null,
    pan_number: gst.gstin ? gst.gstin.substring(2, 12) : null,

    legal_name: gst.lgnm || null,
    trade_name: gst.tradeNam || null,
    constitution: gst.ctb || null,
    taxpayer_type: gst.dty || null,
    gst_status: gst.sts || null,

    registration_date: parseDate(gst.rgdt),
    gst_last_updated: parseDate(gst.lstupdt),

    center_jurisdiction: gst.ctj || null,
    center_jurisdiction_code: gst.ctjCd || null,
    state_jurisdiction: gst.stj || null,
    state_jurisdiction_code: gst.stjCd || null,

    business_nature: gst.nba || [],

    address_building_name: addr.bnm || null,
    address_building_no: addr.bno || null,
    address_floor_no: addr.flno || null,
    address_street: addr.st || null,
    address_location: addr.loc || null,
    address_district: addr.dst || null,
    address_state: addr.stcd || null,
    address_pincode: addr.pncd || null,
    address_landmark: addr.landMark || null,

    full_address: buildFullAddress(addr),

    api_status_code: root.status_cd || null,
    api_transaction_id: apiResponse.transaction_id || null,
    api_timestamp: apiResponse.timestamp || null,

    raw_response: apiResponse,
    last_fetched_at: new Date()
  };
}

module.exports = { normalizeGstResponse };
