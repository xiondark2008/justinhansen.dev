import Die from "@/roll_probability/types/Die.js";

const factorials = []
export function factorial(n) { //console.debug("in factorial",arguments);
    //if(window && window.factorials === undefined) window.factorials = []
    if (n == 0 || n == 1) return 1;
    if (factorials[n] > 0) return factorials[n];
    return factorials[n] = factorial(n - 1) * n;
}

export function combinations(n, r) { //console.debug("in combinations",arguments);
    if(n < 1 || n + r < 1) return 0
    return factorial(n + r - 1) / ( factorial(r) * factorial(n - 1) );
}

export function toBinary(num, template) { //console.debug("in toBinary",arguments);
    const val = num.toString(2),
        lng = template.length;
    return ("" + template + val).substr(-1 * lng, lng);
}

//Standard Dice
export class StandardDie {
    static get D2(){
        return new Die(2)
    }
    static get D4(){
        return new Die(4)
    }
    static get D6(){
        return new Die(6)
    }
    static get D8(){
        return new Die(8)
    }
    static get D10(){
        return new Die(10)
    }
    static get D12(){
        return new Die(12)
    }
    static get D20(){
        return new Die(20)
    }
}
