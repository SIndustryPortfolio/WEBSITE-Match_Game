let CoreModule = {};

// Modules
import PageModule from "./Pages/Main.js";
import DebugModule from "./Services/Debug.js";
import RenderPipelineModule from "./Services/RenderPipeline.js";

// CORE
const ModelPath = "Static/Model/";

// Functions
// MECHANICS
async function LoadedCallback() 
{
    // Functions
    // INIT
    DebugModule.Print("Loaded!");
    await PageModule.Initialise();
    
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
    DebugModule.Print("Loading Globals!");

    const CoreJSON = await fetch(ModelPath + "Core.json").then(response => response.json());
    const MatchJSON = await fetch(ModelPath + "Match.json").then(response =>  response.json());
    const DifficultyJSON = await fetch(ModelPath + "Difficulty.json").then(response => response.json());
    
    window.Core = CoreJSON;
    window.Match = MatchJSON;
    window.Difficulty = DifficultyJSON;

    DebugModule.Print(window.Difficulty);
}

function HandlePage() 
{
    // Functions
    // INIT
    document.title = window.Core["SiteName"];

    DebugModule.Print("Handling Page!");

    if (document.readyState == "loading") 
    {
        document.addEventListener("DOMContentLoaded", LoadedCallback);
    }
    else 
    {
        LoadedCallback();
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