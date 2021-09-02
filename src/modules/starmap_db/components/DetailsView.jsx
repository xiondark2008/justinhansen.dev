import { Component } from "react";
import { UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";

import style from '@/starmap_db/styles/StarMapDB.module.scss'

export default class DetailsView extends Component {
    constructor(props) { //console.debug("in DetailsView.constructor", arguements)
        super(props)
    }

    render(){ //console.debug("in DetailsView.render", arguements)
        const record = this.props.record,
            setRecord = this.props.setRecord,
            entityStub = this.props.entityStub,
            EntityDetailView = entityStub ? entityStub.detailsView : undefined

        return(<>
        <aside className="d-none d-md-block container-fluid"
            id={ style.details_panel }
        >
            { EntityDetailView ? 
                <EntityDetailView
                    record={ record }
                    setRecord={ setRecord }
                />
                : <span>Loading...</span>
            }
        </aside>
        </>)
    }
}