"""
Parking Rates Module Documentation

This module provides functionalities related to parking rates, including retrieving rates, updating rates, and calculating fees for clients.

Functions:
- get_rates(): Retrieve the current parking rates.
- update_rates(hourly_rate: float, entry_grace_minutes: int, exit_grace_minutes: int): Update the parking rates.
- get_rates_for_client(reg_number: str) -> int: Calculate the parking fee for a client based on their registration number.

"""

from fastapi import HTTPException
from datetime import timedelta
import math
from time import strptime
from .query import query_get, query_put, query_update
import logging
from .spots import get_spot_by_reg_number

# Set up logging configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def get_rates():
    """
    Retrieve the current parking rates.

    Returns:
    dict: A dictionary containing hourly rate, entry grace period in minutes, and exit grace period in minutes.
    """
    rates = query_get("""
                    SELECT hourly_rate, entry_grace_minutes, exit_grace_minutes FROM parking_rates;
                    """,
                      (
                      )
                      )
    logger.debug(f"Got rates: {rates}")
    return rates[0]

def update_rates(hourly_rate, entry_grace_minutes, exit_grace_minutes):
    """
    Update the parking rates.

    Args:
    hourly_rate (float): The new hourly parking rate.
    entry_grace_minutes (int): The new entry grace period in minutes.
    exit_grace_minutes (int): The new exit grace period in minutes.

    Returns:
    dict: A dictionary indicating the status of the update.
    """
    query_update("""
                UPDATE parking_rates SET hourly_rate = %s, entry_grace_minutes = %s, exit_grace_minutes = %s;
                """,
                 (
                     hourly_rate,
                     entry_grace_minutes,
                     exit_grace_minutes
                 )
                 )
    return {"status": "success", "message": "Rates updated successfully!"}

def get_rates_for_client(reg_number):
    """
    Calculate the parking fee for a client based on their registration number.

    Args:
    reg_number (str): The registration number of the client's vehicle.

    Returns:
    int: The calculated parking fee in grosz.
    """
    spot = get_spot_by_reg_number(reg_number)
    minutes = __get_minutes_for_client(spot)
    rates = get_rates()
    if minutes < timedelta(minutes=rates['entry_grace_minutes']):
        return 0
    else:
        return int(math.ceil(minutes.total_seconds() / 60) * rates['hourly_rate']) / 60

def __get_minutes_for_client(spot):
    """
    Calculate the duration in minutes for which a client has occupied a parking spot.

    Args:
    spot (dict): A dictionary representing the parking spot, including entry_time.

    Returns:
    timedelta: The duration in minutes.
    """
    if spot is None:
        return None
    entry_time = spot['entry_time']
    temp = query_get("""
            SELECT CURRENT_TIMESTAMP;
                    """,
                      (
                      )
                      )
    exit_time = temp[0]['CURRENT_TIMESTAMP']
    minutes = exit_time - entry_time
    return minutes
