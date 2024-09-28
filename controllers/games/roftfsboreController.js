const pool = require("../../models/connection");
const path = require("path");

const uploadVideo = async (req, res) => {
  const { userName, userEmail } = req.body;
  const video = req.files.video;

  const uploadTime = new Date();
  const videoUrl = `/uploads/${video.name}`;

  try {
    // Move the uploaded video to the designated folder
    await video.mv(`./uploads/${video.name}`);

    const query =
      "INSERT INTO roftfsbore_videos (video_url, user_name, user_email, upload_time) VALUES (?, ?, ?, ?)";
    await pool.execute(query, [videoUrl, userName, userEmail, uploadTime]);

    res.send("Video uploaded successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

const getVideo = async (req, res) => {
  const videoId = req.params.id;

  try {
    const query =
      "SELECT * FROM roftfsbore_videos WHERE id = ? AND approved = 1";
    const [results] = await pool.execute(query, [videoId]);

    if (results.length === 0)
      return res.status(404).send("Video not found or not approved");

    res.sendFile(path.resolve(results[0].video_url));
  } catch (err) {
    res.status(500).send(err);
  }
};

const logAction = async (req, res) => {
  const { actionType, userId, details } = req.body;
  const timestamp = new Date();

  try {
    const query =
      "INSERT INTO roftfsbore_logs (action_type, user_id, timestamp, details) VALUES (?, ?, ?, ?)";
    await pool.execute(query, [actionType, userId, timestamp, details]);

    res.send("Log recorded successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  uploadVideo,
  getVideo,
  logAction,
};
