exports.handler = async function(event, context){
    faunadb = require('faunadb')
    q = faunadb.query;
    var client = new faunadb.Client({
    secret: 'fnAEa2PAAaAAQDI4F7wpz-lxH6BB_mneYggdWbyB',
    domain: 'db.us.fauna.com',
    port: 443,
    scheme: 'https',
    })

    return client.query(
        q.Delete(
            q.Ref(
                q.Collection('mapData'),
                JSON.parse(event.body).ref
            )
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