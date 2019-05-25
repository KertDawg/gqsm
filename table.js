
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
}


module.exports = Table;

