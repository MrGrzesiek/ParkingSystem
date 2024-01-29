"""
Database Connector Documentation

This module includes functions to establish a connection with a MySQL database and perform basic query operations.
"""

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
    """
    init_connection() -> pymysql.connections.Connection
   - Description: Initializes and returns a connection to the MySQL database.
   - Parameters: None
   - Returns:
       - pymysql.connections.Connection: Connection object to the MySQL database.
    """
    connection = pymysql.connect(host=os.environ.get("DATABASE_HOST"),
                                 port=int(os.environ.get("DATABASE_SOCKET")),
                                 user=os.environ.get("DATABASE_USERNAME"),
                                 password=os.environ.get("DATABASE_PASSWORD"),
                                 database=os.environ.get("DATABASE"),
                                 cursorclass=pymysql.cursors.DictCursor,
                                 conv=converions)
    return connection


def query_get(sql, param):
    """
    query_get(sql: str, param: tuple) -> list[dict]
   - Description: Executes a SELECT query on the MySQL database and retrieves the results.
   - Parameters:
       - sql (str): The SELECT SQL query.
       - param (tuple): Parameters for the query.
   - Returns:
       - list[dict]: A list of dictionaries containing the query results.
    """
    connection = init_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, param)
            return cursor.fetchall()


def query_put(sql, param):
    """
    query_put(sql: str, param: tuple) -> int
   - Description: Executes an INSERT query on the MySQL database and returns the last inserted row's ID.
   - Parameters:
       - sql (str): The INSERT SQL query.
       - param (tuple): Parameters for the query.
   - Returns:
       - int: The last inserted row's ID.
    """
    connection = init_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, param)
            connection.commit()
            return cursor.lastrowid


def query_update(sql, param):
    """
    query_update(sql: str, param: tuple) -> bool
   - Description: Executes an UPDATE query on the MySQL database.
   - Parameters:
       - sql (str): The UPDATE SQL query.
       - param (tuple): Parameters for the query.
   - Returns:
       - bool: True if the update is successful, otherwise False.
    """
    connection = init_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, param)
            connection.commit()
            return True
        
"""
Module Dependencies:
   - pymysql: Utilizes the pymysql library for MySQL database interactions.
   - os: Provides access to operating system-dependent functionality.
   - pathlib: Offers classes representing file system paths.
   - dotenv: Allows loading environment variables from a .env file.
"""