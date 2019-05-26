
class Table
{
    constructor(Name)
    {
        this.TableName = Name;
        this.Fields = [];
    }

    AddField(Name, Type)
    {
        var NewField = {
            FieldName: Name,
            FieldType: Type
        };

        this.Fields.push(NewField);
    }

    Process(DB)
    {
        //  Loop through fields
        for (var i = 0; i < this.Fields.length; i++)
        {
            var f = this.Fields[i];

            f.GraphQLType = this.GetGraphQLType(f.FieldType);
            f.SequelizeType = this.GetSequelizeType(f.FieldType);
            f.ForeignTable = this.IsFieldAnID(f.FieldName, DB);
        }
    }

    GetGraphQLType(FieldType)
    {
        var ft = FieldType.toLowerCase();


        if (ft === "datetime")
        {
            return "datetime";
        }

        if (ft.startsWith("int"))
        {
            return "int";
        }

        if (ft.includes("char"))
        {
            return "string";
        }
    }

    GetSequelizeType(FieldType)
    {
        var ft = FieldType.toLowerCase();


        if (ft === "datetime")
        {
            return "datetime";
        }

        if (ft.startsWith("int"))
        {
            return "int";
        }

        if (ft.includes("char"))
        {
            return "string";
        }
    }

    IsFieldAnID(FieldName, DB)
    {
        if (!FieldName.toLowerCase().endsWith("id"))
        {
            return "";
        }

        //  Trim off the "ID" at the end.
        var PossibleTableName = FieldName.slice(0, -2);

        //  Remove an underscore at the end, in case the field name is "XYZ_ID".
        if (PossibleTableName.endsWith("_"))
        {
            PossibleTableName = PossibleTableName.slice(0, -1);
        }

        //  Is this the primary key for its own table?
        if (PossibleTableName.toLowerCase() === this.TableName.toLowerCase())
        {
            return "";
        }

        //  Does a table exist with this name?
        for (var i = 0; i < DB.length; i++)
        {
            if (PossibleTableName.toLowerCase() === DB[i].TableName.toLowerCase())
            {
                return PossibleTableName;
            }
        }

        //  There is no matching table.
        return "";
    }
}


module.exports = Table;

