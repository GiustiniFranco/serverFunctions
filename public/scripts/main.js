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
        resolution: 1
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

    const coordinatesLabel = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 18, fill : 0xeeeeee, align : 'center'});
    coordinatesLabel.anchor.x = 0.5;
    const labelCont = new PIXI.Container();
    let labelBG = PIXI.Sprite.from('labelBG.png');
    labelBG.anchor.x = 0.5;
    labelCont.addChild(labelBG);
    labelCont.addChild(coordinatesLabel);
    app.stage.addChild(labelCont);

    app.stage.interactive = true;
    app.stage.on("pointermove", (e) => UpdateText(e, app, bg, coordinatesLabel, labelCont, labelBG));
}

function UpdateText(e, app, bg, label, cont, labelBG){
    let x = Math.round((e.data.global.x - app.screen.width / 2 + bg.width / 2) * 32 / bg.width);
    let y = (e.data.global.y - app.screen.height / 2 + bg.height / 2) * 27.5 / bg.height;

    if(x % 2 != 0){
        y -= 0.5;
    }
    y = Math.round(y);
    label.text = "(" + x + "; " + y + ")";

    cont.x = e.data.global.x;
    cont.y = e.data.global.y - 35;
    labelBG.width = label.width;
    labelBG.height = label.height;
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