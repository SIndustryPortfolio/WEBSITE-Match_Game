// CORE

class Tile
{
    constructor(ComponentWrapperDiv) 
    {
        // Functions
        // INIT
        this.Element = ComponentWrapperDiv;
        //this.TileImage = ComponentWrapperDiv.querySelector("TileImage");
        this.TileNameParagraph = ComponentWrapperDiv.querySelector("TileName");

    }

    Initialise(ItemName) 
    {
        // CORE
        const ItemMeta = window.Match["Items"][ItemName];

        // Functions
        // INIT
        this.ItemName = ItemName;
        this.TileNameParagraph.innerHTML = ItemMeta["Visual"];
    }

    End() 
    {

    }
}

export default Tile;