import {Modal, Button, Form, Col, Row} from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react';
import { faXmark,faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Swal from 'sweetalert2';

const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export default function ModalPrint({ show, onClose, id_eticheta, id_categorie}) {
  const [showModal, setShowModal] = useState(true);
  const [origine, setOrigine] = useState('');
  const [lot, setLot] = useState('');
  const [expiration_date, setExpiration_date] = useState('');
  const [freezer_date, setFreezer_date] = useState('')
  const [cantitate, setCantitate] = useState(1);
  const [readOnly, setReadOnly] = useState(false);
  const [readOnlyExpiry, setReadOnlyExpiry] = useState(false);
  const [isCarmangerie, setIsCarmangerie] = useState(false);
  const [isCongelat, setIsCongelat] = useState(false);
  const [expirationDatePlaceholder, setExpirationDatePlaceholder] = useState('');
  const [denumire, setDenumire] = useState('');
  const [imageUrl, setImageUrl] = useState(null); // Noua stare pentru URL-ul imaginii
  const [style, setStyle] = useState('');
  const [label_info, setLabel_info] = useState({
    origine: '',
    lot: '',
    dataExpirarii: '',
    dataCongelarii: ''
  })
  const [invalid, setInvalid] = useState({
    origine: '',
    lot: '',
    dataExpirarii: '',
    dataCongelarii: ''
});
  const [prevLabel, setPrevLabel] = useState(label_info);
  const inputCantitateRef = useRef(null);

  const fetchImage = async (id_eticheta) => {
    try {
      const response = await axios.post(`http://${API_URL}:3003/generateLabelTabel/`, {id_societate: id_societate, id_locatie: id_locatie, id_eticheta: id_eticheta, prenume: prenume, VA: VA, label_info}, {responseType: 'arraybuffer'});
      // Convertim răspunsul la obiectul Blob pentru a-l putea afișa
      const blob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl); // Actualizăm URL-ul imaginii în starea componentei
    } 
    catch (error) {
      console.error("Eroare la aducerea imaginii:", error);
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setLabel_info(prevLabel => ({
        ...prevLabel,
        [id]: value
    }));
  }
  const handleChange = (e) => {
    const { id, value } = e.target;
    setLabel_info(prevLabel => ({
        ...prevLabel,
        [id]: value
    }));
  }

  const handleCloseModal = () => {
    setShowModal(false);
    onClose();
  };

  const handleClickPrint = async (id_eticheta) => {
    let fieldsToValidate = [];
        if(id_societate === '2'){
            if(locatii_corner.includes(id_locatie)){
                //fieldsToValidate = ['denumire', 'id_categorie', 'ingrediente', 'valoriEnergetice', 'recomandari', 'dataExpirarii']
            }
            else if(id_locatie === '8'){
                if(id_categorie == 7 || id_categorie == 10){
                  fieldsToValidate = ['origine', 'lot', 'cantitate'];
                }
                else{
                  fieldsToValidate = ['origine', 'lot', 'dataExpirarii', 'cantitate'];
                }
            }
        }
        let isInvalid = false;
        fieldsToValidate.forEach(field => {
            if (label_info[field] === '') {
                setInvalid(prevState => ({ ...prevState, [field]: 'show invalid' }));
                isInvalid = true;
            }
        });

        if (isInvalid) {
            return;
        }
    try {
      const response = await axios.post(`http://${API_URL}:3003/generateLabelPrint/`, {id_societate: id_societate, id_locatie: id_locatie, id_eticheta: id_eticheta, prenume: prenume, VA: VA, label_info, cantitate, id_user});
      return [response.data, cantitate]
      // Convertim răspunsul la obiectul Blob pentru a-l putea afișa
      //const blob = new Blob([response.data], { type: 'image/png' });
      //const imageUrl = URL.createObjectURL(blob);
      //setImageUrl(imageUrl); // Actualizăm URL-ul imaginii în starea componentei
    } 
    catch (error) {
      console.error("Eroare la printarea etichetei:", error.response.data);
    }
  };


  useEffect(() => {
    if (id_societate === '2' && locatii_corner.includes(id_locatie)) {
      setReadOnly(true);
      setStyle('img_modalPrint gustaria');
    } 
    else if(id_societate === '2' && id_locatie === '8'){
      setReadOnly(false);
      setIsCarmangerie(true);
      if(categorii_52x73.includes(id_categorie)){
        setStyle('img_modalPrint carmangerie52x73')
      }
      if(categorii_carniva.includes(id_categorie)){
        setStyle('img_modalPrint carmangerieCarniva')
      }
    }
    
    fetchImage(id_eticheta); // Apelăm funcția fetchImage pentru a obține URL-ul imaginii
    
    axios.get(`http://${API_URL}:3005/expiration-date&denumire/${id_eticheta}`)
      .then(response => {
        if(id_societate === '2' && id_locatie === '8'){
          if(id_categorie == '7' || id_categorie == '10'){
            setIsCongelat(true);
            setReadOnlyExpiry(true);
            setExpirationDatePlaceholder('365');
          }
        }
        else{
          setExpirationDatePlaceholder(response.data[0].dataExpirarii);
          setReadOnlyExpiry(true);
        }
        setDenumire(response.data[0].denumire);
      })
      .catch(error => {
        console.error('Error fetching expiration date:', error);
      });
  }, [id_societate, id_locatie, id_eticheta, id_categorie]);

  useEffect(() => {
    if (showModal && inputCantitateRef.current) {
        inputCantitateRef.current.focus(); // Face focus pe câmpul de intrare pentru cantitate
    }
  }, [showModal]);

  useEffect(() => {
    const isModified = !isEqual(label_info, prevLabel);
      if (isModified) {
        fetchImage(id_eticheta);
        setPrevLabel(label_info);
    }
  }, [label_info]);
  return (
    <Modal show={showModal} onHide={handleCloseModal} animation={true} style={{ opacity: 1 }} id='modal_print' contentClassName='flex'>
      <div className='grid grid-cols-1 relative left-[-2.4rem] justify-center items-center w-[45px]'>
        <div className='close-button-box rounded-full w-[4.5rem] h-[4.5rem] border-2 border-color-custom flex items-center justify-center items-start'>
          <a href="#" className='mt-[2px] mr-[0.5px]' id='btn_close_modal' onClick={handleCloseModal}><FontAwesomeIcon icon={faXmark} /></a>
        </div>
      </div>
      <div className='flex flex-col w-full relative left-[-2.3rem] justify-start'>
        <div className='grig grid-cols-1 m-auto'>
          <h4 className='text-3xl font-bold'>{denumire}</h4>
        </div>
        <div className='grid grid-cols-1 mt-auto ml-auto mr-auto mb-[-5rem]'>
          {imageUrl && <img id='label' className={style} src={imageUrl} />}
        </div>
        <div className='grid grid-cols-1 m-auto w-auto h-auto'>
          <Form>
            {isCarmangerie &&
              <Form.Group controlId='origine'>
                <Form.Label>Origine: </Form.Label>
                <Form.Control readOnly={readOnly} className={invalid.origine} onBlur={handleBlur} type='input' placeholder='Ex. RO, EU'></Form.Control>
                <Form.Control.Feedback type="invalid" className={'validation '+invalid.origine}>
                  Trebuie completata o origine.
              </Form.Control.Feedback>
            </Form.Group>
            }
            {isCarmangerie &&
            <Form.Group controlId='lot'>
              <Form.Label>Lot: </Form.Label>
              <Form.Control readOnly={readOnly} className={invalid.lot} onBlur={handleBlur} type='input' placeholder='Ex. 2810'></Form.Control>
              <Form.Control.Feedback type="invalid" className={'validation '+invalid.lot}>
                Trebuie completat un lot.
              </Form.Control.Feedback>
            </Form.Group>
            }
            {/*isCongelat && 
              <Form.Group controlId='dataCongelarii'>
                <Form.Label>Data congelarii(zile): </Form.Label>
                <Form.Control readOnly={readOnly} onBlur={handleBlur} type='number'></Form.Control>
              </Form.Group>
            */}
            <Form.Group controlId='dataExpirarii'>
              <Form.Label>Data expirarii(zile): </Form.Label>
              <Form.Control 
                readOnly={readOnlyExpiry} 
                className={invalid.dataExpirarii} 
                onChange={handleChange} 
                placeholder={expirationDatePlaceholder} 
                defaultValue={(id_societate == '2' && locatii_corner.includes(id_locatie)) ? (expirationDatePlaceholder) : (id_societate == '2' && id_locatie == '8') ? isCongelat ? expirationDatePlaceholder : null : null } 
                type={id_societate == '2' && locatii_corner.includes(id_societate) ? 'input' : 'number'}>
              </Form.Control>
              <Form.Control.Feedback type="invalid" className={'validation '+invalid.dataExpirarii}>
                  Trebuie completata o data de expirare(zile).
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='cantitate'>
              <Form.Label>Numar etichete: </Form.Label>
              <Form.Control defaultValue={cantitate} ref={inputCantitateRef} className={invalid.cantitate} onChange={(e) => {setCantitate(e.target.value)}} type='number' placeholder='Ex. 1'></Form.Control>
              <Form.Control.Feedback type="invalid" className={'validation '+invalid.cantitate}>
                  Trebuie completat un numar de etichete de printat.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </div>
        <div className='grid grid-cols-1 mb-10'>
          <Button variant="success" id="btn_save_ticket" onClick={() => {
            handleClickPrint(id_eticheta)
              .then((response) => {
                if(response != undefined){
                  const cantitate = response[1];
                  let mesaj= '';
                  if (response[0] === true) {
                    if (cantitate == 1) {
                      mesaj = 'Eticheta a fost tipărită cu succes!';
                    } 
                    else if(parseInt(cantitate) > 1) {
                      mesaj = 'Etichetele au fost tipărite cu succes!';
                    }
                    handleCloseModal();
                    Swal.fire({
                      title: mesaj,
                      icon: 'success',
                      showConfirmButton: false,
                      timer: 1500
                    });
                  }
                }
                else{
                  Swal.fire({
                    title: 'Eroare la tiparire!!!',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                  })
                }
              })
              .catch((error) => {
                console.error('Eroare la tipărirea etichetei:', error.response.data);
              });
          }}><FontAwesomeIcon icon={faPrint} /> Tipareste</Button>
        </div>
      </div>
    </Modal>
  );
}
  