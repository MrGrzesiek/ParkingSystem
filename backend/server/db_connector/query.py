from pathlib import Path
import os
import pymysql.cursors
from pymysql import converters
from dotenv import load_dotenv

converions = converters.conversions
converions[pymysql.FIELD_TYPE.BIT] = lambda x: False if x == b'\x00' else True
# load env file from parent/local.env
load_dotenv(Path(__file__).parent.parent / 'local.env')

def init_connection():
    connection = pymysql.connect(host=os.environ.get("DATABASE_HOST"),
                                 port=int(os.environ.get("DATABASE_SOCKET")),
                                 user=os.environ.get("DATABASE_USERNAME"),
                                 password=os.environ.get("DATABASE_PASSWORD"),
                                 database=os.environ.get("DATABASE"),
                                 cursorclass=pymysql.cursors.DictCursor,
                                 conv=converions)
    return connection


def query_get(sql, param):
    connection = init_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, param)
            return cursor.fetchall()


def query_put(sql, param):
    connection = init_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, param)
            connection.commit()
            return cursor.lastrowid


def query_update(sql, param):
    connection = init_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, param)
            connection.commit()
            return True