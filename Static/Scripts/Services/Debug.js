let DebugModule = {}

// CORE
const DebugMode = false;

// Functions
// MECHANICS
function Print(Message) 
{
    // Functions
    // INIT
    if (!DebugMode) 
    {
        return;
    }

    return console.log(Message);
}

// DIRECT
DebugModule.Print = Print;

export default DebugModule;