module.exports = (app,csvToJson,axios,createCsvWriter)=>{
    app.get("/nonprofit/base/:userBase", (req, res) => {
        let user_choice = req.params.userBase.toUpperCase()
    
        let NGO_Dicts = csvToJson.getJsonFromCsv('./CSV_files/NGOs_data.csv')
        All_Donation = []
        for (Dict of NGO_Dicts) {
            var Dict_keys = Object.keys(Dict)
            var Dict_values = Object.values(Dict)
            let new_dict = {}
            key_list = Dict_keys[0].split(",")
            value_list = Dict_values[0].split(",")
    
            for (var i = 0; i < value_list.length; i++) {
                new_dict[key_list[i]] = value_list[i]
            }
            All_Donation.push(new_dict)
        }
        axios.get('https://api.exchangeratesapi.io/latest?base=' + user_choice)
    
            .then((response) => {
                Foreign_rates_Data = response.data.rates
                let Total_update_data = []
                for (let organization_Dict of All_Donation) {
                    let organization_Currency = organization_Dict.DonationCurrency
                    if (undefined != Foreign_rates_Data[organization_Currency]) {
                        let Currency_data = organization_Dict.DonationAmount
    
                        if (Currency_data.includes('"')) {
                            Currency_data = organization_Dict.DonationAmount.slice(1)
                        }
                        organization_Dict['DonationAmount'] = Currency_data / Foreign_rates_Data[organization_Currency]
                        Total_update_data.push(organization_Dict)
                    } else {
                        Total_update_data.push(organization_Dict)
                    }
                }
                let nonprofit_records = {}
    
                for (let NGO_dict of Total_update_data) {
                    orientation_title = NGO_dict.Nonprofit
                    if (Object.keys(nonprofit_records).includes(orientation_title)) {
                        var nonprofit_insert_dict = nonprofit_records[orientation_title]
                        Fee_data = NGO_dict.Fee
                        if (Fee_data.includes('"')) {
                            Fee_data = Fee_data.slice(0, -1)
                        }
                        nonprofit_insert_dict['DonationAmount'] = nonprofit_insert_dict.DonationAmount + parseInt(NGO_dict.DonationAmount)
                        nonprofit_insert_dict['Fee'] = nonprofit_insert_dict.Fee + parseInt(Fee_data)
                        nonprofit_insert_dict['repeat_time'] = nonprofit_insert_dict.repeat_time + 1
                    } else {
                        nonprofit_records[orientation_title] = { 'Nonprofit': NGO_dict.Nonprofit, 'DonationAmount': parseInt(NGO_dict.DonationAmount), 'Fee': parseInt(NGO_dict.Fee), 'repeat_time': 1 }
                    }
                }
                // res.send(nonprofit_records);
    
                const csvWriter = createCsvWriter({
                    path: './CSV_files/Dsonations.csv',
                    header: [
                        { id: 'title', title: 'Nonprofit' },
                        { id: 'currency_total', title: 'Total amount' },
                        { id: 'C_fee_total', title: 'Total Fee' },
                        { id: 'repeat_value', title: 'Number of Donations' }
                    ]
                });
    
                let orientation_records = []
                const Dict_list = Object.values(nonprofit_records)
    
                Dict_list.forEach(Dictionary_element => {
                    orientation_records.push({ title: Dictionary_element.Nonprofit, currency_total: Dictionary_element.DonationAmount, C_fee_total: Dictionary_element.Fee, repeat_value: Dictionary_element.repeat_time })
    
                });
                csvWriter.writeRecords(orientation_records)       // returns a promise
                    .then(() => {
                        console.log('...Done');
                        res.send(orientation_records)
                    });
    
    
            }).catch((reject) => {
                res.send(reject.message)
            })
    
    });
}