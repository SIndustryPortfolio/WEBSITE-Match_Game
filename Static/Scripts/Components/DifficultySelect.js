// Modules
import UtilitiesModule from "../Services/Utilities.js";
import DebugModule from "../Services/Debug.js";
import ComponentsModule from "../Services/Components.js";
import RenderPipelineModule from "../Services/RenderPipeline.js";

// CLASS
class DifficultySelect 
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
        this.ButtonsHolderDiv = ComponentWrapperDiv.querySelector("#ButtonsHolder");
    }

    async SetupDifficultyButtons() 
    {
        // CORE
        let ResolvePromise;
        const EventPromise = new Promise(resolve => {ResolvePromise = resolve;});

        const AllDifficultyMeta = window.Difficulty;

        // Functions
        // INIT
        DebugModule.Print("GridOverlayButtonsDiv");
        DebugModule.Print(this.GridOverlayButtonsDiv);

        for (const Difficulty in AllDifficultyMeta) 
        {
            await RenderPipelineModule.Wait(.5);

            const DifficultyMeta = AllDifficultyMeta[Difficulty];
            const DifficultyCSSColour = UtilitiesModule.ArrayToCSSColour(DifficultyMeta["Colour"]);

            DebugModule.Print("Setting up Difficulty Button: " + Difficulty);

            let [DifficultyButtonComponentWrapperDiv, DifficultyButtonInstance] = await ComponentsModule.GetAndLoadComponent("Button", 
            {
                "Parent" : this.ButtonsHolderDiv,
                "Args": [Difficulty]
            });

            DifficultyButtonInstance.Button.style.borderColor = DifficultyCSSColour;
            DifficultyButtonInstance.Button.style.color = DifficultyCSSColour;

            DifficultyButtonComponentWrapperDiv.classList.add("FadeUp");

            DifficultyButtonInstance.Clicked = function() 
            {
                return ResolvePromise(Difficulty);
            }
        }

        return EventPromise;
    }

    async Initialise() 
    {
        // Functions
        // INIT
        

    }

    End() 
    {
        // Functions
        // INIT

    }
}

export default DifficultySelect;