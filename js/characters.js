// Chargement du fichier JSON
async function loadCharacters() {

    const response = await fetch("data/characters.json");
    game.characters = await response.json();

    game.loading = false;

    console.log("Personnages chargés :", game.characters);
}

function startGame(difficulty) {
    game.difficulty = difficulty;

    const difficultyCharacters = game.characters.filter(character =>
        character.difficulty === difficulty
    );

    game.totalRounds = Math.floor(difficultyCharacters.length / 4);
    document.getElementById("totalRounds").textContent = game.totalRounds;

    game.score = 0;
    game.round = 1;
    game.usedCharacters = [];

    // Si le JSON n'est pas encore chargé
    //if (game.loading) {
    //    alert("Chargement des personnages...");
    //    return;
    //}

    if (game.characters.length === 0) {
    alert("Les données ne sont pas chargées.");
    return;
    }

    const gameContainer = document.getElementById("game");
    document.getElementById("round").textContent = game.round;document.getElementById("score").textContent = game.score;
    gameContainer.innerHTML = "";
    game.difficulty = difficulty;
    game.score = 0;

    game.currentCharacters = getRandomCharacters();

    displayCards();
}

function createCard(character, index) {

    return `
        <div class="card">

            <img
                class="image"
                src="${character.image}"
                alt="${character.character[0]}">

            <input
                id="character-${index}"
                type="text"
                placeholder="Nom du personnage">

            <input
                id="anime-${index}"
                type="text"
                placeholder="Œuvre">

            <div
                id="result-${index}"
                class="result">
            </div>

        </div>
    `;

}

function displayCards() {

    const gameContainer = document.getElementById("game");

    gameContainer.innerHTML = "";

    game.currentCharacters.forEach((character, index) => {

        gameContainer.innerHTML += createCard(character, index);

    });

    gameContainer.innerHTML += `
        <button id="validateButton" onclick="checkAnswers()">
            Valider
        </button>
    `;

}

// Vérifie les réponses
function checkAnswers() {

    let roundScore = 0;

    game.currentCharacters.forEach((character, index) => {

        const characterAnswer = document
            .getElementById(`character-${index}`)
            .value;

        const animeAnswer = document
            .getElementById(`anime-${index}`)
            .value;

        const goodCharacter = character.character.some(answer =>
            normalize(answer) === normalize(characterAnswer)
        );

        const goodAnime = character.anime.some(answer =>
            normalize(answer) === normalize(animeAnswer)
        );

        if(goodCharacter) roundScore++;
        if(goodAnime) roundScore++;

        displayCorrection(
            index,
            character,
            goodCharacter,
            goodAnime
        );

        document.getElementById(`character-${index}`).disabled = true;
        document.getElementById(`anime-${index}`).disabled = true;

    });

    game.score += roundScore;

    document.getElementById("score").textContent = game.score;

    document.getElementById("validateButton").outerHTML = `
        <button id="nextButton" onclick="nextRound()">
            Manche suivante →
        </button>
    `;

}

function displayCorrection(index, character, goodCharacter, goodAnime){

    const result = document.getElementById(`result-${index}`);

    result.innerHTML = `
        <p class="${goodCharacter ? "good" : "bad"}">
            Personnage :
            ${goodCharacter ? "✔" : "✖"}
        </p>

        ${
            !goodCharacter
            ?
            `<p>Réponse : ${character.character[0]}</p>`
            :
            ""
        }

        <p class="${goodAnime ? "good" : "bad"}">
            Œuvre :
            ${goodAnime ? "✔" : "✖"}
        </p>

        ${
            !goodAnime
            ?
            `<p>Réponse : ${character.anime[0]}</p>`
            :
            ""
        }
    `;

}

function nextRound(){

    game.round++;

    if(game.round > game.totalRounds){

        finishGame();

        return;

    }

    document.getElementById("round").textContent = game.round;

    game.currentCharacters = getRandomCharacters();

    displayCards();

}

function finishGame(){

    //game.progress[game.difficulty] = true;
    game.progress.characters[game.difficulty] = true;

    saveProgress();

    checkSecretUnlock();

    const gameContainer = document.getElementById("game");

    gameContainer.innerHTML = `
        <h2>Partie terminée !</h2>

        <h3>Score</h3>

        <p>${game.score} / ${game.totalRounds * 8}</p>

        <button onclick="startGame(game.difficulty)">
            Rejouer
        </button>
    `;

}

function checkSecretUnlock(){

    if(

        game.progress.characters.easy &&
        game.progress.characters.medium &&
        game.progress.characters.hard

    ){

        game.progress.characters.secret = true;

        saveProgress();

    }

}

loadCharacters();