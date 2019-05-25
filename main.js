const async = require("async");
const db = require("./mysqlconnection");
const args = require("minimist")(process.argv.slice(2), {
    boolean: ["e"],
    alias: {
        o: "outputfolder",
        h: "host",
        p: "port",
        d: "database",
        u: "user",
        w: "password",
        e: "usessl",
        c: "ca",
        k: "key",
        r: "cert"
    },
    default: {
        port: 3306,
        usessl: false
    },
    unknown: PrintHelp
});
const Table = require("./table");



function PrintHelp()
{
    console.log("");
    console.log("gqsm");
    console.log("Node/Express/GraphQL/Sequalize/MySQL API Generator");
    console.log("");
    console.log("Arguments:");
    console.log("-o output_folder (Required)");
    console.log("-h host (Required)");
    console.log("-p port (Default 3306)");
    console.log("-d database (Required)");
    console.log("-u user (Required)");
    console.log("-w password (Required)");
    console.log("-e (use SSL?)");
    console.log("-c path_to_ca_file (Required if -e is used)");
    console.log("-k path_to_key_file (Required if -e is used)");
    console.log("-r path_to_cert_file (Required if -e is used)");
    console.log("");
    process.exit();
}


function CheckArguments(args)
{
    if (!args.outputfolder
        || !args.host
        || !args.database
        || !args.user
        || !args.password)
    {
        PrintHelp();
    }

    if (args.e && (!args.ca || !args.key || !args.cert))
    {
        PrintHelp();
    }
}


//  Make sure we have the right arguments.
CheckArguments(args);

//  Connect to the database.
db.ConnectToDB(args);

//  Initialize table array.
var DB = [];

//  Read the tables in the database.
db.DBConn.query("SHOW TABLES;", function (ShowError, ShowResults, ShowFields)
{
    async.each(ShowResults, function (OneRow, Callback)
    {
        if (ShowError)
        {
            throw ShowError;
        }


        var t = new Table(OneRow[ShowFields[0].name]);
        DB.push(t);

        db.DBConn.query("DESCRIBE " + t.TableName + ";", function (DescribeError, DescribeResults, DescribeFields)
        {
            if (DescribeError)
            {
                throw DescribeError;
            }

            for (var j = 0; j < DescribeResults.length; j++)
            {
                t.AddField(DescribeResults[j]["Field"], DescribeResults[j]["Type"]);
            }

            Callback();
        });
    },
    function (error)
    {
        console.log(JSON.stringify(DB));

        //  Disconnect from the database.
        db.DBConn.end();
    });
});

