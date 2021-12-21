exports.handler = async function(event, context){
    faunadb = require('faunadb')
    q = faunadb.query;
    var client = new faunadb.Client({
    secret: 'fnAEa2PAAaAAQDI4F7wpz-lxH6BB_mneYggdWbyB',
    domain: 'db.us.fauna.com',
    port: 443,
    scheme: 'https',
    })

    const body = JSON.parse(event.body);

    return client.query(
        q.Update(
            q.Ref(
                q.Collection('mapData'),
                body.ref
            ),
            {
                data:{
                    pieceType: body.pieceType,
                    x: body.x,
                    y: body.y
                }
            }
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