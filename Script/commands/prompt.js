const axios = require("axios");

module.exports.config = {
  name: "prompt",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Generate precise prompt from replied image",
  commandCategory: "ai",
  usages: "[reply image]",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!event.messageReply || !event.messageReply.attachments) {
      return api.sendMessage("Please reply to a photo.....", event.threadID, event.messageID);
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") {
      return api.sendMessage("Please reply to a photo.....", event.threadID, event.messageID);
    }

    const imgURL = attachment.url;
    const guideText =
      "Create a short but extremely precise prompt that can recreate this image exactly. Describe only what is visible: subject, face, body, pose, clothing, background, lighting, colors, environment, mood, camera angle, and important visual details. No creativity. No assumptions.";
    const imgBuffer = await axios.get(imgURL, { responseType: "arraybuffer" });
    const base64 = Buffer.from(imgBuffer.data).toString("base64");

    const res = await axios.post("http://51.75.118.79:20045/prompt", {
      image: base64
    });

    const output = res.data?.output || "No prompt generated.";

    return api.sendMessage(output, event.threadID, event.messageID);

  } catch (err) {
    return api.sendMessage(
      "API Error চাঁদের পাহাড় 😹: " + err.message,
      event.threadID,
      event.messageID
    );
  }
};
