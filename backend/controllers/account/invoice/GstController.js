const axios = require("axios");
const API_KEY = "key_live_4ac219f9e7f140cfb6811e9e8b180ea6";
const API_SECRET = "secret_live_0f17a3504d6540aba0ad80bafbfdb39c";

// ==============================
// Get Access Token
// ==============================
const db = require("../../../models");
const {
  normalizeGstResponse
} = require("../../../helper/normalizeGstResponse");
const { GstCache, ApiToken } = db;

// const API_KEY = process.env.SANDBOX_API_KEY;
// const API_SECRET = process.env.SANDBOX_API_SECRET;
const BASE_URL = "https://api.sandbox.co.in";
const PROVIDER = "sandbox_gst";

// ==============================
// Helpers
// ==============================
function isValidGstin(gstin) {
  return /^[0-9A-Z]{15}$/.test((gstin || "").toUpperCase());
}

function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

// ==============================
// Token from DB or API
// ==============================
async function getAccessToken() {
  const existing = await ApiToken.findOne({ where: { provider: PROVIDER } });

  // token valid hai to wahi use karo
  if (
    existing &&
    existing.access_token &&
    existing.expires_at &&
    new Date(existing.expires_at) > new Date()
  ) {
    return existing.access_token;
  }

  const response = await axios.post(
    `${BASE_URL}/authenticate`,
    {},
    {
      headers: {
        "x-api-key": API_KEY,
        "x-api-secret": API_SECRET,
        "x-api-version": "1.0.0"
      }
    }
  );

  const token = response.data?.access_token;
  if (!token) {
    throw new Error("Access token not received from Sandbox");
  }

  // expiry exact docs ke hisaab se set kar sakte ho
  // फिलहाल 12 hours example
  const expiresAt = addMinutes(new Date(), 12 * 60);

  await ApiToken.upsert({
    provider: PROVIDER,
    access_token: token,
    expires_at: expiresAt
  });

  return token;
}

// ==============================
// Force token refresh
// ==============================
async function refreshAccessToken() {
  const response = await axios.post(
    `${BASE_URL}/authenticate`,
    {},
    {
      headers: {
        "x-api-key": API_KEY,
        "x-api-secret": API_SECRET,
        "x-api-version": "1.0.0"
      }
    }
  );

  const token = response.data?.access_token;
  if (!token) {
    throw new Error("Access token not received from Sandbox");
  }

  const expiresAt = addMinutes(new Date(), 12 * 60);

  await ApiToken.upsert({
    provider: PROVIDER,
    access_token: token,
    expires_at: expiresAt
  });

  return token;
}

// ==============================
// Sandbox GST API call
// ==============================
async function fetchGstFromApi(gstin, token) {
  const response = await axios.post(
    `${BASE_URL}/gst/compliance/public/gstin/search`,
    { gstin },
    {
      headers: {
        Authorization: token,
        "x-api-key": API_KEY,
        "x-api-version": "1.0.0",
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
}

// ==============================
// Main service
// ==============================
async function getGstDetails(gstin, options = {}) {
  const forceRefresh = options.forceRefresh || false;

  if (!gstin) {
    throw new Error("GSTIN is required");
  }

  gstin = gstin.toUpperCase().trim();

  if (!isValidGstin(gstin)) {
    throw new Error("Invalid GSTIN format");
  }

  // 1) cache check
  const cached = await GstCache.findOne({ where: { gstin } });

  if (cached) {
    return {
      source: "cache",
      data: cached
    };
  }

  // 2) token lao
  let token = await getAccessToken();

  let apiResponse;
  try {
    apiResponse = await fetchGstFromApi(gstin, token);
  } catch (error) {
    const errData = error.response?.data;

    if (
      errData?.error === "invalid_grant" ||
      errData?.message?.toLowerCase()?.includes("invalid")
    ) {
      token = await refreshAccessToken();
      apiResponse = await fetchGstFromApi(gstin, token);
    } else {
      throw error;
    }
  }

  if (!apiResponse || apiResponse.code !== 200) {
    throw new Error(apiResponse?.message || "GST API failed");
  }

  // 3) normalize
  const normalized = normalizeGstResponse(apiResponse);

  // 4) save cache
  await GstCache.upsert(normalized);

  // 5) fresh DB row
  const fresh = await GstCache.findOne({ where: { gstin } });

  return {
    source: "api",
    data: fresh
  };
}

exports.getGstData = async (req, res) => {
  try {
    const { gstin, forceRefresh = false } = req.body;

    if (!gstin) {
      return res.status(400).json({
        success: false,
        message: "gstin is required"
      });
    }

    const result = await getGstDetails(gstin, { forceRefresh });

    return res.status(200).json({
      success: true,
      source: result.source, // cache / api
      data: result.data
    });
  } catch (error) {
    console.error(
      "GST CONTROLLER ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch GST details",
      error: error.response?.data || null
    });
  }
};
