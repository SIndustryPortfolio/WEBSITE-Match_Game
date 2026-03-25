// CORE
const AudioPath = "Static/Audio/";

const Sounds = {
    "Click" : new Audio(AudioPath + "Click.mp3")
}

// CLASS
class Button 
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
        this.Button = ComponentWrapperDiv.querySelector("#Button");

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

    async Initialise(Text) 
    {
        // Functions
        // INIT
        this.Button.innerHTML = Text;

        this.Element.onclick = this.ClickedCallback.bind(this);
    }

    End() 
    {

    }
}

export default Button;