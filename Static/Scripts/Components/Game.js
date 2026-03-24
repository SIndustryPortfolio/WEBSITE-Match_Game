// Modules
import CoreModule from "../Core.js";
import ComponentsModule from "../Services/Components.js";
import DebugModule from "../Services/Debug.js";
import RenderPipelineModule from "../Services/RenderPipeline.js";
import UtilitiesModule from "../Services/Utilities.js";
import Tile from "./Tile.js";

// CORE

// CLASS
class Game 
{
    constructor(ComponentWrapperDiv) 
    {
        this.Element = ComponentWrapperDiv;

        this.TopRowDiv = ComponentWrapperDiv.querySelector("#TopRow");
        
        this.GridHolderDiv = ComponentWrapperDiv.querySelector("#GridHolder");
        this.GridOverlayDiv = ComponentWrapperDiv.querySelector("#GridOverlay");
        this.GridOverlayText = ComponentWrapperDiv.querySelector("#GridOverlayText");
        this.TileGridDiv = ComponentWrapperDiv.querySelector("#TileGrid");
        this.BottomRowDiv = ComponentWrapperDiv.querySelector("#BottomRow");

        //this.TargetRenderOperation;
    }

    async HandleTopRow() 
    {
        // Functions
        // INIT
        let [TimeCardComponentWrapperDiv, TimeCardInstance] = await ComponentsModule.GetAndLoadComponent("TopRowCard", {
            "Parent" : this.TopRowDiv,
            "Args": [this, "Time"]
        });

        let [TotalClicksComponentWrapperDiv, TotalClicksInstance] = await ComponentsModule.GetAndLoadComponent("TopRowCard", {
            "Parent" : this.TopRowDiv,
            "Args": [this, "Total Clicks"]
        });

        let [MatchesComponentWrapperDiv, MatchesInstance] = await ComponentsModule.GetAndLoadComponent("TopRowCard", {
            "Parent" : this.TopRowDiv,
            "Args": [this, "Matches"]
        });
    }


    async HandleMainLoop(DeltaTime, AccumulatedTime) 
    {
        // CORE
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
            this.TopRowValues["Time"] = AccumulatedTime;

            if (this.TopRowValues["Matches"] == (this.TileCache.size / 2)) 
            {
                return ResolvePromise();
            }
        }

        // INIT
        this.StartTime = UtilitiesModule.GetTimeNow();
        RenderPipelineModule.Bind("MainLoop", Render.bind(this));

        return RenderPromise;
    }

    RenderGridOverlay(DeltaTime, AccumulatedTime) 
    {
        // Functions
        // INIT
        const GridWidth = this.TileGridDiv.offsetWidth;
        const GridHeight = this.TileGridDiv.offsetHeight;


        this.GridOverlayDiv.style.width = `${GridWidth}px`;
        this.GridOverlayDiv.style.height = `${GridHeight}px`;
        UtilitiesModule.ScaleText(this.GridOverlayText,  0.5);
    }


    ToggleAllTiles(ToggleValue) 
    {
        // Functions
        // INIT
        for (let [TileComponentWrapperDiv, TileInstance] of this.TileCache) 
        {
            if (ToggleValue) 
            {
                TileInstance.Show();
                continue;
            }

            TileInstance.Hide();
        }
    }

    CountdownBlur() 
    {
        // CORE
        const CountdownFrom = 3;
        let ResolvePromise;
        const RenderPromise = new Promise(resolve => 
        {
            ResolvePromise = resolve;
        });

        // Functions
        // MECAHNICS
        function Render(DeltaTime, AccumulatedTime) 
        {
            // CORE
            const TimeToDisplay = Math.ceil(CountdownFrom - AccumulatedTime);
            
            // Functions
            // INIT

            this.GridOverlayText.innerHTML = TimeToDisplay;

            if (AccumulatedTime > CountdownFrom) 
            {
                RenderPipelineModule.Unbind("CountdownBlur");

                this.GridOverlayDiv.style.visibility = "hidden";

                return ResolvePromise();
            }
        }

        // INIT
        this.GridOverlayDiv.style.visibility = "visible";

        RenderPipelineModule.Bind("CountdownBlur", Render.bind(this));

        return RenderPromise;
    }


    TileSneakPeak() 
    {
        // CORE
        const SneakPeakTime = 3;
        let ResolvePromise;
        const RenderPromise = new Promise(resolve => 
        {
           ResolvePromise = resolve; 
        });

        // Functions
        // MECHANICS
        function Render(DeltaTime, AccumulatedTime) 
        {
            //console.log("AccumulatedTime: " + AccumulatedTime); 

            //  Functions
            // INIT
            if (AccumulatedTime > SneakPeakTime) 
            {
                RenderPipelineModule.Unbind("TileSneakPeak");
                this.ToggleAllTiles(false);
                return ResolvePromise();
            }
        }

        // INIT
        this.ToggleAllTiles(true);
        RenderPipelineModule.Bind("TileSneakPeak", Render.bind(this));

        return RenderPromise;
    }

    async GameEnd() 
    {
        // Functions
        // INIT


        this.End();
    }

    async GameStart() 
    {
        // Functions
        // INIT
        this.GameState = "Starting";

        this.ToggleAllTiles(false);

        await this.CountdownBlur();
        await this.TileSneakPeak();

        this.GameState = "Running";
        await this.HandleMainLoop();

        await this.GameEnd();
    }


    async CheckIfMatchingPair() 
    {
        // CORE
        const Pair = this.CurrentClickedPair;

        const Tile1ComponentWrapperDiv = Pair[0];
        const Tile1Instance = this.TileCache.get(Tile1ComponentWrapperDiv);

        const Tile2ComponentWrapperDiv = Pair[1];
        const Tile2Instance = this.TileCache.get(Tile2ComponentWrapperDiv);

        // Functions
        // INIT
        if (Tile1Instance.ItemName == Tile2Instance.ItemName) 
        {
            this.TopRowValues["Matches"] += 1;

            Tile1Instance.Disabled = true;
            Tile2Instance.Disabled = true;

            Tile1Instance.Success();
            await Tile2Instance.Success();
        }
        else 
        {
            Tile1Instance.Failed();
            await Tile2Instance.Failed();

            Tile1Instance.Disabled = false;
            Tile2Instance.Disabled = false;
        }

        this.CurrentClickedPair = [];

    }

    HandleTileTemplate(TileWrapperDiv, TileInstance) 
    {
        // Functions
        // MECHANICS
        async function Clicked() 
        {
            // Functions
            // INIT
            if (TileInstance.Disabled) 
            {
                return;
            }

            if (this.GameState != "Running") 
            {
                return;
            }
            
            if (this.CurrentClickedPair.length == 2) 
            {
                return;
            }

            TileInstance.Disabled = true;

            this.CurrentClickedPair.push(TileWrapperDiv);

            TileInstance.Show();

            if (this.CurrentClickedPair.length == 2) 
            {
                return await this.CheckIfMatchingPair();
            }
        }

        // DIRECT
        TileWrapperDiv.onclick = Clicked.bind(this);
    }


    async SetupTiles() 
    {
        // CORE
        let TilesOrder = [];

        DebugModule.Print("Difficulty: " + this.Difficulty);
        DebugModule.Print("Difficulty Meta");
        DebugModule.Print(this.DifficultyMeta);

        const TotalTiles = this.DifficultyMeta["GridSize"];
        const TilesInDirection = Math.sqrt(TotalTiles);
        
        const AllItemMeta = window.Match["Items"];
        const AllItemNames = UtilitiesModule.GetDictKeys(AllItemMeta);

        // Functions
        // INIT
        this.TileGridDiv.style.gridTemplateColumns = `repeat(${TilesInDirection}, minmax(0, 1fr))`;
        this.TileGridDiv.style.gap = "10px";

        for (let i = 0; i < TotalTiles / 2; i++) 
        {
            const RandomItemNumber = UtilitiesModule.GetRandomInt(0, AllItemNames.length - 1);
            const ItemName = AllItemNames[RandomItemNumber];

            for (let x = 0; x < 2; x++) 
            {
                let [TileWrapperDiv, TileInstance] = await ComponentsModule.GetAndLoadComponent("Tile", 
                {
                    "Parent" : this.TileGridDiv,
                    "Args": [ItemName]
                });

                this.HandleTileTemplate(TileWrapperDiv, TileInstance);

                TilesOrder.push(TileWrapperDiv);
                this.TileCache.set(TileWrapperDiv, TileInstance);
            }
        }

        UtilitiesModule.ShuffleArray(TilesOrder);

        for (let i= 0; i < TilesOrder.length; i++) 
        {
            const TileWrapperDiv = TilesOrder[i];
            
            console.log(TileWrapperDiv);

            TileWrapperDiv.style.order = `${i}`;

        }

    }

    async Initialise(Difficulty) 
    {

        // CORE
        this.GameState = "Ended";
        this.TileCache = new Map();

        this.CurrentClickedPair = [];

        this.TopRowValues = {
            "Time": 0,
            "TotalClicks": 0,
            "Matches": 0
        };

        // Functions
        // INIT
        this.Difficulty = Difficulty;
        this.DifficultyMeta = window.Difficulty[Difficulty];

        await this.HandleTopRow();
        await this.SetupTiles();

        RenderPipelineModule.Bind("GridOverlay", this.RenderGridOverlay.bind(this));
        
        await this.GameStart();
    }

    End() 
    {
        // Functions
        // INIT
        RenderPipelineModule.Unbind("MainLoop");
        RenderPipelineModule.Unbind("GridOverlay");

    }
}

export default Game;