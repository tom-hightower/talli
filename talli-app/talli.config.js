module.exports = {
    apps : [{
        name    : "talli-client",
        script  : "client/client.js",
        watch   : true,
        env     : {
            "NODE_ENV"  : "development",
        },
        env_production  : {
            "NODE_ENV"  : "production"
        }
    },
    {
        name    : "talli-server",
        script  : "server/server.js",
        watch   : true,
        env     : {
            "NODE_ENV"  : "development",
        },
        env_production  : {
            "NODE_ENV"  : "production"
        }
    }]
}