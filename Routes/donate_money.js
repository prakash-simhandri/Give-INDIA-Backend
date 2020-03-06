const Private_Id_DATE = require('./../Routes/id_generater')

module.exports = (app,createCsvWriter,fs,csvToJson,path)=>{
    app.post("/user_donation", (req, res) => {
        const file_rote = path.join(__dirname+"/../CSV_files/NGOs_data.csv")

        var { Nonprofit, Donation_currency, Donation_amount, Fee } = req.body
    
    
        const csvWriter = createCsvWriter({
            path: file_rote,
            header: [
                { id: 'date', title: 'Date' },
                { id: 'Order_id', title: "Order Id" },
                { id: 'NGO', title: 'Nonprofit' },
                { id: 'Donation_CCY', title: 'Donation Currency' },
                { id: 'Donation_Amount', title: 'Donation Amount' },
                { id: 'fee', title: 'Fee' }
    
            ]
        });
    
        const give_india_data = []

        if (fs.existsSync(file_rote)) {
    
            let json = csvToJson.getJsonFromCsv(file_rote)
    
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
        }
        give_india_data.push({ Date: Private_Id_DATE.Data(), OrderId: Private_Id_DATE.ID(), Nonprofit: Nonprofit, DonationCurrency: Donation_currency, DonationAmount: Donation_amount, Fee: Fee })
    
        const records = [];
        for (var i of give_india_data) {
            records.push({ date: i.Date, Order_id: i.OrderId, NGO: i.Nonprofit, Donation_CCY: i.DonationCurrency, Donation_Amount: i.DonationAmount, fee: i.Fee })
        }
        // res.send(records)
    
        csvWriter.writeRecords(records)       // returns a promise
            .then(() => {
                console.log('...Done');
                res.send(give_india_data)
            });
    
    });
}