const mysql = require("mysql");
const fs = require("fs");


module.exports = {
    DBConn: null,
    DBSSL: null,
    ConnectToDB: function (args)
    {
        if (args.usessl)
        {
            this.DBSSL = {
                ca: fs.readFileSync(__dirname + "/certs/ca.pem"),
                key: fs.readFileSync(__dirname + "/certs/client-key.pem"),
                cert: fs.readFileSync(__dirname + "/certs/client-cert.pem")
            };
        }
        else
        {
            this.DBSSL = null;
        }

        this.DBConn = mysql.createConnection({
            host: args.host,
            user: args.user,
            password: args.password,
            database: args.database,
            port: args.port,
            ssl: this.DBSSL
        });

        this.DBConn.connect(function (error)
        {
            if (error)
            {
                throw error;
            }
        });
    }
};

