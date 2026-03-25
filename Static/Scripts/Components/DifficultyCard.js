// Modules
import UtilitiesModule from "../Services/Utilities.js";

// CORE
const AudioPath = "Static/Audio/";

const Sounds = {
    "Click" : new Audio(AudioPath + "Click.mp3")
};

// CLASS
class Topbar 
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;

        this.CardTitleHeading = ComponentWrapperDiv.querySelector("#CardTitle");
        this.CardTextParagraph = ComponentWrapperDiv.querySelector("#CardText");

        this.CardButton = ComponentWrapperDiv.querySelector("#CardButton");
        this.CardButtonBacking = ComponentWrapperDiv.querySelector("#CardButtonBacking");

        this.CardIconImage = ComponentWrapperDiv.querySelector("#CardIcon");

        this.Clicked = undefined;
    }

    ClickedCallback() 
    {
        // Functions
        // INIT
        if (this.Clicked == undefined) 
        {
            return;
        }

        Sounds["Click"].play();

        return this.Clicked();
    }

    async Initialise(Difficulty, Text) 
    {
        // CORE
        const DifficultyMeta = window.Difficulty[Difficulty];

        // Functions
        // 

        // INIT
        this.CardTitleHeading.innerHTML = Difficulty || "";
        this.CardTextParagraph.innerHTML = Text || "";

        this.CardButtonBacking.style.background = UtilitiesModule.ArrayToCSSColour([...DifficultyMeta["Colour"], .5]);
        this.CardIconImage.src = DifficultyMeta["Icon"];

        this.Element.onclick = this.ClickedCallback.bind(this);
    }

    End() 
    {

    }
}

export default Topbar;