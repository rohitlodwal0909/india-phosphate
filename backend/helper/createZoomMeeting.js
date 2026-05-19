const axios = require("axios");
const { getZoomAccessToken } = require("./zoomService");

exports.createZoomMeeting = async (topic, date, time) => {
  try {
    /* ================= TOKEN ================= */
    const token = await getZoomAccessToken();

    /* ================= DATE FORMAT ================= */
    // Zoom ISO format required
    const start_time = `${date}T${time}:00`;

    /* ================= CREATE MEETING ================= */
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic,
        type: 2, // Scheduled meeting
        start_time,
        duration: 60,
        timezone: "Asia/Kolkata",
        agenda: topic,

        settings: {
          join_before_host: false,
          waiting_room: true,
          approval_type: 0,
          participant_video: true,
          host_video: true
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("ZOOM CREATE ERROR:", error?.response?.data || error.message);

    throw new Error("Zoom meeting creation failed");
  }
};
