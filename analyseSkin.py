import datetime
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import sqlite3
from sqlite3 import Error
from SQLHelper import create_connection, select_all_sales_with_name

database = r"C:\sqlite\db\bitskinssales.db"

conn = create_connection(database)
sales = [(name, price, datetime.datetime.fromtimestamp(float(ms)), wear_value, knife)
         for (name, price, ms, wear_value, knife) in select_all_sales_with_name(conn, "Butterfly Knife")]

sum_sales = 0
for i in range(len(sales) - 1, len(sales) - 30, -1):
    sum_sales += sales[i][1]

elapsedTime = datetime.datetime.now() - sales[len(sales) - 30][2]
print("Last 30 sales for butterfly knife: average price is " + str(round(sum_sales / 30)) + " spanning " + str(divmod(elapsedTime.total_seconds(), 86400)[0]) + " days.")

# Butterfly Knife

fig, ax = plt.subplots()
plt.xlabel('Date')
plt.ylabel('Price')
plt.title("Plot of butterfly knife price over time")
plt.plot([sale[2] for sale in sales], [sale[1] for sale in sales], 'b-')
ax.xaxis.set_major_formatter(mdates.DateFormatter('%d/%m/%Y'))
ax.xaxis.set_major_locator(mdates.DayLocator(interval=10))
ax.xaxis.set_minor_formatter(mdates.DateFormatter(''))
ax.xaxis.set_minor_locator(mdates.DayLocator(interval=1))
plt.gcf().autofmt_xdate()
plt.show()

# fig.subplots_adjust(bottom=0)
#mng = plt.get_current_fig_manager()
# mng.full_screen_toggle()
# mng.frame.Maximise(True)
