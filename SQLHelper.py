import sqlite3
from sqlite3 import Error


def create_connection(db_file):
    # create a database connection to a SQLite database
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print("Connected to sqlite database at " + db_file)
    except Error as e:
        print(e)

    return conn


def create_sale(conn, sale):
    sql = ''' 
        INSERT INTO Sales(skin_name, price, sold_at, wear_value, knife)
        VALUES(:skin_name, :price, :sold_at, :wear_value, :knife)
        '''
    cur = conn.cursor()
    cur.execute(sql, {"skin_name": sale[0], "price": sale[1], "sold_at": sale[2], "wear_value": sale[3], "knife": sale[4]})
    conn.commit()
    return cur.lastrowid


def select_all_sales(conn):
    cur = conn.cursor()
    cur.execute("SELECT * FROM Sales")
    rows = cur.fetchall()
    for row in rows:
        print(row)


def select_all_sales_with_name(conn, skin_name):
    cur = conn.cursor()
    cur.execute("SELECT * FROM Sales WHERE skin_name = ? ORDER BY sold_at ASC", (skin_name,))
    rows = cur.fetchall()
    return rows


def count_sales_with_name(conn, skin_name):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM Sales GROUP BY skin_name HAVING skin_name = ?", (skin_name,))
    row = cur.fetchone()
    if row != None:
        return row[0]
    else:
        return 0
