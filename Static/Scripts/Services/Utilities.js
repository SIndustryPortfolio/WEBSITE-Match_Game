let UtilitiesModule = {};

// Functions
// DIRECT
UtilitiesModule.Show = function(Element) 
{
    // Functions
    // INIT
    Element.style.visibility = "visible";
}

UtilitiesModule.Hide = function(Element) 
{
    // Functions
    // INIT
    Element.style.visibility = "hidden";
}

UtilitiesModule.CloneArray = function(Array) 
{
    // Functions
    // INIT
    return [...Array];
}

UtilitiesModule.DestroyChildren = function(Parent) 
{
    // Functions
    // INIT
    for (const Child of UtilitiesModule.CloneArray(Parent.children)) 
    {
        UtilitiesModule.Destroy(Child);
    }
}

UtilitiesModule.ArrayToCSSColour = function(Array) 
{
    // CORE
    const [R = 0, G = 0, B = 0, A = 1] = Array;
    
    // Functions
    // INIT
    return `rgba(${R}, ${G}, ${B}, ${A})`;
}

UtilitiesModule.ClearArray = function(Array) 
{
    // Functions
    // INIT
    Arary.length = 0;
}

UtilitiesModule.ScaleText = function(Text, Scale) 
{
    // Functions
    // INIT
    const ParentNode = Text.parentNode;

    const OverlayWidth = ParentNode.offsetWidth;
    const OverlayHeight = ParentNode.offsetHeight;

    const AverageSize = Math.floor((OverlayWidth + OverlayHeight) / 2);
    const ScaledFontSize = Math.floor(AverageSize * Scale);

    Text.style.fontSize = `${ScaledFontSize}px`;
}

UtilitiesModule.ShuffleArray = function(Array) 
{
    // Functions
    // INIT
    for (let i = Array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [Array[i], Array[j]] = [Array[j], Array[i]];
    }

    return Array;
}

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