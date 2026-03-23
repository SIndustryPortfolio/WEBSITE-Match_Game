// Modules
import RenderPipelineModule from "../Services/RenderPipeline.js";
import UtilitiesModule from "../Services/Utilities.js";

// CORE
class Tile
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
        //this.TileImage = ComponentWrapperDiv.querySelector("#TileImage");
        this.TileVisual = ComponentWrapperDiv.querySelector("#TileVisual");
        this.TileOverlayDiv = ComponentWrapperDiv.querySelector("#TileOverlay");
    }

    Show() // Shows visual
    {
        // Functions
        // INIT
        this.TileOverlayDiv.style.visibility = "hidden";
        this.TileVisual.style.visibility = "visible";
    }

    Hide() // Hides Visual
    {
        // Functions
        // INIT
        this.TileOverlayDiv.style.visibility = "visible";
        this.TileVisual.style.visibility = "hidden";
    }

    Render(DeltaTime, AccumulatedTime) 
    {
        // Functions
        // INIT

        UtilitiesModule.ScaleText(this.TileOverlayDiv, 0.25);
        UtilitiesModule.ScaleText(this.TileVisual, 0.5);
    }

    Initialise(ItemName) 
    {
        // CORE
        const ItemMeta = window.Match["Items"][ItemName];

        // Functions
        // INIT
        this.ItemName = ItemName;
        this.TileVisual.innerHTML = ItemMeta["Visual"];
        this.Element.classList.add("Tile");
        this.TileOverlayDiv.style.visibility = "visible";

        // DIRECT
        RenderPipelineModule.Bind(this, this.Render.bind(this));
    }

    End() 
    {
        // Functions
        // INIT
        RenderPipelineModule.Unbind(this);
    }
}

export default Tile;