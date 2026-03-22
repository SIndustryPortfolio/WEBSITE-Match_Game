let CoreModule = {};

// Modules
import PageModule from "./Pages/Main.js";
import DebugModule from "./Services/Debug.js";
import RenderPipelineModule from "./Services/RenderPipeline.js";

// CORE
const ModelPath = "Static/Model/";

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

async function HandleGlobals() 
{
    // Functions
    // INIT
    const CoreJSON = await fetch(ModelPath + "Core.json").then(response => function() {return response.json();});
    const MatchJSON = await fetch(ModelPath + "Match.json").then(response => function() {return response.json();});
    const DifficultyJSON = await fetch(ModelPath + "Difficulty.json").then(response => function() {return response.json()});

    window.Core = CoreJSON;
    window.Match = MatchJSON;
    window.Difficulty = DifficultyJSON;
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

async function Initialise() 
{
    // Functions
    // INIT
    DebugModule.Print("Handling Core Logic!");

    await HandleGlobals();
    RenderPipelineModule.Initialise();
    HandlePage();
}

// DIRECT
CoreModule.Initialise = Initialise;

// Init
export default CoreModule;