/* NOTE: Do not let these be used outside of API calls */
import StarSystemCollection from "@/modules/starmap_db/types/services/StarSystemCollection"
import CelestialObjectCollection from "@/modules/starmap_db/types/services/CelestialObjectCollection"
import TunnelCollection from "@/modules/starmap_db/types/services/TunnelCollection"
import AffiliationCollection from "@/modules/starmap_db/types/services/AffiliationCollection"
import SpeciesCollection from "@/modules/starmap_db/types/services/SpeciesCollection"

import { ENTITY_PATHS } from "@/starmap_db/utils/Utilities"

export const DB_COLLECTIONS = {
    get [ENTITY_PATHS.starSystem](){
        return StarSystemCollection
    },
    get [ENTITY_PATHS.celestialObject](){
        return CelestialObjectCollection
    },
    get [ENTITY_PATHS.tunnel](){
        return TunnelCollection
    },
    get [ENTITY_PATHS.affiliation](){
        return AffiliationCollection
    },
    get [ENTITY_PATHS.species](){
        return SpeciesCollection
    }
}