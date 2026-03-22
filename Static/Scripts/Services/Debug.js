let DebugModule = {}

// CORE

// Functions
// MECHANICS
function Print(Message) 
{
    // Functions
    // INIT
    return console.log(Message);
}

// DIRECT
DebugModule.Print = Print;

export default DebugModule;