import CardsInit from "@/components/cards";
import Navbar from "@/components/navbar";


export default function Home() {
    return (
        <>
            <div className="body">
                <Navbar />
                <div className="containerGeneral">
                    <CardsInit />
                </div>

            </div>

        </>
    );
}
