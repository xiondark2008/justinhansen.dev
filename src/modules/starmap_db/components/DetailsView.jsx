import { Component } from "react";
import { UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";

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
        <aside className="col-lg-4 h-100 overflow-auto">
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