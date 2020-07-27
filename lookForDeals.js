const request = require("request-promise");
const totp = require("notp").totp;
const base32 = require("thirty-two");
const api_key = "65b9c768-871c-4c82-a9a7-d1676fd6c30b";
const secret = "OEZ3F7WBXM7GPDFF";

const app_id = 730;
const context_id = 2;

var i;

// print out a code that's valid right now
var code = generateNewCode();
console.log("code = " + code + "\n");

function generateNewCode() {
    return totp.gen(base32.decode(secret));
}

var skinsOnSale;
var sort_by = "price";
var order = "asc";
var min_price = process.argv[4];
var max_price = 3000;
var per_page = 480;
var market_hash_name = process.argv[2];
var deal_percentage = process.argv[3];

console.log(
    "Looking for " + market_hash_name + " with percentage " + deal_percentage
);
console.log("\n------------------------------------");

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
            market_hash_name
        ),
        function (err, res, body) {}
    );

    skinsOnSale = JSON.parse(data);

    for (i = 0; i < skinsOnSale.data.items.length; i++) {
        if (
            skinsOnSale.data.items[i].price <
                deal_percentage * skinsOnSale.data.items[i].suggested_price &&
            skinsOnSale.data.items[i].item_type != "Graffiti"
        ) {
            console.log("Name: " + skinsOnSale.data.items[i].market_hash_name);
            console.log("BitSkins:        " + skinsOnSale.data.items[i].price);
            console.log(
                "Suggested price: " + skinsOnSale.data.items[i].suggested_price
            );
            console.log(
                "float:           " + skinsOnSale.data.items[i].float_value
            );
            console.log(
                "percentage off:  " +
                    parseFloat(
                        1 -
                            skinsOnSale.data.items[i].price /
                                skinsOnSale.data.items[i].suggested_price
                    ).toFixed(2)
            );
            console.log("------------------------------------");
        }
    }

    //console.log(skinsOnSale.data.items[0]);
}

searchForLowPrice(1);
searchForLowPrice(2);
searchForLowPrice(3);
searchForLowPrice(4);
