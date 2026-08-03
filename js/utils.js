function normalize(text){

    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

function getRandomCharacters() {

    const availableCharacters = game.characters.filter(character => {

        return character.difficulty === game.difficulty &&
               !game.usedCharacters.includes(character.id);

    });

    const shuffled = availableCharacters.sort(() => Math.random() - 0.5);

    const selected = shuffled.slice(0, 4);

    selected.forEach(character => {

        game.usedCharacters.push(character.id);

    });

    return selected;

}
