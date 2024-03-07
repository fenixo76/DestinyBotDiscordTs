import axios from "axios";
import { getManifest } from "./Api";

class Manifest {
    urls: any = {};
    tables: any = {};

    definitions = [
        "DestinyInventoryItemDefinition",
        "DestinyClassDefinition",
        "DestinyVendorDefinition",
        "DestinyDestinationDefinition",
        "DestinyDamageTypeDefinition",
        "DestinyActivityDefinition",
        "DestinyActivityModeDefinition",
        "DestinyActivityModifierDefinition",
    ];

    async fetchManifest() {
        try {
            const res = await getManifest();
            this.urls = (res && res.data || { Response: {} }).Response;
    
            for (const definition of this.definitions) {
                const manifestUrl = "https://www.bungie.net" + this.jsonUrl(definition);
                try {
                    const res2 = await axios.get(manifestUrl);
                    console.log(`fetched manifest: ${definition}`);
                    this.tables[definition] = res2.data;
                } catch (error:any) {
                    if (error.code === 'ECONNABORTED') {
                        console.error(`Timeout error fetching manifest for ${definition}:`, error);
                        // Gérer l'erreur de timeout ici
                    } else {
                        console.error(`Error fetching manifest for ${definition}:`, error);
                        // Gérer d'autres erreurs ici
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching manifest:", error);
            // Gérer d'autres erreurs ici, par exemple les erreurs de getManifest
        }
    }

    jsonUrl(
        definition = "DestinyInventoryItemDefinition",
        lang = "fr",
        path = "jsonWorldComponentContentPaths"
    ) {
        return this.urls[path][lang][definition];
    }

    t(hash: string) {
        try {
            for (const definition of this.definitions) {
                const defined = this.tables[definition][hash];
                if (defined) {
                    return defined;
                }
            }
            // Si aucun élément n'est trouvé, vous pouvez choisir de renvoyer une valeur par défaut ou de lancer une nouvelle erreur
            throw new Error("Element not found in manifest");
        } catch (e) {
            console.error("Error finding element in manifest:", e);
            return hash; // ou null ou une autre valeur par défaut
        }
    }
}

export default new Manifest();