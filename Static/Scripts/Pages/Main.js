let PageModule = {};

// Modules
import ComponentsModule from "../Services/Components.js";

// CORE
let PageComponents = {};

// Functions
// MECHANICS
async function LoadedCallback() 
{
    // Functions
    // INIT
    let BodyContentDiv = PageComponents["Topbar"].querySelector("#BodyContent");
    PageComponents["Game"] = await ComponentsModule.GetAndLoadComponent("Game", {"Parent" : BodyContentDiv});
}


async function Initialise() 
{
    // Functions
    // INIT
    PageComponents["Topbar"] = await ComponentsModule.GetAndLoadComponent("Topbar", {"Parent" : document.body});
    PageComponents["Footer"] = await ComponentsModule.GetAndLoadComponent("Footer", {"Parent" : document.body});

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