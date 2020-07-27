if (process.argv.length < 5) {
    console.log(
        "Usage: " + __filename + " MARKET_HASH_NAME PAGE_NO SORTING_METHOD"
    );
    process.exit(-1);
}

const request = require("request-promise");
const totp = require("notp").totp;
const base32 = require("thirty-two");
const api_key = "...";
const secret = "....";
const app_id = 730;

var code = totp.gen(base32.decode(secret));

new_market_hash_name = process.argv[2].replace("kstar", "%E2%98%85");

function getSaleHistory(market_hash_name, page, sort_method) {
    request(
        "https://bitskins.com/api/v1/get_sales_info/?api_key=".concat(
            api_key,
            "&code=",
            code,
            "&market_hash_name=",
            market_hash_name,
            "&page=",
            page,
            "&app_id=",
            app_id
        ),
        function (err, res, body) {
            //console.log(body);
            var data = JSON.parse(body);
            var sales = data.data.sales;

            if (sales.length == 0) {
                console.log("Couldn't find any sales for " + market_hash_name);
            } else {
                var date_range =
                    (sales[0].sold_at - sales[29].sold_at) / 60 / 60 / 24;

                if (sort_method == "date") {
                    //sales.sort(function(a, b) {return b.sold_at - a.sold_at});
                } else if (sort_method == "float") {
                    sales.sort(function (a, b) {
                        return a.wear_value - b.wear_value;
                    });
                } else if (sort_method == "price") {
                    sales.sort(function (a, b) {
                        return a.price - b.price;
                    });
                }

                var average_price = 0;

                for (i = 0; i < sales.length; i++) {
                    var newDate = new Date(parseInt(sales[i].sold_at) * 1000);
                    console.log(
                        "Sold " +
                            sales[i].market_hash_name +
                            " for " +
                            sales[i].price +
                            " with float " +
                            sales[i].wear_value +
                            " at " +
                            newDate
                    );
                    average_price += parseFloat(sales[i].price);
                }

                console.log(
                    "\nAverage Price: " +
                        (average_price / sales.length).toFixed(2)
                );
                console.log(
                    "30 sold in the last " +
                        parseFloat(date_range).toFixed(2) +
                        " days."
                );
            }
        }
    );
}

getSaleHistory(new_market_hash_name, process.argv[3], process.argv[4]);
