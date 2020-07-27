const request = require("request-promise");
const totp = require("notp").totp;
const base32 = require("thirty-two");
const api_key = "....";
const secret = "....";

const app_id = 730;
const context_id = 2;

const wear_order = [
    "Battle-Scarred",
    "Well-Worn",
    "Field-Tested",
    "Minimal Wear",
    "Factory News",
];
const wear_levels = [1, 0.45, 0.38, 0.15, 0.07];
var i;

// print out a code that's valid right now
var code = generateNewCode();
console.log("code = " + code + "\n");

function generateNewCode() {
    return totp.gen(base32.decode(secret));
}

// Retrieve the account balance
/*
request("https://bitskins.com/api/v1/get_account_balance/?api_key=".concat(api_key, "&code=", code), function(err, res, body) {
	var accountBalance;
	accountBalance = JSON.parse(body);
	console.log(accountBalance.data);
});
*/

/*
// Retrieve the WHOLE market data
var marketData;
request("https://bitskins.com/api/v1/get_price_data_for_items_on_sale/?api_key=".concat(api_key, "&code=", code, "&app_id=", app_id), function(err, res, body) {
	marketData = JSON.parse(body);
	console.log(marketData.data[0]);
});*/

// Retrieve data for all the items on sale on BitSkins
var skinsOnSale;
var sort_by = "price";
var order = "asc";
var min_price = 40;
var max_price = 1000;
var per_page = 480;
var market_hash_name_low = "AK-47";

async function searchForLowPrice(page) {
    var data = await request(
        "https://bitskins.com/api/v1/get_inventory_on_sale/?api_key=".concat(
            api_key,
            "&code=",
            code,
            "&page=",
            page,
            "&app_id=",
            app_id,
            "&sort_by=",
            sort_by,
            "&order=",
            order,
            "&min_price=",
            min_price,
            "&max_price=",
            max_price,
            "&per_page=",
            per_page,
            "&market_hash_name=",
            market_hash_name_low
        ),
        function (err, res, body) {}
    );

    skinsOnSale = JSON.parse(data);

    for (i = 0; i < skinsOnSale.data.items.length; i++) {
        if (
            skinsOnSale.data.items[i].price <
            0.7 * skinsOnSale.data.items[i].suggested_price
        ) {
            console.log(
                "-- found a " +
                    skinsOnSale.data.items[i].market_hash_name +
                    " with a BitSkins price of " +
                    skinsOnSale.data.items[i].price +
                    " and suggested price of " +
                    skinsOnSale.data.items[i].suggested_price +
                    " on page " +
                    page +
                    " with float " +
                    skinsOnSale.data.items[i].float_value
            );
            console.log(
                "-- Savings = " +
                    (1 -
                        skinsOnSale.data.items[i].price /
                            skinsOnSale.data.items[i].suggested_price)
            );
        }
        //console.log("-- found a " + skinsOnSale.data.items[i].market_hash_name + " with a BitSkins price of " + skinsOnSale.data.items[i].price + " and suggested price of " + skinsOnSale.data.items[i].suggested_price + " on page " + page + " with float " + skinsOnSale.data.items[i].float_value);
    }

    //console.log(skinsOnSale.data.items[0]);
}

searchForLowPrice(1);

function getSaleHistory(market_hash_name, page_history) {
    request(
        "https://bitskins.com/api/v1/get_sales_info/?api_key=".concat(
            api_key,
            "&code=",
            code,
            "&market_hash_name=",
            market_hash_name,
            "&page=",
            page_history,
            "&app_id=",
            app_id
        ),
        function (err, res, body) {
            //console.log(body);
            var data = JSON.parse(body);
            var sales = data.data.sales;

            // sort by float
            //sales.sort(function(a, b) {return a.wear_value - b.wear_value})

            // sort by sale date
            sales.sort(function (a, b) {
                return b.sold_at - a.sold_at;
            });

            if (sales.length == 0) {
                console.log("Couldn't find any sales for " + market_hash_name);
            } else {
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
                    "Average Price: " +
                        (average_price / sales.length).toFixed(2)
                );
            }
        }
    );
}

function regularSearch(
    market_hash_name_search,
    min_price_search,
    max_price_search,
    page_search
) {
    request(
        "https://bitskins.com/api/v1/get_inventory_on_sale/?api_key=".concat(
            api_key,
            "&code=",
            code,
            "&page=",
            page_search,
            "&app_id=",
            app_id,
            "&sort_by=",
            sort_by,
            "&order=",
            order,
            "&min_price=",
            min_price_search,
            "&max_price=",
            max_price_search,
            "&per_page=",
            per_page,
            "&market_hash_name=",
            market_hash_name_search
        ),
        function (err, res, body) {
            console.log(body);
        }
    );
}


/*
// Retrieve specific item data
var item_ids = "16109825053";
request("https://bitskins.com/api/v1/get_specific_items_on_sale/?api_key=".concat(api_key, "&code=", code, "&item_ids=", item_ids, "&app_id=", app_id), function(err, res, body) {
	itemData = JSON.parse(body);
	console.log(itemData.data)
});*/
