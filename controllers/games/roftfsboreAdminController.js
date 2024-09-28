const pool = require("../../models/connection");
const fs = require("fs");
const { transporter } = require("../../helpers/mailer");

const listVideos = async (req, res) => {
  try {
    const query = "SELECT * FROM roftfsbore_videos";
    const [results] = await pool.execute(query);
    res.render("games/roftfsbore/admin/videos", { videos: results });
  } catch (err) {
    res.status(500).send(err);
  }
};

const viewVideo = async (req, res) => {
  const videoId = req.params.id;

  try {
    const query = "SELECT * FROM roftfsbore_videos WHERE id = ?";
    const [results] = await pool.execute(query, [videoId]);
    if (results.length === 0) return res.status(404).send("Video not found");

    res.render("games/roftfsbore/admin/video", { video: results[0] });
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateApprovalStatus = async (req, res) => {
  const videoId = req.params.id;
  const approved = req.body.approved === "true" ? 1 : 0;

  try {
    const query = "UPDATE roftfsbore_videos SET approved = ? WHERE id = ?";
    await pool.execute(query, [approved, videoId]);

    if (approved) {
      const videoQuery = "SELECT * FROM roftfsbore_videos WHERE id = ?";
      const [results] = await pool.execute(videoQuery, [videoId]);

      if (results.length === 0) return res.status(404).send("Video not found");

      const video = results[0];

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: video.user_email,
        subject: `No - Reply (${video.video_title} Approval Notice) Your Video has been Approved! 🥳`,
        text: `Hello ${video.user_name},\n\nYour video titled "${video.video_title}" has been approved after thorough review by our team, and is now live on the app. \n\nGet ready to receive room alerts 🎉🎉.\n\nThank you for using RTB!\n\nBest regards,\nThe RTB Team\n\nNOTE: This is an automatic message, do not reply.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Error sending email");
        }
        res.send("Approval status updated and email sent successfully");
      });
    } else {
      res.send("Approval status updated successfully");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const downloadLogs = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const query =
      "SELECT * FROM roftfsbore_logs WHERE timestamp BETWEEN ? AND ?";
    const [results] = await pool.execute(query, [startDate, endDate]);

    const logs = JSON.stringify(results, null, 2);
    const filename = `roftfsbore_logs_${startDate}_to_${endDate}.json`;

    fs.writeFileSync(`./roftfsbore_logs/${filename}`, logs);
    res.download(`./roftfsbore_logs/${filename}`);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteLogs = async (req, res) => {
  const { adminToken, startDate, endDate } = req.body;

  if (adminToken !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: "Invalid admin token" });
  }

  try {
    const countQuery = "SELECT COUNT(*) AS total FROM roftfsbore_logs";
    const [results] = await pool.execute(countQuery);

    const totalLogs = results[0].total;
    if (totalLogs < 500000) {
      return res
        .status(400)
        .json({ error: "Batch delete not allowed under 500,000 logs" });
    }

    const deleteQuery =
      "DELETE FROM roftfsbore_logs WHERE timestamp BETWEEN ? AND ?";
    await pool.execute(deleteQuery, [startDate, endDate]);
    res.send("Logs deleted successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  listVideos,
  viewVideo,
  updateApprovalStatus,
  downloadLogs,
  deleteLogs,
};
