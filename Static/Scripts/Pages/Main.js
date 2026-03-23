let PageModule = {};

// Modules
import ComponentsModule from "../Services/Components.js";
import DebugModule from "../Services/Debug.js";

// CORE
let PageComponents = {};

// Functions
// MECHANICS
async function LoadedCallback() 
{
    // Functions
    // INIT
    
    let BodyContentDiv = PageComponents["Topbar"].querySelector("#BodyContent");

    let [GameComponentWrapperDiv, GameInstance] = await ComponentsModule.GetAndLoadComponent("Game", 
    {
        "Parent" : BodyContentDiv,
        "Args": ["Easy"]
    });

    PageComponents["Game"] = GameComponentWrapperDiv;
}


async function Initialise() 
{
    // Functions
    // INIT
    let [TopbarComponentWrapperDiv, TopbarInstance] = await ComponentsModule.GetAndLoadComponent("Topbar", {"Parent" : document.body});
    let [FooterComponentWrapperDiv, FooterInstance] = await ComponentsModule.GetAndLoadComponent("Footer", {"Parent" : document.body});

    PageComponents["Topbar"] = TopbarComponentWrapperDiv;
    PageComponents["Footer"] = FooterComponentWrapperDiv;

    DebugModule.Print("PageComponents!");
    DebugModule.Print(PageComponents);

    await LoadedCallback();
}

function End() 
{
    // Functions
    // INIT
    
}

// DIRECT
PageModule.Initialise = Initialise;
PageModule.End = End;


export default PageModule;