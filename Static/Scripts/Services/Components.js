let ComponentsModule = {};

// Modules
import DebugModule from "./Debug.js";

// CORE
const HTMLComponentsPath = "Static/Templates/Components/";
const ScriptsComponentsPath = "../Components/";

let ModuleCache = {};
let ComponentCache = new Map();

// Functions
// MECHANICS
function GetComponentCache(ComponentWrapperDiv) 
{
    // Functions
    // INIT
    if (ComponentWrapperDiv != undefined) 
    {
        return ComponentCache.get(ComponentWrapperDiv);
    }
    else 
    {
        return ComponentCache;
    }
}

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
    // CORE
    let ComponentRawHTML;

    // Functions
    // INIT
    let ComponentWrapperDiv = document.createElement("div");
    ComponentWrapperDiv.id = "Component-" + HTMLComponentName;
    ComponentWrapperDiv.name = HTMLComponentName;
    ComponentWrapperDiv.style.position = "relative";

    try 
    {
        ComponentRawHTML = await fetch(HTMLComponentsPath + HTMLComponentName + ".html").then(response =>  response.text());
    }
    catch(Error) 
    {
        ComponentRawHTML = undefined;
        return DebugModule.Print("GetComponent | Error: " + Error);
    }

    ComponentWrapperDiv.innerHTML = ComponentRawHTML;

    ComponentCache.set(ComponentWrapperDiv, 
    {
        "Module": undefined     
    });   
    

    return ComponentWrapperDiv;
}

async function LoadComponent(ComponentWrapperDiv, Options) 
{
    // CORE
    const ComponentName = ComponentWrapperDiv.name;
    const ComponentModule = await GetComponentModule(ComponentName);

    let Cache = ComponentCache.get(ComponentWrapperDiv);
    let Instance;

    Options = Options || {};
    Options["Args"] = Options["Args"] || [];

    // Functions
    // INIT
    if (Options["Parent"] !== undefined) 
    {
        Options["Parent"].appendChild(ComponentWrapperDiv);
    }

    if (ComponentModule !== undefined) 
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

async function GetAndLoadComponent(ComponentName, Options) 
{
    // Functions
    // INIT
    let ComponentWrapperDiv = await GetComponent(ComponentName);
    let Instance = await LoadComponent(ComponentWrapperDiv, Options);

    return [ComponentWrapperDiv, Instance];
}

// DIRECT
ComponentsModule.GetComponent = GetComponent;
ComponentsModule.LoadComponent = LoadComponent;

ComponentsModule.GetAndLoadComponent = GetAndLoadComponent;
ComponentsModule.GetComponentModule = GetComponentModule;

ComponentsModule.GetComponentCache = GetComponentCache;

export default ComponentsModule;