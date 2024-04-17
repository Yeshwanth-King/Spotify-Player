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
  console.log(song);
  return song;
};

async function main() {
  let songs = await getSong();
  let playBut = document.querySelector(".playbut");

  playBut.addEventListener("click", () => {
    let t = 0;
    var audio = new Audio(songs[8]);
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
