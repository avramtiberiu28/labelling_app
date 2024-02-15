function generateZPLGustaria (label, prenume, VA){
    let zpl = '';
    let font_denumire = `^AR,36,20`
    let font_normal = `^A0R,20`
    let font_data = `^A0R,27`
    let font_mic = `^A0R,18`
    const origine = `^FO`
    let latimeEticheta = 450;
    let inaltime = 290
    let pozitieX = 15
    let nrRanduri = 1;
    let fb = (latimeEticheta, nrRanduri) => {
        return `^FB${latimeEticheta},${nrRanduri},,`;
    }
    let br = '^FS\n'
    let contor = pozitieX + 1;
    zpl += '^XA^PW600\n';
    //denumire
    for(let i = pozitieX; i <= contor; i++ ){
        zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FD${label.denumire}${br}`;
    }
    //denumire
    //alergeni
    if(label.alergeni != ''){
        inaltime = inaltime - 20;
        for(let i = pozitieX; i <= contor; i ++){
            zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FDAlergeni: ${label.alergeni}${br}`;
        }
    }
    //alergeni
    //contine urme
    if(label.contineUrme != ''){
        inaltime = inaltime - 20;
        zpl += `${origine}${inaltime},${pozitieX}${font_mic}${fb(latimeEticheta, nrRanduri)}c^FDPoate contine urme de: ${label.contineUrme}${br}`;
    }
    //contine urme
    //informatii aditionale
    if(label.informatiiAditionale != ''){
        inaltime = inaltime - 20;
        zpl += `${origine}${inaltime},${pozitieX}${font_mic}${fb(latimeEticheta, nrRanduri)}c^FD${label.informatiiAditionale}${br}`;
    }
    //infomartii aditionale
    //VA
    if(label.VA != ''){
        inaltime = inaltime - 20;
        zpl += `${origine}${inaltime},${pozitieX}${font_mic}${fb(latimeEticheta, nrRanduri)}c^FDFRAHER ${prenume} ${VA}${br}`;
    }
    //VA
    //recomandari
    if(label.recomandari != ''){
        inaltime = inaltime - 20;
        zpl += `${origine}${inaltime},${pozitieX}${font_mic}${fb(latimeEticheta, nrRanduri)}c^FD${label.recomandari}${br}`;
    }
    //recomandari
    //ingrediente
    if(label.ingrediente != ''){
        label.ingrediente = "Ingrediente: "+label.ingrediente;
        nrRanduri = Math.ceil(label.ingrediente.length/56);
        inaltime = inaltime - (18 * nrRanduri);
        zpl += `${origine}${inaltime},${pozitieX}${font_mic}${fb(latimeEticheta, nrRanduri)}^FD${label.ingrediente}${br}`;
        nrRanduri = 1;
    }
    //ingrediente
    //valori energetice
    if(label.valoriEnergetice != ''){
        label.valoriEnergetice = "Valori energetice/100gr: "+label.valoriEnergetice;
        nrRanduri = Math.ceil(label.valoriEnergetice.length/56);
        inaltime = inaltime - (18 * nrRanduri);
        zpl += `${origine}${inaltime},${pozitieX}${font_mic}${fb(latimeEticheta, nrRanduri)}^FD${label.valoriEnergetice}${br}`;
        nrRanduri = 1;
    }
    //valori energetice
    //lot
    /*inaltime = inaltime - 20;
    for(let i = pozitieX; i <= contor; i++){
        zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDLOT: 2810${br}`;
    }*/
    //lot
    //data productiei
    inaltime = inaltime - 20;
    const data_curenta = new Date().toLocaleDateString('ro-RO');
    for(let i = pozitieX; i <= contor; i++){
        if (label.id_categorie == 1 || label.id_categorie == 2 || label.id_categorie == 3){
            zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDData si ora productiei: ${data_curenta}${br}`; 
        }
        if(label.id_categorie == 4){
            zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDData si ora productiei:${br}`; 
        }
    }
    //data productiei
    //data expirarii
    if(label.dataExpirarii != ''){
        inaltime = inaltime - 20;
        for(let i = pozitieX; i <= contor; i++){
            zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDTermen de valabilitate: ${label.dataExpirarii}${br}`;
        } 
    }
    //data expirarii
    zpl += `^XZ`;
    //console.log(zpl);
    return zpl;
}

module.exports = {generateZPLGustaria}