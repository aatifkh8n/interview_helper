## REQUIREMENTS 🎯

1. ✅ User can upload a document (thesis, research paper, or some other document). *[ADDITIONAL PACKAGE USED i.e, react-pdftotext]*

2. ✅ Our app should be able to process it.

3. ✅ Our app should do questioning answering from that document only.

4. ✅ Our app should compare the user answer with that document only.

5. ✅ Upload file should be on some other link or page not in the same form.

6. ✅ Update the db schema and store the updated doc text as well in db.

7. ~~App should ask for new questions when start the same customized interview again.~~ *[CHANGED]*

8. System should capture the audio from the tab. *[REQUIRES Chrome Extension with proper permissions]*

	<span style="color: magenta;">ISSUE: Chrome extension in unable to turn on</span>

9. System should be able to capture the audio of the desktop apps. *[REQUIRES Softwares like Stereo Mix or Virtual Audio Cable for Windows and Loopback or BlackHole for macOS]*

	<span style="color: red;">VAC is a paid software</span>

	VAC docs reference: [https://vac.muzychenko.net/en/manual/main.htm](https://vac.muzychenko.net/en/manual/main.htm)

	VAC usage: [https://vac.muzychenko.net/en/usage.htm](https://vac.muzychenko.net/en/usage.htm)
10. Transcribe the english audio into the text. *[REQUIRES cloud services like Google Text-to-speech or python packages like vosk]*

## BUGS 🐛

1. ✅ Number of questions were hardcoded i.e, 5 in element QuestionSection, and page.jsx *[FIXED]*

2. ✅ When we save the answer, it automatically moves to the next question but: *[FIXED]*

	- when I click previous, it shows the previous question with no answer recorded for the previous question in the input textarea *(answer to each question should be maintained via state)*

3. ✅ Some of the questions are stored in object[index].question while some are stored in object[index].questions *[FIXED]*

4. ❗⚠ When user save the answer, and move ahead, it still allow the user the change the previous question answer. Which is updated but system also store the old answer.
	
	<span style="color: yellow;">***QF:** We can disable the Save Answer button when saved by the user. We can also show something like "Already Answered or Already Recorded" on disabled button.*</span>

5. ✅ The user-submitted interview can be start again by visiting the /interview/{id}/start explicitly. *[FIXED using redirection via useRouter hook from next/navigation]*

6. ✅ Add new column to check the interview have been completed or not? i.e., "submitted" in our case. *[FIXED]*

7. ✅ For an interview with only one single question, it was not showing the questions in the QuestionSection. *[FIXED]*

8. ✅ The Tech Stack and the Suggestions are all hardcoded. *[DONE]*
	
	- Now app is fetching tech stack and description data from the database.


---

### DOUBTS 🧐

- ✅ Previously, if user restart the same interview it will ask the same questions again. So, should I change it or not? ANSWER WAS "NO, WE MUST NOT ALLOW USER TO START THE SUBMITTED INTERVIEW AGAIN" *[AFFECTED REQ # 8]*

- ❓ If I convert the audio from one format to another on each request, it'll increase the latency of the audio transcription causing a decent delay.

---

### EXTRAS 🎁

- isNewInterviewModalOpen useState hook in app/dashboard/pages.jsx is not usable

- ✅ Explore the working/functionality of https://finalroundai.com *[Credit Card Details REQUIRED]*

- ✅ Interview Cards on the dashboard should be consistant *[DONE]*

---

### ISSUES 🚨 & POSSIBLE SOLUTIONS 💡

1. Capturing audio from a different browser tab is not possible due to browser security restrictions that prevent one tab from accessing the media or audio content of another tab.

	#### Solution 1: Browser Extension (e.g., Chrome Extension)

	- Develop a browser extension to capture audio from specific tabs in real-time.

	- The extension can send the captured audio to the backend server for further processing.

	#### Solution 2: WebRTC (for browser-based communication)

	- Use WebRTC to capture audio in real-time from a browser tab (within your own application), but this requires cooperation from the page (e.g., the audio or video stream must be exposed to WebRTC).

	- This won't work for audio from other tabs or external sites (like Zoom or Google Meet) due to cross-origin security.

2. Real-time audio capture is not possible in the browser due to browser restrictions and security limitations.

	#### Solution 1: Desktop Application (Electron-based)

	- Develop a desktop application (e.g., using Electron) that can capture system-wide audio (e.g., Zoom, Teams, Google Meet).

	- The app can send the captured audio to the backend server for further processing.

	#### Solution 2: Use Meeting Platform SDKs (Zoom, Teams, Google Meet)

	- Platforms like Zoom and Microsoft Teams provide SDKs to embed meetings in your app, but real-time audio capture is not supported via their APIs.

	- Audio can be accessed after the meeting ends via platform recording APIs.

	#### Solution 3: Third-Party Video/Audio APIs (Twilio, Agora)

	- Use third-party services like Twilio Video or Agora that allow real-time audio and video streaming.

	- These platforms give full control over the audio stream in real-time.


3. Google Chrome's extension is not working <span style="color: red;">ERROR: chrome.tabCapture.capture is not a function.</span>

4. ❗ Unable to convert the WebM audio file to wav file. It is required for the transcription via Google Cloud Speech-to-Text service.

	#### Solution 1: Use "ffmpeg/ffmpeg" library

	- ISSUE: Seems to be not working for node.js

	#### Solution 2: Use "fluent-ffmpeg" and "ffmpeg-static" libraries

	- ISSUE: It's throwing error.
		
		*error: Failed to convert WebM to WAV*
		
		*message: "Internal server error*

	- POSSIBLE REASON: The fluent-ffmpeg and ffmpeg-static are unable to locate. npm error could not determine executable to run.

	***Extra:** Converting every chunk would negatively affect the performance.*

5. ❗ Unable to invoke the event functions on audioRecorder.

6. ❗ Unable to get the recording on the server-side. Unable to parse the incoming form.




---
---

### EMOJIS

- 👷‍♂️ working...

- ✅ done

- ❓ doubts

- ❗ issue/bug

- ❗⚠ high-severity issue



---

### Atif Jamil

email: [atif.jamil@egeeksglobal.com](mailto:atif.jamil@egeeksglobal.com)