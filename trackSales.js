var Pusher = require("pusher-client");

var pusher = new Pusher("c0eef4118084f8164bec65e6253bf195", {
    encrypted: true,
    wsPort: 443,
    wssPort: 443,
    host: "notifier.bitskins.com",
});

pusher.connection.bind("connected", function () {
    console.log(" -- connected to websocket");
});

var events_channel = pusher.subscribe("inventory_changes");

events_channel.bind("delisted_or_sold", function (data) {
    if (
        // Change your search criteria here
        data.market_hash_name.includes("Key") &&
        data.app_id == 730 &&
        data.context_id == 2
    ) {
        console.log(
            " -- just sold: " +
                JSON.stringify(data.market_hash_name) +
                " for " +
                JSON.stringify(data.price)
        );
    }

    // print all the raw data
    //console.log(" -- got data: " + JSON.stringify(data));
});
