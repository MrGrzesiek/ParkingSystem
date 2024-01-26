# from fastapi import HTTPException
from .query import query_get, query_put, query_update
import logging
from .spots import get_spot_by_reg_number




logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# GET
# rates/all (None) -> {hourly: float, entry_grace_period: time??, exit_grace_period: time??}
# rates/for_client (reg_number: string) -> grosz: int

# UPDATE
# rates/all (hourly: float, entry_grace_period: time??, exit_grace_period: time??) -> None

def get_rates():
    rates = query_get("""
                    SELECT hourly_rate, entry_grace_minutes, exit_grace_minutes FROM parking_rates;
                    """,
                      (
                      )
                      )
    logger.debug(f"Got rates: {rates}")
    return rates[0]

def update_rates(hourly_rate, entry_grace_minutes, exit_grace_minutes):
    query_update("""
                UPDATE parking_rates SET hourly_rate = %s, entry_grace_minutes = %s, exit_grace_minutes = %s;
                """,
                 (
                     hourly_rate,
                     entry_grace_minutes,
                     exit_grace_minutes
                 )
                 )
    logger.debug(f"Updated rates: hourly_rate: {hourly_rate}, entry_grace_minutes: {entry_grace_minutes}, exit_grace_minutes: {exit_grace_minutes}")
    return {"status": "success", "message": "Rates updated successfully!"}

def get_rates_for_client(reg_number):
    spot = get_spot_by_reg_number(reg_number)
    minutes = __get_minutes_for_client(spot)
    rates = get_rates
    if minutes < rates["entry_grace_minutes"]:
        return 0
    else: 
        return (minutes/60) * rates["hourly_rate"]

def __get_minutes_for_client(spot):
    if spot is None:
        return None
    entry_time = spot['entry_time']
    exit_time = query_get("""
            SELECT CURRENT_TIMESTAMP;
                    """,
                      (
                      )
                      )

    logger.debug(f"Got minutes for client: entry_time{entry_time}\nexit_time: {exit_time}")
    minutes = exit_time - entry_time
