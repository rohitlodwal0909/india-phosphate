const axios = require("axios");

exports.getZoomAccessToken = async () => {
  try {
    const response = await axios.post(`https://zoom.us/oauth/token`, null, {
      params: {
        grant_type: "account_credentials",
        account_id: "xdUkjwB1SUuF_1w5zzmLBw"
      },
      auth: {
        username: "JevpoekgS0Ksa_5VzXb6DQ",
        password: "uN1rrfhY6u34gR7YnvMQBHA2J2MUZjdf"
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error("ZOOM TOKEN ERROR:", error.response?.data || error.message);
    throw new Error("Zoom authentication failed");
  }
};
