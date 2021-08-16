import { Component } from "react";

import style from '@/roll_probability/styles/WelcomeModal.module.scss';

export default class WelcomeModal extends Component {
    constructor(props){
        super(props)

        this.modalId = 'welcomeModal'

        this.componentDidMount = this.componentDidMount.bind(this)
        this.render = this.render.bind(this)
    }

    componentDidMount() {
        var myModal = new bootstrap.Modal( document.getElementById( this.modalId, {} ) )
        myModal.show()
    }

    render(){
        return(<>
        <div className={ "modal fade "+style.modal }
            id={ this.modalId }
            tabIndex="-1"
            aria-labelledby="modalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title"
                            id="modalLabel"
                        >Welcome!</h1>
                        <button className="btn-close"
                            type="button"
                            data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>This app will help you calculate the odds of getting a particulate result
                        when rolling a combination of multisided dice.</p>
                        <p>If you know what it means to "roll a d8," then you can skip this part. 
                        If not, let's <a className=''
                                         data-bs-toggle="collapse" 
                                         href="#additionInfo" 
                                         role="button" 
                                         aria-expanded="false" 
                                         aria-controls="additionInfo"
                        >learn some lingo.</a></p>
                        <p className='collapse' 
                            id="additionInfo"
                        >When rolling multisided dice, it is normally written as "3d6". In this 
                        notation, the number before the letter 'd' is the number of dice to roll. 
                        The following number indicates the number of sides on the die. The number 
                        of sides of a die is also know as the die size. So in this example, "roll 
                        3d6" means to roll 3 six-sided dice.</p>
                        <p>Start by 1) entering in the number of each type of die you will roll. 2) Select
                        a target value. Then 3) choose if you want to roll equal to, less than, or greater
                        than you target value. The probability of your roll will be displayed along with 
                        a graph displaying the odds of rolling each number possible in the range.</p>
                        <p>Now, let's roll!</p>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary btn-lg"
                            type="button"
                            data-bs-dismiss="modal"
                        >LET'S ROLL</button>
                    </div>
                </div>
            </div>
        </div>
        </>)
    }
}