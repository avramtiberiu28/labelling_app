const express = require('express');
const cors = require('cors')
const axios = require('axios');
const app = express();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const request = require('request');
const {generateZPLGustaria} = require('./functions/Gustaria');
const {generateZPLCarmangerie52x73} = require('./functions/Carmangerie52x73');
const {generateZPLCarmangerieCarniva} = require('./functions/CarmangerieCarniva');

dotenv.config();
const API_URL = process.env.API_URL


const  PORT_WEB = 3003;

const locatii_corner = ['0', '1', '2', '3', '4', '5', '6', '7'];
const categorii_52x73 = [5, 6, 7];
const categorii_carniva = [8, 9, 10];

app.use(cors());
app.use(express.json())


app.post("/generateLabelTabel/", async (req, res) => {
    try {
        const {id_eticheta, id_societate, id_locatie, prenume, VA, label_info} = req.body
        //console.log('id_eticheta: ', id_eticheta, 'id_societate: ',id_societate, 'id_locatie: ', id_locatie, 'prenume: ', prenume, 'va: ',VA, 'Label_info: ',label_info)
        const response = await axios.get(`http://${API_URL}:3005/getInfoLabel/${id_eticheta}`);
        const label = response.data[0];
        let zpl = '';
        let url = '';
        if (id_societate === '2' && locatii_corner.includes(id_locatie)) {
            zpl = generateZPLGustaria(label, prenume, VA, label_info);
            url = `http://api.labelary.com/v1/printers/8dpmm/labels/1.572x2.35/0/${zpl}`;
        }
        else if(id_societate === '2' && id_locatie == 8 && categorii_52x73.includes(label.id_categorie)){
            zpl = generateZPLCarmangerie52x73(label, label_info);
            url = `http://api.labelary.com/v1/printers/8dpmm/labels/2.04x2.86/0/${zpl}`;
        }
        else if(id_societate === '2' && id_locatie == 8 && categorii_carniva.includes(label.id_categorie)){
            zpl = generateZPLCarmangerieCarniva(label, label_info);
            url = `http://api.labelary.com/v1/printers/8dpmm/labels/4.00x2.475/0/${zpl}`;
        }
        //console.log(zpl);
        // Trimite ZPL către API-ul Labelary
        const labelaryResponse = await axios.get(url, {
            responseType: 'arraybuffer' // Va returna un buffer pentru imaginea PNG
        });
        // Returnează răspunsul de la API-ul Labelary către frontend
        res.setHeader('Content-Type', 'image/png');
        res.send(labelaryResponse.data);

    } catch (error) {
        console.error("Error generating label table:", error.code);
        res.status(500).send("Error generating label table");
    }
});

app.post("/generateLabel/", async (req, res) => {
    try {
        const { id_societate, id_locatie, prenume, VA, label } = req.body;
        //console.log('id_societate: ',id_societate, 'id_locatie: ', id_locatie, 'Label: ',label);
        let zpl = '';
        let url = '';
        if (id_societate === '2' && locatii_corner.includes(id_locatie)) {
            zpl = generateZPLGustaria(label, prenume, VA);
            url = `http://api.labelary.com/v1/printers/8dpmm/labels/1.572x2.35/0/${zpl}`;
        }
        else if(id_societate === '2' && id_locatie == 8 && categorii_52x73.includes(label.id_categorie)){
            zpl = generateZPLCarmangerie52x73(label);
            url = `http://api.labelary.com/v1/printers/8dpmm/labels/2.04x2.86/0/${zpl}`;
        }
        else if(id_societate === '2' && id_locatie == 8 && categorii_carniva.includes(label.id_categorie)){
            console.log('test3')
            zpl = generateZPLCarmangerieCarniva(label);
            url = `http://api.labelary.com/v1/printers/8dpmm/labels/2.475x4.00/0/${zpl}`;
        }
        console.log('id_societate: ',id_societate, 'id_locatie: ', id_locatie, categorii_carniva)
        console.log('ZPL: ', zpl);
        // Trimite ZPL către API-ul Labelary
        const labelaryResponse = await axios.get(url, {
            responseType: 'arraybuffer' // Va returna un buffer pentru imaginea PNG
        });
        //console.log('Labelary response: ',labelaryResponse.data, 'URL: ', url,'ZPL: ', zpl);
        // Returnează răspunsul de la API-ul Labelary către frontend
        res.setHeader('Content-Type', 'image/png');
        res.send(labelaryResponse.data);

    } 
    catch (error) {
        console.error("Error generating label table:", error.code);
        res.status(500).send("Error generating label table");
    }
});

app.post("/generateLabelPrint/", async (req, res) => {
    try {
        const {id_eticheta, id_societate, id_locatie, prenume, VA, label_info, cantitate, id_user} = req.body
        //console.log('id_eticheta: ', id_eticheta, 'id_societate: ',id_societate, 'id_locatie: ', id_locatie, 'prenume: ', prenume, 'va: ',VA, 'Label_info: ',label_info, 'Cantitate: ',cantitate)
        const responseLabel = await axios.get(`http://${API_URL}:3005/getInfoLabel/${id_eticheta}`);
        const label = responseLabel.data[0];

        const responseUser = await axios.get(`http://${API_URL}:3005/getUserInfo/${id_user}`);
        const user_info = responseUser.data[0];
        let zpl = '';
        let url = '';
        if (id_societate === '2' && locatii_corner.includes(id_locatie)) {
            zpl = generateZPLGustaria(label, prenume, VA, label_info);
            url = `http://${API_URL}:3004/printLabel/`;
        }
        else if(id_societate === '2' && id_locatie == 8 && categorii_52x73.includes(label.id_categorie)){
            zpl = generateZPLCarmangerie52x73(label, label_info);
            url = `http://${API_URL}:3004/printLabel/`
        }
        else if(id_societate === '2' && id_locatie == 8 && categorii_carniva.includes(label.id_categorie)){
            zpl = generateZPLCarmangerieCarniva(label, label_info);
            url = `http://${API_URL}:3004/printLabel/`
        }
        const printResponse = await axios.post(url, {zpl, user_info, cantitate});
        res.send(printResponse.data)
        // Returnează răspunsul de la API-ul Labelary către frontend
        //res.setHeader('Content-Type', 'image/png');
        //res.send(labelaryResponse.data);

    } catch (error) {
        console.log('Error: ', error.response.data.error);
        console.error("Error generating label table:", error.code);
        res.status(500).send(error.response.data.error);
    }
});

app.listen(PORT_WEB, () => {
    console.log(`Serverul API-Labelary funcționează pe portul ${PORT_WEB}`);
});







