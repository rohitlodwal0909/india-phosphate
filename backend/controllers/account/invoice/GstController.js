const axios = require("axios");

const API_KEY = "key_live_28d7ee1401b24f329e42cb3028986dde";
const API_SECRET = "secret_live_d414a44c3f814f4884beff22004c2693";

const BASE_URL = "https://api.sandbox.co.in";

// ==============================
// Get Access Token
// ==============================
async function getAccessToken() {
  try {
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

    console.log("TOKEN RESPONSE:", response.data);

    return response.data.access_token;
  } catch (error) {
    console.log("AUTH ERROR:", error.response?.data || error.message);
    throw error;
  }
}

// ==============================
// Get GST Details
// ==============================
async function getGstDetails(token) {
  try {
    // const
    const gstin = "23AAJCM0239R2Z4";
    const response = await axios.post(
      `${BASE_URL}/gst/compliance/public/gstin/search`,
      {
        gstin: gstin
      },
      {
        headers: {
          Authorization: token,
          "x-api-key": API_KEY,
          "x-api-version": "1.0.0",
          "Content-Type": "application/json"
        }
      }
    );

    // console.log("GST RESPONSE:", response.data);

    return response.data;
  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("GST ERROR:", JSON.stringify(error.response?.data, null, 2));

    throw error;
  }
}

// ==============================
// Controller
// ==============================
exports.getGstData = async (req, res) => {
  try {
    const token = await getAccessToken();

    const gstData = await getGstDetails(token);

    return res.status(200).json({
      success: true,
      data: gstData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
};
