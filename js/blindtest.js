// ===============================
// Chargement du JSON
// ===============================

async function loadBlindTest() {

    const response = await fetch("data/blindtest.json");

    blindTest.musics = await response.json();

    console.log("Blind Test chargé :", blindTest.musics);

}



// ===============================
// Démarrer une partie
// ===============================

function startBlindTest(category) {

    if (blindTest.musics.length === 0) {

        alert("Les musiques sont encore en cours de chargement.");

        return;

    }

    blindTest.category = category;

    blindTest.round = 1;

    blindTest.score = 0;

    blindTest.usedMusic = [];

    blindTest.currentMusic = null;

    document.getElementById("score").textContent = 0;

    const musics = blindTest.musics.filter(music =>
        music.category === category
    );

    blindTest.totalRounds = musics.length;

    document.getElementById("round").textContent = 1;

    document.getElementById("totalRounds").textContent = blindTest.totalRounds;

    getNextMusic();

}



// ===============================
// Cherche la prochaine musique
// ===============================

function getNextMusic() {

    const remaining = blindTest.musics.filter(music =>

        music.category === blindTest.category &&

        !blindTest.usedMusic.includes(music.id)

    );

    if (remaining.length === 0) {

        alert("Toutes les musiques ont été jouées.");

        return;

    }

    blindTest.currentMusic = remaining[0];

    blindTest.usedMusic.push(blindTest.currentMusic.id);

    displayBlindMusic();

}



// ===============================
// Affichage
// ===============================

function displayBlindMusic() {

    const game = document.getElementById("game");

    console.log(blindTest.currentMusic.audio);
    game.innerHTML = `

        <h2>${blindTest.category.toUpperCase()}</h2>

        <audio
            id="player"
            src="${blindTest.currentMusic.audio}">
        </audio>

        <br><br>

        <button onclick="playMusic()">

            ▶ Écouter

        </button>

        <br><br>

        <input
            id="animeAnswer"
            type="text"
            placeholder="Nom de l'anime">

        <br><br>

        <input
            id="titleAnswer"
            type="text"
            placeholder="Titre de la musique">

        <br><br>

        <button
        id="validateBlind"
        onclick="checkBlindAnswer()">

            Valider

        </button>

    `;

    document.getElementById("animeAnswer").addEventListener("keydown", pressEnter);
    document.getElementById("titleAnswer").addEventListener("keydown", pressEnter);

}

function pressEnter(event){

    if(event.key === "Enter"){

        checkBlindAnswer();

    }

}

// ===============================
// Lecture
// ===============================

function playMusic() {

    const player = document.getElementById("player");

    console.log(player.src);

    player.currentTime = 0;

    player.play();

}



// ===============================
// Teste les réponses
// ===============================

function checkBlindAnswer() {

    const validateButton = document.getElementById("validateBlind");

    if(validateButton.disabled)
        return;

    validateButton.disabled = true;

    const animeAnswer = document
        .getElementById("animeAnswer")
        .value;

    const titleAnswer = document
        .getElementById("titleAnswer")
        .value;

    const goodAnime = blindTest.currentMusic.anime.some(answer =>
        normalize(answer) === normalize(animeAnswer)
    );

    const goodTitle = blindTest.currentMusic.title.some(answer =>
        normalize(answer) === normalize(titleAnswer)
    );

    if(goodAnime)
        blindTest.score++;

    if(goodTitle)
        blindTest.score++;

    document.getElementById("animeAnswer").disabled = true;
    document.getElementById("titleAnswer").disabled = true;
    document.querySelector("#game button").disabled = true;

    const player = document.getElementById("player");

    player.pause();
    player.currentTime = 0;

    displayBlindCorrection(
        goodAnime,
        goodTitle
    );

}

// ===============================
// Affiche la correction
// =============================== 

function displayBlindCorrection(goodAnime, goodTitle){

    const game = document.getElementById("game");

    game.innerHTML += `

        <div id="blindCorrection">

            <p class="${goodAnime ? "good" : "bad"}">

                Anime :
                ${goodAnime ? "✔" : "✖"}

            </p>

            ${
                !goodAnime
                ?
                `<p>Réponse : ${blindTest.currentMusic.anime[0]}</p>`
                :
                ""
            }

            <p class="${goodTitle ? "good" : "bad"}">

                Titre :
                ${goodTitle ? "✔" : "✖"}

            </p>

            ${
                !goodTitle
                ?
                `<p>Réponse : ${blindTest.currentMusic.title[0]}</p>`
                :
                ""
            }

            <button onclick="nextBlindRound()">

                Musique suivante →

            </button>

        </div>

    `;

}

// ===============================
// Passe à la musique suivante
// ===============================

function nextBlindMusic() {

    const available = blindTest.musics.filter(music =>

        music.category === blindTest.category &&

        !blindTest.usedMusic.includes(music.id)

    );

    if (available.length === 0) {

        finishBlindTest();
        return;

    }

    blindTest.currentMusic = available[0];

    blindTest.usedMusic.push(blindTest.currentMusic.id);

    document.getElementById("round").textContent = blindTest.round;
    document.getElementById("totalRounds").textContent = blindTest.totalRounds;
    document.getElementById("score").textContent = blindTest.score;

    displayBlindMusic();

}

function nextBlindRound(){

    blindTest.round++;

    if(blindTest.round > blindTest.totalRounds){

        finishBlindTest();

        return;

    }

    nextBlindMusic();

}

// ===============================
// Affiche l'écran de fin
// ===============================

function finishBlindTest(){

    game.progress.blindtest[blindTest.category] = true;

    saveProgress();

    checkBlindSecretUnlock();

    document.getElementById("game").innerHTML = `

        <h2>Blind Test terminé !</h2>

        <p>

            Score :

            ${blindTest.score}

            /

            ${blindTest.totalRounds * 2}

        </p>

        <button onclick="startBlindTest(blindTest.category)">

            Rejouer

        </button>

    `;

}

function checkBlindSecretUnlock(){

    if(

        game.progress.blindtest.opening &&
        game.progress.blindtest.ending &&
        game.progress.blindtest.ost

    ){

        game.progress.blindtest.secret = true;

        saveProgress();

    }

}

// ===============================
// Démarrage
// ===============================

loadBlindTest();