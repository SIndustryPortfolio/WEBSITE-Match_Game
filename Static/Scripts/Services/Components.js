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
    
    if (ComponentModule !== undefined) 
    {
        return ComponentModule;
    }

    try 
    {
        let RawImport = await import(ScriptsComponentsPath + ComponentName + ".js");
        const Module = RawImport.default;

        ComponentModule = Module;
        ModuleCache[ComponentName] = Module;
    }
    catch(Error) 
    {
        ComponentModule = undefined;
        DebugModule.Print("GetComponentModule | Error: " + Error);
    }

    /*DebugModule.Print("Component Module!");
    DebugModule.Print(ComponentModule);*/

    return ComponentModule;
}

async function GetComponent(HTMLComponentName) 
{
    // Functions
    // INIT
    let ComponentWrapperDiv = document.createElement("div");
    ComponentWrapperDiv.id = "Component-" + HTMLComponentName;
    ComponentWrapperDiv.name = HTMLComponentName;

    let Component;

    try 
    {
        Component = await fetch(HTMLComponentsPath + HTMLComponentName + ".html").then(response => {return response.text();});
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
    const ComponentName = ComponentWrapperDiv.name;
    const ComponentModule = await GetComponentModule(ComponentName);

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

    if (ComponentModule !== undefined) 
    {
        DebugModule.Print(ComponentModule);
        Instance = new ComponentModule(ComponentWrapperDiv);

        Cache["Instance"] = Instance;

        if (Instance.Initialise != undefined) 
        {
            Instance.Initialise(...Options["Args"]);
        }
    }

    return Instance;
}

async function GetAndLoadComponent(ComponentName, Options) 
{
    // Functions
    // INIT
    let ComponentWrapperDiv = await GetComponent(ComponentName);
    let Instance = await LoadComponent(ComponentWrapperDiv, Options);

    return ComponentWrapperDiv, Instance;
}

// DIRECT
ComponentsModule.GetComponent = GetComponent;
ComponentsModule.LoadComponent = LoadComponent;

ComponentsModule.GetAndLoadComponent = GetAndLoadComponent;
ComponentsModule.GetComponentModule = GetComponentModule;

export default ComponentsModule;