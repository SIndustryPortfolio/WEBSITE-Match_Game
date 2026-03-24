// Modules
import RenderPipelineModule from "../Services/RenderPipeline.js";
import UtilitiesModule from "../Services/Utilities.js";

// CORE
const PossibleClasses = [
    "TileSuccess",
    "TileFailed"
];

// CLASS
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

    Uncolour() 
    {
        // Functions
        // INIT
        for (let i = 0; i < PossibleClasses.length; i++) 
        {
            const ClassName = PossibleClasses[i];
            this.Element.classList.remove(ClassName);
        }
    }

    Recolour(ClassName) 
    {
        // Functions
        // INIT
        this.Element.classList.add(ClassName);
    }


    Success() 
    {
        // Functions
        // INIT
        this.Recolour("TileSuccess");
    }

    async Failed() 
    {
        // CORE
        let RenderKey;
        let ResolvePromise;
        const RenderPromise = new Promise(resolve => {
            ResolvePromise = resolve;
        }); 

        // Functions
        // MECHANICS
        function Render(DeltaTime, AccumulatedTime) 
        {
            // Functions
            // INIT
            if (AccumulatedTime > 1) 
            {
                RenderPipelineModule.Unbind(RenderKey);

                this.Uncolour();
                this.Hide();
                return ResolvePromise();
            }
        }

        // INIT
        this.Recolour("TileFailed");
        RenderKey = RenderPipelineModule.Bind(undefined, Render.bind(this));

        return RenderPromise;
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

    async Initialise(ItemName) 
    {
        // CORE
        const ItemMeta = window.Match["Items"][ItemName];
        this.Disabled = false;

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