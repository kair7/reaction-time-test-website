document.addEventListener('DOMContentLoaded', () => {
    const message = document.getElementById('message');
    const startButton = document.getElementById('start-button');
    const lights = document.querySelectorAll('.light');
    let startTime;
    let timeout;
    let lightTimers = [];
    let isTestRunning = false;
    let allowEarlyClick = false;

    const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        message.textContent = 'Get ready...';
        allowEarlyClick = false;
        isTestRunning = false;

        // Reset lights
        lights.forEach(light => light.style.backgroundColor = 'grey');

        // turn lights on one by one
        let totalDelay = 0;
        lights.forEach((light, index) => {
            let delay = randomDelay(1400, 2800); // Random delay between 1.4 and 2.8 seconds
            totalDelay += delay;
            lightTimers[index] = setTimeout(() => {
                light.style.backgroundColor = 'red';
                if (index === lights.length - 1) {
                    message.textContent = 'Wait for lights out...';
                    timeout = setTimeout(() => {
                        lights.forEach(light => light.style.backgroundColor = 'grey');
                        message.textContent = 'Go!';
                        startTime = Date.now();
                        isTestRunning = true;
                    }, randomDelay(2000, 5000)); // Random delay between 2 and 5 seconds before lights go out
                }
            }, totalDelay);
        });

        // delay before allowing early click
        setTimeout(() => {
            allowEarlyClick = true;
        }, 500); // 0.5 second delay
    });

    document.body.addEventListener('click', () => {
        if (isTestRunning) {
            const reactionTime = Date.now() - startTime;
            const seconds = Math.floor(reactionTime / 1000);
            const milliseconds = reactionTime % 1000;
            message.textContent = `Your reaction time is ${seconds},${milliseconds} seconds. Click start to try again.`;
            isTestRunning = false;
            startButton.style.display = 'block';
        } else if (allowEarlyClick) {
            // Check if the user clicked too soon
            if (startButton.style.display === 'none') {
                clearTimeout(timeout);
                lightTimers.forEach(timer => clearTimeout(timer));
                message.textContent = 'Too soon! Click start to try again.';
                lights.forEach(light => light.style.backgroundColor = 'grey');
                startButton.style.display = 'block';
            }
        }
    });
});
