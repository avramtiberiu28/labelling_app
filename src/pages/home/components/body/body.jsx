//body.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { faPrint, faCopy, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from "sweetalert2";
import {Button, Card} from 'react-bootstrap';
import ModalPrint from "../modalPrint/modalPrint";
import ModalEdit from "../modalEdit/modalEdit";
import ModalCopy from "../modalCopy/modalCopy";

export default function Body({id_categorie, id_locatie, admin, handleShowModal, refreshTable, setRefreshTable}) {
  const [tabel, setTabel] = useState([]);
  const [etichete, setEtichete] = useState([]);
  const [filteredEtichete, setFilteredEtichete] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isModalPrintOpen, setIsPrintModalOpen] = useState(false);
  const [isModalEditOpen, setIsEditModalOpen] = useState(false);
  const [isModalCopyOpen, setIsCopyModalOpen] = useState(false);
  const [idLabel, setIdLabel] = useState(null);
  const [idCategorie, setIdCategorie] = useState(null);
  const [refreshTableDelete, setRefreshTableDelete] = useState(false); // Starea pentru reîmprospătarea tabelului
  const [isAdmin, setIsAdmin] = useState(localStorage.admin);
  const [idLocatie, setIdLocatie] = useState(null);

console.log(admin, id_societate, id_locatie);

  const fetchEtichete = async () => {
    try {
      const response = await axios.get(
        `http://${API_URL}:3005/etichete/${id_societate}/${id_locatie}`
      );
      setEtichete(response.data);
      setFilteredEtichete(response.data);
    } 
    catch (error) {
      console.error("Eroare la aducerea etichetelor:", error);
    }
  };
  
  const deleteLabel = async (id_eticheta) => {
    try {
      await axios.get(`http://${API_URL}:3005/deleteLabel/${id_eticheta}`);
      setIdLabel(id_eticheta); // Actualizează id-ul etichetei șterse pentru a declanșa reîmprospătarea tabelului
      setRefreshTableDelete(true); // Declanșează reîmprospătarea tabelului
      Swal.fire({
        title: "Sters!",
        text: "Eticheta a fost stearsa!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
    } 
    catch (error) {
      console.error("Eroare la stergerea etichetei:", error);
    }
  };

  const handleOnClickLabel = (id_eticheta, id_categorie, actiune) => {
    //console.log('id_eticheta: ',id_eticheta, 'id_categorie: ', id_categorie, 'actiune: ', actiune);
    if(actiune === 'print'){
      setIsPrintModalOpen(true);
    }
    else if(actiune === 'edit'){
      setIsEditModalOpen(true);
    }
    else if(actiune === 'copy'){
      setIsCopyModalOpen(true);
    }
    else if(actiune === 'delete'){
      Swal.fire({
        title: "Esti sigur ca vrei sa stergi eticheta?",
        text: "Nu poti sa o mai recuperezi, dupa stergere!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor: "#d33",
        confirmButtonText: "Da, sterge!",
        cancelButtonText: "Anuleaza",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteLabel(id_eticheta);
        }
        else if(result.dismiss === Swal.DismissReason.cancel){
          Swal.fire({
            title: 'Anulat!',
            text: 'Eticheta nu a fost stearsa.',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
    }
    setIdLabel(id_eticheta);
    setIdCategorie(id_categorie);
  }

  function generare_casute(contor, etichete) {
    const casute = [];
    for (let i = 0; i < contor; i++) {
      casute.push(
        <div key={etichete[i].id_eticheta} className="flex">
          <Card className="w-full border-2 border-color-custom p-2">
            <Card.Header className="h-10">
              <Card.Title>{etichete[i].denumire}</Card.Title>
            </Card.Header>
            <Card.Footer className="relative">
              {isAdmin == 1 ? 
                <div className="grid grid-cols-4 gap-4 px-3 mb-3">
                  <Button onClick={() => handleOnClickLabel(etichete[i].id_eticheta, etichete[i].id_categorie, 'print')} title="Tipareste eticheta" className="flex justify-center items-center mt-10 admin" variant="success"><FontAwesomeIcon icon={faPrint}/></Button>
                  <Button onClick={() => handleOnClickLabel(etichete[i].id_eticheta, etichete[i].id_categorie, 'edit')} title="Editeaza eticheta" className="flex justify-center items-center mt-10 admin" variant="warning"><FontAwesomeIcon icon={faEdit}/></Button>
                  <Button onClick={() => handleOnClickLabel(etichete[i].id_eticheta, etichete[i].id_categorie, 'copy')} title="Copiaza eticheta" className="flex justify-center items-center mt-10 admin" variant="primary"><FontAwesomeIcon icon={faCopy}/></Button>
                  <Button onClick={() => handleOnClickLabel(etichete[i].id_eticheta, etichete[i].id_categorie, 'delete')} title="Sterge eticheta" className="flex justify-center items-center mt-10 admin" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>  
                </div> 
                :
                <Button onClick={() => handleOnClickLabel(etichete[i].id_eticheta,etichete[i].id_categorie, 'print')} className="mt-10" variant="success"><FontAwesomeIcon icon={faPrint}/> Tipareste</Button>
              }
            </Card.Footer>
          </Card>
        </div>
      );
    }
    return casute;
  }
  
  useEffect(() => {
    fetchEtichete();
    if(refreshTable){
      setRefreshTable(false);
    }
  }, [refreshTable]);

  useEffect(() => {
    fetchEtichete();
    if(refreshTableDelete){
      setRefreshTableDelete(false);
    }
  }, [id_societate, refreshTableDelete]);

  useEffect(() => {
    const filtered = activeCategory ? etichete.filter(eticheta => eticheta.id_categorie === activeCategory) : etichete;
    setFilteredEtichete(filtered);
  }, [activeCategory, etichete]);

  useEffect(() => {
    setActiveCategory(id_categorie);
  }, [id_categorie]);

  useEffect(() => {
    setTabel(generare_casute(filteredEtichete.length, filteredEtichete));
  }, [filteredEtichete, idLabel]);

  return (
    <div className="grid grid-cols-6 gap-4 mt-20 w-full">
      {tabel}
      {isModalPrintOpen && (
        <ModalPrint
          show={isModalPrintOpen}
          onClose={() => setIsPrintModalOpen(false)}
          id_eticheta={idLabel}
          id_categorie={idCategorie}
        />
      )}
      {isModalEditOpen && (
        <ModalEdit
          show={isModalEditOpen}
          onClose={() => setIsEditModalOpen(false)}
          id_eticheta={idLabel}
          id_categorie={idCategorie}
          onLabelEditet={() =>  {
            setRefreshTable(true);
          }}
        />
      )}
      {isModalCopyOpen && (
        <ModalCopy
          show={isModalCopyOpen}
          onClose={() => setIsCopyModalOpen(false)}
          id_eticheta={idLabel}
          id_categorie={idCategorie}
          onLabelAdded={() =>  {
            setRefreshTable(true);
          }}
        />
      )}
    </div>
  );
}
