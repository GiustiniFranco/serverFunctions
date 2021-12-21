Init();
function Init(){
    document.addEventListener('DOMContentLoaded', () => {
        Start();
    })
}
async function Start(){
    let app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: devicePixelRatio 
    });
    document.body.appendChild(app.view);
    
    const container = new PIXI.Container();
    app.stage.addChild(container);

    let mapScale = app.screen.height;
    if(app.screen.width < app.screen.height){
        mapScale = app.screen.width;
    }
    let bg = PIXI.Sprite.from('map.jpeg');
    bg.width = mapScale;
    bg.height = mapScale;
    container.addChild(bg);
    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;
    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    const response = await fetch('/.netlify/functions/requestMapData').then(
        response => response.json()
    );
    CreatePieces(response.data, container, mapScale);
        
  /*  const fetchBtn = document.getElementById('fetch-btn')
    const responseText = document.getElementById('response-output')

    const sendBtn = document.getElementById('send-btn')
    const nameInput = document.getElementById('nameInput')
    sendBtn.addEventListener('click', async()=>{
        const response = await fetch('.netlify/functions/saveData', {
        method: 'POST',
        body: JSON.stringify({
            name: nameInput.value
        })
        }).then(
        response => response.json()
        )
        responseText.innerText = response.message
    })*/
}

function CreatePieces(dataArray, container, mapScale){
    for(let i = 0; i < dataArray.length; i++){
        let pieceData = dataArray[i].data;
        let piece = PIXI.Sprite.from("Piece" + pieceData.pieceType + ".png");
        piece.anchor.set(0.5);
        let pieceSize = 25;
        if(pieceData.pieceType > 1){
            pieceSize = 13;
            piece.anchor.set(0.5, 0.9);
        }else{
            piece.anchor.set(0.5);
        }
        piece.width = piece.height = mapScale / pieceSize;
        let x = pieceData.x;
        let y = pieceData.y
        if(x % 2 != 0){
            y += 0.5;
        }
        piece.x = (mapScale / 32) * x;
        piece.y = (mapScale / 27.5) * y;
        container.addChild(piece);
    }
}