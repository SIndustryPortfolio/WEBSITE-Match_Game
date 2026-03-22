let ComponentsModule = {};

// Modules
import DebugModule from "./Debug.js";

// CORE
const HTMLComponentsPath = "Static/Templates/Components/";
const ScriptsComponentsPath = "../Components/";

let ModuleCache = {};
let ComponentCache = {};

// Functions
// MECHANICS
async function GetComponentModule(ComponentName) 
{
    // Functions
    // INIT
    let ComponentModule = ModuleCache[ComponentName];
    
    if (ComponentModule != undefined) 
    {
        return ComponentModule;
    }

    try 
    {
        ComponentModule = await import(ScriptsComponentsPath + ComponentName + ".js");
        ModuleCache[ComponentName] = ComponentModule;
    }
    catch(Error) 
    {
        DebugModule.Print("GetComponentModule | Error: " + Error);
    }

    return ComponentModule;
}

async function GetComponent(HTMLComponentName) 
{
    // Functions
    // INIT
    let ComponentWrapperDiv = document.createElement("div");
    ComponentWrapperDiv.id = "Component-" + HTMLComponentName;
    ComponentWrapperDiv.tagName = HTMLComponentName;

    let Component;

    try 
    {
        Component = fetch(HTMLComponentsPath + HTMLComponentName + ".html").then(response => {return response.text;});
    }
    catch(Error) 
    {
        return DebugModule.Print("GetComponent | Error: " + Error);
    }

    ComponentWrapperDiv.innerHTML = Component;

    ComponentCache[ComponentWrapperDiv] = 
    {
        "Module": undefined     
    };

    return ComponentWrapperDiv;
}

async function LoadComponent(ComponentWrapperDiv, Options) 
{
    // CORE
    const ComponentName = ComponentWrapperDiv.tagName;
    const ComponentModule = GetComponentModule(ComponentName);

    let Cache = ComponentCache[ComponentWrapperDiv];
    let Instance;

    Options = Options || {};
    Options["Args"] = Options["Args"] || [];

    // Functions
    // INIT
    if (Options["Parent"]) 
    {
        Options["Parent"].appendChild(ComponentWrapperDiv);
    }

    if (ComponentModule) 
    {
        Instance = new ComponentModule(ComponentWrapperDiv);

        Cache["Instance"] = Instance;

        if (Instance.Initialise != undefined) 
        {
            Instance.Initialise(...Options["Args"]);
        }
    }

    return Instance;
}

// DIRECT
ComponentsModule.GetComponent = GetComponent;
ComponentsModule.LoadComponent = LoadComponent;
ComponentsModule.GetComponentModule = GetComponentModule;

export default ComponentsModule;