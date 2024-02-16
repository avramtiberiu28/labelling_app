//home.jsx

import Meniu from "./components/navbar/navbar"
import Categorii_etichete from "./components/categorii_etichete/categorii_etichete";
import Body from "./components/body/body"
import { useState } from "react";


export default function Home () {
    const [id_categorie, setId_categorie] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [idLocatie, setIdLocatie] = useState(localStorage.id_locatie);
    document.body.classList.remove('flex');

    const handleCategoryChange = (id_categorie) => {
        setId_categorie(id_categorie);
    }

    const handleRefresh = () => {
        setRefresh(true);
    };
    
    return (
        <>
            <Meniu onRefresh={handleRefresh} />
            <Categorii_etichete id_societate={localStorage.id_societate} id_locatie={localStorage.id_locatie} onCategoryChange={handleCategoryChange}/>
            <Body id_categorie={id_categorie} id_locatie={idLocatie} admin={admin} handleShowModal={() => setShowModal(true)}  refreshTable = {refresh} setRefreshTable={setRefresh} />
        </>
    )
}