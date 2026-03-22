let PageModule = {};

// Modules
import ComponentsModule from "../Services/Components.js";

// Functions
// MECHANICS
async function Initialise() 
{
    // Functions
    // INIT
    ComponentsModule.GetAndLoadComponent("Topbar", {"Parent" : document.body});
    ComponentsModule.GetAndLoadComponent("Footer", {"Parent" : document.body});
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