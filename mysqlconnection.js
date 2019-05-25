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
                ca: fs.readFileSync(args.ca),
                key: fs.readFileSync(args.key),
                cert: fs.readFileSync(args.cert)
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

