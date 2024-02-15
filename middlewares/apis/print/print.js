const express = require('express');
const cors = require('cors');
const fs = require('fs');
const {exec} = require('child_process');
const util = require('util');
const execAsync = util.promisify(require('child_process').exec);


const app = express();
const PORT = 3004;


app.use(cors());
app.use(express.json());


app.post("/printLabel/", async (req, res) => {
    const { zpl, user_info, cantitate } = req.body;
    let cmds=[];
    console.log(user_info)
    let zpl_file = 'print_files\\label'+user_info.printer+'.zpl';
    console.log(zpl_file);
    fs.writeFile(zpl_file, zpl, async (err) => {
        if (err) {
            console.error('Eroare la scrierea în fișierul ZPL:', err);
            res.status(500).json({ error: 'Eroare la generarea fișierului ZPL' });
        } else {
            console.log('Fișierul ZPL a fost generat cu succes.');

            let printedLabels = 0;

            for (let i = 0; i < cantitate; i++) {
                try {
                    cmds[0] = `net use "\\\\${user_info.IP}\\${user_info.printer}" /USER:${user_info.W_user} ${user_info.W_pass}\r\n`
                    cmds[1] = `copy /B ${zpl_file} "\\\\${user_info.IP}\\${user_info.printer}"\r\n`
                    cmds[2] = `net use "\\\\${user_info.IP}\\${user_info.printer}" /DELETE /Y\r\n`
                    for(let j = 0; j < cmds.length; j++){
                        const { stdout, stderr } = await execAsync(cmds[j]);
                    }
                    console.log('Fișierul ZPL a fost trimis la imprimantă cu succes.');
                    console.log('Eticheta a fost tipărită.');
                    printedLabels++;
                } catch (error) {
                    console.error('Eroare la trimiterea fișierului ZPL la imprimantă:', error);
                    res.status(500).json({ error: 'Eroare la trimiterea fișierului ZPL la imprimantă' });
                    return; // Terminăm execuția aici, nu mai mergem mai departe în buclă
                }
            }
            console.log(printedLabels, cantitate)
            if (printedLabels == cantitate) {
                res.send(true);
            }
            else{
                res.send(false);
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serverul API-Print funcționează pe portul ${PORT}`);
});