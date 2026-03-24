let RenderPipelineModule = {};

// Modules
import DebugModule from "./Debug.js";
import UtilitiesModule from "./Utilities.js";

// CORE
let RenderCache = new Map();
const CoreRenderPrefix = "CoreRenderProcess-";
let CoreRenderIndex = 0;

// Functions
// MECHANICS
function Wait(Time) 
{
    // CORE
    let ResolveRender;
    let RenderKey;

    const RenderPromise = new Promise(resolve => {
        ResolveRender = resolve;
    });

    // FUNCTIONS
    // MECHANICS
    function Render(DeltaTime, AccumulatedTime) 
    {
        // Functions
        // INIT
        if (AccumulatedTime > Time) 
        {
            RenderPipelineModule.Unbind(RenderKey);
            return ResolveRender();
        }
    }

    // INIT
    RenderKey = RenderPipelineModule.Bind(undefined, Render);

    return RenderPromise;
}

function Bind(Key, Callback, Options) 
{
    // CORE
    let TimeNow = UtilitiesModule.GetTimeNow();
    Options = Options || {};
    Options["Args"] = Options["Args"] || [];

    // Functions
    // INIT
    if (Key == undefined) 
    {
        CoreRenderIndex += 1;
        Key = CoreRenderPrefix + CoreRenderIndex;
    }

    RenderCache.set(Key, {
        "Time" : TimeNow,
        "Callback" : Callback,
        "Args": Options["Args"],
        "DisconnectCallback" : Options["DisconnectCallback"]
    });

    return Key;
}

function Unbind(Key) 
{
    // Functions
    // INIT
    RenderCache.delete(Key);
}

function Initialise() 
{
    // CORE
    let AccumulatedTime = 0;
    let LastFrameTime = 0;
    let Busy = false;

    // Functions
    // MECHANICS
    function Render() 
    {
        if (Busy) 
        {
            return;
        }

        Busy = true;

        // CORE
        const TimeNow = UtilitiesModule.GetTimeNow();
        const DeltaTime = TimeNow - LastFrameTime;

        AccumulatedTime += DeltaTime;

        // Functions
        // INIT
        //DebugModule.Print("Render Loop | DT: " + DeltaTime + " | AT: " + AccumulatedTime);

        //DebugModule.Print(RenderCache);

        for (const [MetaKey, CallableMeta] of RenderCache) 
        {
            //const CallableMeta = RenderCache[MetaKey];
            
            const _StartTime = CallableMeta["Time"];
            const _AccumulatedTime = TimeNow - _StartTime;

            try 
            {
                CallableMeta["Callback"](DeltaTime, _AccumulatedTime, ...CallableMeta["Args"]);
            }
            catch(Error) 
            {
                DebugModule.Print("Render | Key: " + MetaKey + " | Error: " + Error);
            }
        }

        LastFrameTime = TimeNow;
        Busy = false;
        requestAnimationFrame(Render);
    }
    
    // INIT
    Render();
}

function End() 
{
    // Functions
    // INIT

}

// DIRECT
RenderPipelineModule.Initialise = Initialise;
RenderPipelineModule.End = End;

RenderPipelineModule.Wait = Wait;

RenderPipelineModule.Bind = Bind;
RenderPipelineModule.Unbind = Unbind;

export default RenderPipelineModule;