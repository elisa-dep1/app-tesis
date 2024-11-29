import Image from 'next/image';
import styles from '../styles/styleGame.module.css';
import { act, useContext, useState } from 'react';
import Game, { GameContextProvider, useGameContext } from '../components/game';

function Star({ win }) {
    if (win) return <Image src="/images/estrellaWin.svg" height={50} width={50}></Image>
    return <Image src="/images/estrellaDisabled.svg" height={50} width={50}></Image>
}
function Score() {
    const { gameState } = useGameContext();
    const { completed } = gameState


    return (
        <div className='start display'>
            <>
                {[1, 2, 3].map((level, index) => (
                    // Las estrellas solo se activan de forma secuencial
                    <Star key={level} win={index < completed.length} />
                ))}
            </>
        </div>
    );
}


function ButtonBack() {

    return (
        <button style={{ margin: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', }}>
            ← Volver al menú
        </button>
    );

}

export default function Practice() {
    const [gameStart, setGameStart] = useState(false);
    const startGame = () => {
        setGameStart(true);
    }


    return (
        <GameContextProvider >
            <div className={styles.background}>
                <Score />
                <div className='contectBoxGame display'>
                    <div className="contectGame display">

                        {gameStart ? <> <Game /> </> : <>
                            <h1> ¡Prepárate para aprender jugando!</h1>
                            <h2>Desafiate a ti mismo y conviertete en un experto</h2>
                            <button onClick={startGame} className='buttonPlay'>
                                <Image src="/images/boton-play.gif" alt='imagen de boton' width={450} height={200} />
                            </button></>}

                    </div>
                </div>

            </div>
        </GameContextProvider>

    );
}




