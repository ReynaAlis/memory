const GAME_NODE = document.querySelector("#game-board");
const WINNING_TEXT = document.querySelector("#victory-message");
const START_GAME_BUTTON = document.querySelector("#new-game-button");
const TIMER_NODE = document.querySelector("#timer");
const HALLOWEEN_BUTTON = document.querySelector("#halloween-theme");
const CHRISTMAS_BUTTON = document.querySelector("#christmas-theme");
const ROBOTS_BUTTON = document.querySelector("#robots-theme");

const VISIBLE_CARD_CLASSNAME = "visible";
const CARD_FLIP_TIMEOUT_MS = 500;
const GAME_TIME_LIMIT_MS = 60000;

const CARDS_AMOUNT = 16;

const UNIQUE_HALLOWEEN_CARDS = [
    {
        avif: 'images/halloween/1.avif',
        webp: 'images/halloween/1.webp',
        png: 'images/halloween/1.png'
    },
    {
        avif: 'images/halloween/2.avif',
        webp: 'images/halloween/2.webp',
        png: 'images/halloween/2.png'
    },
    {
        avif: 'images/halloween/3.avif',
        webp: 'images/halloween/3.webp',
        png: 'images/halloween/3.png'
    },
    {
        avif: 'images/halloween/4.avif',
        webp: 'images/halloween/4.webp',
        png: 'images/halloween/4.png'
    },
    {
        avif: 'images/halloween/5.avif',
        webp: 'images/halloween/5.webp',
        png: 'images/halloween/5.png'
    },
    {
        avif: 'images/halloween/6.avif',
        webp: 'images/halloween/6.webp',
        png: 'images/halloween/6.png'
    },
    {
        avif: 'images/halloween/7.avif',
        webp: 'images/halloween/7.webp',
        png: 'images/halloween/7.png'
    },
    {
        avif: 'images/halloween/8.avif',
        webp: 'images/halloween/8.webp',
        png: 'images/halloween/8.png'
    }
];

const UNIQUE_CHRISTMAS_CARDS = [
    {
        avif: 'images/christmas/1.avif',
        webp: 'images/christmas/1.webp',
        png: 'images/christmas/1.png'
    },
    {
        avif: 'images/christmas/2.avif',
        webp: 'images/christmas/2.webp',
        png: 'images/christmas/2.png'
    },
    {
        avif: 'images/christmas/3.avif',
        webp: 'images/christmas/3.webp',
        png: 'images/christmas/3.png'
    },
    {
        avif: 'images/christmas/4.avif',
        webp: 'images/christmas/4.webp',
        png: 'images/christmas/4.png'
    },
    {
        avif: 'images/christmas/5.avif',
        webp: 'images/christmas/5.webp',
        png: 'images/christmas/5.png'
    },
    {
        avif: 'images/christmas/6.avif',
        webp: 'images/christmas/6.webp',
        png: 'images/christmas/6.png'
    },
    {
        avif: 'images/christmas/7.avif',
        webp: 'images/christmas/7.webp',
        png: 'images/christmas/7.png'
    },
    {
        avif: 'images/christmas/8.avif',
        webp: 'images/christmas/8.webp',
        png: 'images/christmas/8.png'
    }
];

const UNIQUE_ROBOTS_CARDS = [
    {
        avif: 'images/robots/1.avif',
        webp: 'images/robots/1.webp',
        png: 'images/robots/1.png'
    },
    {
        avif: 'images/robots/2.avif',
        webp: 'images/robots/2.webp',
        png: 'images/robots/2.png'
    },
    {
        avif: 'images/robots/3.avif',
        webp: 'images/robots/3.webp',
        png: 'images/robots/3.png'
    },
    {
        avif: 'images/robots/4.avif',
        webp: 'images/robots/4.webp',
        png: 'images/robots/4.png'
    },
    {
        avif: 'images/robots/5.avif',
        webp: 'images/robots/5.webp',
        png: 'images/robots/5.png'
    },
    {
        avif: 'images/robots/6.avif',
        webp: 'images/robots/6.webp',
        png: 'images/robots/6.png'
    },
    {
        avif: 'images/robots/7.avif',
        webp: 'images/robots/7.webp',
        png: 'images/robots/7.png'
    },
    {
        avif: 'images/robots/8.avif',
        webp: 'images/robots/8.webp',
        png: 'images/robots/8.png'
    }
];

function createPairs(cardsArray) {
    return [...cardsArray, ...cardsArray];
}

const HALLOWEEN_CARDS = createPairs(UNIQUE_HALLOWEEN_CARDS);

const CHRISTMAS_CARDS = createPairs(UNIQUE_CHRISTMAS_CARDS);

const ROBOTS_CARDS = createPairs(UNIQUE_ROBOTS_CARDS);

let VISIBLE_CARDS = [];
let matchedPairs = 0;
let timerInterval;
let currentThemeCards = HALLOWEEN_CARDS;
let currentThemeBackground = 'images/halloween/halloween-bg';

async function supportsWebP() {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = "data:image/webp;base64,UklGRhYAAABXRUJQVlA4WAoAAAAQAAAABwAAQUxQSBYAAAABZlAFp8mMFwAA";
    });
}

function supportsAvif() {
    return typeof window.ImageDecoder === "function" && ImageDecoder.isTypeSupported("image/avif");
}

async function selectImageFormat(card) {
    if (await supportsAvif()) {
        return card.avif;
    } else if (await supportsWebP()) {
        return card.webp;
    }
    return card.png;
}

async function renderCard(card) {
    const cardPath = await selectImageFormat(card);

    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

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
    cardElement.appendChild(cardInner);

    cardElement.addEventListener("click", handleCardClick.bind(this, cardElement));
    GAME_NODE.appendChild(cardElement);
}
async function setInitialBackground() {
    currentThemeBackground = 'images/halloween/halloween-bg';
    await setThemeBackground();
}

document.addEventListener("DOMContentLoaded", setInitialBackground);

async function setThemeBackground() {
    let backgroundUrl;
    if (await supportsAvif()) {
        backgroundUrl = `url('${currentThemeBackground}.avif')`;
    } else if (await supportsWebP()) {
        backgroundUrl = `url('${currentThemeBackground}.webp')`;
    } else {
        backgroundUrl = `url('${currentThemeBackground}.jpg')`;
    }
    document.body.style.backgroundImage = backgroundUrl;
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

    (async () => {
        for (let card of shuffledCards) {
            await renderCard(card);
        }

        const renderedCards = document.querySelectorAll(".card");

        GAME_NODE.style.pointerEvents = "none";
        console.log("Клики временно отключены");

        setTimeout(() => {
            renderedCards.forEach((card) => {
                card.classList.add(VISIBLE_CARD_CLASSNAME);
            });

            setTimeout(() => {
                renderedCards.forEach((card) => card.classList.remove(VISIBLE_CARD_CLASSNAME));
                GAME_NODE.style.pointerEvents = "auto";
            }, 2000);
        }, 100); 
    })();

    let remainingTime = GAME_TIME_LIMIT_MS / 1000;
    timerInterval = setInterval(() => {
        remainingTime--;
        TIMER_NODE.textContent = `Time: ${remainingTime} seconds`;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            TIMER_NODE.textContent = "Time's up!";
            WINNING_TEXT.textContent = "Try again!";
            GAME_NODE.classList.add('inactive');
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

function switchTheme(themeName, cards, backgroundPath) {
    currentThemeCards = cards;
    currentThemeBackground = backgroundPath;
    setThemeBackground();
    startGame();
}

HALLOWEEN_BUTTON.addEventListener("click", () => switchTheme('halloween', HALLOWEEN_CARDS, 'images/halloween/halloween-bg'));
CHRISTMAS_BUTTON.addEventListener("click", () => switchTheme('christmas', CHRISTMAS_CARDS, 'images/christmas/christmas-bg'));
ROBOTS_BUTTON.addEventListener("click", () => switchTheme('robots', ROBOTS_CARDS, 'images/robots/robots-bg'));

START_GAME_BUTTON.addEventListener("click", startGame);


