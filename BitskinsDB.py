import requests
import pyotp
import json
import sqlite3
from sqlite3 import Error

from SQLHelper import create_connection, create_sale, count_sales_with_name

api_key = "....."
secret = '......'
token = pyotp.TOTP(secret)
database = r"C:\sqlite\db\bitskinssales.db"
knife_star_char = "★"


def jprint(obj):
    # print a JSON object nicely
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)


market_hash_name = "★ Butterfly Knife"
skin_name = "Butterfly Knife"

parameters = {
    "api_key": api_key,
    "code": token.now(),
    "market_hash_name": market_hash_name,
    "page": 1,
    "app_id": 730
}

response = requests.get("https://bitskins.com/api/v1/get_sales_info/", params=parameters)
conn = create_connection(database)

with conn:
    # select_all_sales(conn)
    print("Number of sales found in db for Butterfly Knife: " + str(count_sales_with_name(conn, "Butterfly Knife")))
    print("Number of sales found in db for Karambit: " + str(count_sales_with_name(conn, "Karambit")))
    print("\n")

if response.status_code == 200:
    if len(response.json()["data"]["sales"]) == 0:
        print("No sales found for '" + market_hash_name + "' in BitSkins API call.")
    else:
        current_row_num = count_sales_with_name(conn, skin_name)
        for sale in response.json()["data"]["sales"]:

            if (sale["market_hash_name"].startswith("\u2605")):
                new_sale = (sale["market_hash_name"][2:], sale["price"], sale["sold_at"], sale["wear_value"], 1)
            else:
                new_sale = (sale["market_hash_name"], sale["price"], sale["sold_at"], sale["wear_value"], 0)

            create_sale(conn, new_sale)
            #print("inserted sale " + str(new_sale) + " into Sales")

        new_row_num = count_sales_with_name(conn, skin_name)
        print("Added " + str(new_row_num - current_row_num) + " new sales for a total of " + str(new_row_num) + " sales of " + skin_name)
        # jprint(response.json()["data"]["sales"])
