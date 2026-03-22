let RenderPipelineModule = {};

// Modules
import DebugModule from "./Debug.js";
import UtilitiesModule from "./Utilities.js";

// CORE
let RenderCache = {};

// Functions
// MECHANICS
function Bind(Key, Callback, Options) 
{
    // CORE
    let TimeNow = UtilitiesModule.GetTimeNow();
    Options = Options || {};
    Options["Args"] = Options["Args"] || [];

    // Functions
    // INIT
    RenderCache[Key] = {
        "Time" : TimeNow,
        "Callback" : Callback,
        "Args": Options["Args"],
        "DisconnectCallback" : Options["DisconnectCallback"]
    };
}

function Unbind(Key) 
{
    // Functions
    // INIT
    delete RenderCache[Key];
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

        for (let MetaKey in RenderCache) 
        {
            const CallableMeta = RenderCache[MetaKey];
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

RenderPipelineModule.Bind = Bind;
RenderPipelineModule.Unbind = Unbind;

export default RenderPipelineModule;