// Modules
import UtilitiesModule from "../Services/Utilities.js";
import DebugModule from "../Services/Debug.js";
import ComponentsModule from "../Services/Components.js";

// CLASS
class DifficultySelect 
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
    }

    async SetupDifficultyButtons() 
    {
        // CORE
        let ResolvePromise;
        const EventPromise = new Promise(resolve => {ResolvePromise = resolve;});

        const AllDifficultyMeta = window.Difficulty;

        // Functions
        // INIT
        console.log("GridOverlayButtonsDiv");
        console.log(this.GridOverlayButtonsDiv);

        for (const Difficulty in AllDifficultyMeta) 
        {
            const DifficultyMeta = AllDifficultyMeta[Difficulty];
            const DifficultyCSSColour = UtilitiesModule.ArrayToCSSColour(DifficultyMeta["Colour"]);

            DebugModule.Print("Setting up Difficulty Button: " + Difficulty);

            let [DifficultyButtonComponentWrapperDiv, DifficultyButtonInstance] = await ComponentsModule.GetAndLoadComponent("Button", 
            {
                "Parent" : this.Element,
                "Args": [Difficulty]
            });


            DifficultyButtonInstance.Button.style.borderColor = DifficultyCSSColour;
            DifficultyButtonInstance.Button.style.color = DifficultyCSSColour;

            DifficultyButtonInstance.Clicked = function() 
            {
                return ResolvePromise(Difficulty);
            }
        }

        return EventPromise;
    }

    Initialise() 
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