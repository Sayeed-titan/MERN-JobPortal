const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/jobportal"; // 🔹 update DB name

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const notificationSchema = new mongoose.Schema({}, { strict: false });
const Notification = mongoose.model("Notification", notificationSchema, "notifications");

async function migrate() {
  try {
    const docs = await Notification.find({});

    for (const doc of docs) {
      const update = {};

      // Rename `user` → `userId`
      if (doc.user && !doc.userId) {
        update.userId = doc.user;
      }

      // Rename `read` → `isRead`
      if (typeof doc.read !== "undefined" && typeof doc.isRead === "undefined") {
        update.isRead = doc.read;
      }

      // Add default message if missing
      if (!doc.message) {
        update.message = "Notification";
      }

      // Apply updates if any
      if (Object.keys(update).length > 0) {
        await Notification.updateOne({ _id: doc._id }, { $set: update, $unset: { user: "", read: "" } });
        console.log(`🔄 Fixed notification: ${doc._id}`);
      }
    }

    console.log("✅ Migration complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
