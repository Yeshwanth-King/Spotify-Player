let temp = 1;
let playBut = document.querySelector(".playbut");
let currentSong = new Audio();
let songs;
let currFolder = "RepeatSongs";
let cardContainer = document.querySelector(".card-container");
function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const displayAlbum = async () => {
  let a = await fetch(`/Songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let acs = div.getElementsByTagName("a");
  let array = Array.from(acs);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/Songs/")) {
      let folderName = e.href.split("/Songs/")[1];
      console.log(folderName);
      let a = await fetch(`/Songs/${folderName}/info.json`);
      let response = await a.json();
      console.log(response.title);
      cardContainer.innerHTML += `
      <div data-folder="${folderName}" class="card mg-1">
      <div class="play">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
          width="40"
          height="40"
          fill="none"
        >
          <!-- Green Circle -->
          <circle cx="20" cy="20" r="18" fill="#00FF00" />

          <!-- Original SVG Path -->
          <g transform="translate(9 9)">
            <path
              d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </div>
      <img src="/Songs/${folderName}/cover.jpg" alt="" class="rounded"/>
      <h2>${response.title}</h2>
      <p>${response.discription}</p>
    </div>
      `;
    }
  }

  Array.from(document.querySelectorAll(".card")).forEach((e) => {
    e.addEventListener("click", async (event) => {
      songs = await getSong(event.currentTarget.dataset.folder);
    });
  });
};

const playNextSong = () => {
  currentSong.pause();
  let inde = songs.indexOf(currentSong.src);
  if (inde < songs.length - 1) {
    playAudio(
      songs[inde + 1].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
    );
  } else if (inde == songs.length - 1) {
    playAudio(
      songs[0].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
    );
  }
};

const playAudio = (track, pause = false) => {
  currentSong.src = `/Songs/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    playBut.src = "Svgs/pause.svg";
  }
  document.querySelector(".song-info").innerHTML = track.split(".mp3")[0];
  document.querySelector(".act-time").innerHTML = "00:00/00:00";
};
let getSong = async (folder) => {
  currFolder = folder;
  document.querySelector(".songul").innerHTML = "";
  let a = await fetch(`/Songs/${currFolder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let ac = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < ac.length; index++) {
    const element = ac[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  let songli = document.querySelector(".songul");
  for (let key in songs) {
    songli.innerHTML += `
    <li>
    <img class="invert" src="Svgs/music.svg" alt="" />
    <div class = "info">
    <div>
      ${
        songs[key]
          .split(`/Songs/${currFolder}/`)[1]
          .replaceAll("%20", " ")
          .split(".mp3")[0]
      }
      </div>
      </div>
      <img
        class="invert"
        src="Svgs/play.svg"
        style="cursor: pointer"
        alt=""
        />
        </li>
        `;
  }

  let songList = Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  );

  songList.forEach((element) => {
    element.addEventListener("click", () => {
      let adu = element
        .querySelector(".info")
        .firstElementChild.innerHTML.trim();
      adu += ".mp3";
      playAudio(adu);
    });
  });

  return songs;
};

async function main() {
  songs = await getSong(`${currFolder}`);
  playAudio(
    songs[0].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " "),
    true
  );

  displayAlbum();

  playBut.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      playBut.src = "Svgs/pause.svg";
    } else {
      currentSong.pause();
      playBut.src = "Svgs/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    if (currentSong.currentTime == currentSong.duration) {
      console.log("song ended");
      playNextSong();
    }
    document.querySelector(".act-time").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    let circle = document.querySelector(".circle");
    circle.style.left =
      (currentSong.currentTime / currentSong.duration) * 99 + "%";
  });

  let seek = document.querySelector(".song-time");
  seek.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  let humbuger = document.querySelector(".hamburger");
  humbuger.addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.transition = "all 0.7s";
  });

  previous.addEventListener("click", () => {
    let inde = songs.indexOf(currentSong.src);
    if (inde > 0) {
      playAudio(
        songs[inde - 1].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
      );
    } else if (inde == 0) {
      playAudio(
        songs[0].split(`/Songs/${currFolder}/`)[1].replaceAll("%20", " ")
      );
    }
  });

  next.addEventListener("click", () => {
    playNextSong();
  });

  document.querySelector(".range").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });

  volme.addEventListener("click", () => {
    if (temp) {
      currentSong.volume = 0;
      volme.src = "Svgs/mute.svg";
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
      temp = 0;
    } else {
      temp = 1;
      volme.src = "Svgs/volume.svg";
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 100;
      currentSong.volume = 1;
    }
  });
}
main();
