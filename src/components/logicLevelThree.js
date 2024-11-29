import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import questionsData from '../data/ordenar5num.json'; // Archivo JSON con las preguntas
import styles from '../styles/styleGame.module.css';
import Image from 'next/image';
import { BackToMenu } from './game';

const DraggableItem = ({ id, content }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    return (
        <div
            ref={setNodeRef}
            className={styles.draggableItem2}
            style={{
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
                zIndex: 5
            }}
            {...listeners}
            {...attributes}
        >
            {content}
        </div>
    );
};

const DroppableArea = ({ id, children, isOver, className, style }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`${className} ${isOver ? styles.droppableAreaIsOver : ''}`}
            style={style}
        >
            {children}
        </div>
    );
};

export const LogicLevelThree = ({ onComplete }) => {
    const getRandomInt = (max) => Math.floor(Math.random() * max);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getRandomInt(questionsData.length));
    const [initialElements, setInitialElements] = useState(questionsData[currentQuestionIndex].numbers);
    const [placedElements, setPlacedElements] = useState([undefined, undefined, undefined, undefined, undefined]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [correctCount, setCorrectCount] = useState(0);

    const playAudio = () => {
        const question = questionsData[currentQuestionIndex].question;
        let audio;
        if (question.includes('menor a mayor')) {
            audio = new Audio('/audio/menor-a-mayor.mp3');
        } else if (question.includes('mayor a menor')) {
            audio = new Audio('/audio/mayor-a-menor.mp3');
        }
        if (audio) {
            audio.play();
        }
    };

    const isOrderCorrect = () => {
        const correctAnswer = questionsData[currentQuestionIndex].correct_answer;
        return JSON.stringify(placedElements) === JSON.stringify(correctAnswer);
    };

    const resetElements = () => {
        setInitialElements(questionsData[currentQuestionIndex].numbers);
        setPlacedElements([undefined, undefined, undefined, undefined, undefined]);
    };

    const goToNextQuestion = () => {
        const nextIndex = getRandomInt(questionsData.length);
        setCurrentQuestionIndex(nextIndex);
        setInitialElements(questionsData[nextIndex].numbers);
        setPlacedElements([undefined, undefined, undefined, undefined, undefined]);
    };

    const onDragEnd = (event) => {
        const sourceId = event.active.id;
        const destinationId = event.over?.id;

        if (!destinationId) return;

        const sourceIdInt = parseInt(sourceId);

        if (destinationId.startsWith("initial") && placedElements.includes(sourceIdInt)) {
            setPlacedElements(
                placedElements.map((item) => (item === sourceIdInt ? undefined : item))
            );
            setInitialElements([...initialElements, sourceIdInt]);
        } else if (destinationId.startsWith("target") && initialElements.includes(sourceIdInt)) {
            const targetIndex = parseInt(destinationId.split("-")[1], 10);
            if (placedElements[targetIndex] === undefined) {
                setInitialElements(initialElements.filter(item => item !== sourceIdInt));
                const updatedPlacedElements = [...placedElements];
                updatedPlacedElements[targetIndex] = sourceIdInt;
                setPlacedElements(updatedPlacedElements);
            }
        }
    };

    useEffect(() => {
        if (!placedElements.includes(undefined)) {
            if (isOrderCorrect()) {
                setAlertMessage("✅ Orden correcto!");
                setAlertType("alert-success");
                setShowAlert(true);
                setCorrectCount(prev => prev + 1);

                setTimeout(() => {
                    setShowAlert(false);
                    goToNextQuestion();
                }, 2000);

            } else {
                setAlertMessage("Ups! Orden incorrecto. Intenta de nuevo.");
                setAlertType("alert-warning");
                setShowAlert(true);

                setTimeout(() => {
                    setShowAlert(false);
                    resetElements();
                }, 2000);
            }
        }
    }, [placedElements]);

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <div className={styles.gameContainer}>
                {correctCount < 1 ? (
                    <>
                        {showAlert && (
                            <div className={`alert ${alertType} ${styles.floatingAlert}`} role="alert">
                                {alertMessage}
                            </div>
                        )}
                        <BackToMenu/>
                        <div className={styles.titleAudio}>
                            <span className={styles.gameTitle}>{questionsData[currentQuestionIndex].question}</span>
                            <button onClick={playAudio} className={styles.audioButton}>
                                🔊
                            </button>

                        </div>
                        <div className={styles.droppableTargetArea2}>
                            {placedElements.map((item, index) => (
                                <React.Fragment key={index}>
                                    <DroppableArea id={`target-${index}`}>
                                        {item !== undefined && <DraggableItem id={String(item)} content={item} />}
                                    </DroppableArea>
                                    {index < placedElements.length - 1 && (
                                        <span className={styles.separator}>
                                            {questionsData[currentQuestionIndex].symbol}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <Image src="/images/iconFlecha.svg" alt="Flecha" width={60} height={60} />

                        <div className={styles.droppableInitialAreaWrapper2}>
                            <DroppableArea id="initial" className={styles.droppableInitialArea2}>
                                {initialElements.map(item => (
                                    <DraggableItem key={item} id={String(item)} content={item} />
                                ))}
                            </DroppableArea>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>¡Felicidades! Haz terminado la etapa 3</h2>
                        <button onClick={onComplete} className={styles.completeButton}>Finalizar</button>
                    </>
                )}
            </div>
        </DndContext>
    );
};
