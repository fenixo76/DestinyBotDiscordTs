import express, { json, urlencoded } from "express";

export let autorizationCode: any = ""

export function createServeur() {
    const app = express();
    const PORT = 3000;

    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });

    app.get('/Pages/Succes.html', (req, res) => {
        const code = req.query.code;
        if (code) {
            res.redirect('/Pages/Succe.html')
            autorizationCode = code
        } else {
            res.redirect('/Pages/Echec.html')
        }
    });
}
