function generateZPLCarmangerieCarniva (label, label_info){
    console.log('Label: ', label, 'Label_info: ', label_info);
    let flag = 0;
    let expiration_calculation_after_freezer = 365;
    let dataProductiei = new Date();
    let dataCongelarii = new Date();
    let dataExpirarii;
    if(label_info == undefined){
        label_info = '';
    }
    let zpl = '';
    let font_denumire = `^A0R,36`
    let font_normal = `^A0R,20`
    let font_data = `^A0R,27`
    let font_mic = `^A0R,18`
    const origine = `^FO`
    let latimeEticheta = 480;
    let inaltime = 655;
    let pozitieX = 15;
    let nrRanduri = 1;
    let fb = (latimeEticheta, nrRanduri) => {
        return `^FB${latimeEticheta},${nrRanduri},,`;
    }
    let br = '^FS\n'
    let contor = pozitieX + 1;
    zpl += '^XA^PW816^LL496\n';
    //zpl += '^FWR\n';
    //denumire
    for(let i = 0; i <= 1; i++ ){
        zpl += `${origine}${inaltime},${i}${font_denumire}${fb(latimeEticheta, nrRanduri)}c^FD${label.denumire}${br}`;
    }
    //denumire
    //clasa
    if(label.clasa != ''){
        if(label.clasa != undefined){
            inaltime = inaltime - 20;
            zpl += `${origine}${inaltime},${pozitieX}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FD${label.clasa}${br}`;
        }
    }
    //clasa
    //precizari
    if(label.precizari != ''){
        if(label.clasa != undefined){
            inaltime = inaltime - 20;
            zpl += `${origine}${inaltime},${pozitieX}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FD${label.precizari}${br}`;
        }
    }
    //precizari
    //alergeni
    if(label.alergeni != ''){
        inaltime = inaltime - 20;
        for(let i = 0; i <= 1; i++ ){
            zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FDAlergeni: ${label.alergeni}${br}`;
        }
    }
    //alergeni
    //contine urme
    if(label.contineUrme != ''){
        inaltime = inaltime - 20;
        zpl += `${origine}${inaltime},${pozitieX}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FDPoate contine urme de: ${label.contineUrme}${br}`;
    }
    //contine urme
    //informatii aditionale
    if(label.informatiiAditionale != ''){
        inaltime = inaltime - 20;
        zpl += `${origine}${inaltime},${pozitieX}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FD${label.informatiiAditionale}${br}`;
    }
    //infomartii aditionale
    //recomandari
    if(label.recomandari != ''){
        if(label.recomandari.length > 74){
            nrRanduri = 2;
            inaltime = inaltime - 40;
        }
        else{
            nrRanduri = 1;
            inaltime = inaltime - 20;
        }        
        zpl += `${origine}${inaltime},${pozitieX}${font_normal}${fb(latimeEticheta, nrRanduri)}c^FD${label.recomandari}${br}`;
        nrRanduri = 1;
    }
    //recomandari
    //ingrediente
    if(label.ingrediente != ''){
        label.ingrediente = "Ingrediente: "+label.ingrediente;
        nrRanduri = Math.ceil(label.ingrediente.length/56);
        inaltime = inaltime - (20 * nrRanduri);
        zpl += `${origine}${inaltime},${pozitieX}${font_normal}${fb(latimeEticheta, nrRanduri)}^FD${label.ingrediente}${br}`;
        nrRanduri = 1;
    }
    //ingrediente
    //valori energetice
    if(label.valoriEnergetice != ''){
        label.valoriEnergetice = "Valori energetice/100gr: "+label.valoriEnergetice;
        nrRanduri = Math.ceil(label.valoriEnergetice.length/56);
        inaltime = inaltime - (20 * nrRanduri);
        zpl += `${origine}${inaltime},${pozitieX}${font_normal}${fb(latimeEticheta, nrRanduri)}^FD${label.valoriEnergetice}${br}`;
        nrRanduri = 1;
    }
    //valori energetice
    //origine
    if(label_info.origine != '' && label_info.origine != undefined){
        inaltime = inaltime - 20;
        for(let i = pozitieX; i < contor; i++){
            zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDOrigine, crestere, abatorizare: ${label_info.origine}${br}`;
        }
    }
    else{
        inaltime = inaltime - 20;
        for(let i = pozitieX; i < contor; i++){
            zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDOrigine, crestere, abatorizare: RO${br}`;
        }
    }
    //origine
    //lot
    let pozitieXLot = 390;
    let contorLot = 391;
    if(label_info.lot != '' && label_info.lot != undefined){
        inaltime = inaltime - 30;
        for(let i = pozitieXLot; i <= contorLot; i++){
            zpl += `${origine}${inaltime},${i}${font_data}${fb(latimeEticheta, nrRanduri)}^FDLOT: ${label_info.lot}${br}`;
        }
    }
    else {
        inaltime = inaltime - 30;
        for(let i = pozitieXLot; i <= contorLot; i++){
            zpl += `${origine}${inaltime},${i}${font_data}${fb(latimeEticheta, nrRanduri)}^FDLOT: 2810${br}`;
        }
    }
    //lot
    //data productiei
    /*inaltime = inaltime - 25;*/
    for(let i = pozitieX; i <= contor; i++){
        zpl += `${origine}${inaltime},${i}${font_data}${fb(latimeEticheta, nrRanduri)}^FDDATA PRODUCTIEI: ${dataProductiei.toLocaleDateString('ro-RO')}${br}`; 
    }
    //data productiei
    //data congelarii
    if(label.id_categorie == '10'){
        flag = 1;
        if(label_info.dataCongelarii != '' && label_info.dataCongelarii != undefined){
            console.log('test1')
            console.log(label_info.dataCongelarii);
            inaltime = inaltime - 25;
            dataCongelarii.setDate(dataCongelarii.getDate() + parseInt(label_info.dataCongelarii));
            for(let i = pozitieX; i <= contor; i++){
                zpl += `${origine}${inaltime},${i}${font_data}${fb(latimeEticheta, nrRanduri)}^FDDATA CONGELARII: ${new Date(dataCongelarii).toLocaleDateString('ro-RO')}${br}`; 
            }
        }
        else{
            console.log('test2')
            inaltime = inaltime - 25;
            dataCongelarii = dataProductiei;
            for(let i = pozitieX; i <= contor; i++){
                zpl += `${origine}${inaltime},${i}${font_data}${fb(latimeEticheta, nrRanduri)}^FDDATA CONGELARII: ${new Date().toLocaleDateString('ro-RO')}${br}`; 
            }
        }
    }
    //data congelarii
    //data expirarii
    if(label_info.dataExpirarii != '' && label_info.dataExpirarii != undefined){
        if(flag == 1){
            dataExpirarii = new Date(dataCongelarii);
            dataExpirarii.setDate(dataExpirarii.getDate() + expiration_calculation_after_freezer);
        }
        else{
            console.log(label_info.dataExpirarii);
            dataExpirarii = new Date();
            dataExpirarii.setDate(dataExpirarii.getDate() + parseInt(label_info.dataExpirarii));
        }
        inaltime = inaltime - 25;
        for(let i = pozitieX; i <= contor; i++){
            zpl += `${origine}${inaltime},${i}${font_data}${fb(latimeEticheta, nrRanduri)}^FDEXPIRA LA: ${new Date(dataExpirarii).toLocaleDateString('ro-RO')}${br}`;
        } 
    }
    else {
        if(flag == 1){
            console.log(flag, expiration_calculation_after_freezer);
            dataExpirarii = new Date(dataCongelarii);
            dataExpirarii.setDate(dataExpirarii.getDate() + expiration_calculation_after_freezer);
        }
        else{
            dataExpirarii = new Date();
            //dataExpirarii.setDate(dataExpirarii.getDate() + parseInt(label_info.dataExpirarii));
        }
        inaltime = inaltime - 25;
        for(let i = pozitieX; i <= contor; i++){
            zpl += `${origine}${inaltime},${i}${font_data}${fb(latimeEticheta, nrRanduri)}^FDEXPIRA LA: ${new Date(dataExpirarii).toLocaleDateString('ro-RO')}${br}`;
        } 
    }
    //data expirarii
    //producator
    if(label.producator != ''){
        if(label.transat == 0){
            nrRanduri = 2;
            inaltime = inaltime - 20 * nrRanduri;
            for(let i = pozitieX; i <= contor; i++){
                zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDProdus de: ${label.producator}${br}`;
            }
        }
        else if(label.transat == 1){
            nrRanduri = 2;
            inaltime = inaltime - 20 * nrRanduri;
            for(let i = pozitieX; i <= contor; i++){
                zpl += `${origine}${inaltime},${i}${font_normal}${fb(latimeEticheta, nrRanduri)}^FDTransat si ambalat de: ${label.producator}${br}`;
            }
            nrRanduri = 1;
        }
    }
    //producator
    zpl += `^XZ`;
    //console.log(zpl);
    return zpl;
}

module.exports = {generateZPLCarmangerieCarniva}