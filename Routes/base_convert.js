module.exports = (app,csvToJson,axios,path)=>{
    app.post("/base_currency/:BASE", (req, res) => {
        const file_rote = path.join(__dirname+"/../CSV_files/NGOs_data.csv")
        let user_choice = req.params.BASE.toUpperCase()
    
        let json = csvToJson.getJsonFromCsv(file_rote)
        give_india_data = []
        for (Dict of json) {
            var Dict_keys = Object.keys(Dict)
            var Dict_values = Object.values(Dict)
            let new_dict = {}
            key_list = Dict_keys[0].split(",")
            value_list = Dict_values[0].split(",")
    
            for (var i = 0; i < value_list.length; i++) {
                new_dict[key_list[i]] = value_list[i]
    
            }
            give_india_data.push(new_dict)
        }
        // res.send(give_india_data)
    
        axios.get('https://api.exchangeratesapi.io/latest?base=' + user_choice)
    
            .then(resp => {
                const Foreign_rates_API = resp.data.rates
                var total_update_data = []
                for (let NGO_INF_dict of give_india_data) {
    
                    let Dict_Currency = NGO_INF_dict.DonationCurrency
                    if (undefined != Foreign_rates_API[Dict_Currency]) {
    
                        NGO_INF_dict['DonationAmount'] = (NGO_INF_dict.DonationAmount / Foreign_rates_API[Dict_Currency] + " " + user_choice)
                        total_update_data.push(NGO_INF_dict)
                    } else {
                        total_update_data.push(NGO_INF_dict)
                    }
                }
    
                res.send(total_update_data);
    
            }).catch(err => {
                res.send(err.message)
            });
    });
}