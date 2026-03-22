// CORE

class Tile
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
        //this.TileImage = ComponentWrapperDiv.querySelector("#TileImage");
        this.TileVisual = ComponentWrapperDiv.querySelector("#TileVisual");
        this.TileOverlayDiv = ComponentWrapperDiv.querySelector("#TileOverlay");

    }

    Initialise(ItemName) 
    {
        // CORE
        const ItemMeta = window.Match["Items"][ItemName];

        // Functions
        // INIT
        this.ItemName = ItemName;
        this.TileVisual.innerHTML = ItemMeta["Visual"];
        this.Element.classList.add("Tile");
        this.TileOverlayDiv.style.visibility = "visible";
    }

    End() 
    {

    }
}

export default Tile;