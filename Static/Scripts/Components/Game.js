// Modules
import CoreModule from "../Core.js";
import ComponentsModule from "../Services/Components.js";
import RenderPipelineModule from "../Services/RenderPipeline.js";
import UtilitiesModule from "../Services/Utilities.js";

// CORE

// CLASS
class Game 
{
    constructor(ComponentWrapperDiv) 
    {
        this.Element = ComponentWrapperDiv;

        this.TopRowDiv = ComponentWrapperDiv.querySelector("#TopRow");
        this.TileGridDiv = ComponentWrapperDiv.querySelector("#TileGrid");
        this.BottomRowDiv = ComponentWrapperDiv.querySelector("#BottomRow");

        this.TileCache = {};
    }

    Render(DeltaTime, AccumulatedTime) 
    {
        // Functions
        // INIT

    }

    async SetupTiles() 
    {
        // CORE
        let TotalTiles = this.DifficultyMeta["GridSize"];
        let TilesInDirection = Math.sqrt(TotalTiles);

        // Functions
        // INIT
        this.TileGridDiv.style.display = "grid";
        this.TileGridDiv.style.gridTemplateColumns = `repeat(${TilesInDirection}, 1fr)`;
        this.TileGridDiv.style.gap = "10px";
        
        for (let i = 0; i < TotalTiles / 2; i++) 
        {
            const ItemName = 0;

            let TileWrapperDiv, TileInstance = await ComponentsModule.GetAndLoadComponent("Tile", {"Parent" : this.TileGridDiv});

            this.TileCache[TileWrapperDiv] = {"Instance" : TileInstance};
        }
    }

    async Initialise(Difficulty) 
    {
        // Functions
        // INIT
        this.Difficulty = Difficulty;
        this.DifficultyMeta = window.Difficulty[Difficulty];

        await this.SetupTiles();

        this.StartTime = UtilitiesModule.GetTimeNow();
        RenderPipelineModule.Bind("GameRuntime", this.Render.bind(this));
    }

    End() 
    {
        // Functions
        // INIT
        RenderPipelineModule.Unbind("GameRuntime");
    }
}

export default Game;