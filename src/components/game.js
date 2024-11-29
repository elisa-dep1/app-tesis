import { createContext, useContext, useState } from "react";
import { LogicLevelOne } from "./logicLevelOne";
import { LogicLevelTwo } from "./logicLevelTwo";
import { LogicLevelThree } from "./logicLevelThree";

export default function Game() {
    const { gameState, setGameState } = useGameContext();


    const isDisabledGame = (levelNumber) => {
        return !!gameState?.completed?.includes(levelNumber);
    };

    const onGameStart = (levelNumber) => {
        setGameState(prev => ({ ...prev, active: levelNumber }));
    };

    if (gameState.active === "none") {
        return (
            <>

                <p style={{ fontSize: '24px', marginBottom: '30px' }}>¡Bienvenido! Iniciamos esta divertida aventura de números</p>
                <div className="container-cards-game">
                    <button
                        disabled={isDisabledGame(1)}
                        className="card-content-game"
                        onClick={() => onGameStart(1)}
                    >
                        <span> Nivel 1 </span><br />
                        <span> Comparar números </span>
                    </button>
                    <button
                        disabled={isDisabledGame(2)}
                        className="card-content-game"
                        onClick={() => onGameStart(2)}
                    >
                        <span> Nivel 2 </span><br />
                        <span> Ordenar 2 números</span>
                    </button>

                    <button
                        disabled={isDisabledGame(3)}
                        className="card-content-game"
                        onClick={() => onGameStart(3)}
                    >
                        <span> Nivel 3 </span><br />
                        <span> Ordenar 5 números</span>
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {gameState.active === 1 && (
                <LevelOne />
            )}
            {gameState.active === 2 && <LevelTwo />}
            {gameState.active === 3 && <LevelThree />}
        </>
    );
}


export function BackToMenu() {
    const {goBackGame} = useGameContext();

    return (
        <button className="buttonToBack display" onClick={goBackGame}> ⬅ </button>
    )
}

function LevelOne() {
    const { finishGame } = useGameContext();

    const handleLevelComplete = () => {
        finishGame(1);
    };

    return (
        <LogicLevelOne onComplete={handleLevelComplete} />
    );
}


function LevelTwo() {
    const { finishGame } = useGameContext();

    const handleLevelComplete = () => {
        finishGame(2);
    };

    return (
        <>
            <LogicLevelTwo backToMenu={BackToMenu}  onComplete={handleLevelComplete} />
        </>
    );
}


function LevelThree() {
    const { finishGame } = useGameContext();

    const handleLevelComplete = () => {
        finishGame(3);
    };

    return (
        <>
            <LogicLevelThree onComplete={handleLevelComplete} />
        </>
    );
}

const gameContext = createContext();

export const GameContextProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        active: "none",
        completed: []
    });

    const finishGame = (levelNumber) => {
        setGameState(prev => ({ ...prev, active: "none", completed: [...prev.completed, levelNumber] }));
    };
    const goBackGame = () => {
        setGameState(prev => ({ ...prev, active: "none" }));
    };

    return (
        <gameContext.Provider value={{ gameState, setGameState, finishGame, goBackGame }}>
            {children}
        </gameContext.Provider>
    );
};

export const useGameContext = () => useContext(gameContext);
