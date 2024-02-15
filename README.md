# Etichetare și Imprimare Etichete - Proiect GitHub

## Descriere

Acest proiect este o aplicație de gestionare a etichetelor și imprimarea acestora pentru diverse produse. Scopul principal al aplicației este de a oferi utilizatorilor o modalitate simplă și eficientă de a crea, edita și imprima etichete pentru produsele lor.

## Funcționalități principale

- **Creare și editare etichete**: Utilizatorii pot crea și edita etichete personalizate pentru produsele lor, inserând informații cum ar fi denumirea, ingrediente, valori energetice, recomandări etc.

- **Imprimare etichete**: Aplicația permite utilizatorilor să imprime etichetele create direct din interfața aplicației.

- **Gestionare categorii și produse**: Utilizatorii pot gestiona categoriile și produsele pentru care creează etichete, permițând o organizare eficientă a datelor.

## Tehnologii utilizate

- **React.js**: Pentru dezvoltarea interfeței utilizator (UI) interactive și dinamice.
  
- **Node.js și Express.js**: Pentru crearea API-ului backend care gestionează logica de afaceri și comunicarea cu baza de date.

- **MySQL**: Pentru stocarea și gestionarea datelor despre etichete, categorii și produse.

- **React Bootstrap**: Pentru componente și stilizare UI.

- **Axios**: Pentru efectuarea cererilor HTTP către server.

- **SweetAlert2**: Pentru afișarea de alerte și notificări interactive.

## Cerințe de instalare și utilizare

1. **Clonare repository-ului**: Folosiți comanda `git clone` pentru a clona acest repository pe calculatorul local:

   ```bash
   git clone https://github.com/avramtiberiu28/labelling_app.git
   ```

2. **Instalare dependințe**: După clonarea repository-ului, navigați în directorul proiectului și instalați dependințele folosind npm sau yarn:

   ```bash
   npm install
   # sau
   yarn install
   ```

3. **Pornire server SQL**: Porniți serverul backend folosind nodemon sau comanda `node`:

   ```bash
   npm run start
   # sau
   node sql.js
   ```

4. **Pornire server ZPL**: Porniți serverul backend folosind nodemon sau comanda `node`:

   ```bash
   npm run start
   # sau
   node zpl.js
   ```

5. **Pornire server PRINT**: Porniți serverul backend folosind nodemon sau comanda `node`:

   ```bash
   npm run start
   # sau
   node print.js
   ```


6. **Pornire aplicație frontend**: Porniți aplicația frontend React utilizând comanda `npm run dev`:

   ```bash
   npm run dev
   ```

7. **Accesare aplicație în browser**: Accesați aplicația în browser folosind adresa `http://localhost:5173`.

## Contribuții și Îmbunătățiri

Contribuțiile sunt binevenite! Dacă doriți să contribuiți la acest proiect, vă rugăm să faceți un fork al repository-ului, să adăugați funcționalitățile sau îmbunătățirile dorite și să trimiteți un pull request.

## Autor

Proiectul a fost realizat de [Avram Tiberiu - Andrei](https://github.com/avramtiberiu28).

## Licență

Acest proiect este licențiat sub [Licența MIT](https://opensource.org/licenses/MIT).