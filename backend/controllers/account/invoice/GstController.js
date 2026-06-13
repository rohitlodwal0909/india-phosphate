const axios = require("axios");

// Sandbox.co.in Live Credentials
const API_KEY = "key_live_d8d134fefc934e6dbca9bebf15ce6e11";
const API_SECRET = "secret_live_44e11a69cb8c4d6a9f57517d67b90453";
const BASE_URL = "https://api.sandbox.co.in";

/**
 * Local Corporate Mapping Registry
 * Maps raw company names directly to a real, valid 15-digit GSTIN format required by this specific endpoint.
 * (Replace the mock GSTINs below with real active GST numbers you want to query)
 */
const companyRegistryLookups = {
  "hindustan phosphates pvt. ltd.": "27AAACH1294K1Z1",
  "hindustan phosphates": "27AAACH1294K1Z1",
  "acme industries private limited": "27AAACA1234B1Z0",
  "acme industries": "27AAACA1234B1Z0"
};

/**
 * [STEP 1/2] - Fetch the temporary Authorization Token
 */
async function getAccessToken() {
  try {
    console.log("--> Requesting Sandbox authentication token...");
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
    return response.data.access_token;
  } catch (error) {
    console.error(
      "❌ Authentication Failed:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to authenticate with Sandbox gateway.");
  }
}

/**
 * [STEP 2/2] - Fetch data using the exact E-Invoice Taxpayer Search Endpoint from your curl
 */
async function getEInvoiceTaxpayerDetails(token, targetGstin) {
  try {
    console.log(
      `--> Sending request to E-Invoice endpoint for GSTIN: ${targetGstin}`
    );

    // Exact URL and method configuration derived from your curl request
    const targetUrl = `${BASE_URL}/gst/compliance/e-invoice/tax-payer/gstin/search`;

    const response = await axios.post(
      targetUrl,
      {
        gstin: targetGstin // Sending a properly structured 15-digit identifier string
      },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
          "x-api-key": API_KEY,
          "x-api-version": "1.0.0"
        }
      }
    );
    return response;
  } catch (error) {
    console.error(
      "❌ E-Invoice GST Search Failed:",
      error.response
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    throw error;
  }
}

/**
 * Express Route Controller
 * Accepts Postman JSON body payload: { "company_name": "Hindustan Phosphates Pvt. Ltd." }
 */
exports.getGstData = async (req, res) => {
  const { company_name } = req.body;

  if (!company_name) {
    return res.status(400).json({
      success: false,
      error:
        "Missing parameter. Please provide 'company_name' in the request body."
    });
  }

  try {
    console.log("================ START RUNTIME PIPELINE ================");

    // Standardize input string to find a match in our local directory
    const lookupKey = company_name.trim().toLowerCase();
    const resolvedGstin = companyRegistryLookups[lookupKey];

    if (!resolvedGstin) {
      console.log(
        `⚠️ Input string '${company_name}' was not found in the local database mapping dictionary.`
      );
      return res.status(442).json({
        success: false,
        error: `The company name '${company_name}' is not mapped to a valid 15-digit GSTIN inside your script database registry configuration.`
      });
    }

    console.log(
      `--> Name found! Local map resolved string to active GSTIN: ${resolvedGstin}`
    );

    // Execute Step 1: Token Generation
    const token = await getAccessToken();
    console.log("✅ Authorization Token successfully generated.");

    // Execute Step 2: Fetch Live E-Invoice Profile details via newly resolved GSTIN
    const finalGstDetails = await getEInvoiceTaxpayerDetails(
      token,
      resolvedGstin
    );
    console.log(
      "✅ Complete taxpayer corporate data object successfully retrieved."
    );
    console.log("================= END RUNTIME PIPELINE =================");

    return res.status(200).json({
      success: true,
      meta: {
        input_provided: company_name,
        internally_resolved_gstin: resolvedGstin
      },
      data: finalGstDetails
    });
  } catch (error) {
    console.error("❌ Pipeline Runtime sequence broken.");
    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "An error occurred during verification processing rules."
    });
  }
};
