// MODULES
import RenderPipelineModule from "../Services/RenderPipeline.js";
import ComponentsModule from "../Services/Components.js";
import UtilitiesModule from "../Services/Utilities.js";

// CLASS
class Narrator 
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
        this.NarratorTextParagraph = ComponentWrapperDiv.querySelector("#NarratorText");
    }

    async Initialise(Type) 
    {
        // CORE
        const NarratorMeta = window.Narrator[Type];

        // Functions
        // INIT
        this.NarratorTextParagraph.innerHTML = NarratorMeta["DisplayText"];
        this.Element.classList.add("FadeUp");

        UtilitiesModule.Show(this.Element);

        await RenderPipelineModule.Wait(1.25);

        this.Element.classList.remove("FadeUp");
        this.Element.classList.add("FadeOut");
        await RenderPipelineModule.Wait(1);

        ComponentsModule.RemoveComponent(this.Element);
    }

    async End() 
    {
        // Functions
        // INIT
    }
}

export default Narrator;