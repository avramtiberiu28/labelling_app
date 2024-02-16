//modalAddUser.jsx
import {Modal, Button, Form, Col, Row, FloatingLabel} from 'react-bootstrap'
import { useState, useEffect } from 'react';
import { faXmark, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Swal from 'sweetalert2';

const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};


export default function ModalAddUser({ show, onClose}) {
    const [showModal, setShowModal] = useState(true);
    const [isAdmin, setIsAdmin] = useState(localStorage.admin);
    const [user_info, setUser_info] = useState({
        username: '',
        password: '',
        nume: '',
        prenume: '',
        id_locatie: '',
    });
    const [invalid, setInvalid] = useState({
        username: '',
        password: '',
        nume: '',
        prenume: '',
        id_locatie: '',
    });
    const [locatii, setLocatii] = useState([]);
    const fetchLocatii = async () => {
        try {
            const response = await axios.get(`http://${API_URL}:3005/getLocatii/${id_societate}`);
            setLocatii(response.data);
        }
        catch(error){
            console.error('Eroare la aducerea locatiilor: ', error);
        }
    }
    const handleBlur = (e) => {
        const { id, value } = e.target;
        setUser_info(prevUser => ({
            ...prevUser,
            [id]: value
        }));
    }
    const handleChange = (e) => {
        const { id, value } = e.target;
        setUser_info(prevUser => ({
            ...prevUser,
            [id]: value
        }));
    }
    const handleSaveUser = async () => {
        console.log('test');
        let fieldsToValidate = ['username', 'password', 'nume', 'prenume', 'id_locatie'];
        let isInvalid = false;
        fieldsToValidate.forEach(field => {
            if (user_info[field] === '') {
                setInvalid(prevState => ({ ...prevState, [field]: 'show invalid' }));
                isInvalid = true;
            }
        });
        if (isInvalid) {
            return;
        }
        try {
            const response = await axios.post(`http://${API_URL}:3005/saveUser/`, {id_societate: id_societate, user_info: user_info});
            //console.log(response);
            handleCloseModal();
            Swal.fire({
                icon: "success",
                title: "Utilizator salvat cu succes!",
                showConfirmButton: false,
                timer: 1500
            });
        } 
        catch (error) {
            console.error("Eroare la salvarea utilizatorului:", error);
        }
    }
    const handleCloseModal = () => {
        setShowModal(false);
        onClose();
    };

    useEffect(() => {
        if(isAdmin == 1){
            fetchLocatii();
        }
    },[isAdmin])
    return (
        <Modal show={showModal} onHide={handleCloseModal} animation={true} style={{ opacity: 1 }} id='modal_addUser' contentClassName='flex flex-row'>
            <div className='grid grid-cols-1 relative left-[-2.4rem] justify-center items-center w-[45px]'>
                <div className='close-button-box rounded-full w-[4.5rem] h-[4.5rem] border-2 border-color-custom flex items-center justify-center items-start'>
                    <a href="#" className='mt-[2px] mr-[0.5px]' id='btn_close_modal' onClick={handleCloseModal}><FontAwesomeIcon icon={faXmark} /></a>
                </div>
            </div>
            <div className='relative flex flex-col w-full left-[-2.15rem] pt-5'>
                <div className='flex flex-row w-full justify-center items-center'>
                    <p className='text-4xl font-bold'>Formular adaugare utilizator</p>
                </div>
                <div className='flex flex-row w-full'>
                    <div className='flex w-full px-10 my-10'>
                        <Form className='w-full'>
                            <Form.Group controlId='username'>
                                <Form.Label className='mb-0'>Utilizator(email): </Form.Label>
                                <Form.Control type='email' className={invalid.username} onBlur={handleBlur} name="username"></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.username}>
                                     Trebuie completat un username.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='password'>
                                <Form.Label className='mb-0'>Parola: </Form.Label>
                                <Form.Control type='password' className={invalid.password} onBlur={handleBlur} name="password"></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.password}>
                                     Trebuie completata o parola.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='nume'>
                                <Form.Label className='mb-0'>Nume: </Form.Label>
                                <Form.Control type='input' className={invalid.nume} onBlur={handleBlur} name="nume"></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.nume}>
                                     Trebuie completat un nume.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='prenume'>
                                <Form.Label className='mb-0'>Prenume: </Form.Label>
                                <Form.Control type='input' className={invalid.prenume} onBlur={handleBlur} name="prenume"></Form.Control>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.prenume}>
                                     Trebuie completat un prenume.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className='pt-5' controlId='id_locatie'>
                                <Form.Label className='mb-0'>Locatie: </Form.Label>
                                <Form.Select className={invalid.id_locatie} onChange={handleChange}>
                                    <option id='null'>Selecteaza o locatie</option>
                                    {locatii.map((item) => (
                                        <option key={item.id_locatie} id={item.id_locatie} value={item.id_locatie}>{item.nume}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" className={'validation '+invalid.id_locatie}>
                                     Trebuie selectata o locatie.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    </div>
                </div> 
                <div className='flex flex-row w-full justify-center items-center pb-5'>
                    <Button variant="success" id="btn_save_label" onClick={handleSaveUser}><FontAwesomeIcon icon={faSave} /> Salveaza</Button>
                </div> 
            </div>
      </Modal>
    );
  }
  