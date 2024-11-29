import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import questionsData from '../data/ordenar2num.json'; // Archivo JSON con las preguntas
import styles from '../styles/styleGame.module.css';
import Image from 'next/image';
import { BackToMenu } from './game';

const DraggableItem = ({ id, content }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      className={styles.draggableItem}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        zIndex: 5,
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

export const LogicLevelTwo = ({ onComplete }) => {
  const getRandomInt = (max) => Math.floor(Math.random() * max);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(getRandomInt(questionsData.length));
  const [initialElements, setInitialElements] = useState(questionsData[currentQuestionIndex].numbers);
  const [leftElement, setLeftElement] = useState(undefined);
  const [rightElement, setRightElement] = useState(undefined);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
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

  useEffect(() => {
    // Opcional: Reproducir automáticamente cuando se carga la pregunta
    //playAudio();
  }, [currentQuestionIndex]);

  const isOrderCorrect = () => {
    const correctAnswer = questionsData[currentQuestionIndex].correct_answer;
    return JSON.stringify([leftElement, rightElement]) === JSON.stringify(correctAnswer);
  };

  const resetElements = () => {
    setInitialElements(questionsData[currentQuestionIndex].numbers);
    setLeftElement(undefined);
    setRightElement(undefined);
  };

  const goToNextQuestion = () => {
    const nextIndex = getRandomInt(questionsData.length);
    setCurrentQuestionIndex(nextIndex);
    setInitialElements(questionsData[nextIndex].numbers);
    setLeftElement(undefined);
    setRightElement(undefined);
  };

  const onDragEnd = (event) => {
    const sourceId = event.active.id;
    const destinationId = event.over?.id;

    if (!destinationId) return;

    const sourceIdInt = parseInt(sourceId);

    if (destinationId === 'initial') {
      const updatedInitialElements = [...initialElements, sourceIdInt];
      setInitialElements(updatedInitialElements);

      if (leftElement === sourceIdInt) setLeftElement(undefined);
      if (rightElement === sourceIdInt) setRightElement(undefined);
    } else if (destinationId === 'left-target') {
      if (leftElement !== undefined) {
        setInitialElements((prev) => [...prev, leftElement]);
      }
      setInitialElements((prev) => prev.filter((item) => item !== sourceIdInt));
      setLeftElement(sourceIdInt);
    } else if (destinationId === 'right-target') {
      if (rightElement !== undefined) {
        setInitialElements((prev) => [...prev, rightElement]);
      }
      setInitialElements((prev) => prev.filter((item) => item !== sourceIdInt));
      setRightElement(sourceIdInt);
    }
  };

  useEffect(() => {
    if (leftElement !== undefined && rightElement !== undefined) {
      if (isOrderCorrect()) {
        setAlertMessage('✅ Respuesta correcta!');
        setAlertType('alert-success');
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          setCorrectCount((prev) => prev + 1);

          if (correctCount + 1 < 1) {
            goToNextQuestion();
          }
        }, 2000);
      } else {
        setAlertMessage('Ups! Orden incorrecto. Intenta de nuevo.');
        setAlertType('alert-warning');
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          resetElements();
        }, 2000);
      }
    }
  }, [leftElement, rightElement]);

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


            <div className={styles.droppableTargetArea}>
              <DroppableArea id="left-target">
                {leftElement && <DraggableItem id={String(leftElement)} content={leftElement} />}
              </DroppableArea>
              <span className={styles.betweenText}>{questionsData[currentQuestionIndex].text}</span>
              <DroppableArea id="right-target">
                {rightElement && <DraggableItem id={String(rightElement)} content={rightElement} />}
              </DroppableArea>
            </div>

            <Image src="/images/iconFlecha.svg" alt="Flecha" width={60} height={60} />

            <div className={styles.droppableInitialAreaWrapper}>
              <DroppableArea id="initial" className={styles.droppableInitialArea}>
                {initialElements.map((item) => (
                  <DraggableItem key={item} id={String(item)} content={item} />
                ))}
              </DroppableArea>
            </div>
          </>
        ) : (
          <>
            <h2>¡Felicidades! Haz terminado la etapa 2</h2>
            <button onClick={onComplete} className={styles.completeButton}>
              Finalizar
            </button>
          </>
        )}
      </div>
    </DndContext>
  );
};
