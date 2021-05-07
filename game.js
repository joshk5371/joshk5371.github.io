let squares = $('.snake-board div');
const width = 30;
let currentIndex = 0;
let appleIndex = 0;
let currentSnake = [2, 1, 0];
let direction = 1;
let score = 0;
let speed = 0.99;
let intervalTime = 1000;
let interval = 0;
let directions = false;
let username = localStorage.getItem('username');
let highscore = localStorage.getItem('score');
let gameEnded = false;

// firebase.initializeApp({
//     apiKey: "AIzaSyBAx_e76ctxOTtZqPVAnn2BAY3wTUFXIdU",
//     authDomain: "snake-game-33967.firebaseapp.com",
//     projectId: "snake-game-33967"
// })

export const renderLogoutButton = function () {
    let $logindiv = $('.login-div');
    $logindiv.empty();
    $logindiv.append(`<button class="logout-button">Logout</button>`);
}

export const renderNameHighScore = function () {
    $('.username').append(`<div>Hi ${username}!</div>`);
    $('.highscore').append(`<div>Highest Score:${highscore}</div>`);
}

export const renderQuote = function () {
    let $quote = $(".snake-quote");
    let quote = "";
    let author = "-";
    getQuote().then((data) => {
        let index = Math.floor(Math.random() * (1600));
        let object = data[index];
        quote = object.text;
        author = author + object.author;
        if (author == "-null") {
            author = "-Anonymous";
        }
        $quote.append(`<div>${quote}</div>
        <div>${author}</div>`)
    });
}

export const renderBoard = function () {
    let $board = $(".snake-board");
    for (let i = 0; i < 600; i++) {
        $board.append('<div class=pixel></div>');
    }
    squares = $('.snake-board div');
}

export const startGame = function () {
    $(".end-game").empty();
    $(".number-fact").empty();
    gameEnded = false;
    currentSnake.forEach(index => squares[index].classList.remove('snake'));
    squares[appleIndex].classList.remove('apple');
    clearInterval(interval);
    score = 0;
    addNewApple();
    direction = 1;
    updateScore();
    intervalTime = 125;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    interval = setInterval(moveOutcomes, intervalTime);
}

export const moveOutcomes = function () {
    if ((currentSnake[0] + 30 >= (30 * 20) && direction == width) ||
        (currentSnake[0] % width == width - 1 && direction == 1) ||
        (currentSnake[0] % width == 0 && direction == -1) ||
        (currentSnake[0] - width < 0 && direction == -width) ||
        squares[currentSnake[0] + direction].classList.contains('snake')) {
        let $end = $(".end-game");
        let $num = $('.number-fact');
        gameEnded = true;
        getNumbersFact(score).then((result) => {
            $end.empty();
            $num.empty();
            $end.append(`<div>Game Over</div>`);
            if (score == 0) {
                $num.append(`<div>0 is the atomic number of the theoretical element tetraneutron</div>`);
            } else {
                $num.append(`<div>${score} is ${result.text}</div>`);
            }
        })
        if (score > highscore) {
            highscore = score;
            db.collection("users").doc(username).update({
                highscore: score
            }).then((snapshot) => {
                localStorage.setItem('score', score)
            });
            $('.highscore').empty();
            $('.highscore').append(`<div>Highest Score:${highscore}</div>`);
        }
        return clearInterval(interval);
    }

    const tail = currentSnake.pop();
    squares[tail].classList.remove('snake');
    currentSnake.unshift(currentSnake[0] + direction);

    if (squares[currentSnake[0]].classList.contains('apple')) {
        squares[currentSnake[0]].classList.remove('apple')
        squares[tail].classList.add('snake');
        currentSnake.push(tail);
        addNewApple();
        score += 1;
        updateScore();
        clearInterval(interval);
        intervalTime = intervalTime * speed;
        interval = setInterval(moveOutcomes, intervalTime);
    }
    squares[currentSnake[0]].classList.add('snake');
}

export const addNewApple = function () {
    do {
        appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains('snake')) {
        squares[appleIndex].classList.add('apple');
    }
}

export const handleArrowKeys = function (event) {
    if (!gameEnded) {
        squares[currentIndex].classList.remove('snake');
        if (event.keyCode == 39) {
            if (direction != -1) {
                direction = 1; // right
            }
        } else if (event.keyCode == 38) {
            if (direction != width) {
                direction = -width; // up
            }
        } else if (event.keyCode == 37) {
            if (direction != 1) {
                direction = -1; // left
            }
        } else if (event.keyCode == 40) {
            if (direction != -width) {
                direction = width; // down
            }
        }
    }
}

export const updateScore = function () {
    let $score = $('.snake-score');
    $('.score').remove();
    $score.append(`<span class='score'>${score}</span>`);
}

export const handleDirectionsButton = function () {
    let $directions = $(".directions");
    if (directions) {
        $directions.empty();
        directions = false;
    } else {
        $directions.append(`<div>Use the arrow keys to control the snake (green). The more apples (red) you collect, the more your snake will grow and go faster! (Try not to press two directions simultaneously) </div>`);
        directions = true;
    }
}

export const handleJokeButton = function () {
    let $quote = $('.snake-quote');
    $quote.empty();
    getRandomJoke().then((result) => {
        let joke = result.setup;
        let answer = result.punchline;
        $quote.append(`<div>${joke}</div> <div>${answer}</div>`);
    })

}

export const handleLogoutButton = function () {
    username = null;
    highscore = null;
    localStorage.removeItem('username');
    localStorage.removeItem('score');
    location.replace('index.html');
}

export const loadGameIntoDOM = function () {
    let $root = $("#root");
    if (username != null) {
        renderNameHighScore();
        renderLogoutButton();
    }
    renderQuote();
    renderBoard();
    if (!gameEnded) {
        $(document).on('keydown', handleArrowKeys);
    }
    $root.on('click', '.logout-button', handleLogoutButton);
    $root.on('click', ".start-button", startGame);
    $root.on('click', '.joke-button', handleJokeButton);
    $root.on('click', '.direction-button', handleDirectionsButton);
}

export async function getQuote() {
    const result = await axios({
        method: 'GET',
        url: 'https://type.fit/api/quotes',
    });
    return result.data;
}

// export async function getNumbersFact(number) {
//     const result = await axios({
//         method: 'GET',
//         url: 'http://numbersapi.com/' + number,
//     })

//     return result.data;
// }

export async function getNumbersFact(number) {
    const result = await axios({
        method: 'GET',
        url: 'https://numbersapi.p.rapidapi.com/' + number + '/trivia',
        params: { json: 'true', fragment: 'true' },
        headers: {
            'x-rapidapi-key': '228b01284bmshe3a9a1aa09294aap1fd479jsnc9c80ecc5b7d',
            'x-rapidapi-host': 'numbersapi.p.rapidapi.com'
        }
    });
    return result.data;

}

export async function getRandomJoke() {
    const result = await axios({
        method: 'GET',
        url: 'https://official-joke-api.appspot.com/random_joke'
    });
    return result.data;
}

$(function () {
    loadGameIntoDOM();
});