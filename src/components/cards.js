import { useRouter } from 'next/router'

export default function CardsInit() {
    const router = useRouter()
    return (
        <div className="containerCards">
            <button onClick={() => router.push('/learning')} className="card-init" >
                Sección de aprendizaje
            </button>
            <button onClick={() => router.push('/practice')} className="card-init" >
                Sección de práctica
            </button>
            <button onClick={() => router.push('/quizzes')} className="card-init" >
                Sección de pruebas
            </button>

        </div>
    );
}
