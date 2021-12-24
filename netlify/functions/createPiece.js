exports.handler = async function(){
    faunadb = require('faunadb')
    q = faunadb.query;
    var client = new faunadb.Client({
    secret: 'fnAEa2PAAaAAQDI4F7wpz-lxH6BB_mneYggdWbyB',
    domain: 'db.us.fauna.com',
    port: 443,
    scheme: 'https',
    })

    return client.query(
        q.Create(
            q.Collection('mapData'),
            {
                data:{
                    pieceType: 0,
                    x: 0,
                    y: 0,
                    name: "undefined"
                },
            },
        )
    )
    .then(ret => {
        return{
            statusCode: 200,
            body: JSON.stringify(ret)
        }
    })
    .catch((error =>{
        return{
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }))
}