document.addEventListener("DOMContentLoaded", function () {
    const cat = document.getElementById("cat");
    const foodItemsContainer = document.getElementById("food-items");
    const scoreValue = document.getElementById("score-value");
    const gameOver = document.getElementById("game-over");
    const startButton = document.getElementById("start-button");
    const foodCaughtSound = new Audio("food_caught.mp3");
    const foodMissedSound = new Audio("food_missed.mp3");

    const gameWidth = window.innerWidth;
    const gameHeight = window.innerHeight;
    const catWidth = cat.offsetWidth;
    const foodItemWidth = 50;
    const foodItemHeight = 50;
    const initialSpeed = 2;
    const speedIncrement = 0.1;
    const maxMissedItems = 3;
    const foodCreationInterval = 2000; // Adjust food creation interval (milliseconds)
    const rareFoodProbability = 0.05; // Probability of rare food item appearance (5%)

    const foodRewards = {
        food1: 100,
        food2: 400,
        food3: 600,
        food4: 2000
    };

    let score = 0;
    let missedItems = 0;
    let speed = initialSpeed;
    let gameRunning = false;
    let gameLoop;

    function startGame() {
        score = 0;
        missedItems = 0;
        speed = initialSpeed;
        scoreValue.textContent = score;
        gameRunning = true;
        gameOver.textContent = "";
        gameOver.style.display = "none";
        foodItemsContainer.innerHTML = ""; // Clear food items from previous game
        startButton.style.display = "none"; // Hide start button
        gameLoop = setInterval(() => {
            if (gameRunning) {
                createFoodItem();
                speed += speedIncrement;
            }
        }, foodCreationInterval);
    }

    function moveCat(event) {
        if (gameRunning) {
            // Move cat with arrow keys
            if (event.key === "ArrowLeft" && cat.offsetLeft > 0) {
                cat.style.left = cat.offsetLeft - 20 + "px";
            } else if (event.key === "ArrowRight" && cat.offsetLeft < gameWidth - catWidth) {
                cat.style.left = cat.offsetLeft + 20 + "px";
            }
        }
    }

    function moveCatWithMouse(event) {
        if (gameRunning) {
            // Move cat with mouse
            const mouseX = event.clientX;
            const catX = mouseX - catWidth / 2;
            if (catX >= 0 && catX <= gameWidth - catWidth) {
                cat.style.left = catX + "px";
            }
        }
    }

    function playFoodCaughtSound() {
        foodCaughtSound.currentTime = 0; // Reset the audio to the beginning
        foodCaughtSound.play();
    }

    function playFoodMissedSound() {
        foodMissedSound.currentTime = 0; // Reset the audio to the beginning
        foodMissedSound.play();
    }

    function createFoodItem() {
        const foodItem = document.createElement("div");
        foodItem.classList.add("food-item");

        // Randomly determine if the food item is rare or regular
        const randomProbability = Math.random();
        let foodIndex;
        if (randomProbability < rareFoodProbability) {
            foodIndex = 4; // Use food4.png for rare food
        } else {
            foodIndex = Math.floor(Math.random() * 3) + 1; // Randomly select food1, food2, or food3
        }
        foodItem.style.backgroundImage = `url('food${foodIndex}.png')`;

        foodItem.style.left = Math.floor(Math.random() * (gameWidth - foodItemWidth)) + "px";
        foodItemsContainer.appendChild(foodItem);

        let foodItemInterval = setInterval(() => {
            if (gameRunning) {
                const bottomPosition = foodItem.offsetTop + foodItemHeight;
                const foodCenterX = foodItem.offsetLeft + foodItemWidth / 2;
                const catCenterX = cat.offsetLeft + catWidth / 2;

                if (bottomPosition >= gameHeight) {
                    if (Math.abs(foodCenterX - catCenterX) <= catWidth / 2) {
                        const foodType = `food${foodIndex}`;
                        score += foodRewards[foodType];
                        scoreValue.textContent = score;
                        playFoodCaughtSound();
                        foodItemsContainer.removeChild(foodItem); // Remove the food item from the DOM
                    } else {
                        missedItems++;
                        playFoodMissedSound();
                        if (missedItems >= maxMissedItems) {
                            endGame();
                        }
                        clearInterval(foodItemInterval);
                        foodItemsContainer.removeChild(foodItem);
                    }
                } else {
                    foodItem.style.top = foodItem.offsetTop + speed + "px";
                }
            } else {
                clearInterval(foodItemInterval);
            }
        }, 10);
    }

    function endGame() {
        gameRunning = false;
        gameOver.textContent = "Game Over";

        // Display collected food items and final score
        const collectedItems = document.createElement("p");
        collectedItems.textContent = "Collected Food Items: " + (score / 100); // Each food item is worth 100 points
        gameOver.appendChild(collectedItems);

        const finalScore = document.createElement("p");
        finalScore.textContent = "Final Score: " + score;
        gameOver.appendChild(finalScore);

        gameOver.style.display = "block";
        startButton.style.display = "block"; // Show start button

        clearInterval(gameLoop); // Stop the game loop
    }

    document.addEventListener("keydown", moveCat);

    document.addEventListener("mousemove", moveCatWithMouse);

    startButton.addEventListener("click", startGame);
});
