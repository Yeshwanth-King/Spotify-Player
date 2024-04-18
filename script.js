console.log("Let's Goooooooo");

const playAudio = (track) => {
  let audio = new Audio("/Songs/" + track);
  audio.play();
};

let getSong = async () => {
  let a = await fetch("/Songs");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let ac = div.getElementsByTagName("a");
  let song = [];
  for (let index = 0; index < ac.length; index++) {
    const element = ac[index];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href);
    }
  }
  let songli = document.querySelector(".songul");
  for (let key in song) {
    songli.innerHTML += `
      <li>
      <img class="invert" src="Svgs/music.svg" alt="" />
      <div class = "info">
      <div>
      ${song[key].split("/Songs/")[1].replaceAll("%20", " ").split(".mp3")[0]}
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

  return song;
};

async function main() {
  let songs = await getSong();
  let playBut = document.querySelector(".playbut");

  let t = 0;
  playBut.addEventListener("click", () => {
    var audio = new Audio(songs[2]);
    if (t == 0) {
      audio.play();
      playBut.src = "Svgs/pause.svg";
      t = 1;
    } else {
      playBut.src = "Svgs/play.svg";
      audio.pause();
      t = 0;
    }
  });
}
main();
