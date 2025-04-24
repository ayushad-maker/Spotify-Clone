let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItemPlay = Array.from(document.getElementsByClassName('songItemPlay'));
let songItems = Array.from(document.getElementsByClassName('songItem'));
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.dx;
        star.y += star.dy;

        if (star.x < 0 || star.x > canvas.width) star.dx = -star.dx;
        if (star.y < 0 || star.y > canvas.height) star.dy = -star.dy;
    });

    requestAnimationFrame(drawStars);
}

drawStars();


let songs = [
    { songName: "Go Down Deh", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Die With Smile", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "All The Stars", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Blue-Yung kai", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
];

songItems.forEach((element, i) => {
    element.getElementsByTagName('img')[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

const makeAllPlays = () => {
    songItemPlay.forEach((el) => {
        el.classList.remove('fa-pause-circle');
        el.classList.add('fa-play-circle');
    });
    songItems.forEach((el) => el.classList.remove('playing'));
};

const updateUIOnPlay = () => {
    makeAllPlays();
    let currentIcon = document.getElementById(songIndex.toString());
    currentIcon.classList.remove('fa-play-circle');
    currentIcon.classList.add('fa-pause-circle');
    songItems[songIndex].classList.add('playing');
    masterSongName.innerText = songs[songIndex].songName;
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
};

// Master play button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        updateUIOnPlay();
    } else {
        audioElement.pause();
        gif.style.opacity = 0;
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        makeAllPlays();
    }
});

// Progress bar
audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
});

myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// Song list play/pause
songItemPlay.forEach((element) => {
    element.addEventListener('click', (e) => {
        let clickedIndex = parseInt(e.currentTarget.id);

        if (clickedIndex === songIndex && !audioElement.paused) {
            audioElement.pause();
            gif.style.opacity = 0;
            e.target.classList.remove('fa-pause-circle');
            e.target.classList.add('fa-play-circle');
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            songItems[songIndex].classList.remove('playing');
        } else {
            songIndex = clickedIndex;
            audioElement.src = songs[songIndex].filePath;
            audioElement.currentTime = 0;
            audioElement.play();
            updateUIOnPlay();
        }
    });
});

// Next song
document.getElementById("next").addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();
    updateUIOnPlay();
});

// Previous song
document.getElementById("previous").addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();
    updateUIOnPlay();
});

audioElement.addEventListener('ended', () => {
    // Advance the index (wrap around)
    songIndex = (songIndex + 1) % songs.length;
    // Update the source, reset time, and play
    audioElement.src = songs[songIndex].filePath;
    audioElement.currentTime = 0;
    audioElement.play();
    // Update UI (icons, highlight, master button, song name, gif)
    updateUIOnPlay();
});

