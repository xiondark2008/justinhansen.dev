import { Component } from "react";
import { withRouter } from 'next/router'
import Roll from "@/roll_probability/types/Roll.js";
import DieType from "@/roll_probability/types/DieType.js";
import Target from "@/roll_probability/types/Target.js";
import WelcomeModal from "@/roll_probability/components/WelcomeModal";
import DieTypeInput from '@/roll_probability/components/DieTypeInput.jsx';
import TargetInput from '@/roll_probability/components/TargetInput.jsx';
import Results from '@/roll_probability/components/Results.jsx';
import { StandardDie } from '@/roll_probability/utils/Utilities.js';

import style from '@/roll_probability/styles/Base.module.scss';
import { isEmpty, urlQueryFromString } from "@/common/utils/Utilities";


export default withRouter( class RollProbabilityCalculator extends Component {
    static INITIAL_DIETYPES = [
        new DieType(StandardDie.D2),
        new DieType(StandardDie.D4),
        new DieType(StandardDie.D6),
        new DieType(StandardDie.D8),
        new DieType(StandardDie.D10),
        new DieType(StandardDie.D12)
    ];
    constructor( props ){ //console.debug("DEBUG - in RollProbabilityCalculator.constructor()");
        super(props)
        console.log("DEBUG - in RollProbabilityCalculator.constructor() > router: ",this.props.rounter)
        this.state = {
            dieTypes: RollProbabilityCalculator.INITIAL_DIETYPES,
            roll: new Roll( this.getDiceList.call(this, RollProbabilityCalculator.INITIAL_DIETYPES) ),
            target: new Target(0),
            showWelcomeMessage: true,
            showScrollbar: true
        }

        this.updateDieTypeQuantity = this.updateDieTypeQuantity.bind(this);
        this.updateTarget = this.updateTarget.bind(this);
        this.getDiceList = this.getDiceList.bind(this);

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount(){ console.debug("DEBUG - in RollProbabilityCalculator.componentDidMount()");
        //console.log("router: ", this.props.router)
        const urlQuery = urlQueryFromString( this.props.router.asPath )
        console.log("url query: ",urlQuery)
        if( !isEmpty(urlQuery) ){
            this.setState({
                showWelcomeMessage: urlQuery.instructions === 'false' ? false : true,
                showScrollbar: urlQuery.scrollbar === 'false' ? false : true
            })
        }
    }

    componentWillUnmount(){ console.debug('DEBUG - in RollProbabilityCalculator.componentWillUnmount()')

    }

    //Update functions
    updateDieTypeQuantity(index, val){ //console.debug("in RollProbabilityCalculator.updateDieTypeQuantity",arguments);
        this.setState( prevState => {
            const dieTypes = prevState.dieTypes,
                dieType = dieTypes[index],
                target = prevState.target
            let newRoll

            dieTypes[index] = dieType.copy(val)
            newRoll = new Roll( this.getDiceList(dieTypes) )

            return {
                dieTypes: dieTypes,
                roll: newRoll,
                target: target.copy( Math.max(target.value, newRoll.min) )
            }
        })
    }

    updateTarget(val, equal, lesser, greater){ //console.debug("in RollProbabilityCalculator.updateTarget()",arguments);
        this.setState( prevState => {
            return {
                target: prevState.target.copy(val, equal, lesser, greater)
            }
        })
    }

    //Utility functions
    getDiceList(dieTypes = this.state.dieTypes){ //console.debug("in RollProbabilityCalculator.getDiceList()",arguments);
        const dice = []
        
        for(const dieType of dieTypes){
            let count = 0
            
            while(count < dieType.quantity){
                dice.push(dieType.die)
                count++
            };
        }

        return dice
    }

    render(){ //console.debug("DEBUG - in RollProbabilityCalculator.render()")
        const dieTypeList = this.state.dieTypes.map( (dieType, idx) =>
            <DieTypeInput
                key={ idx }
                index={ idx }
                dieType={ dieType }
                update={ this.updateDieTypeQuantity }
            />
        )

        return(<>
        <div className={ ([
                'container-fluid',
                style.body,
                this.state.showScrollbar ? '' : 'scrollbar-hide'
            ]).join(' ') }
        >
            <section className="row justify-content-evenly flex-wrap">
                { dieTypeList }
            </section>
            <div className="row">
                <TargetInput
                    target={ this.state.target }
                    min={ this.state.roll.min }
                    update={ this.updateTarget }
                />
                <Results
                    roll={ this.state.roll }
                    target={ this.state.target }
                />
            </div>
            <WelcomeModal show={ this.state.showWelcomeMessage }
            />
        </div>
        </>);
    }
} )