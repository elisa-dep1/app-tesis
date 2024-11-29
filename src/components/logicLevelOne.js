import { useState } from 'react';
import preguntas from '../data/preguntas.json';
import styles from '../styles/styleGame.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Image from 'next/image';
import { BackToMenu } from './game';

export function LogicLevelOne({ onComplete }) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    const [numb, setNumb] = useState(getRandomInt(preguntas.length));
    const [correctCount, setCorrectCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");

    const pregunta = preguntas[numb];

    const isCorrect = (pregunta, option) => {
        if (pregunta.correct_answer === pregunta.options[option]) {
            setAlertMessage("✅ Respuesta correcta!");
            setAlertType("alert-success");
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                setCorrectCount((prevCount) => prevCount + 1);

                if (correctCount + 1 < 5) {
                    setNumb(getRandomInt(preguntas.length));
                }
            }, 2000);
        } else {
            setAlertMessage(" Ups ¡Vuelve a intentarlo!");
            setAlertType("alert-warning");
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                if (correctCount < 5) {
                    setNumb(getRandomInt(preguntas.length));
                }
            }, 2000);
        }
    };

  
    

    return (
        <>
            {showAlert && (
                <div className={`alert ${alertType} ${styles.floatingAlert}`} role="alert">
                    {alertMessage}
                </div>
            )}
            <div className={styles.containerLevel}>
                {correctCount < 1 ? (
                    <>
                   <BackToMenu/>
                        <p className="text-effect" >Selecciona el signo correcto </p>
                        <p className='questionBox'>¿ <span className='textUnderline'>{pregunta.numbers[0]}</span> es menor, igual o mayor que <span className='textUnderline'>{pregunta.numbers[1]}</span> ?</p>
                        <div className={styles.containerButtons}>
                            <button className={`${styles.optionButton} ${styles.colorButton1}`} onClick={() => isCorrect(pregunta, 0)}><span style={{fontSize: '30px'}}> {"<"} </span> <br/> {pregunta.options[0]}</button>
                            <button className={`${styles.optionButton} ${styles.colorButton2}`} onClick={() => isCorrect(pregunta, 1)}><span style={{fontSize: '30px'}}> {"="} </span> <br/> {pregunta.options[1]}</button>
                            <button className={`${styles.optionButton} ${styles.colorButton3}`} onClick={() => isCorrect(pregunta, 2)}><span style={{fontSize: '30px'}}> {">"} </span> <br/> {pregunta.options[2]}</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>¡Felicidades! Haz terminado la etapa 1</h2>
                       
                        <button onClick={onComplete} className={styles.completeButton}>Finalizar</button>

                    </>
                )}
            </div>
        </>
    );
}

