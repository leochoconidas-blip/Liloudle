function showCharacterMenu(){

    document.getElementById("menu").innerHTML = `

        <h2>Deviner les personnages</h2>

        <button onclick="startGame('easy')">Easy</button>

        <button onclick="startGame('medium')">Medium</button>

        <button onclick="startGame('hard')">Hard</button>

        ${
            game.progress.characters.secret
            ?
            `<button onclick="startGame('secret')">
                Secret
            </button>`
            :
            `<button disabled>
                Secret
            </button>`
        }

    `;

}

function showBlindMenu(){

    document.getElementById("menu").innerHTML = `

        <h2>Blind Test</h2>

        <button onclick="startBlindTest('easy')">
            Easy
        </button>

        <button onclick="startBlindTest('medium')">
            Medium
        </button>

        <button onclick="startBlindTest('hard')">
            Hard
        </button>

        ${
            game.progress.blindtest.secret
            ?
            `<button onclick="startBlindTest('secret')">
                Secret
            </button>`
            :
            `<button disabled>
                Secret
            </button>`
        }

    `;

}

function showQuizMenu(){

    document.getElementById("menu").innerHTML = `

        <h2>Quiz</h2>

        <button onclick="startQuiz()">

            Commencer

        </button>

    `;

}