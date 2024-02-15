//categorii_etichete.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
export default function Categorii_etichete({ id_societate, id_locatie, onCategoryChange }) {
    const [categorii, setCategorii] = useState([]);
    const [categoriiSelect, setCategoriiSelect] = useState([]);
    const [activeCategory, setActiveCategory] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const handleClick = (id) => {
        setActiveCategory(id);
        onCategoryChange(id);
    }

    
    

    const fetchCategorii = async () => {
        try {
            const response = await axios.get(
                `http://${API_URL}:3005/categorii/${id_societate}/${id_locatie}`
            );
            setCategorii(response.data);
        } catch (error) {
            console.error("Eroare la aducerea categoriilor:", error);
        }
    };

    const adaugaCategorie = async (categorie) => {
        try {
            const response = await axios.get(
                `http://${API_URL}:3005/adaugaCategorie/${id_societate}/${id_locatie}/${categorie}`
            );
            console.log(response.data);
            setRefresh(true)
        } catch (error) {
            console.error("Eroare la introducerea categoriei:", error);
        }
    }
    const stergeCategorie = async (id_categorie) => {
        try {
            const response = await axios.get(
                `http://${API_URL}:3005/stergeCategorie/${id_societate}/${id_locatie}/${id_categorie}`
            );
            console.log(response.data);
            setRefresh(true)
        } catch (error) {
            console.error("Eroare la introducerea categoriei:", error);
        }
    }
    const handleClickAdd = () => {
        Swal.fire({
            title: "Introdu categorie noua",
            input: "text",
            inputLabel: "Categorie noua",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Adauga',
            cancelButtonText: 'Anuleaza',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            inputValidator: (value) => {
                if (!value) {
                    return "Trebuie sa scrii ceva!";
                }
            }
        }).then((result) => {
            if(result.isConfirmed){
                console.log(result.value);
                adaugaCategorie(result.value);
                Swal.fire({
                    icon: "success",
                    title: "Categorie salvata cu succes!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else if(result.dismiss === Swal.DismissReason.cancel){
                Swal.fire({
                  title: 'Anulat!',
                  text: 'Categoria nu a fost adaugata.',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
        });
    }
    
    const handleClickDelete = () => {
        Swal.fire({
            title: "Sterge categorie",
            input: "select",
            inputOptions : categoriiSelect,
            inputPlaceholder: "Alege o categorie",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sterge',
            cancelButtonText: 'Anuleaza',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            inputValidator: (value) => {
                if (!value) {
                    console.log(value)
                    return "Trebuie sa alegi o categorie!";
                }
            }
        }).then((result) => {
            if(result.isConfirmed){
                console.log(result.value);
                stergeCategorie(result.value);
                Swal.fire({
                    icon: "success",
                    title: "Categorie stearsa cu succes!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else if(result.dismiss === Swal.DismissReason.cancel){
                Swal.fire({
                  title: 'Anulat!',
                  text: 'Categoria nu a fost stearsa.',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500
                })
              }
        });
    }
    useEffect(() => {
        fetchCategorii();
        if(refresh){
            setRefresh(false);
        }
    }, [refresh]);

    useEffect(() => {
        fetchCategorii();
    }, [id_societate]);

    useEffect(() => {
        categorii.map((categorie) => {
            setCategoriiSelect(prevCat => ({
                ...prevCat,
                [categorie.id_categorie]: categorie.denumire
            }));
        })
    }, [categorii]);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <div className="mt-20 xs:hidden categories sm:block border-b-2 border-color-custom">
            <div className="flex space-x-10 flex-row justify-start">
                {categorii.map((item) => (
                    <a
                        key={item.id_categorie}
                        onClick={() => handleClick(item.id_categorie)}
                        className={classNames(
                            item.id_categorie === activeCategory ? 'categories-button-active' : 'hover:bg-transparent',
                            'px-3 text-xl font-bold bottom-[-2px]'
                        )}
                    >
                        {item.denumire}
                    </a>
                ))}
                <a
                    id="all-labels"
                    key={0}
                    onClick={() => handleClick(0)}
                    className={classNames(
                        0 === activeCategory ? 'categories-button-active' : 'hover:bg-transparent','px-3 text-xl font-bold bottom-[-2px]'
                    )}
                >
                    Toate
                </a>
                {admin == 1 ?
                    <>
                        <a
                            id="add-labels"
                            key={'add'}
                            onClick={() => handleClickAdd()}
                            className='justify-self-end pl-20 text-xl font-bold bottom-[-2px]'
                        >
                            <FontAwesomeIcon icon={faAdd} /> Adauga categorie
                        </a>
                        <a
                            id="delete-labels"
                            key={'delete'}
                            onClick={() => handleClickDelete()}
                            className='justify-self-end self-end pl-20 text-xl font-bold bottom-[-2px]'
                        >
                            <FontAwesomeIcon icon={faMinus} /> Sterge categorie
                        </a>
                    </>:
                    null
                }
            </div>
        </div>
    );
}
