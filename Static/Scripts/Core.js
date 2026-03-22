// Modules
import PageModule from "./Pages/Main.js";

// Functions
// MECHANICS
function HandlePage() 
{
    // Functions
    // MECHANICS
    function LoadedCallback() 
    {
        // Functions
        // INIT
        return PageModule.Initialise();
    }

    function UnloadCallback() 
    {
        // Functions
        // INIT
        return PageModule.End();
    }

    // INIT
    if (document.readyState == "complete") 
    {
        LoadedCallback();
    }
    else 
    {
        document.addEventListener("onload", LoadedCallback);
    }

    window.addEventListener("beforeunload", UnloadCallback);
}

// Init
Initialise();