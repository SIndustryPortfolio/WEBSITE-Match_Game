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
    
    let BodyContentDiv = PageComponents["Topbar"].Element.querySelector("#BodyContent");
    PageComponents["Game"] = await ComponentsModule.GetAndLoadComponent("Game", 
    {
        "Parent" : BodyContentDiv,
        "Args": ["Easy"]
    });
}


async function Initialise() 
{
    // Functions
    // INIT
    PageComponents["Topbar"] = await ComponentsModule.GetAndLoadComponent("Topbar", {"Parent" : document.body});
    //PageComponents["Topbar"] = await ComponentsModule.GetAndLoadComponent("Topbar", {"Parent" : document.body});
    PageComponents["Footer"] = await ComponentsModule.GetAndLoadComponent("Footer", {"Parent" : document.body});

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