let CoreModule = {};

// Modules
import PageModule from "./Pages/Main.js";
import DebugModule from "./Services/Debug.js";
import RenderPipelineModule from "./Services/RenderPipeline.js";

// CORE

// Functions
// MECHANICS
function LoadedCallback() 
{
    // Functions
    // INIT
    DebugModule.Print("Loaded!");
    PageModule.Initialise();
    
    if (PageModule.Heartbeat !== undefined) 
    {
        RenderPipelineModule.Bind("PageHeartbeat", PageModule.Heartbeat);
    }
}

function UnloadCallback() 
{
    // Functions
    // INIT
    RenderPipelineModule.Unbind("PageHeartbeat");
    return PageModule.End();
}

function HandlePage() 
{
    // Functions
    // INIT
    if (document.readyState === "complete") 
    {
        LoadedCallback();
    }
    else 
    {
        document.addEventListener("DOMContentLoaded", LoadedCallback);
    }

    window.addEventListener("beforeunload", UnloadCallback);
}   

function Initialise() 
{
    // Functions
    // INIT
    DebugModule.Print("Handling Core Logic!");
    RenderPipelineModule.Initialise();
    HandlePage();
}

// DIRECT
CoreModule.Initialise = Initialise;

// Init
export default CoreModule;