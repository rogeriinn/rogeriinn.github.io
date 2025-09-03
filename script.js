window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

const audio = document.getElementById("musica");
audio.pause();
audio.volume = 0.1;

const numImatges = 33;
const galeria = document.getElementById("galeria");

const captions = [
  "La primera foto de NOS",
  "NOS al pis de la polònia",
  "NOS al zakopane fent un muñeco de nieve. Vaig posar el mòbil malament i no es va gravar bé :(",
  "NOS a l'aeroport quan vas marxar a la polònia :(",
  "NOS fa exactament 2 ANYS al llit de Bellpuig",
  "NOS a la casa de tu",
  "NOS al bus tornant de BCN",
  "NOS al meu pis vell de BCN",
  "TU fent foto a MI al huerto",
  "NOS al Bellpuig quan vas tornar uns dies de la Polònia crec nose",
  "NOS després del flèndit abans d'anar al sopar",
  "JO fent beso a TU a Bellpuig",
  "NOS a la festa de passanant o noseon",
  "NOS fent ojitos a algun puesto",
  "NOS al bellpuig",
  "TU a BCN tota Sadama Husseina",
  "NOS a casa teva amb Pingu",
  "NOS esmorzant a Zakopane",
  "NOS fent un besote a BCN",
  "NOS a algun lloc probablement per polònia",
  "NOS a un ascensor de la Itàlia",
  "TU besant a MI per flors boniques del San Valentín",
  "TU tota cosplayeada",
  "TU servint cacarusca sentada a un vàter de Menàrguens",
  "TU tota guapa al llit de casa meva",
  "NOS al sofà de casa teva",
  "Bereal de NOS a la platja",
  "NOS cuchicheant per cap d'any",
  "TU cavalgant-me per algun lloc d'Astúries",
  "TU normal sense res estrany",
  "TU TOTA GUAPA amb orelles de ratona sisi de RATONA.",
  "TU observant les meves boniques flors quan vas tornar de Polònia",
  "La TU i el JO (NOS) tots feliços a Cuenca"
];

for (let i = 0; i < numImatges; i += 3) {
  const fila = document.createElement("div");
  fila.classList.add("fila-galeria");

  for (let j = i; j < i + 3 && j < numImatges; j++) {
    const img = document.createElement("img");
    img.src = "img/photo" + (j + 1) + ".jpeg";
    img.alt = `Imatge ${j + 1}`;
    img.dataset.caption = captions[j] || `Imatge ${j + 1}`;
    fila.appendChild(img);
  }

  galeria.appendChild(fila);
}

// Modal
const modal = document.getElementById("myModal");
const modalImg = document.getElementById("img-modal");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close");

const images = document.querySelectorAll("#galeria img");

images.forEach(img => {
  img.addEventListener("click", function () {
    modal.classList.remove("hidden");
    modalImg.src = this.src;
    captionText.innerHTML = this.dataset.caption;
  });
});

// Cerrar modal
closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


closeBtn.onclick = function () {
  modal.classList.add("hidden");
};

modal.onclick = function (event) {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
};


particlesJS("particles-js", {
  particles: {
    number: { value: 100 },
    size: { value: 3 },
    move: { speed: 1.5 },
    line_linked: { enable: false },
    color: { value: ["#ffffff", "#f8bbd0", "#ff80ab"] }
  }
});

function obrirInvitacio() {
  const contra = document.getElementById("contra").value.toLowerCase();
  const contenido = document.getElementById("contenido");

  const password = "abubu1";

  if (contra === password) {
    contenido.classList.remove("hidden");
  } else {
    alert("No és pas aquesta paraula...");
  }
}

function entrar() {
  const clave = document.getElementById("clave").value.toLowerCase();
  const password = "2anysBusi";

  if (clave === password) {
    document.getElementById("login").style.display = "none";
    document.getElementById("all").style.display = "flex";
    audio.play();
  } else {
    alert("Aquesta no és la paraula màgica!");
  }
}


const board = document.getElementById("board");
  const message = document.getElementById("message");

  const myFace = "cara-roger.png";
  const herFace = "cara-cloe.png";

  let currentPlayer = myFace;
  let cells = Array(9).fill(null);

  function checkWinner() {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8], 
      [0,3,6],[1,4,7],[2,5,8], 
      [0,4,8],[2,4,6]          
    ];

    for (let [a,b,c] of wins) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return cells.includes(null) ? null : "draw";
  }

  function handleClick(e, idx) {
    if (cells[idx] || checkWinner()) return;

    cells[idx] = currentPlayer;
    e.target.innerHTML = `<img src="${currentPlayer}">`;

    const winner = checkWinner();
    if (winner) {
      if (winner === myFace) {
        message.textContent = "Juejuejue he guanyat jo, torna a intentar.";
      } else if (winner === herFace) {
        message.textContent = "Ala busina has guanyat, la contrasenya és: abubu1";
      } else {
        message.textContent = "Hem lo empatat";
      }
      return;
    }

    // Canviar torn
    currentPlayer = currentPlayer === myFace ? herFace : myFace;
  }

  // Crear tauler
  for (let i=0; i<9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", (e) => handleClick(e, i));
    board.appendChild(cell);
  }

  function reiniciarJoc() {
    cells.fill(null);
    currentPlayer = myFace;
    message.textContent = "";
    board.querySelectorAll(".cell").forEach(cell => cell.innerHTML = "");

  }

