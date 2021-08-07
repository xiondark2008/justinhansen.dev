import {toBinary, combinations} from '@/roll_probability/utils/Utilities.js'

export default class Roll {
    #_max
    #_min
    #_points
    #_combinationsPerRollSum
    #_rollSumOddsList

    constructor(dice = [], mod = 0){ //console.debug("in Roll.constructor",arguments);
        this.dice = dice;
        this.modifier = mod;
    }

    get max() { //console.debug("in Roll.max", arguments);
        if (this.#_max === undefined) {
            this.#_max = this.dice.reduce( (p, c) => {
                return p + c.max
            }, this.modifier);
        }
        
        return this.#_max
    }

    get min() { //console.debug("in Roll.min", arguments);
        if (this.#_min === undefined) {
            this.#_min = this.dice.reduce( (p = 0, c) => {
                return p + c.min
            }, this.modifier);
        }
        
        return this.#_min
    }

    get template() { //console.debug("in Roll.template",arguments);
        let rtn = "";
        for (let i = 0; i < this.dice.length; i++) {
            rtn += "0";
        }
        return rtn;
    }

    get points() { //console.debug("in Roll.points",arguments);
        if (this.#_points === undefined || this.#_points.length < 1) {
            this.#_points = [];

            const tmpl = this.template,
                values = this.dice.map( die => {return die.faces} )
            let key,
                count = 0
            
            //console.debug("\tvalues: ",values,"\n\ttmpl: ",tmpl)
            do {
                let point

                count++;
                key = toBinary(count, tmpl);
                point = values.reduce( (p, c, i) => {
                    if( parseInt(key[i]) )
                        return (p>=0?-1:1) * (Math.abs(p) + c)
                    return p
                }, 0)

                this.#_points.push(point);
            }while( !key.split('').every( char => {return parseInt(char)} ) );

            this.#_points.sort( (a, b) => {return Math.abs(a) - Math.abs(b)} );
        }

        return this.#_points;
    }

    get combinationsPerRollSum() {  //console.debug("in Roll.combinationsPerRollSum",arguments);
        if (this.#_combinationsPerRollSum === undefined || this.#_combinationsPerRollSum.length < 1) {
            this.#_combinationsPerRollSum = [];

            const pts = this.points,
                N = this.dice.length
            
            //console.debug("\tpts: ",pts,"\n\tN: ",N,"\n\tmin: ",this.min,"\n\tmax: ",this.max)
            for (let r = 0; r <= (this.max - this.min); r++) {
                let val = combinations(N, r);

                for(const pt of pts){
                    const diff = r - Math.abs(pt)
                    
                    if (diff >= 0) {
                        val += (pt / Math.abs(pt)) * combinations(N, diff);
                    }
                }
                
                //console.debug("+"+r+":"+val);
                this.#_combinationsPerRollSum[r] = Math.round(val);
            }
        }

        return this.#_combinationsPerRollSum;
    }

    get rollSumOddsList() { //console.debug("in Roll.rollSumOddsList",arguments);
        if (this.#_rollSumOddsList === undefined || this.#_rollSumOddsList.length < 1) {
            this.#_rollSumOddsList = [];
            
            const allCombinations = this.combinationsPerRollSum.reduce( (p, c) => {return p + c}, 0)
            
            for(const i in this.combinationsPerRollSum){
                const rollSumCombinations = this.combinationsPerRollSum[i]
                
                this.#_rollSumOddsList.push({
                    rollSum: parseInt(i) + this.min,
                    percentage: (rollSumCombinations / allCombinations) * 100
                });
            }
        }

        //console.debug("Roll.rollSumOddsList: ",this.#_rollSumOddsList);
        return this.#_rollSumOddsList;
    }

    oddsOfGetting(target) { //console.debug("in Roll.oddsOfGetting()",arguments);
        let percentage = 0;

        if(this.dice.length > 0){
            for(const chance of this.rollSumOddsList){
                if ( target.isMatch(chance.rollSum) ) {
                    percentage += chance.percentage;
                }
            }
        }

        //console.debug("Roll chance: ",chance);
        return percentage.toFixed(4) + '%';
    }
}