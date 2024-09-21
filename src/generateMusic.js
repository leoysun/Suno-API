const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Replace with your actual base URL
const baseUrl = "http://localhost:3000";

async function generateMusic() {
  const url = `${baseUrl}/api/generate`;
  const payload = {
    prompt: "A relaxing instrumental piece with soft piano and strings.",
    make_instrumental: false,
    wait_audio: true,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    
    console.log("Generated Music Data:", response.data);

    // Check if the audio URL is available
    if (response.data.audio_url) {
      const audioUrl = response.data.audio_url;
      const audioResponse = await axios.get(audioUrl, { responseType: "stream" });

      // Define the path where you want to save the file
      const filePath = path.join(__dirname, "generated_music.mp3");

      // Create a write stream and pipe the audio response to it
      const writer = fs.createWriteStream(filePath);
      audioResponse.data.pipe(writer);

      writer.on("finish", () => {
        console.log(`Audio downloaded successfully to ${filePath}`);
      });

      writer.on("error", (error) => {
        console.error("Error writing file:", error);
      });
    } else {
      console.error("No audio URL found in the response.");
    }
  } catch (error) {
    console.error("Error generating music:", error);
  }
}

generateMusic();
