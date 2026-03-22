let UtilitiesModule = {};

// Functions
// MECHANICS
function Destroy(Element) 
{
    // Functions
    // INIT
    return Element.parentNode.removeChild(Element);
}


// DIRECT
UtilitiesModule.Destroy = Destroy;

export default UtilitiesModule;