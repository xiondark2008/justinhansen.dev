export default class Die {
    #_max
    #_min

    constructor(faces = 1, mod = 0, values = []) { //console.debug("in Die.constructor", arguments);
        this.faces = faces
        this.modifier = mod
        this.values = values
    
        if (this.values.length > this.faces) {
            const start = this.faces - this.values.length,
                stop = this.values.length - this.faces,
                //NOTE: splice modifies the collection
                cut = this.values.splice(start, stop);
            
            console.warn("More values than # of faces given. Removed values: ", cut);
        } else if (this.values.length < this.faces) {
            const vals = []
            
            for (let i = this.values.length; i < this.faces; i++) {
                vals.push(i + 1)
            }

            this.values = this.values.concat(vals)
            //console.warn("Fewer values than # of faces given. Added values: ", vals);
        }

        this.values.sort( (a, b) => { a - b });
    }

    get max() { //console.debug("in Die.max", arguments);
        if(this.#_max == undefined){
            this.#_max = this.values[this.values.length - 1] + this.modifier;
        }

        return this.#_max
    }

    get min() { //console.debug("in Die.min", arguments);
        if(this.#_max == undefined){
            this.#_min = this.values[0] + this.modifier;
        }

        return this.#_min
    }

    getFaceValue(face) { //console.debug("in Die.getFaceValue()", arguments);
        return this.values[face] + this.modifier;
    }

    toString() { //console.debug("in Die.toString()",arguments);
        return "d" + this.faces + (this.modifier !== 0 ? " + " + this.modifier : "");
    }
}