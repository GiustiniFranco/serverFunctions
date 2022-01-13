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
        q.Map(
            q.Paginate(q.Documents(q.Collection('mapData')), {size: 100000}),
            q.Lambda((x) => q.Get(x))
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