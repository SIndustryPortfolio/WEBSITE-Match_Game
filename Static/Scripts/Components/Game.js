// Modules
import ComponentsModule from "../Services/Components.js";
import DebugModule from "../Services/Debug.js";
import RenderPipelineModule from "../Services/RenderPipeline.js";
import UtilitiesModule from "../Services/Utilities.js";

// CORE
const AudioPath = "Static/Audio/";

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
        this.GridOverlayBlurDiv = ComponentWrapperDiv.querySelector("#GridOverlayBlur");
        this.GridOverlayTopRow = ComponentWrapperDiv.querySelector("#GridOverlayTopRow");
        this.GridOverlayContentDiv = ComponentWrapperDiv.querySelector("#GridOverlayContent");

        this.NarratorHolderDiv = ComponentWrapperDiv.querySelector("#NarratorHolder");

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
            "Args": [this, "TotalClicks", "Total Clicks"]
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

    RenderGridOverlay(DeltaTime, AccumulatedTime, ) 
    {
        // Functions
        // INIT
        const GridWidth = this.TileGridDiv.offsetWidth;
        const GridHeight = this.TileGridDiv.offsetHeight;


        this.GridOverlayDiv.style.width = `${GridWidth}px`;
        this.GridOverlayDiv.style.height = `${GridHeight}px`;
        
        UtilitiesModule.ScaleText(this.GridOverlayText,  this.GridOverlayTextScale || 0);             
    }


    ToggleAllTiles(ToggleValue, IgnoreSound) 
    {
        // CORE
        IgnoreSound = IgnoreSound || false;

        // Functions
        // INIT
        if (!IgnoreSound) 
        {
            this.Sounds["Draw"].play();            
        };

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

    async CountdownBlur() 
    {
        // CORE
        const CountdownFrom = 3;
        let LastWholeCountdownNumber;

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
            const TransparencyPercentage = UtilitiesModule.Clamp(AccumulatedTime / (CountdownFrom * 0.75), 0, 1);

            const Opacity = UtilitiesModule.Clamp(UtilitiesModule.Lerp(1, 0, TransparencyPercentage) * 100, 0, 100);

            // Functions
            // INIT
            if (LastWholeCountdownNumber != TimeToDisplay) 
            {
                this.Sounds["Tick"].play();
            }

            this.GridOverlayText.innerHTML = TimeToDisplay;

            this.GridOverlayBlurDiv.style.opacity = `${Opacity}%`;
            

            if (AccumulatedTime > CountdownFrom) 
            {
                RenderPipelineModule.Unbind("CountdownBlur");

                UtilitiesModule.Hide(this.GridOverlayDiv, this.GridOverlayText);

                return ResolvePromise();
            }

            LastWholeCountdownNumber = TimeToDisplay;

            UtilitiesModule.Show(this.GridOverlayDiv, this.GridOverlayText);
        }

        // INIT
        RenderPipelineModule.Bind("CountdownBlur", Render.bind(this));

        return RenderPromise;
    }


    async TileSneakPeak() 
    {
        // CORE
        const SneakPeakTime = 3;
        /*let ResolvePromise;
        const RenderPromise = new Promise(resolve => 
        {
           ResolvePromise = resolve; 
        });*/

        // Functions
        // MECHANICS
        /*function Render(DeltaTime, AccumulatedTime) 
        {
            //DebugModule.Print("AccumulatedTime: " + AccumulatedTime); 

            //  Functions
            // INIT
            if (AccumulatedTime > SneakPeakTime) 
            {
                RenderPipelineModule.Unbind("TileSneakPeak");
                this.ToggleAllTiles(false);
                return ResolvePromise();
            }
        }*/

        // INIT
        this.ToggleAllTiles(true);
        //RenderPipelineModule.Bind("TileSneakPeak", Render.bind(this));

        await RenderPipelineModule.Wait(SneakPeakTime);
        this.ToggleAllTiles(false);

        //return RenderPromise;
    }

    async GameEnd() 
    {
        // Functions
        // INIT

        this.GameState = "Ended";

        RenderPipelineModule.Unbind("MainLoop");

        await this.ShowResults();
        await this.End();
    }

    async GameStart() 
    {
        // Functions
        // INIT
        this.GameState = "Starting";

        this.ToggleAllTiles(false, true);

        await this.CountdownBlur();
        await this.TileSneakPeak();

        this.GameState = "Running";
        await this.HandleMainLoop();

        await this.GameEnd();
    }

    async RandomNarrator() 
    {
        // CORE
        const AllNarratorMeta = UtilitiesModule.GetDictKeys(window.Narrator);
        const RandomNarratorIndex = UtilitiesModule.GetRandomInt(0, AllNarratorMeta.length - 1);

        const ChosenNarrator = AllNarratorMeta[RandomNarratorIndex];

        // Functions
        // INIT
        for (const NarratorComponentWrapperDiv of this.NarratorHolderDiv.children) 
        {
            ComponentsModule.RemoveComponent(NarratorComponentWrapperDiv);
        }

        ComponentsModule.GetAndLoadComponent("Narrator", 
        {
            "Parent" : this.NarratorHolderDiv,
            "Args" : [ChosenNarrator]
        })
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

            this.Sounds["Correct"].play();

            await this.RandomNarrator();

            Tile1Instance.Success();
            await Tile2Instance.Success();
        }
        else 
        {
            this.Sounds["Incorrect"].play();

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

            this.TopRowValues["TotalClicks"] += 1;

            DebugModule.Print("Total Clicks: " + this.TopRowValues["TotalClicks"]);

            this.CurrentClickedPair.push(TileWrapperDiv);

            TileInstance.Show();

            this.Sounds["Draw"].play();

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

        for (let i = 0; i < Math.floor(TotalTiles / 2); i++) 
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

                TileWrapperDiv.classList.add("Expand");

                await RenderPipelineModule.Wait(0.05);

                TilesOrder.push(TileWrapperDiv);
                this.TileCache.set(TileWrapperDiv, TileInstance);
            }
        }

        await RenderPipelineModule.Wait(1);

        UtilitiesModule.ShuffleArray(TilesOrder);

        for (let i= 0; i < TilesOrder.length; i++) 
        {
            const TileWrapperDiv = TilesOrder[i];
            
            TileWrapperDiv.style.order = `${i}`;
        }
    }

    async Initialise() //Difficulty) 
    {

        // CORE
        this.Sounds = {
            "Correct" : new Audio(AudioPath + "Correct.mp3"),
            "Incorrect" : new Audio(AudioPath + "Incorrect.mp3"),
            "Win" : new Audio(AudioPath + "Win.mp3"),
            //
            "Click" : new Audio(AudioPath + "Click.mp3"),
            "Tick" : new Audio(AudioPath + "Tick.mp3"),
            "Draw" : new Audio(AudioPath + "Draw.mp3")
        };

        this.GridOverlayTextScale = 1;

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
        UtilitiesModule.Hide(this.Element, this.GridOverlayText);

        //const Difficulty = await this.SetupDifficultyButtons();

        let [DifficultySelectComponentWrapperDiv, DifficultySelectInstance] = await ComponentsModule.GetAndLoadComponent("DifficultySelect", 
        {
            "Parent" : document.getElementById("BodyContent"),
            "Args": []
        });

        const Difficulty = await DifficultySelectInstance.SetupDifficultyButtons();

        await ComponentsModule.RemoveComponent(DifficultySelectComponentWrapperDiv);

        this.Difficulty = Difficulty;
        this.DifficultyMeta = window.Difficulty[Difficulty];

        await this.HandleTopRow();

        this.GridOverlayTextScale = 0.5;
        RenderPipelineModule.Bind("GridOverlay", this.RenderGridOverlay.bind(this));
        
        UtilitiesModule.Show(this.Element);
        await this.SetupTiles();
        await this.GameStart();
    }

    async ShowResults() 
    {
        // Functions
        // INIT
        UtilitiesModule.DestroyChildren(this.NarratorHolderDiv);

        this.GridOverlayText.innerHTML = "YOU WIN!";

        const TopRowElementsCount = this.TopRowDiv.children.length;

        this.GridOverlayTopRow.append(...this.TopRowDiv.children);

        this.GridOverlayTopRow.style.gridTemplateColumns = `repeat(${TopRowElementsCount}, 1fr)`;

        this.GridOverlayTextScale = 0.125;
        this.GridOverlayBlurDiv.style.opacity = "100%";

        UtilitiesModule.Show(this.GridHolderDiv, this.GridOverlayText, this.GridOverlayTopRow, this.GridOverlayBlurDiv, this.GridOverlayContentDiv);

        this.GridOverlayContentDiv.classList.add("GridOverlayContentResults");

        this.Sounds["Win"].play();

        await RenderPipelineModule.Wait(1);

        let [PlayAgainComponentWrapperDiv, PlayAgainInstance] = await ComponentsModule.GetAndLoadComponent("Button", 
        {
            "Parent" : this.GridOverlayContentDiv,
            "Args" : ["Play Again"]
        })

        PlayAgainInstance.Element.style.width = "80%";
        PlayAgainInstance.Element.style.height = "50px";

        PlayAgainInstance.Element.classList.add("FadeUp");
        UtilitiesModule.Show(PlayAgainInstance.Element);

        PlayAgainInstance.Clicked = function() 
        {
            // Functions
            // INIT
            return location.reload(true);
        }
    }

    async End() 
    {
        // Functions
        // INIT
        RenderPipelineModule.Unbind("MainLoop");
        //RenderPipelineModule.Unbind("GridOverlay");

        UtilitiesModule.DestroyChildren(this.TopRowDiv);
    }
}

export default Game;