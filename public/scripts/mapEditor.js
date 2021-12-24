Init();
function Init(){
    document.addEventListener('DOMContentLoaded', () => {
        Start();
    })
}

var pieces;

async function Start(){
    LoadPieces();
}

async function LoadPieces(){
    const response = await fetch('/.netlify/functions/requestMapData').then(
        response => response.json()
    );
    
    document.body.innerHTML = "";
    document.write("Pieces:<br>");
    pieces = new Array();
    for(let i = 0; i < response.data.length; i++){
        let data = response.data[i];
        let newPiece = {
            id: data.ref["@ref"].id,
            pieceType: data.data.pieceType,
            x: data.data.x,
            y: data.data.y
        };
        pieces.push(newPiece);
        
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "delete piece";
        deleteButton.onclick  = () => DeletePiece(newPiece);
        document.body.appendChild(deleteButton);

        document.write(" type:");
        let typein = document.createElement("input");
        typein.type = "number";
        typein.value = newPiece.pieceType;
        document.body.appendChild(typein);
        
        document.write(" x:");
        let xin = document.createElement("input");
        xin.type = "number";
        xin.value = newPiece.x;
        document.body.appendChild(xin);
        
        document.write(" y:");
        let yin = document.createElement("input");
        yin.type = "number";
        yin.value = newPiece.y;
        document.body.appendChild(yin);

        document.write(" name:");
        let namein = document.createElement("input");
        namein.value = newPiece.name;
        document.body.appendChild(namein);
        
        let saveButton = document.createElement("button");
        saveButton.innerHTML = "save piece";
        saveButton.onclick = () => SavePiece(newPiece, typein.value, xin.value, yin.value, namein.value);
        document.body.appendChild(saveButton);
        
        document.write("<br>");
    }
    let createButton = document.createElement("button");
    createButton.innerHTML = "create new piece";
    createButton.onclick = createNewPiece;
    document.body.appendChild(createButton);
}

async function createNewPiece(){
    document.body.innerHTML = "loading...";
    const response = await fetch('/.netlify/functions/createPiece').then(
        response => response.json()
    );
    LoadPieces();
}

async function DeletePiece(piece){
    document.body.innerHTML = "loading...";
    const response = await fetch('/.netlify/functions/deletePiece',
    {
        method: 'Post',
        body: JSON.stringify({
            ref: piece.id
        })
    }).then(
        response => response.json()
    );
    LoadPieces();
}

async function SavePiece(piece, type, x, y, name){
    document.body.innerHTML = "loading...";
    const response = await fetch('/.netlify/functions/editPiece',
    {
        method: 'Post',
        body: JSON.stringify({
            ref: piece.id,
            pieceType: parseInt(type),
            x: parseInt(x),
            y: parseInt(y),
            name: name
        })
    }).then(
        response => response.json()
    );
    LoadPieces();
}