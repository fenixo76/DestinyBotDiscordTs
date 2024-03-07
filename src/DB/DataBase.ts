import sqlite3 from "sqlite3"

export const dataBaseFile = "./src/DB/Orphidia.db"

export function createDataBase() {
  const db = new sqlite3.Database('./src/DB/Orphidia.db', (err) => {
    if (err) {
      console.error('Erreur lors de l\'ouverture de la base de données', err.message);
    } else {
      console.log('Connexion à la base de données réussie');
    }
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          IdDiscord TEXT NOT NULL,
          Token TEXT NOT NULL,
          TokenExpiresIn TEXT NOT NULL,
          RefreshToken TEXT NOT NULL,
          RefreshExpiresIn TEXT NOT NULL,
          MembershipId TEXT NOT NULL UNIQUE,
          DestinyMembershipId TEXT NOT NULL,
          MembershipType TEXT NOT NULL,
          CharacterId TEXT NOT NULL
        )`, (err) => {
      if (err) {
        console.error('Erreur lors de la création de la table', err.message);
      } else {
        console.log('Table créée avec succès');
      }
    });
  });

  db.close((err) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données', err.message);
    } else {
      console.log('Connexion à la base de données fermée');
    }
  });
}

export const openDataBase = (): Promise<sqlite3.Database> => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("./src/DB/Orphidia.db", (err) => {
      if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données', err.message);
        reject(err); // Rejeter la promesse en cas d'erreur
      } else {
        console.log('Connexion à la base de données réussie');
        resolve(db); // Résoudre la promesse avec la base de données
      }
    });
  });
};

export const closeDataBase = (db: any) => {
  db.close((err: { message: any; }) => {
    if (err) {
      console.error('Erreur lors de la fermeture de la base de données', err.message);
    } else {
      console.log('Connexion à la base de données fermée');
    }
  });
};