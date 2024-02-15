import {Modal, Button, Form, Col, Row, FloatingLabel, ToggleButton} from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { faXmark, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Swal from 'sweetalert2';

const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};


export default function ModalEdit({ show, onClose, id_eticheta , id_categorie, onLabelEditet}) {
    const [showModal, setShowModal] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [isTransat, setIsTransat] = useState(false);
    const [categorii, setCategorii] = useState([]);
    const [imageUrl, setImageUrl] = useState(null); // Noua stare pentru URL-ul imaginii
    const [produs, setProdus] = useState('');
    const [style, setStyle] = useState('');
    const [checked, setChecked] = useState(false);
    const [label, setLabel] = useState({
        denumire: '',
        id_categorie: '',
        informatiiAditionale: '',
        ingrediente: '',
        valoriEnergetice: '',
        alergeni: '',
        contineUrme: '',
        precizari: '',
        recomandari: '',
        clasa: '',
        dataExpirarii: '',
        dataCongelarii: '',
        transat: '0',
        producator: 'SC FRAHER RETAIL, STR. I.L.Caragiale, tel: 0240531111'
    });
    const [prevLabel, setPrevLabel] = useState(label);
    const [invalid, setInvalid] = useState({
        denumire: '',
        id_categorie: '',
        ingrediente: '',
        valoriEnergetice: '',
        recomandari: '',
        dataExpirarii: ''
    });
    const handleBlur = (e) => {
        const { id, value } = e.target;
        setLabel(prevLabel => ({
            ...prevLabel,
            [id]: value
        }));
    }
    const handleChange = (e) => {
        const { id, value } = e.target;
        setLabel(prevLabel => ({
            ...prevLabel,
            [id]: value
        }));
    }

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setLabel(prevLabel => ({
            ...prevLabel,
            [name]: checked ? 1 : 0
        }))
        setChecked(checked);
    }

    const fetchImage = async () => {
        try {
            const response = await axios.post(`http://${API_URL}:3003/generateLabel/`, {id_societate: id_societate, id_locatie: id_locatie, prenume: prenume, VA: VA, label: label}, {responseType: 'arraybuffer'});
            // Convertim răspunsul la obiectul Blob pentru a-l putea afișa
            const blob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setImageUrl(imageUrl); // Actualizăm URL-ul imaginii în starea componentei
        } 
        catch (error) {
            console.error("Eroare la aducerea imaginii:", error);
        }
    };
    const handleSaveLabel = async () => {
        let fieldsToValidate = [];
        if(id_societate === '2'){
            if(locatii_corner.includes(id_locatie)){
                fieldsToValidate = ['denumire', 'id_categorie', 'ingrediente', 'valoriEnergetice', 'recomandari', 'dataExpirarii']
            }
            else if(id_locatie === '8'){
                fieldsToValidate = ['denumire', 'id_categorie'];
            }
        }
        let isInvalid = false;
        fieldsToValidate.forEach(field => {
            if (label[field] === '') {
                setInvalid(prevState => ({ ...prevState, [field]: 'show invalid' }));
                isInvalid = true;
            }
        });

        if (isInvalid) {
            return;
        }
        try {
            const response = await axios.post(`http://${API_URL}:3005/saveLabel/`, {id_societate: id_societate, id_locatie: id_locatie ,label: label, CRUD: 'update', id_eticheta: id_eticheta});
            handleCloseModal();
            Swal.fire({
                icon: "success",
                title: "Eticheta editata cu succes!",
                showConfirmButton: false,
                timer: 1500
            });
        } 
        catch (error) {
            console.error("Eroare la salvarea etichetei:", error);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        onClose();
        onLabelEditet();
    };

    useEffect(() => {
        const fetchLabel = async () => {
            try {
                const response = await axios.get(
                    `http://${API_URL}:3005/getLabelDetails/${id_societate}/${id_locatie}/${id_eticheta}`
                );
                setLabel(response.data[0]);
            } catch (error) {
                console.error("Eroare la aducerea categoriilor:", error);
            }
        };
        fetchLabel();
    }, [id_eticheta]);
    

    useEffect(() => {
        if (id_societate === '2' && locatii_corner.includes(id_locatie)) {
            setReadOnly(true);
            setProdus('Produs in unitate FAST FOOD');
            setStyle('img_modalEdit gustaria');
            setLabel(prevState => ({ ...prevState, informatiiAditionale: 'Produs in unitate FAST FOOD' }));

        } 
        else if(id_societate === '2' && id_locatie === '8'){
            if(categorii_52x73.includes(id_categorie)){
                setStyle('img_modalEdit carmangerie52x73');
            }
            setIsTransat(true);
            setReadOnly(true);
        }
        // Definirea funcției fetchImage în interiorul funcției useEffect pentru a o putea folosi
    
        fetchImage(); // Apelăm funcția fetchImage pentru a obține URL-ul imaginii*/
      }, [id_societate, id_locatie, id_categorie]);

    useEffect(() => {
        const isModified = !isEqual(label, prevLabel);
        if (isModified) {
            fetchImage();
            setPrevLabel(label);
        }
    }, [label]);

    useEffect(() => {
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
        fetchCategorii();
    }, [id_societate]);
    
    return (
        <Modal show={showModal} onHide={handleCloseModal} animation={true} style={{ opacity: 1 }} id='modal_edit' contentClassName='flex flex-row'>
            <div className='grid grid-cols-1 relative left-[-2.4rem] justify-center items-center w-[45px]'>
                <div className='close-button-box rounded-full w-[4.5rem] h-[4.5rem] border-2 border-color-custom flex items-center justify-center items-start'>
                    <a href="#" className='mt-[2px] mr-[0.5px]' id='btn_close_modal' onClick={handleCloseModal}><FontAwesomeIcon icon={faXmark} /></a>
                </div>
            </div>
            <div className='relative flex flex-col w-full left-[-2.15rem] pt-5'>
                <div className='flex flex-row w-full justify-center items-center'>
                    <p className='text-4xl font-bold'>Formular editare eticheta</p>
                </div>
                <div className='flex flex-row w-full'>
                    <div className='flex w-full px-10 my-10 border-r-[2px]'>
                        <Form className='w-full'>
                            <Form.Group controlId='denumire'>
                                <Form.Label className='mb-0'>Denumire: </Form.Label>
                                <Form.Control type='input' className={invalid.denumire} defaultValue={label.denumire} name="denumire" onBlur={handleBlur}></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.denumire}>
                                     Trebuie completata o denumire.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='id_categorie'>
                                <Form.Label className='mb-0'>Categorie: </Form.Label>
                                <Form.Select className={invalid.id_categorie} value={label.id_categorie} onChange={handleChange}>
                                    <option id='null'>Selecteaza categorie</option>
                                    {categorii.map((item) => (
                                        <option key={item.id_categorie} id={item.id_categorie} value={item.id_categorie}>{item.denumire}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.id_categorie}>
                                     Trebuie selectata o categorie.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='informatiiAditionale'>
                                <Form.Label className='mb-0'>Produs: </Form.Label>
                                <Form.Control readOnly={readOnly} defaultValue={label.informatiiAditionale} onBlur={handleBlur} type='input'></Form.Control>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='ingrediente'>
                                <Form.Label className='mb-0'>Ingrediente: </Form.Label>
                                <Form.Control as='textarea' defaultValue={label.ingrediente} className={invalid.ingrediente} style={{height: '8rem'}} onBlur={handleBlur}></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.ingrediente}>
                                     Trebuie completate ingredientele.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='valoriEnergetice'>
                                <Form.Label className='mb-0'>Valori energetice /100gr: </Form.Label>
                                <Form.Control as='textarea' defaultValue={label.valoriEnergetice} className={invalid.valoriEnergetice} style={{height: '8rem'}} onBlur={handleBlur}></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.valoriEnergetice}>
                                     Trebuie completate valorile energetice.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='alergeni'>
                                <Form.Label className='mb-0'>Alergeni: </Form.Label>
                                <Form.Control placeholder='Ex. mustar, lactoza, etc.' defaultValue={label.alergeni} type='input' onBlur={handleBlur}></Form.Control>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='contineUrme'>
                                <Form.Label className='mb-0'>Contine urme: </Form.Label>
                                <Form.Control placeholder='Ex. mustar, etc.' defaultValue={label.contineUrme} type='input' onBlur={handleBlur}></Form.Control>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='precizari'>
                                <Form.Label className='mb-0'>Precizari: </Form.Label>
                                <Form.Control placeholder='Ex. +/- 5% grame.' defaultValue={label.precizari} type='input' onBlur={handleBlur}></Form.Control>
                            </Form.Group>
                        </Form>
                    </div>
                    <div className='flex w-full px-10 py-10'>
                        <Form className='w-full'>
                            <Form.Group controlId='recomandari'>
                                <Form.Label className='mb-0'>Recomandari: </Form.Label>
                                <Form.Control className={invalid.recomandari} defaultValue={label.recomandari} placeholder='Ex. Conditii de pastrare +4 - + 10 gr C' type='input' onBlur={handleBlur}></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.recomandari}>
                                     Trebuie completate recomandarile.
                                </Form.Control.Feedback>
                            </Form.Group>
                            {locatii_corner.includes(id_locatie) ?
                                <Form.Group className='pt-5' controlId='dataExpirarii'>
                                    <Form.Label className='mb-0'>Termen de valabilitate: </Form.Label>
                                    <Form.Select className={invalid.dataExpirarii} value={label.dataExpirarii} onChange={handleChange}>
                                        <option id='null'>Selecteaza termen</option>
                                        <option value='24 ore'>24 ore</option>
                                        <option value='48 ore'>48 ore</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid" className={'validation '+invalid.dataExpirarii}>
                                        Trebuie selectat un termen de valabilitate.
                                    </Form.Control.Feedback>
                                </Form.Group> :
                                <Form.Group className='pt-5' controlId='dataExpirarii'>
                                    <Form.Label className='mb-0'>Termen de valabilitate(zile): </Form.Label>
                                    <Form.Control readOnly={readOnly} onBlur={handleBlur} defaultValue={label.dataExpirarii} className={invalid.dataExpirarii} placeholder='Ex. 30, 60, 365' type='number'></Form.Control>
                                    <Form.Control.Feedback type="invalid" className={'validation '+invalid.dataExpirarii}>
                                        Trebuie completat un termen de valabilitate.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            }
                            {isTransat &&
                               <Form.Group className='pt-5' controlId='transat'>
                                    <Form.Label className='mb-0 mr-2'>Transat: </Form.Label>
                                    <input type='checkbox' name='transat' checked={label.transat == 1} onChange={handleCheck}/>
                                </Form.Group>
                            }
                            <Form.Group className='pt-5' controlId='clasa'>
                                <Form.Label className='mb-0'>Ambalat: </Form.Label>
                                <Form.Control placeholder='Ambalat VID.' defaultValue={label.clasa} type='input' onBlur={handleBlur}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <div className='flex justify-center items-center'>
                                    {imageUrl && <img className={style} src={imageUrl} />}
                                </div>
                            </Form.Group>             
                        </Form>
                        
                    </div>
                </div> 
                <div className='flex flex-row w-full justify-center items-center pb-5'>
                    <Button variant="success" id="btn_save_label" onClick={handleSaveLabel}><FontAwesomeIcon icon={faSave} /> Salveaza</Button>
                </div> 
            </div>
      </Modal>
    );
  }
  