import StarSystem from "@/starmap_db/types/entities/StarSystem"
import CelestialObject from "@/starmap_db/types/entities/CelestialObject"
import Tunnel from "@/starmap_db/types/entities/Tunnel"
import Affiliation from "@/starmap_db/types/entities/Affiliation"
import Species from "@/starmap_db/types/entities/Species"

export const RSI_URL = "https://robertsspaceindustries.com/api/starmap"

export const ENTITY_PATHS = {
    starSystem: 'star-systems',
    celestialObject: 'celestial-objects',
    tunnel: 'tunnels',
    affiliation: 'affiliations',
    species: 'species'
}

export const UI_ENTITY_STUBS = {
    get [ENTITY_PATHS.starSystem](){
        return StarSystem.getUIEntityListEntry()
    },
    get [ENTITY_PATHS.celestialObject](){
        return CelestialObject.getUIEntityListEntry()
    },
    get [ENTITY_PATHS.tunnel](){
        return Tunnel.getUIEntityListEntry()
    },
    get [ENTITY_PATHS.affiliation](){
        return Affiliation.getUIEntityListEntry()
    },
    get [ENTITY_PATHS.species](){
        return Species.getUIEntityListEntry()
    }
}

export function tunnelSizeToLabel(size){
    switch( size ){
        case 'L': return 'Large'
        case 'M': return 'Medium'
        case 'S': return 'Small'
        default:
            console.warn("WARNING - Found unknown tunnel size: " + size)
    }
}