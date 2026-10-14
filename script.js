async function navigateToPage(path,addHistory=true){
 const target=new URL(path,window.location.href);
 if(target.origin!==window.location.origin){window.location.assign(target.href);return;}
 try{
   const response=await fetch(target.href);
   if(!response.ok)throw new Error(`Page request failed: ${response.status}`);
   const page=new DOMParser().parseFromString(await response.text(),"text/html");
   const currentMusic=document.getElementById("musicFloat");
   const nextMusic=page.getElementById("musicFloat");
   if(!currentMusic||!nextMusic)throw new Error("The destination page is missing the music player.");
   document.body.className=page.body.className;
   const oldContent=Array.from(document.body.childNodes).filter(node=>node!==currentMusic);
   const newContent=Array.from(page.body.childNodes).filter(node=>node!==nextMusic);
   newContent.forEach(node=>document.body.insertBefore(node,currentMusic));
   oldContent.forEach(node=>node.remove());
   document.title=page.title;
   if(addHistory)history.pushState({}, "", target.href);
   window.scrollTo(0,0);
   initializePage();
 }catch(error){
   console.error("Unable to load the next story page without a full reload.",error);
   window.location.assign(target.href);
 }
}

document.addEventListener("click",event=>{
 const link=event.target.closest("a[href]");
 if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute("download"))return;
 const target=new URL(link.href,window.location.href);
 if(target.origin===window.location.origin&&target.pathname.endsWith(".html")){
   event.preventDefault();
   navigateToPage(target.href);
 }
});
window.addEventListener("popstate",()=>navigateToPage(window.location.href,false));

function initializePage(){
 const c=window.OPENWITHLOVE||{};
 const put=(key,val)=>document.querySelectorAll(`[data-${key}]`).forEach(el=>{if(val)el.textContent=val});
 put("your-name",c.yourName||"Your Name");put("partner-name",c.partnerName||"Your Favorite Person");
 const opening=c.opening||{};
 const openingKicker=document.getElementById("introKicker");
 const openingTitle=document.getElementById("introTitle");
 const openingCopy=document.getElementById("introCopy");
 const beginLabel=document.getElementById("beginLabel");
 if(openingKicker&&opening.eyebrow)openingKicker.textContent=opening.eyebrow;
 if(openingTitle){
   if(opening.titleLineOne)openingTitle.firstChild.textContent=opening.titleLineOne;
   const emphasizedTitle=openingTitle.querySelector("em");
   if(emphasizedTitle&&opening.titleLineTwo)emphasizedTitle.textContent=opening.titleLineTwo;
 }
 if(openingCopy&&opening.message)openingCopy.textContent=opening.message;
 if(beginLabel&&opening.button)beginLabel.textContent=opening.button;
 const begin=document.getElementById("beginBtn");if(begin)begin.addEventListener("click",()=>{begin.classList.add("clicked");document.body.classList.add("launching");setTimeout(()=>navigateToPage("quiz.html"),700)});
 const qList=c.quizQuestions||[], qNum=document.getElementById("questionNumber"), qTitle=document.getElementById("questionTitle"), qSub=document.getElementById("questionSub"), answers=document.getElementById("answerList"), feedback=document.getElementById("quizFeedback"), next=document.getElementById("nextQuestion"), fill=document.getElementById("progressFill");let qi=0;
 function renderQ(){if(!answers)return;const q=qList[qi]||{question:"Ready for the next chapter?",answers:["Always","Of course","Let's go"],response:"Our story is only getting started."};qNum.textContent=`QUESTION ${String(qi+1).padStart(2,"0")} / ${String(qList.length||3).padStart(2,"0")}`;qTitle.innerHTML=q.question.replace(/ours\?/i,"<em>ours?</em>");qSub.textContent="Choose the answer that feels right.";answers.innerHTML="";feedback.textContent="";next.classList.add("hidden");fill.style.width=`${((qi)/(qList.length||3))*100}%`;q.answers.forEach((a,i)=>{const b=document.createElement("button");b.className="answer-option";b.innerHTML=`<span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${a}</span><i>↗</i>`;b.addEventListener("click",()=>{[...answers.children].forEach(x=>x.classList.remove("selected"));b.classList.add("selected");feedback.textContent=q.response||"Every answer is a little part of your story. ♡";feedback.classList.add("show");next.classList.remove("hidden");fill.style.width=`${((qi+1)/(qList.length||3))*100}%`});answers.appendChild(b)})}
 if(answers){renderQ();next.addEventListener("click",()=>{qi++;if(qi>=(qList.length||3)){navigateToPage("date.html")}else renderQ()})}
 const dateCard=document.getElementById("calendarCard");if(dateCard){const d=(c.anniversaryDate||"2024-10-12").split("-");const date=new Date(`${d[0]}-${d[1]}-${d[2]}T12:00:00`);if(!isNaN(date)){document.getElementById("dateMonth").textContent=date.toLocaleString("en",{month:"long"}).toUpperCase();document.getElementById("dateDay").textContent=date.getDate();document.getElementById("dateYear").textContent=date.getFullYear()}const msg=document.getElementById("dateMessage");if(msg)msg.textContent=c.anniversaryMoment||"The beginning of a story we’ll keep choosing, one day at a time.";dateCard.addEventListener("click",()=>{dateCard.classList.add("calendar-open");document.getElementById("dateReveal").classList.remove("hidden")});document.getElementById("dateContinue").addEventListener("click",()=>navigateToPage("boxes.html"))}
 const boxes=document.querySelectorAll(".mystery-box"),boxReveal=document.getElementById("boxReveal");
 if(boxes.length){
   const title=document.getElementById("boxTitle"),text=document.getElementById("boxText"),extra=document.getElementById("boxExtra"),icon=document.getElementById("revealIcon"),eyebrow=document.getElementById("revealEyebrow"),cont=document.getElementById("boxContinue");
   const renderChoice=(kind)=>{
     extra.innerHTML="";
     boxReveal.classList.remove("hidden","box-pop");
     void boxReveal.offsetWidth;
     boxReveal.classList.add("box-pop");
     boxes.forEach(b=>{
       const active=b.dataset.box===kind;
       b.classList.toggle("chosen",active);
       b.classList.toggle("opened",active);
       b.setAttribute("aria-pressed",String(active));
     });
     const readOpened=()=>{
       try{return JSON.parse(sessionStorage.getItem("openwithlove_b7_opened_boxes")||"[]")}catch(e){return []}
     };
     const markOpened=(k)=>{
       const opened=readOpened();
       if(!opened.includes(k))opened.push(k);
       try{sessionStorage.setItem("openwithlove_b7_opened_boxes",JSON.stringify(opened))}catch(e){}
       return opened;
     };
     const updateContinue=()=>{
       const opened=readOpened();
       const allOpened=["memory","date","letter"].every(k=>opened.includes(k));
       cont.classList.toggle("hidden",!allOpened);
       cont.textContent="Continue our story ↗";
       cont.disabled=!allOpened;
       cont.onclick=()=>{if(allOpened)navigateToPage("promises.html")};
       return allOpened;
     };
     // Memory and Adventure are opened when selected. The Love Note counts only when its envelope is opened.
     if(kind!=="letter")markOpened(kind);
     updateContinue();

     if(kind==="memory"){
       icon.textContent="♡";
       eyebrow.textContent="YOUR MEMORY CAPSULE";
       title.textContent=c.memoryTitle||"One moment I'd keep forever";
       text.textContent=c.memoryReveal||"It isn't always the grand moments. It's the little, ordinary moment that became precious because we were together.";
       const card=document.createElement("div");
       card.className="memory-polaroid";
       const gallery=document.createElement("div");
       gallery.className="memory-photo-gallery";
       (Array.isArray(c.photos)?c.photos:[]).forEach(photo=>{
         const src=typeof photo==="string"?photo:photo&&photo.src;
         if(!src)return;
         const caption=typeof photo==="object"&&photo.caption?photo.caption:"A favorite memory";
         const figure=document.createElement("figure");
         figure.className="memory-photo";
         const image=document.createElement("img");
         image.src=src;
         image.alt=caption;
         image.loading="lazy";
         const label=document.createElement("figcaption");
         label.textContent=caption;
         figure.append(image,label);
         gallery.appendChild(figure);
       });
       if(gallery.childElementCount)card.appendChild(gallery);
       const caption=document.createElement("p");
       caption.textContent=c.memoryPhotoCaption||"Some moments become home.";
       card.appendChild(caption);
       extra.appendChild(card);
       const reveal=document.createElement("button");
       reveal.className="glow-button";
       reveal.textContent="Tap to keep this memory ♡";
       reveal.onclick=()=>{
         card.classList.toggle("memory-kept");
         reveal.textContent=card.classList.contains("memory-kept")?"Kept safe in my heart ♥":"Tap to keep this memory ♡";
         if(card.classList.contains("memory-kept")) text.textContent=c.memoryKeepsakeMessage||"No matter how much time passes, this little piece of our story will always be worth keeping.";
       };
       extra.appendChild(reveal);
     } else if(kind==="date"){
       icon.textContent="✦";
       eyebrow.textContent="A LITTLE DATE-NIGHT GAME";
       title.textContent="Plan our next favorite memory";
       text.textContent="Choose the evening that sounds most like us. Your choice becomes our tiny invitation.";
       const opts=Array.isArray(c.dateIdeas)&&c.dateIdeas.length
         ?c.dateIdeas.map(idea=>[idea.emoji||"♡",idea.title||"A date together",idea.description||"A little time just for us."])
         :[["🌅","Golden-hour date","A sunset walk, favorite snacks, and no rush to go home."],["🎬","Cozy-night date","A comfort movie, warm blankets, and phones tucked away."],["✨","Surprise-me date","Dress up, pick a new place, and let the night surprise us."]];
       let selected=null;
       const plan=document.createElement("div");plan.className="date-plan";
       opts.forEach(([emoji,label,detail])=>{
         const b=document.createElement("button");
         b.className="date-choice";
         b.innerHTML=`<span class="date-choice-emoji">${emoji}</span><span><strong>${label}</strong><small>${detail}</small></span><span class="date-check">♡</span>`;
         b.onclick=()=>{
           selected={label,detail};
           plan.querySelectorAll(".date-choice").forEach(x=>x.classList.remove("selected"));
           b.classList.add("selected");
           text.textContent=`It's a date ♡ ${detail}`;
           try{sessionStorage.setItem("openwithlove_b7_date",JSON.stringify(selected));}catch(e){}
           text.textContent=`It's a date ♡ ${detail}`;
           updateContinue();
         };
         plan.appendChild(b);
       });
       extra.appendChild(plan);
     } else if(kind==="letter"){
       icon.textContent="💌";
       eyebrow.textContent="A NOTE ONLY YOU SHOULD OPEN";
       const loveLetter=c.loveLetter||{};
       title.textContent=loveLetter.title||"A little letter, sealed with love";
       text.textContent=loveLetter.prompt||"Touch the heart seal. There's something I want you to remember.";
       const env=document.createElement("button");
       env.className="mini-envelope";
       env.setAttribute("aria-label","Open your love letter");
       env.innerHTML='<span class="mini-flap"></span><span class="mini-seal">♡</span><span class="mini-letter"></span>';
       env.querySelector(".mini-letter").textContent=loveLetter.message||"You are my favorite part of the story. Today, tomorrow, and all the little days between. ♡";
       const note=document.createElement("p");note.className="letter-after hidden";note.textContent=loveLetter.afterMessage||"If you ever forget how loved you are, come back to this little note. My heart is cheering for you in every season. ♡";
       env.onclick=()=>{
         const opened=env.classList.toggle("opened");
         note.classList.toggle("hidden",!opened);
         text.textContent=opened?"The seal is open. Take your time with these words. ♡":"Touch the heart seal. There's something I want you to remember.";
         if(opened)markOpened("letter");
         updateContinue();
       };
       extra.appendChild(env);extra.appendChild(note);
     }
   };
   boxes.forEach(b=>b.addEventListener("click",()=>renderChoice(b.dataset.box)));
 }
 const jar=document.getElementById("jarButton"),promiseText=document.getElementById("promiseText"),promiseCount=document.getElementById("promiseCount");let pi=0;const promises=c.promises||["I promise to keep making memories with you."];function setPromise(){if(!promiseText)return;promiseText.classList.remove("pop-in");void promiseText.offsetWidth;promiseText.textContent=promises[pi%promises.length];promiseCount.textContent=`PROMISE ${String(pi+1).padStart(2,"0")}`;promiseText.classList.add("pop-in");if(jar){jar.classList.remove("shake");void jar.offsetWidth;jar.classList.add("shake")}}if(jar){setPromise();jar.addEventListener("click",()=>{pi=(pi+1)%promises.length;setPromise()});document.getElementById("anotherPromise").addEventListener("click",()=>{pi=(pi+1)%promises.length;setPromise()});document.getElementById("finishPromises").addEventListener("click",()=>navigateToPage("final.html"))}
 const fm=document.getElementById("finalMessage");if(fm&&c.finalMessage)fm.textContent=c.finalMessage;
 const sf=document.querySelector(".final-particles");if(sf){for(let i=0;i<28;i++){const s=document.createElement("span");s.textContent=i%3===0?"♡":"✦";s.style.left=(Math.random()*100)+"%";s.style.animationDelay=(Math.random()*8)+"s";s.style.animationDuration=(8+Math.random()*10)+"s";sf.appendChild(s)}}


 const reviewButton=document.getElementById("finalReviewButton");
 if(reviewButton)reviewButton.addEventListener("click",()=>navigateToPage("index.html"));
 const closeButton=document.getElementById("finalCloseButton");
 const closeMessage=document.getElementById("finalCloseMessage");
 if(closeButton)closeButton.addEventListener("click",()=>{
   // Browsers only permit scripts to close tabs opened by script. Try, then show a fallback if still open.
   window.close();
   setTimeout(()=>{
     if(!window.closed && closeMessage)closeMessage.classList.remove("hidden");
   },150);
 });


 // Minimal bottom-right music button. Add the audio file through config.js, not on-screen controls.
 const musicAudio=document.getElementById("musicFloatAudio");
 const musicButton=document.getElementById("musicFloatButton");
 if(musicAudio&&musicButton&&!musicButton.dataset.initialized){
   musicButton.dataset.initialized="true";
   const musicEnabledKey="openwithlove_b7_music_enabled";
   const musicPositionKey="openwithlove_b7_music_position";
   const configuredSong=(c.musicFile||"").trim();
   const configuredTitle=(c.musicTitle||"Our song").trim();
   musicAudio.loop=true;
   if(configuredSong)musicAudio.src=configuredSong;
   const setMusicButton=(isPlaying)=>{
     musicButton.classList.toggle("is-playing",isPlaying);
     musicButton.textContent=isPlaying?"Ⅱ":"♫";
     musicButton.title=isPlaying?`Pause ${configuredTitle}`:`Play ${configuredTitle}`;
     musicButton.setAttribute("aria-label",isPlaying?`Pause ${configuredTitle}`:`Play ${configuredTitle}`);
   };
   const saveMusicState=(enabled)=>{
     try{
       sessionStorage.setItem(musicEnabledKey,String(enabled));
       sessionStorage.setItem(musicPositionKey,String(musicAudio.currentTime));
     }catch(e){
       musicButton.title="Music will not continue across pages in this browser";
     }
   };
   let resumeMusic=false,savedPosition=0;
   if(configuredSong){
     try{
       resumeMusic=sessionStorage.getItem(musicEnabledKey)==="true";
       const storedPosition=Number(sessionStorage.getItem(musicPositionKey));
       if(Number.isFinite(storedPosition)&&storedPosition>0)savedPosition=storedPosition;
     }catch(e){
       musicButton.title="Music will not continue across pages in this browser";
     }
   }
   if(resumeMusic){
     musicAudio.addEventListener("loadedmetadata",async()=>{
       if(savedPosition>0){
         await new Promise(resolve=>{
           const finishSeeking=()=>resolve();
           musicAudio.addEventListener("seeked",finishSeeking,{once:true});
           musicAudio.currentTime=savedPosition;
           if(!musicAudio.seeking){
             musicAudio.removeEventListener("seeked",finishSeeking);
             resolve();
           }
         });
       }
       musicAudio.play().then(()=>setMusicButton(true)).catch(()=>{
         saveMusicState(false);
         musicButton.title="Tap to play music";
         musicButton.setAttribute("aria-label","Play music");
       });
     },{once:true});
     musicAudio.load();
   }
   window.addEventListener("pagehide",()=>{
     try{
       if(sessionStorage.getItem(musicEnabledKey)==="true")sessionStorage.setItem(musicPositionKey,String(musicAudio.currentTime));
     }catch(e){
       musicButton.title="Music will not continue across pages in this browser";
     }
   });
   musicButton.addEventListener("click",async()=>{
     if(!musicAudio.src){musicButton.title="Add a song path in config.js";musicButton.setAttribute("aria-label","No song configured");return;}
     if(musicAudio.paused){
       try{
         await musicAudio.play();
         saveMusicState(true);
         setMusicButton(true);
       }catch(e){
         musicButton.title="Check the musicFile path in config.js";
         musicButton.setAttribute("aria-label","Music file unavailable");
       }
     }else{
       musicAudio.pause();
       saveMusicState(false);
       setMusicButton(false);
     }
   });
 }
}
document.addEventListener("DOMContentLoaded",initializePage,{once:true});