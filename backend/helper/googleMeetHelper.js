const { google } = require("googleapis");

const createGoogleMeet = async (title, date, time) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client
    });

    const startDateTime = new Date(`${date}T${time}:00+05:30`);

    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

    const event = {
      summary: title,
      start: {
        dateTime: startDateTime
      },
      end: {
        dateTime: endDateTime
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet"
          }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1
    });

    const meetLink = response.data.conferenceData.entryPoints[0].uri;

    return {
      join_url: meetLink
    };
  } catch (error) {
    console.log("GOOGLE MEET ERROR:", error.message);
    throw error;
  }
};

module.exports = { createGoogleMeet };
