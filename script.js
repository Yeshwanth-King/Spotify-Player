console.log("Let's Goooooooo");
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
      <div>
      ${song[key].split("/Songs/")[1].replaceAll("%20", " ").split(".mp3")[0]}
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
    } else if (t == 1) {
      playBut.src = "Svgs/play.svg";
      audio.pause();
      t = 0;
    }
  });
}
main();
