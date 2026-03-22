let UtilitiesModule = {};

// Functions
// MECHANICS
UtilitiesModule.GetDictKeys = function(Dict) 
{
    // Functions
    // INIT
    return Object.keys(Dict);
}

UtilitiesModule.GetRandomInt = function(Min, Max) 
{
    // Functions
    // INIT
    return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}

UtilitiesModule.Destroy = function(Element) 
{
    // Functions
    // INIT
    return Element.parentNode.removeChild(Element);
}

UtilitiesModule.GetUTCTimeNow = function() 
{
    // Functions
    // INIT
    return Date.now() / 1000;
}

UtilitiesModule.GetTimeNow = function() 
{
    // Functions
    // INIT
    return performance.now() / 1000;
}

UtilitiesModule.Clamp = function(Value, Min, Max) 
{
    // Functions
    // INIT
    return Math.max(Min, Math.min(Max, Value));
}

UtilitiesModule.Lerp = function(StartValue, EndValue, Alpha) 
{
    // Functions
    // INIT
    return StartValue + (EndValue - StartValue) * Alpha;
}

// DIRECT

export default UtilitiesModule;