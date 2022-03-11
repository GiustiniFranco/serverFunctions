const hideFullScreenButton = "true";
const buildUrl = "Build";
const loaderUrl = buildUrl + "/Build.loader.js";
const config = {
    dataUrl: buildUrl + "/Build.data",
    frameworkUrl: buildUrl + "/Build.framework.js",
    codeUrl: buildUrl + "/Build.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "DefaultCompany",
    productName: "easterEggHunter",
    productVersion: "1.0",
};

const container = document.querySelector("#unity-container");
const canvas = document.querySelector("#unity-canvas");
const loadingCover = document.querySelector("#loading-cover");
const progressBarEmpty = document.querySelector("#unity-progress-bar-empty");
const progressBarFull = document.querySelector("#unity-progress-bar-full");
const fullscreenButton = document.querySelector("#unity-fullscreen-button");
const spinner = document.querySelector('.spinner');
const googleLoginButton = document.querySelector('.g-signin2');

const canFullscreen = (function() {
    for (const key of [
        'exitFullscreen',
        'webkitExitFullscreen',
        'webkitCancelFullScreen',
        'mozCancelFullScreen',
        'msExitFullscreen',
        ]) {
        if (key in document) {
            return true;
        }
    }
    return false;
}());

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    container.className = "unity-mobile";
    //config.devicePixelRatio = 1;
}
loadingCover.style.display = "";

const script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        spinner.style.display = "none";
        progressBarEmpty.style.display = "";
        progressBarFull.style.width = `${100 * progress}%`;
    }).then((unityInstance) => {
        window.unityInstance = unityInstance;
        loadingCover.style.display = "none";
        if (canFullscreen) {
            if (!hideFullScreenButton) {
                fullscreenButton.style.display = "";
            }
            fullscreenButton.onclick = () => {
                unityInstance.SetFullscreen(1);
            };
        }
    }).catch((message) => {
        alert(message);
    });
};
document.body.appendChild(script);

var gUser;

function onSignIn(googleUser) {
    let p = googleUser.getBasicProfile();
    gUser = {};
    gUser.id = p.getId();
    gUser.name = p.getGivenName();
    gUser.lastName = p.getFamilyName();
    gUser.email = p.getEmail();
    RequestLoginData();
}

function RequestLoginData(){
    if(typeof window.unityInstance !== 'undefined'){
        if(typeof gUser !== 'undefined'){
            window.unityInstance.SendMessage('GoogleLogin', 'LoginCallback', JSON.stringify(gUser));
        }
        else{
            window.unityInstance.SendMessage('GoogleLogin', 'LoginCallback', "");
        }
    }
}

function ToggleLoginButton(isOn){
    if(isOn === true){
        googleLoginButton.style.display = "";
    }else{
        googleLoginButton.style.display = "none";
    }
}
faunadb = window.faunadb;
q = faunadb.query;
var client = new faunadb.Client({
    secret: 'fnAEhNDoB1AAQOkY3xwEYmCTb-KmoFPjuoH58IYe',
    domain: 'db.us.fauna.com',
    port: 443,
    scheme: 'https',
});

function FetchLeaderBoard(){
    client.query(
        q.Map(
            q.Paginate(q.Documents(q.Collection('leaderBoard')), {size: 100000}),
            q.Lambda((x) => q.Get(x))
        )
    ).then(
        ret =>{
            let leaderBoardData = {}
            let users = [];
            for(let i = 0; i < ret.data.length; i++){
                let user = {};
                user.name = ret.data[i].data.name;
                user.time = ret.data[i].data.time;
                user.tokenId = ret.data[i].data.tokenId;
                user.refId = ret.data[i].ref.id;
                users.push(user);
            }
            leaderBoardData.userData = users;
            console.log("fetch board f");
            window.unityInstance.SendMessage('LeaderBoard', 'OnGetLeaderBoard', JSON.stringify(leaderBoardData));
        }
    )
}

function SubmitNewLeaderBoardUser(userData){
    let d = JSON.parse(userData);
    client.query(
        q.Create(
            q.Collection('leaderBoard'),
            {
                data:{
                    name: d.name,
                    time: d.time,
                    tokenId: d.tokenId
                }
            }
        )
    ).then(
		ret=>{
			FetchLeaderBoard();
		}
	);
}

function UpdateLeaderBoardUser(userData){
    let d = JSON.parse(userData);
    client.query(
        q.Update(
            q.Ref(
                q.Collection('leaderBoard'),
                d.refId
            ),
            {
                data:{
                    name: d.name,
                    time: d.time,
                    tokenId: d.tokenId
                }
            }
        )
    ).then(
		ret=>{
			FetchLeaderBoard();
		}
	);
}

function SubmitNewUserData(userData){
    let d = JSON.parse(userData);
    client.query(
        q.Create(
            q.Collection('userData'),
            {
                data:{
                    name: d.name,
                    lastName: d.lastName,
                    email: d.email
                }
            }
        )
    )
}
