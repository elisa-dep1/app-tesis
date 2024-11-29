import { useRef, useEffect } from "react";
import Navbar from "@/components/navbar";


export default function Learning() {
    const videoRef = useRef(null);

    // Manejador para mostrar y ocultar los controles dinámicamente
    const handleMouseMove = () => {
        const video = videoRef.current;
        if (video) {
            video.setAttribute("controls", "true"); // Muestra los controles al mover el mouse
            clearTimeout(video.hideControlsTimeout);
            video.hideControlsTimeout = setTimeout(() => {
                video.removeAttribute("controls"); // Oculta los controles después de 5 segundos
            }, 5000);
        }
    };

    // Manejador para ocultar controles al salir del área del video
    const handleMouseLeave = () => {
        const video = videoRef.current;
        if (video) {
            video.removeAttribute("controls"); // Oculta los controles al salir del video
        }
    };

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            // Agregar eventos de interacción al video
            video.addEventListener("mousemove", handleMouseMove);
            video.addEventListener("mouseleave", handleMouseLeave);

            // Limpiar eventos al desmontar
            return () => {
                video.removeEventListener("mousemove", handleMouseMove);
                video.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="learning-container">
                <div className="video-container">
                    <p className="video-title">1. Introducción a los signos de comparación</p>
                    <video
                        ref={videoRef} // Referencia al video para manejarlo desde funciones
                        controls
                        className="video-element"
                    >
                        <source src="/videos/videoNro1.mp4" type="video/mp4" />
                        Tu navegador no soporta este formato de video.
                    </video>
                </div>
            </div>
        </>
    );
}
