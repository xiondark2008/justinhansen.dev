export default class DieType {
    constructor(die, quantity = 0){
        this.quantity = Math.max(quantity, 0)
        this.die = die
    }

    copy(quantity = this.quantity, die = this.die){
        return new DieType(die, quantity)
    }
}