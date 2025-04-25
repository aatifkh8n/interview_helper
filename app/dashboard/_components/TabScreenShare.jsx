import React, { useState, useEffect } from "react";
import { ScreenShare } from "lucide-react";

import {
  transcribeAudio,
  generateResponse,
  detectSilence,
} from "@/utils/process-audio";

const TabScreenShare = React.memo(
<<<<<<< HEAD
  ({ setIsPlaying, setConversation, interview }) => {
=======
  ({ setIsPlaying, setConversation, mockInterview }) => {
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    let chunks = [];
    let blobArr = [];
    const MIN_SILENCE_DURATION_SECONDS = 1.5; // Define minimum silence duration

    // Renamed function to clarify its role with silence detection
    const handleAndTranscribeIfSilent = async () => {
      if (chunks.length === 0) {
        console.log("handleAndTranscribeIfSilent called with no chunks.");
        return;
      }

      // Create blob from current chunks
      const blob = new Blob(chunks, { type: "audio/webm" });
      // Clear chunks immediately for the next recording cycle
      chunks = [];

      if (blob.size < 300) {
        // Basic check before intensive detection
        console.log(
          "Blob too small, skipping silence detection and transcription."
        );
        return;
      }

      console.log(
        `Checking blob (size: ${blob.size}) for ${MIN_SILENCE_DURATION_SECONDS}s silence...`
      );
      const hasRequiredSilence = await detectSilence(
        blob,
        MIN_SILENCE_DURATION_SECONDS
      );

      if (hasRequiredSilence) {
        console.log("Silence detected! Proceeding with transcription.");

        blobArr.push(blob);
        const newBlob = new Blob(blobArr, { type: "audio/webm" });
        blobArr = [];

        let text = "";
        text = await transcribeAudio(newBlob);

        if (!text) {
          console.log("Transcription failed or returned no text.");
          return;
        }
        console.log("Transcribed text: ", text);

        const response = await generateResponse(text, {
<<<<<<< HEAD
          fileText: interview?.jobInterview?.fileText,
          jobPosition: interview?.jobInterview?.position,
          jobDesc: interview?.jobInterview?.description,
=======
          fileText: mockInterview?.fileText,
          jobPosition: mockInterview?.jobPosition,
          jobDesc: mockInterview?.jobDesc,
>>>>>>> 472314dfa9823bd34ef56789713ef3b6c45cd9bd
        });
        if (!response) {
          console.error("Failed to generate response.");
          blobArr.push(newBlob);
          return;
        }
        console.log("Generated response: ", response);

        setConversation((prev) => [
          { type: "question", text },
          { type: "answer", text: response },
          ...prev,
        ]);
      } else {
        console.log(
          `Silence less than ${MIN_SILENCE_DURATION_SECONDS}s detected. Discarding audio chunk.`
        );
        blobArr.push(blob);
        // Audio chunk is discarded as `chunks` was already cleared.
      }
    };

    // Function to start sharing a tab
    const shareTab = async () => {
      try {
        let mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        console.log("mediaStream: ", mediaStream);

        let audioStream = new MediaStream(mediaStream.getAudioTracks());
        if (mediaStream.getAudioTracks().length <= 0) {
          console.error("no audio tracks found");
          return;
        }

        let audioRecorder = new MediaRecorder(audioStream, {
          mimeType: "audio/webm; codecs=opus",
        });
        console.log("audioRecorder: ", audioRecorder);

        // Interval to stop recording, triggering ondataavailable
        const processInterval = setInterval(() => {
          if (audioRecorder.state === "recording") {
            console.log("Interval: Stopping recorder to process chunk...");
            audioRecorder.stop();
          } else {
            console.log("Interval: Recorder not recording, skipping stop.");
          }
        }, MIN_SILENCE_DURATION_SECONDS * 1000); // Stop every 5 seconds

        audioRecorder.ondataavailable = (e) => {
          console.log(`Audio data available (size: ${e.data.size})`);
          if (e.data.size > 0) {
            chunks.push(e.data);
            // Call the handler function which now includes silence detection
          } else {
            console.log("Received empty data chunk.");
          }
        };

        // Restart recording after it stops, if the stream is still active
        audioRecorder.onstop = () => {
          console.log("Recorder stopped.");
          // Check if the main media stream is still active before restarting
          handleAndTranscribeIfSilent();
          if (mediaStream.active) {
            console.log("Restarting recorder...");
            audioRecorder.start();
          } else {
            console.log("Media stream inactive, not restarting recorder.");
          }
        };

        audioRecorder.onerror = (error) => {
          console.error("Error with AudioRecorder:", error);
          clearInterval(processInterval); // Stop interval on error
        };

        // Start the first recording
        console.log("Starting initial recording...");
        audioRecorder.start();

        let mediaRecorder = new MediaRecorder(mediaStream, {
          mimeType: "video/webm",
        });
        console.log("mediaRecorder: ", mediaRecorder);
        setIsPlaying(true);
        setError("");
        mediaRecorder.ondataavailable = (e) => {
          console.log("mediaRecorder data available: ", e.data);
        };
        mediaRecorder.onerror = (error) => {
          console.error("Error with MediaRecorder:", error);
        };
        mediaRecorder.onstop = () => {
          console.log("stopping the video mediaRecorder");
          // Ensure audio stops if video stops first
          if (audioRecorder.state === "recording") {
            audioRecorder.stop();
          }
        };

        mediaStream.oninactive = async () => {
          console.log("Media stream became inactive.");
          clearInterval(processInterval);
          if (audioRecorder.state === "recording") {
            console.log("Stopping final audio recording...");
            audioRecorder.stop(); // Allow final ondataavailable to fire if needed
          } else if (chunks.length > 0) {
            // Process any chunks remaining if stopped right before inactive
            console.log("Processing remaining chunks on inactive stream...");
            await handleAndTranscribeIfSilent();
          }

          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
          setStream(null);
          setIsPlaying(false);
          console.log("Cleanup complete.");
        };

        setStream(mediaStream);
      } catch (err) {
        setError("Error sharing the tab: " + err.message);
        console.error("Error in shareTab:", err);
      }
    };

    useEffect(() => {
      return () => {
        if (stream) {
          console.log("Component unmounting, stopping tracks.");
          stream.getTracks().forEach((track) => track.stop());
        }
      };
    }, [stream]);

    return (
      <div>
        {stream ? (
          <video
            autoPlay
            playsInline
            muted
            className="border rounded-lg"
            style={{ width: "100%", height: "auto", border: "1px solid #000" }}
            ref={(videoElement) => {
              if (videoElement && stream) {
                videoElement.srcObject = stream;
              }
            }}
          />
        ) : (
          <>
            <ScreenShare
              className="h-72 border rounded-lg w-full p-20 bg-secondary cursor-pointer hover:bg-gray-50"
              onClick={shareTab}
            />
          </>
        )}

        {/* Button to trigger screen share */}
        {/* <Button variant="outline" onClick={shareTab}>Share a Tab</Button> */}

        {/* Show error if any */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </div>
    );
  }
);

export default TabScreenShare;
