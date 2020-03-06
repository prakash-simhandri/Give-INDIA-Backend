module.exports = (app,csvToJson)=>{
    app.get("/", (req, res) => {
        let json = csvToJson.getJsonFromCsv('./CSV_files/NGOs_data.csv')
        var give_india_data = []
        for (Dict of json) {
            var Dict_keys = Object.keys(Dict)
            var Dict_values = Object.values(Dict)
            let new_dict = {}
            key_list = Dict_keys[0].split(",")
            value_list = Dict_values[0].split(",")
    
    
            for (var i = 0; i < value_list.length; i++) {
                new_dict[key_list[i]] = value_list[i]
    
            }
            give_india_data.push(new_dict);
        }
        res.send(give_india_data)
    })
}