var request = require("request");
var cheerio = require("cheerio");

const url = "https://cs.money";

request(url, function (err, resp, html) {
    if (!err) {
        const $ = cheerio.load(html);
        //console.log($(".column_3" > "block_bottom" > ".block_items_bot").html());
        console.log($("#main_container_bot div[class=items]").html());
        //console.log($("#main_container_bot").html());
        console.log($("div[id=main_container_bot]").html());
    } else {
        console.log("There was an error requesting cs.money\n");
        console.log(err);
    }
});
