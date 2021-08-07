import PromiseQueue from "@/utils/PromiseQueue.js";
import got from "got"
import { RSI_URL } from "../utils/Utilities";

export default class StarCitizenDataSource {
    static BASE_URL = RSI_URL
    static #_CACHE = {}
    static #_MIN_CALL_INTERVAL = 100 //5000;

    static async getData(url, opts){ //console.debug("DEBUG - in StarCitizenDataSource.getData, url:",url)
        if(this.#_CACHE[url] === undefined){
            //NOTE: using a queue to not spam RSI servers
            this.#_CACHE[url] = PromiseQueue.enqueue( async ()=>{
                //console.debug("DEBUG - in StarCitizenDataSource.getData, Fetching "+url)
                const response = await got(url, opts),
                    json = JSON.parse( response.body )
                
                if(response.statusCode !== 200){
                    throw new Error("Invalide HTTP response status. HTTP Status Code: "+response.statusCode+". "+response.requestUrl)
                } else if( !json 
                        || !json.data 
                        || !( (json.data.resultset && json.data.resultset.length>0)
                            || (json.data.systems && json.data.systems.resultset.length>0
                                && json.data.tunnels && json.data.tunnels.resultset.length>0
                                && json.data.species && json.data.species.resultset.length>0
                                && json.data.affiliations && json.data.affiliations.resultset.length>0)
                            )
                        ) {
                    console.group("WARNNING - in StarCitizenDataSource.getData")
                        console.warn("No or missing data found for ", response.requestUrl)
                        //console.debug("json: ", json)
                    console.groupEnd()
                } else {
                    return json
                }

                return null
            }, this.#_MIN_CALL_INTERVAL)
        }

        return await this.#_CACHE[url]
    }

    static async getBootup(){ //console.debug("DEBUG - in StarCitizenDataSource.getBootup")
        const extension = "/bootup",
            url = this.BASE_URL + extension
        
        return this.getData(url, { method: 'POST' })
    }

    static async getStarSystemDetails(code){ //console.debug("DEBUG - in StarCitizenDataSource.getStarSystemDetails",code)
        const extension = "/star-systems/",
            url = this.BASE_URL + extension + encodeURIComponent( code )
            
        return this.getData(url, { method: 'POST' })
    }

    static async getCelestialObjectDetails(code){ //console.debug("DEBUG - in StarCitizenDataSource.getCelestialObjectDetails",code)
        const extension = "/celestial-objects/",
            url = this.BASE_URL + extension + code
        
        return this.getData(url, { method: 'POST' })
    }

    static clearCache(){ //console.debug("DEBUG - in StarCitizenDataSource.clearCache")
        this.#_CACHE = {}
    }
}