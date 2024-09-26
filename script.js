const wheel = document.getElementById('wheel');
const ctx = wheel.getContext('2d');
const inputField = document.getElementById('inputField');
const shuffleButton = document.getElementById('shuffleButton');
const sortButton = document.getElementById('sortButton');
const spinButton = document.getElementById('spinButton');
const shuffleColorsButton = document.getElementById('shuffleColorsButton');
const resetButton = document.getElementById('resetButton');
const modal = document.getElementById('modal');
const resultText = document.getElementById('resultText');
const closeModal = document.getElementById('closeModal');
const winnerSound = document.getElementById('winnerSound');

let options = [];
let spinning = false;

function drawWheel() {
    const numSegments = options.length;
    const angle = 2 * Math.PI / numSegments;

    ctx.clearRect(0, 0, wheel.width, wheel.height);
    ctx.save();
    ctx.translate(wheel.width / 2, wheel.height / 2);
    ctx.rotate(-Math.PI / 2);

    for (let i = 0; i < numSegments; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 200, angle * i, angle * (i + 1));
        ctx.closePath();

        // Set a random color for each segment
        ctx.fillStyle = getRandomColor();
        ctx.fill();
        
        ctx.save();
        ctx.rotate(angle * (i + 0.5));
        ctx.fillStyle = "#fff";
        ctx.fillText(options[i], 70, 10);
        ctx.restore();
    }

    ctx.restore();
}

function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
}

function addOption(event) {
    const value = inputField.value.trim();
    if (event.key === "Enter" && value && !options.includes(value)) {
        options.push(value);
        inputField.value = '';
        drawWheel();
    }
}

function shuffleOptions() {
    options.sort(() => Math.random() - 0.5);
    drawWheel();
}

function sortOptions() {
    options.sort();
    drawWheel();
}

function shuffleColors() {
    drawWheel();
}

function resetOptions() {
    options = [];
    inputField.value = '';
    drawWheel();
}

function spinWheel() {
    if (spinning || options.length === 0) return;

    spinning = true;
    const spins = Math.floor(Math.random() * 10) + 5; // Random number of spins
    const spinAngle = (Math.PI * 2) * spins;
    const totalAngle = spinAngle + (Math.PI * 2 / options.length) * (Math.random() * options.length);
    
    const spinDuration = 3000; // Duration of the spin in milliseconds
    const startTime = performance.now();

    function animateSpin(time) {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / spinDuration, 1);
        ctx.save();
        ctx.translate(wheel.width / 2, wheel.height / 2);
        ctx.rotate(progress * totalAngle);
        ctx.translate(-wheel.width / 2, -wheel.height / 2);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            spinning = false;
            const selectedIndex = Math.floor(((totalAngle % (Math.PI * 2)) / (Math.PI * 2)) * options.length);
            displayResult(options[selectedIndex]);
        }
    }

    requestAnimationFrame(animateSpin);
}

function displayResult(result) {
    resultText.textContent = `Your winner is: ${result}`;
    modal.style.display = 'block';
    playSound();
    showConfetti();
}

function playSound() {
    winnerSound.play();
}

function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti-container');
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.backgroundColor = getRandomColor();
        confettiContainer.appendChild(confetti);

        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.animationDuration = Math.random() * 2 + 2 + 's'; // 2 to 4 seconds
        confetti.style.opacity = Math.random();
    }

    setTimeout(() => {
        confettiContainer.remove();
    }, 4000); // Remove after 4 seconds
}

// Event Listeners
inputField.addEventListener('keypress', addOption);
shuffleButton.addEventListener('click', shuffleOptions);
sortButton.addEventListener('click', sortOptions);
shuffleColorsButton.addEventListener('click', shuffleColors);
resetButton.addEventListener('click', resetOptions);
spinButton.addEventListener('click', spinWheel);

closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Initialize the canvas with an empty wheel
drawWheel();
