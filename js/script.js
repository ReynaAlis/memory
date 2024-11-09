const GAME_NODE = document.querySelector("#game-board");
const WINNING_TEXT = document.querySelector("#victory-message");
const START_GAME_BUTTON = document.querySelector("#new-game-button");
const TIMER_NODE = document.querySelector("#timer");
const HALLOWEEN_BUTTON = document.querySelector("#halloween-theme");
const CHRISTMAS_BUTTON = document.querySelector("#christmas-theme");

const VISIBLE_CARD_CLASSNAME = "visible";
const CARD_FLIP_TIMEOUT_MS = 500;
const GAME_TIME_LIMIT_MS = 60000;

const HALLOWEEN_CARDS = [
    'images/halloween/1.png', 'images/halloween/1.png',
    'images/halloween/2.png', 'images/halloween/2.png',
    'images/halloween/3.png', 'images/halloween/3.png',
    'images/halloween/4.png', 'images/halloween/4.png',
    'images/halloween/5.png', 'images/halloween/5.png',
    'images/halloween/6.png', 'images/halloween/6.png',
    'images/halloween/7.png', 'images/halloween/7.png',
    'images/halloween/8.png', 'images/halloween/8.png'
];

const CHRISTMAS_CARDS = [
    'images/christmas/1.png', 'images/christmas/1.png',
    'images/christmas/2.png', 'images/christmas/2.png',
    'images/christmas/3.png', 'images/christmas/3.png',
    'images/christmas/4.png', 'images/christmas/4.png',
    'images/christmas/5.png', 'images/christmas/5.png',
    'images/christmas/6.png', 'images/christmas/6.png',
    'images/christmas/7.png', 'images/christmas/7.png',
    'images/christmas/8.png', 'images/christmas/8.png'
];

const CARDS_AMOUNT = 16;

let VISIBLE_CARDS = [];
let matchedPairs = 0;
let timerInterval;
let currentThemeCards = HALLOWEEN_CARDS;
let currentThemeBackground = 'url(\'images/halloween/halloween-bg.jpg\')';

function setThemeBackground() {
    document.body.style.backgroundImage = currentThemeBackground;
}

function renderCard(cardPath = "") {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = "?";

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    const img = document.createElement("img");
    img.src = cardPath;
    img.alt = "Card Image";
    img.classList.add("card-image");
    cardBack.appendChild(img);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener("click", handleCardClick.bind(this, card));

    GAME_NODE.appendChild(card);
}

function startGame() {
    [GAME_NODE, WINNING_TEXT].forEach((element) => (element.innerHTML = ""));
    TIMER_NODE.textContent = "Time: 60 seconds";
    clearInterval(timerInterval);
    matchedPairs = 0;
    VISIBLE_CARDS = [];

    GAME_NODE.classList.remove('inactive');
    GAME_NODE.style.opacity = '1';

    setThemeBackground();

    const shuffledCards = currentThemeCards.slice().sort(() => Math.random() - 0.5);
    shuffledCards.forEach(renderCard);

    const renderedCards = document.querySelectorAll(".card");
    renderedCards.forEach((card) => card.classList.add(VISIBLE_CARD_CLASSNAME));

    setTimeout(() => {
        renderedCards.forEach((card) => card.classList.remove(VISIBLE_CARD_CLASSNAME));
    }, 1000);

    let remainingTime = GAME_TIME_LIMIT_MS / 1000;
    timerInterval = setInterval(() => {
        remainingTime--;
        TIMER_NODE.textContent = `Time: ${remainingTime} seconds`;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            TIMER_NODE.textContent = "Time's up!";
            WINNING_TEXT.textContent = "Try again!";
            GAME_NODE.classList.add('inactive');
            GAME_NODE.querySelectorAll(".card").forEach((card) => card.removeEventListener("click", handleCardClick));
        }
    }, 1000);
}

function handleCardClick(card) {
    if (GAME_NODE.classList.contains('inactive') || card.classList.contains(VISIBLE_CARD_CLASSNAME) || VISIBLE_CARDS.length >= 2) {
        return;
    }

    card.classList.add(VISIBLE_CARD_CLASSNAME);
    VISIBLE_CARDS.push(card);

    if (VISIBLE_CARDS.length === 2) {
        const [firstCard, secondCard] = VISIBLE_CARDS;
        const firstImgSrc = firstCard.querySelector(".card-back img").src;
        const secondImgSrc = secondCard.querySelector(".card-back img").src;

        if (firstImgSrc === secondImgSrc) {
            matchedPairs++;
            VISIBLE_CARDS = [];
            checkVictory();
        } else {
            setTimeout(() => {
                [firstCard, secondCard].forEach((card) => {
                    card.classList.remove(VISIBLE_CARD_CLASSNAME);
                    const front = card.querySelector(".card-front");
                    if (front) front.textContent = "?";
                });
                VISIBLE_CARDS = [];
            }, CARD_FLIP_TIMEOUT_MS);
        }
    }
}

function createSparksEffect(element) {
    const rect = element.getBoundingClientRect();
    const offsetX = rect.left + rect.width / 2 + window.scrollX;
    const offsetY = rect.top + rect.height / 2 + window.scrollY;

    for (let i = 0; i < 50; i++) {
        let spark = document.createElement('div');
        spark.classList.add('spark');
        document.body.appendChild(spark);

        spark.style.left = `${offsetX}px`;
        spark.style.top = `${offsetY}px`;

        gsap.to(spark, {
            x: `random(-200, 200)`,
            y: `random(-200, 200)`,
            opacity: 0,
            duration: 1.5,
            onComplete: () => spark.remove()
        });
    }
}

function showVictoryMessage() {
    WINNING_TEXT.textContent = "Congratulations, you win!";
    createSparksEffect(WINNING_TEXT);
}

function checkVictory() {
    if (matchedPairs === CARDS_AMOUNT / 2) {
        clearInterval(timerInterval);
        showVictoryMessage();
    }
}

HALLOWEEN_BUTTON.addEventListener("click", () => {
    currentThemeCards = HALLOWEEN_CARDS;
    currentThemeBackground = 'url(\'images/halloween/halloween-bg.jpg\')';
    startGame();
});

CHRISTMAS_BUTTON.addEventListener("click", () => {
    currentThemeCards = CHRISTMAS_CARDS;
    currentThemeBackground = 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url(\'images/christmas/christmas-bg.jpg\')';
    startGame();
});

START_GAME_BUTTON.addEventListener("click", startGame);


