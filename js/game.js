console.log("game.js chargé");

const game = {
    characters: [],
    loading: true,
    currentCharacters: [],
    difficulty: "",
    round: 1,
    totalRounds: 0,
    score: 0,
    usedCharacters: [],
    //progress:{

    //easy:false,

    //medium:false,

    //hard:false,

    //secret:false

    //}

    progress: {

    characters: {

        easy: false,
        medium: false,
        hard: false,
        secret: false

    },

    blindtest: {

        opening: false,
        ending: false,
        ost: false,
        secret: false

    }

    }

};

const blindTest = {

    musics: [],

    currentMusic: null,

    category: "",

    round: 1,

    totalRounds: 0,

    score: 0,

    usedMusic: []
};

const quotesGame = {

    quotes: [],

    currentQuote: null,

    score: 0,

    round: 1,

    totalRounds: 0,

    usedQuotes: []

};

function saveProgress(){

    localStorage.setItem(
        "laniguessrProgress",
        JSON.stringify(game.progress)
    );

}

function loadProgress(){

    const save = localStorage.getItem("laniguessrProgress");

    if(save){

        game.progress = JSON.parse(save);

    }

}

loadProgress();