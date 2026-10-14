OPENWITHLOVE — B7: THE ANNIVERSARY EXPERIENCE
An original, cinematic, interactive anniversary template with a distinct flow (not the standard wish → photos → letter sequence).

FLOW
index.html → quiz.html → date.html → boxes.html → promises.html → final.html

FEATURES
• Animated lock and glowing intro
• Three interactive relationship-question cards
• Anniversary calendar/date reveal
• Three selectable mystery gift boxes with different reveals
• Animated promise jar with customizable promises
• Cinematic final screen with orbiting heart, floating particles and replay link
• Responsive design for mobile and desktop

CUSTOMIZATION
Edit config.js for each order. It contains the names, opening text, date and date message, music path/title, photo list and captions, memory text, quiz questions, date-night ideas, envelope letter, promises, and final message.
- The supplied music is assets/music/our-song.mp3; it is already selected in config.js. Use music you have permission to publish.
- The supplied photos are assets/photos/couple-01.jpg through couple-13.jpg; they are already listed in config.js. Replace a photo or edit its caption in the photos array.
- Keep asset paths relative to this folder. Add replacement files to assets/music or assets/photos and update their paths in config.js.
- Enter anniversaryDate as YYYY-MM-DD. The visitor starts playback with the music button because browsers block autoplay.
- Make a copy of the project folder for each customer and edit that copy's config.js.

HOW TO TEST
To test locally, open PowerShell in this folder and run:
  py -m http.server 8000 --bind 127.0.0.1
Then visit http://127.0.0.1:8000/ in your browser and click through every screen. Keep the server running while testing. Do not open index.html directly: file:// pages cannot use the seamless page transitions, so each page change reloads the audio. You can also deploy the folder to a static host. For production, test on a phone too.

NOTES
Use customer photos, names, dates, and personal messages only with the customer's permission. Files published on a public static host may be accessible to anyone with the link.

BOX INTERACTIONS UPDATE
Each of the three boxes now has a distinct experience: Memory (save a sweet thought), Adventure (choose a date-night idea), and Love Note (open an animated mini-envelope). Customize the memory message with memoryReveal in config.js.


B7 v3 BOX INTERACTIONS
- A Memory: animated memory capsule/polaroid and a keep-in-heart action.
- An Adventure: choose one of three date ideas; the chosen idea updates the invitation and is saved for the next step during the current browser session.
- A Love Note: tap the heart seal to open the animated envelope and reveal a second note.
Each box uses its own dedicated branch and UI content in script.js.

B7 v4 ADDITIONS
- On the Three Little Worlds page, visitors must open all three gifts before Continue our story becomes available. The Adventure choice saves its selected date idea for the current tab session.
- A floating music dock is available on every page. Add a licensed song as assets/our-song.mp3, or visitors can use Add song to choose a local audio file in their browser. Sound requires a tap because browsers block autoplay. A visitor-selected local file is for that browser session only; for a public customer page, include the chosen song file in the project and set musicFile in config.js.
- Final page includes Review our little surprises (returns to the gift choices) and Close this window. Browsers only allow window.close() for tabs opened by script, so if the browser blocks it, an explanatory note appears and the visitor can close the tab manually.

B7 v5 VISIBILITY FIX
- Music controls are included directly in every page's HTML and appear as a visible fixed bar at the bottom. Tap Add song to choose an audio file, or configure musicFile in config.js and include that song file with the website.
- The final page has visible Review our surprises and Close this window buttons directly in final.html.
- Browsers may block window.close(); a note appears if the visitor needs to close the tab manually.

B7 v6 FINAL PAGE LAYOUT FIX
- Final page now scrolls vertically instead of clipping content at normal zoom. The review and close buttons are in the normal document flow beneath the final message.
- The music bar is fixed at the bottom with a higher stacking order; it includes Play/Pause and Add song.

B7 v7 UI correction: Music controls are a compact floating widget at the bottom-right, with Play/Pause and Add song. Final page contains only one Review our surprises button and one Close this window button. For hosted music, include the audio file and set musicFile in config.js.

B7 v8 MUSIC UI
- There is only one round music play/pause button at the bottom-right of each page. No visible Add Song option is shown.
- To add a song to the published website, put a song file you have permission to use inside the project folder (for example assets/our-song.mp3) and set musicFile: "assets/our-song.mp3" in config.js.
- The button shows a music note when paused and a pause icon when playing.

B7 v9 FINAL BUTTONS
- Review surprise returns to index.html, the true starting screen.

B7 v10 MUSIC PLAYBACK
- Music loops while enabled and stays on the same audio player as visitors move between story pages, avoiding a restart or volume dip. Press the music button again to stop it.
- Serve the project from a website or local web server for seamless page transitions. Opening HTML files directly reloads the page on each transition, which interrupts and restarts the audio.
- Browser autoplay restrictions may require visitors to tap the music button to start playback.
- Close this tab calls window.close(). Browsers generally only allow a page to close a tab that was opened by script. If this page was opened directly from a file or by the user, the browser may block closing; the page then shows a note explaining that the tab must be closed manually.

B7 v10 GIFT FLOW
- Continue our story appears below the gift reveal only after A Memory, An Adventure, and the Love Note envelope have all been opened.
- The Love Note counts as opened when the visitor taps the envelope seal, so the Continue button appears below the final letter content.
- Continue our story advances to promises.html.
