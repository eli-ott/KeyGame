const serieInterface = document.getElementById("displayingSerie");
const gameStarter = document.getElementById("timerStart");
const chrono = document.getElementById('chrono');
const winStreakBoard = document.getElementById("winStreak");
const bestScore = document.getElementById("bestTime");

var scoreLogs = [];
var wins = 0;
var roundToWin = 3;
var isGameStarted = false;
var winStreak = 0;
var cursor = 0; //sert à indiquer à combien d'input on est
const opt = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
let timer;
let startTime = 0;


//On récupère les 5 meilleurs score

function findMin(array){
    let n = array.length-1;
    let min = array[0];
    for(let i =1;i<=n;i++){
      if(array[i]<min){
        min = array[i];
      }
    }
    return min;
  }
  
  function sortingArray(array){
    let res = [];
    let stack = array.slice();
    while(stack.length!=0){
      let min = findMin(stack);
      let index = stack.indexOf(min);
      res.push(min);
      stack.splice(index,1);
    }
    return res;
  }

function getTopFiveScore() {
    var res = [];
    var tab = sortingArray(scoreLogs);
    for (let i = 0; i <= 4; i++) {
        res.push(tab[i]);
    }
    return res;
}

function displayScore(array) {
    for (let i = 0; i <= 4; i++) {

        let tempId = "top" + (i + 1);
        let scoreInputing = document.getElementById(tempId);
        if (array[i] != undefined) {
            scoreInputing.innerHTML = array[i];
        } else {
            scoreInputing.innerHTML = "" ;
        }
    }
}

displayScore(getTopFiveScore());

//on retourne du html qui représente la flèche correspondant à l'input
function getArrowInHtml(input, i) {
    switch (input) {
        case "ArrowUp":
            return '<span class="material-symbols-outlined inputDisplay notValidated" id="arrow' + i + '">arrow_upward_alt</span>';
        case "ArrowDown":
            return '<span class="material-symbols-outlined inputDisplay notValidated" id="arrow' + i + '">arrow_downward_alt</span>';
        case "ArrowRight":
            return '<span class="material-symbols-outlined inputDisplay notValidated" id="arrow' + i + '">arrow_right_alt</span>';
        case "ArrowLeft":
            return '<span class="material-symbols-outlined inputDisplay notValidated" id="arrow' + i + '">arrow_left_alt</span>';
    }
}

//gestion de l'affichage de la série
function displaySerie(serie) {
    let html = "";
    let i = 0;
    serie.forEach(input => {
        html += getArrowInHtml(input, i);
        i++;
    });
    return html;
}

//Obtenir un index aléatoire pour composer la liste des inputs
function getRandomIndex() {
    var n = 4; // Corrigé pour inclure toutes les options
    return Math.floor(Math.random() * n);
}

//génération d'une série d'inputs aléatoires
function randomSerie(opt) {
    let serie = [];
    for (let i = 0; i <= 5; i++) {
        let index = getRandomIndex();
        serie.push(opt[index]);
    }
    return serie;
}

//on écoute les inputs de l'utilisateur
let input;
addEventListener('keydown', (event) => {
    input = event;
    if (opt.includes(input.code) && isGameStarted) {
        checkIfValid(serie, input.code);
    }
});

function startGame() {
    serie = randomSerie(opt);
    serieInterface.innerHTML = displaySerie(serie);
    cursor = 0;
    if (!timer) {
        startTime = Date.now();
        timer = window.setInterval(timePassing, 10);
    }
    isGameStarted = true;
    gameStarter.innerHTML = "Arrêter le jeu";
}

function stopGame(interruptMessage = true) {
    if (timer) {
        window.clearInterval(timer);
        timer = null;
    }
    isGameStarted = false;
    chrono.innerText = "0.000s"; // Réinitialise l'affichage du chrono
    resetGame(); // Réinitialise les variables de jeu
    if (interruptMessage) {
        serieInterface.innerHTML = "<span>Partie interrompue, cliquez sur le bouton pour recommencer</span>";
    }
    gameStarter.innerHTML = "Lancer le jeu !";
}

function winningGame() {
    serieInterface.innerHTML = "<span>Bien joué vous avez gagné en " + chrono.innerText + " , pour relancer une partie cliquez sur le bouton ! 😁</span>";
    winStreak = 0;
    winStreakBoard.innerHTML = "Parties gagnées : " + wins + "🎖️";
    scoreLogs.push(parseFloat(chrono.innerText));
    bestScore.innerText = "🏆Votre meilleur score : " + Math.min(...scoreLogs).toFixed(3) + "s 🏆";
    wins++;
    displayScore(getTopFiveScore());
    stopGame(false);
}

function losingGame() {
    serieInterface.innerHTML = "<span>Vous avez perdu ...😞</span>";
    stopGame(false);
}

function resetGame() {
    cursor = 0;
    winStreak = 0;
    winStreakBoard.innerHTML = "Parties gagnées : " + wins + "🎖️";
}

function checkIfValid(serie, input) {
    if (serie[cursor] === input) {
        let arrowId = "arrow" + cursor;
        let arrow = document.getElementById(arrowId);
        arrow.classList.remove("notValidated");
        arrow.classList.add('validated');
        cursor++;
        if (cursor === 6) {
            winStreak++;

            if (winStreak === roundToWin) {
                winningGame();
            } else {
                startGame();
            }
        }
    } else {
        losingGame();
    }
}

//chrono
function timePassing() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000;
    chrono.innerText = elapsedTime.toFixed(3) + "s";
}

gameStarter.addEventListener('click', () => {
    if (!isGameStarted) {
        startGame();
    } else {
        stopGame();
    }
});


