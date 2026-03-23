// Modules
import RenderPipelineModule from "../Services/RenderPipeline.js";
import UtilitiesModule from "../Services/Utilities.js";

// CLASS
class TopRowCard 
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
        this.CardTitleHeading = ComponentWrapperDiv.querySelector("#CardTitle");
        this.CardTextHeading = ComponentWrapperDiv.querySelector("#CardText");
    }

    Render(DeltaTime, AccumulatedTime) 
    {
        // Functions
        // INIT
        //UtilitiesModule.ScaleText(this.CardTitleHeading, 0.3);
        //UtilitiesModule.ScaleText(this.CardTextHeading, 0.5);

        this.CardTextHeading.innerHTML = Math.floor(this.GameInstance.TopRowValues[this.TopRowKey] || 0);
    }

    Initialise(GameInstance, TopRowKey) 
    {
        // Functions
        // INIT
        this.GameInstance = GameInstance;
        this.TopRowKey = TopRowKey;

        this.CardTitleHeading.innerHTML = TopRowKey;

        RenderPipelineModule.Bind(this, this.Render.bind(this));
    }

    End() 
    {
        // Functions
        // INIT
        RenderPipelineModule.Unbind(this);
    }
}

export default TopRowCard;