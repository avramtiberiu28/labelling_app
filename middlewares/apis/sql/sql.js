const express = require('express');
const db = require('./config/dbconnect.js')
const cors = require('cors')

const app = express();
const jwt = require('jsonwebtoken');


const  PORT = 3005;
const locatii_corner = ['0','1','2','3','4','5','6','7'];
let sql_query = '';
app.use(cors());
app.use(express.json())

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        let sql_query = `SELECT * FROM users WHERE username='${username}' AND password=MD5('${password}')`;
        // Verifică în baza de date dacă există un utilizator cu aceste credențiale
        db.query(sql_query, (err, result) => {
            if(err) {
                console.log(err)
            } 
            if (result.length !== 0) {
                //console.log(result[0]);
                // Dacă există un utilizator cu aceste credențiale, generăm un token JWT
                const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
                const id_societate = result[0].id_societate;
                const id_locatie = result[0].id_locatie;
                const nume = result[0].nume;
                const prenume = result[0].prenume;
                const VA = result[0].VA;
                const admin = result[0].admin;  
                const id_user = result[0].id_user;
                // Returnează token-ul în răspuns
                res.json({ token, username, id_societate, id_locatie, nume, prenume, VA, admin, id_user});
            }
            else {
                res.status(401).json({ error: 'Credențiale invalide' });
            }
            //res.send(result)
        });
    } 
    catch (error) {
        console.error('Eroare la cerere:', error);
        res.status(500).json({ error: 'A apărut o eroare la autentificare. Vă rugăm să încercați din nou.' });
    }
});

app.get("/getUserInfo/:id_user", (req, res) => {
    const id_user = req.params.id_user;
    sql_query = `SELECT * FROM users_info WHERE id_user = ${id_user}`;
    db.query(sql_query, (err, result) => {
        if(err){
            console.log(err);
        }
        res.send(result);
    })
})
app.get("/categorii/:id_societate/:id_locatie", (req, res) => {
    const id_societate = req.params.id_societate;
    const id_locatie = req.params.id_locatie;
    if(id_societate === '2' && locatii_corner.includes(id_locatie)){
        sql_query = `SELECT * FROM categorii WHERE id_societate = ${id_societate} AND id_locatie = 0`;
    }
    else{
        sql_query = `SELECT * FROM categorii WHERE id_societate = ${id_societate} AND id_locatie = ${id_locatie}`;
    }
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.get("/adaugaCategorie/:id_societate/:id_locatie/:categorie", (req, res) => {
    const id_societate = req.params.id_societate;
    const id_locatie = req.params.id_locatie;
    const categorie = req.params.categorie
    if(id_societate === '2' && locatii_corner.includes(id_locatie)){
        sql_query = `INSERT INTO categorii (id_societate, id_locatie, denumire) VALUES('${id_societate}', 0, '${categorie}')`;
    }
    else {
        sql_query = `INSERT INTO categorii (id_societate, id_locatie, denumire) VALUES('${id_societate}', '${id_locatie}', '${categorie}')`;
    }
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.get("/stergeCategorie/:id_societate/:id_locatie/:id_categorie", (req, res) => {
    const id_societate = req.params.id_societate;
    const id_locatie = req.params.id_locatie;
    const id_categorie = req.params.id_categorie
    let sql_query = `DELETE FROM categorii WHERE id_categorie = ${id_categorie}`;
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})


app.get("/etichete/:id_societate/:id_locatie", (req, res) => {
    const id_societate = req.params.id_societate;
    const id_locatie = req.params.id_locatie
    if(id_societate === '2' && locatii_corner.includes(id_locatie)){
        sql_query = `SELECT * FROM etichete WHERE id_societate = ${id_societate} AND id_locatie= 0`;
    }
    else{
        sql_query = `SELECT * FROM etichete WHERE id_societate = ${id_societate} AND id_locatie= ${id_locatie}`;
    }
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.get("/expiration-date&denumire/:id_eticheta", (req, res) => {
    const id_eticheta = req.params.id_eticheta;
    let sql_query = `SELECT a.dataExpirarii,b.denumire FROM etichete_infos a INNER JOIN etichete b ON a.id_eticheta = b.id_eticheta WHERE a.id_eticheta = ${id_eticheta}`;
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

app.get("/getInfoLabel/:id_eticheta", (req, res) => {
    const id_eticheta = req.params.id_eticheta;
    let sql_query = `SELECT a.*, b.denumire, b.id_categorie, b.transat FROM etichete_infos a INNER JOIN etichete b ON a.id_eticheta = b.id_eticheta  WHERE a.id_eticheta = ${id_eticheta}`;
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})


app.post("/saveLabel/", (req,res)=>{
    const {id_societate, id_locatie, label, CRUD, id_eticheta} = req.body;
    console.log('Id_societate: '+id_societate, 'Id_locatie: '+id_locatie, 'Eticheta: ',label, 'CRUD: '+CRUD, 'Id_eticheta: '+id_eticheta);
    if(CRUD == 'create'){
        if(id_societate == 2 && locatii_corner.includes(id_locatie)){
            sql_query = `Call CreateLabelCorner('${id_societate}', '0', '${label.denumire}', '${label.id_categorie}', '${label.informatiiAditionale}', '${label.ingrediente}', '${label.valoriEnergetice}', '${label.alergeni}', '${label.contineUrme}', '${label.precizari}', '${label.recomandari}', '${label.dataExpirarii}')`;
        }
        else if(id_societate == 2 && id_locatie == 8){
            if(label.id_categorie == 7 || label.id_categorie == 10){
                sql_query = `Call CreateLabelCarmangerie('${id_societate}', '${id_locatie}', '${label.denumire}', '${label.id_categorie}', '${label.informatiiAditionale}', '${label.producator}', '${label.ingrediente}', '${label.valoriEnergetice}', '${label.alergeni}', '${label.contineUrme}', '${label.precizari}', '${label.recomandari}', '${label.clasa}', '${label.transat}')`;
            }
            else{
                label.dataCongelarii = 0;
                sql_query = `Call CreateLabelCarmangerie('${id_societate}', '${id_locatie}', '${label.denumire}', '${label.id_categorie}', '${label.informatiiAditionale}', '${label.producator}', '${label.ingrediente}', '${label.valoriEnergetice}', '${label.alergeni}', '${label.contineUrme}', '${label.precizari}', '${label.recomandari}', '${label.clasa}', '${label.transat}')`;
            }
        }
    }
    else if(CRUD == 'update'){
        if(id_societate == 2 && locatii_corner.includes(id_locatie)){
            sql_query = `Call UpdateLabelCorner('${label.denumire}', '${label.id_categorie}', '${label.informatiiAditionale}', '${label.ingrediente}', '${label.valoriEnergetice}', '${label.alergeni}', '${label.contineUrme}', '${label.precizari}', '${label.recomandari}', '${label.dataExpirarii}', '${id_eticheta}')`;
        }
        else if(id_societate == 2 && id_locatie == 8){
            if(label.id_categorie == 7 || label.id_categorie == 10){
                sql_query = `Call UpdateLabelCarmangerie('${label.denumire}', '${label.id_categorie}', '${label.informatiiAditionale}', '${label.producator}', '${label.ingrediente}', '${label.valoriEnergetice}', '${label.alergeni}', '${label.contineUrme}', '${label.precizari}', '${label.recomandari}', '${label.clasa}', ${label.transat}, '${id_eticheta}')`;
            }
            else{
                label.dataCongelarii = 0;
                sql_query = `Call UpdateLabelCarmangerie('${label.denumire}', '${label.id_categorie}', '${label.informatiiAditionale}', '${label.producator}', '${label.ingrediente}', '${label.valoriEnergetice}', '${label.alergeni}', '${label.contineUrme}', '${label.precizari}', '${label.recomandari}', '${label.clasa}', ${label.transat}, '${id_eticheta}')`;
            }

        }
    }
    console.log(sql_query);
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err);
        }
        console.log('Rezultat: ',result);
        res.send(result);
    })
})

app.get("/deleteLabel/:id_eticheta", (req, res) => {
    const id_eticheta = req.params.id_eticheta;
    
    // Șterge din tabela 'etichete'
    const sql_query_etichete = `DELETE FROM etichete WHERE id_eticheta = ${id_eticheta};`;
    
    // Șterge din tabela 'etichete_infos'
    const sql_query_etichete_infos = `DELETE FROM etichete_infos WHERE id_eticheta = ${id_eticheta};`;

    db.query(sql_query_etichete, (err_etichete, result_etichete) => {
        if(err_etichete) {
            console.log("Error deleting from 'etichete':", err_etichete);
            return res.status(500).send("Error deleting from 'etichete'");
        }

        console.log("Deleted from 'etichete':", result_etichete);

        // După ce am șters din tabela 'etichete', ștergem din tabela 'etichete_infos'
        db.query(sql_query_etichete_infos, (err_etichete_infos, result_etichete_infos) => {
            if(err_etichete_infos) {
                console.log("Error deleting from 'etichete_infos':", err_etichete_infos);
                return res.status(500).send("Error deleting from 'etichete_infos'");
            }

            console.log("Deleted from 'etichete_infos':", result_etichete_infos);

            // Trimitem un răspuns către client că operația a fost realizată cu succes
            res.send("Deleted from 'etichete' and 'etichete_infos'");
        });
    });
});

app.get("/changePassword/:username/:password", (req, res) => {
    const username = req.params.username;
    const password = req.params.password;
    const sql_query = `UPDATE users SET password = MD5("${password}") WHERE username = "${username}"`

    db.query(sql_query, (err, result) => {
        if(err) {
            console.log("Error changing password:", err);
            return res.status(500).send("Error changing password!");
        }
        res.send(result);
    });
});

app.get("/getLocatii/:id_societate", (req, res) => {
    const id_societate = req.params.id_societate;
    const sql_query = `SELECT * FROM locatii WHERE id_societate = ${id_societate}`

    db.query(sql_query, (err, result) => {
        if(err) {
            console.log("Error getting locations:", err);
            return res.status(500).send("Error getting locations!");
        }
        res.send(result);
    });
});


app.get("/getLabelDetails/:id_societate/:id_locatie/:id_eticheta", (req, res) => {
    const {id_societate, id_locatie, id_eticheta} = req.params;
    if(id_societate == 2 && locatii_corner.includes(id_locatie)){
        sql_query = `SELECT b.denumire, b.id_categorie, a.informatiiAditionale, a.ingrediente, a.valoriEnergetice, a.alergeni, a.contineUrme, a.precizari, a.recomandari, a.dataExpirarii FROM etichete_infos a INNER JOIN etichete b ON a.id_eticheta = b.id_eticheta  WHERE a.id_eticheta = ${id_eticheta}`;
    }
    else{
        sql_query = `SELECT a.*, b.denumire, b.id_categorie, b.transat FROM etichete_infos a INNER JOIN etichete b ON a.id_eticheta = b.id_eticheta  WHERE a.id_eticheta = ${id_eticheta}`;
    }
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})

/*app.get("/search/:string", (req, res) => {
    const string = req.params.string;
    let sql_query = `SELECT * FROM nomenclator WHERE search_description LIKE "%${string}%" OR cod_mrf LIKE "%${string}%" OR brand LIKE "%${string}%" OR barcode LIKE "%${string}%"`;
    db.query(sql_query, (err, result) => {
        if(err) {
            console.log(err)
        }
        res.send(result)
    })
})
app.post("/addItemToInventory", (req,res)=>{
    const barcode = req.body.barcode;
    const cantitate = req.body.cantitate;
    const nr_tableta = req.body.nr_tableta;
    console.log('Barcode: '+barcode,'Cantitate: '+cantitate, 'Tableta NR: '+nr_tableta, 'Req.Body: '+req.body );
    let sql_query = `Call addItemToInventory('${barcode}', '${cantitate}', '${nr_tableta}')`;
    db.query(sql_query, (err,result)=>{
        if(err) {
            console.log(err)
        } 
        console.log(result);
        res.send(result)
    });
})*/

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})







