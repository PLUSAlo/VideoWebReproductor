const principalVideo = document.querySelector('#mainVideo');
const playList = document.getElementById('playList');
const All__videos = document.querySelector('.All__videos');
const videoTitulo = document.querySelector('.titulo');
const video_players = document.querySelectorAll(".videoPlayer");
const captureImageButton = document.getElementById('captureImage');
const prevVideoButton = document.getElementById('prevVideo');
const nextVideoButton = document.getElementById('nextVideo');

let lastVolume = 0.5; 
const muteButton = document.getElementById('muteButton');
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const volumeUpButton = document.getElementById('volumeUpButton');
const volumeControl = document.getElementById('volumeControl');
const volumeSlider = document.getElementById('volumeSlider');
const speedUpButton = document.getElementById('speedUpButton');
const speedDownButton = document.getElementById('speedDownButton');
const sizeUpButton = document.getElementById('sizeUpButton');
const sizeDownButton = document.getElementById('sizeDownButton');
const subtitlesButton = document.getElementById('subtitlesButton');
const seekBar = document.getElementById('seekBar');

// muteButton.addEventListener('click', () => {
// });
//  seekBar.value = '0';

muteButton.addEventListener('click', () => {
   if (volumeSlider.value === '0') {
       volumeSlider.value = lastVolume;
   } else {
       lastVolume = volumeSlider.value;
       volumeSlider.value = '0';
   }
   principalVideo.muted = !principalVideo.muted;
});


playButton.addEventListener('click', () => {
    principalVideo.play();
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
});

pauseButton.addEventListener('click', () => {
    principalVideo.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'inline-block';
});

volumeUpButton.addEventListener('click', () => {
   volumeControl.style.display = volumeControl.style.display === 'none' ? 'block' : 'none';
});

volumeSlider.addEventListener('input', () => {
   lastVolume = volumeSlider.value;
   principalVideo.volume = volumeSlider.value;
});

speedUpButton.addEventListener('click', () => {
   principalVideo.playbackRate += 0.1;
});

speedDownButton.addEventListener('click', () => {
   principalVideo.playbackRate -= 0.1;
});

sizeUpButton.addEventListener('click', () => {
   if (principalVideo.requestFullscreen) {
       principalVideo.requestFullscreen();
   } else if (principalVideo.mozRequestFullScreen) { // Firefox
       principalVideo.mozRequestFullScreen();
   } else if (principalVideo.webkitRequestFullscreen) { // Chrome, Safari, Edge
       principalVideo.webkitRequestFullscreen();
   }
});

sizeDownButton.addEventListener('click', () => {
   principalVideo.width -= 100;
});

principalVideo.addEventListener('loadedmetadata', () => {
   seekBar.value = '0';
});

seekBar.addEventListener('change', () => {
   let time = principalVideo.duration * (seekBar.value / 100);
   principalVideo.currentTime = time;
});

principalVideo.addEventListener('timeupdate', () => {
   let value = (100 / principalVideo.duration) * principalVideo.currentTime;
   seekBar.value = value;
});


const ulTag = document.querySelector("ul");
All__videos.innerHTML = `Lista de Reproducción`


let videoIndice = 1;
window.addEventListener('load',()=>{
   cargarVideo(videoIndice);
   reproducirNow();
})


for(let i = 0; i < allVideos.length; i++){
   let liTag = `<li li-index="${i + 1}">
      <div class="row">
         <span>${i + 1}. ${allVideos[i].name}</span>
      </div>
      <video class="${allVideos[i].id}" src="${allVideos[i].src}.mp4" style="display: none;" title="${allVideos[i].name}"></video>
      <span id="${allVideos[i].id}" class="duration"></span>
   </li>`;
   playList.insertAdjacentHTML('beforeend',liTag); 

   let liVideoDuration = ulTag.querySelector(`#${allVideos[i].id}`)
   let liVideoTag = ulTag.querySelector(`.${allVideos[i].id}`);
   

   liVideoTag.addEventListener("loadeddata", ()=>{
      let videoDuration = liVideoTag.duration;
      let totalMin = Math.floor(videoDuration / 60);
      let totalSec = Math.floor(videoDuration % 60);
      totalSec < 10 ? totalSec = "0"+ totalSec : totalSec
      liVideoDuration.innerText = `${totalMin}:${totalSec}`;
      liVideoDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
   })  
}
const allLiTags = playList.querySelectorAll('li');

function playVideo(){
    principalVideo.play();
    playList.classList.add('active')
    playButton.style.display = 'none';
    pauseButton.style.display = 'inline-block';
 }

 function cargarVideo(indexNumb){
    principalVideo.src = `${allVideos[indexNumb - 1].src}.mp4`;
    let trackElement = principalVideo.querySelector('track');
    trackElement.src = allVideos[indexNumb - 1].subtitles;
    videoTitulo.innerHTML = `${allVideos[indexNumb - 1].name}`
    seekBar.value = '0';       
    pauseButton.style.display = 'none';
    playButton.style.display = 'inline-block';         
    principalVideo.textTracks[0].mode = 'hidden';
 }

function reproducirNow(){
   for(let j = 0; j<allVideos.length; j++){
      if(allLiTags[j].classList.contains('playing')){
         allLiTags[j].classList.remove("playing")
      }
      if(allLiTags[j].getAttribute('li-index')==videoIndice){
         allLiTags[j].classList.add('playing')
      }
      allLiTags[j].setAttribute("onclick", "clicked(this)")
   }   
}

prevVideoButton.addEventListener('click', () => {
   videoIndice--;
   if(videoIndice < 1) { 
       videoIndice = allVideos.length;
   }
   cargarVideo(videoIndice);
   playVideo();
   reproducirNow();      
});

nextVideoButton.addEventListener('click', () => {
   videoIndice++;
   if(videoIndice > allVideos.length) {
       videoIndice = 1;
   }
   cargarVideo(videoIndice);
   playVideo();
   reproducirNow();   
});


captureImageButton.addEventListener('click', (event) => {
   event.preventDefault();
   let canvas = document.createElement('canvas');
   canvas.width = principalVideo.videoWidth;
   canvas.height = principalVideo.videoHeight;
   let ctx = canvas.getContext('2d');
   ctx.drawImage(principalVideo, 0, 0, canvas.width, canvas.height);
   let imageUrl = canvas.toDataURL();
   let link = document.createElement('a');
   link.href = imageUrl;
   link.download = 'captura.png';
   link.click();
});


function clicked(element){
   let getIndex = element.getAttribute("li-index");
   videoIndice = getIndex;
   cargarVideo(videoIndice);
   playVideo();
   reproducirNow();
}


let customControls = document.getElementById('customControls');
let customControls2 = document.getElementById('customControls2');

principalVideo.addEventListener('mouseenter', () => {
   if (!principalVideo.paused) {
       customControls.style.display = 'block';
       customControls2.style.display = 'block';
   }
});

principalVideo.addEventListener('mouseleave', () => {
   if (!principalVideo.paused) {
       customControls.style.display = 'none';
       customControls2.style.display = 'none';
   }
});

principalVideo.addEventListener('play', () => {
   if (!principalVideo.parentElement.querySelector(':hover')) {
       customControls.style.display = 'none';
       customControls2.style.display = 'none';
   }
});

principalVideo.addEventListener('pause', () => {
   customControls.style.display = 'block';
   customControls2.style.display = 'block';
});

customControls.addEventListener('mouseenter', (event) => {
   event.stopPropagation();
   customControls.style.display = 'block';
   customControls2.style.display = 'block';
});

customControls.addEventListener('mouseleave', (event) => {
   event.stopPropagation();
   if (!principalVideo.paused) {
       customControls.style.display = 'none';
       customControls2.style.display = 'none';
   }
});
customControls.addEventListener('mouseenter', (event) => {
   event.stopPropagation();
   customControls.style.display = 'block';
   customControls2.style.display = 'block';
});

customControls.addEventListener('mouseleave', (event) => {
   event.stopPropagation();
   if (!principalVideo.paused) {
       customControls.style.display = 'none';
       customControls2.style.display = 'none';
   }
});

customControls2.addEventListener('mouseenter', (event) => {
   event.stopPropagation();
   customControls.style.display = 'block';
   customControls2.style.display = 'block';
});

customControls2.addEventListener('mouseleave', (event) => {
   event.stopPropagation();
   if (!principalVideo.paused) {
       customControls.style.display = 'none';
       customControls2.style.display = 'none';
   }
});

subtitlesButton.addEventListener('click', () => {
   // Verifica si los subtítulos están activados o desactivados
   if (principalVideo.textTracks[0].mode === 'showing') {
       // Si están activados, desactívalos
       principalVideo.textTracks[0].mode = 'hidden';
   } else {
       // Si están desactivados, actívalos
       principalVideo.textTracks[0].mode = 'showing';
   }
});