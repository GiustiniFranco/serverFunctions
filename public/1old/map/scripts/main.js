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

    const coordinatesLabel = new PIXI.Text('',{fontFamily : 'Arial', fontSize: 18, fill : 0xeeeeee, align : 'center'});
    coordinatesLabel.anchor.x = 0.5;
    const labelCont = new PIXI.Container();
    let labelBG = PIXI.Sprite.from('labelBG.png');
    labelBG.anchor.x = 0.5;
    labelCont.addChild(labelBG);
    labelCont.addChild(coordinatesLabel);
    app.stage.addChild(labelCont);

    app.stage.interactive = true;
    app.stage.on("pointermove", (e) => UpdateCoordinatesLabel(e, app, bg, coordinatesLabel, labelCont, labelBG));


    const piecesLabe = new PIXI.Text('',{fontFamily : 'Arial', fontSize: 18, fill : 0xeeeeee, align : 'left'});
    piecesLabe.anchor.x = 0;
    const piecesLabeCont = new PIXI.Container();
    let plabelBG = PIXI.Sprite.from('labelBG.png');
    plabelBG.anchor.x = 0;
    piecesLabeCont.addChild(plabelBG);
    piecesLabeCont.addChild(piecesLabe);
    app.stage.addChild(piecesLabeCont);

    app.stage.on("pointerdown", (e) => UpdatePiecesLabel(e, app, bg, piecesLabe, piecesLabeCont, plabelBG));

}

function ScreenPosToCoordinates(pos, app, bg){
    let x = Math.round((pos.x - app.screen.width / 2 + bg.width / 2) * 32 / bg.width);
    let y = (pos.y - app.screen.height / 2 + bg.height / 2) * 27.5 / bg.height;

    if(x % 2 != 0){
        y -= 0.5;
    }
    y = Math.round(y);

    return{x:x,y:y};
}

function UpdateCoordinatesLabel(e, app, bg, label, cont, labelBG){
    let coor = ScreenPosToCoordinates(e.data.global, app, bg);

    label.text = "(" + coor.x + "; " + coor.y + ")";

    cont.x = e.data.global.x;
    cont.y = e.data.global.y - 35;
    labelBG.width = label.width;
    labelBG.height = label.height;
}

function UpdatePiecesLabel(e, app, bg, label, cont, labelBG){
    let coor = ScreenPosToCoordinates(e.data.global, app, bg);
    let x = coor.x;
    let y = coor.y;
    if(pieces[x] !== undefined && pieces[x][y] !== undefined){
        label.text = "";
        let p = pieces[x][y];
        for(let i = 0; i < p.length; i++){
            label.text += p[i].name;
            if(i < p.length - 1){
                label.text += "\n";
            }
        }
        cont.visible = true;
        cont.x = e.data.global.x;
        cont.y = e.data.global.y + 35;
        labelBG.width = label.width;
        labelBG.height = label.height;
    }
    else{
        cont.visible = false;
    }
}

var pieces = [];

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
        
        if(pieces[x] === undefined){
            pieces[x] = [];
        }
        if(pieces[x][y] === undefined){
            pieces[x][y] = [];
        }
        pieces[x][y].push(pieceData);

        if(x % 2 != 0){
            y += 0.5;
        }
        piece.x = (mapScale / 32) * x;
        piece.y = (mapScale / 27.5) * y;
        container.addChild(piece);

    }
    console.log(pieces)
}