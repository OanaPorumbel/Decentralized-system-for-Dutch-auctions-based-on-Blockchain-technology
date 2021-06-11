import React, { useEffect, useState } from 'react';

const Timer = ({ finishTime }) => {

    let [secondsLeft, setSecondsLeft] = useState(finishTime - Date.now() / 1000);
    let timerInterval;

    const timerFunction = () => {
        timerInterval = setInterval(() => {
            timeLeft()
        }, 1000)
    }

    const timeLeft = () => {
        const secondsLeftAux = (finishTime - Math.floor(Number(Date.now()) / 1000))
        setSecondsLeft(secondsLeftAux)
    }

    const displaySecondsLeft = (secondsLeft) => {
        if (secondsLeft <= 0) {
            return "Time expired!"
        }
        if (secondsLeft <= 60) return `There are ${secondsLeft} seconds left!`
        if (secondsLeft <= 3600) return `There are ${Math.floor(secondsLeft / 60)} minutes and ${secondsLeft % 60} seconds left!`
        if (secondsLeft <= 3600 * 24) return `There are ${Math.floor(secondsLeft / 3600)} hours and ${Math.floor(secondsLeft % 3600 / 60)} minutes left!`
        return `There are ${Math.floor(secondsLeft / (3600 * 24))} days left!`
    }

    useEffect( () => {
        timerFunction();
        return function cleanup() {
            clearInterval(timerInterval)
        }
    })

    return (
        <div>
            <p>{displaySecondsLeft(secondsLeft)}</p>
        </div>
    );
};

export default Timer;