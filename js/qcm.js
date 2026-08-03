const quiz={

    questions:[],

    currentQuestion:null,

    round:1,

    totalRounds:0,

    score:0,

    usedQuestions:[]

};

async function loadQuiz(){

    const response=await fetch("data/qcm.json");

    quiz.questions=await response.json();

}

function startQuiz(){

    quiz.round=1;

    quiz.score=0;

    quiz.usedQuestions=[];

    quiz.totalRounds=quiz.questions.length;

    nextQuestion();

}

function nextQuestion(){

    const available=quiz.questions.filter(question=>

        !quiz.usedQuestions.includes(question.id)

    );

    if(available.length===0){

        finishQuiz();

        return;

    }

    quiz.currentQuestion=available[0];

    quiz.usedQuestions.push(quiz.currentQuestion.id);

    displayQuestion();

}

function displayQuestion(){

    document.getElementById("game").innerHTML=`

        <h2>

            Question

            ${quiz.round}

            /

            ${quiz.totalRounds}

        </h2>

        <p>

            ${quiz.currentQuestion.question}

        </p>

        <button onclick="showChoices()">

            Afficher les propositions

        </button>

    `;

}

function showChoices(){

    let html="";

    quiz.currentQuestion.choices.forEach(choice=>{

        html+=`

            <label>

                <input

                    type="radio"

                    name="answer"

                    value="${choice}">

                ${choice}

            </label>

            <br>

        `;

    });

    document.getElementById("game").innerHTML=`

        <h2>

            Question

            ${quiz.round}

            /

            ${quiz.totalRounds}

        </h2>

        <p>

            ${quiz.currentQuestion.question}

        </p>

        ${html}

        <br>

        <button onclick="checkQuizAnswer()">

            Valider

        </button>

    `;

}

function checkQuizAnswer(){

    const selected=document.querySelector(

        'input[name="answer"]:checked'

    );

    if(!selected){

        alert("Choisissez une réponse.");

        return;

    }

    const answer=selected.value;

    const good=

        answer===quiz.currentQuestion.answer;

    if(good)

        quiz.score++;

    displayQuizCorrection(good);

}

function displayQuizCorrection(good){

    document.getElementById("game").innerHTML+=`

        <hr>

        <h3>

            ${good?"✔ Bonne réponse":"✖ Mauvaise réponse"}

        </h3>

        <p>

            Bonne réponse :

            ${quiz.currentQuestion.answer}

        </p>

        <button onclick="nextQuizRound()">

            Question suivante →

        </button>

    `;

}

function nextQuizRound(){

    quiz.round++;

    document.getElementById("score").textContent=quiz.score;

    nextQuestion();

}

function finishQuiz(){

    document.getElementById("game").innerHTML=`

        <h2>

            Quiz terminé !

        </h2>

        <p>

            Score

            ${quiz.score}

            /

            ${quiz.totalRounds}

        </p>

    `;

}

loadQuiz();