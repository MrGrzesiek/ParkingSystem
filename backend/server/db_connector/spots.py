"""
Parking Management System Documentation

This module provides functionalities for managing parking spots, rates, and user authentication through a FastAPI application.

Module Structure:
1. Parking Spot Management
   - reserve_spot(reg_number: str, photo_name: str) -> Tuple[int, dict]: Reserves a parking spot for a vehicle.
   - get_all_spots() -> List[dict]: Retrieves information about all parking spots.
   - get_spot_info(spot_id: str) -> dict: Retrieves information about a specific parking spot by ID.
   - get_spot_history(spot_id: str) -> List[dict]: Retrieves the history of a specific parking spot by ID.
   - free_spot(spot_id: str) -> None: Frees a reserved parking spot by ID.
   - get_number_of_free_spots_out_of_all() -> Tuple[int, int]: Retrieves the count of free spots and total spots.
   - get_spot_by_reg_number(reg_number: str) -> dict: Retrieves information about a parking spot by registration number.
   - get_spot_info_by_registration(registration: str) -> dict: Retrieves information about a parking spot by vehicle registration.
   - get_free_spots_count() -> int: Retrieves the count of currently free parking spots.

2. Rates Management
   - get_rates() -> dict: Retrieves current parking rates.
   - update_rates(hourly_rate: float, entry_grace_minutes: int, exit_grace_minutes: int) -> dict: Updates parking rates.
   - get_rates_for_client(reg_number: str) -> int: Retrieves parking rates for a client based on registration number.

3. User Authentication
   - signin_user(email: str, pwdHash: str) -> dict: Logs in a user based on email and password hash.

4. FastAPI Application
   - /: Returns a welcome message.
   - /test: Tests the connection to the server.
   - /spot/all: Retrieves information about all parking spots.
   - /spot/number_of_free_out_of_all: Retrieves the number of free spots out of all spots.
   - /spot/reserve/{registration}/{photo_name}: Reserves a parking spot for a vehicle.
   - /spot/info/{spotID}: Retrieves information about a specific parking spot by ID.
   - /spot/info/registration/{registration}: Retrieves information about a parking spot by registration number.
   - /spot/history/{placeID}: Retrieves the history of a specific parking spot by ID.
   - /rates/all: Retrieves current parking rates.
   - /rates/{registration}: Retrieves parking rates for a client based on registration number.
   - /spots/free: Counts the number of currently free parking spots.
   - /user/login/{email}/{pwdHash}: Logs in a user based on email and password hash.
   - /rates/update/{hourly_rate}/{entry_grace_minutes}/{exit_grace_minutes}: Updates parking rates.
   - /spot/free/{spotID}: Frees a reserved parking spot by ID.

"""

from fastapi import HTTPException
from .query import query_get, query_put, query_update
from .auth import Auth
import logging

auth_handler = Auth()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

SPOT_FREE = 0
SPOT_TAKEN = 1


def reserve_spot(reg_number, photo_name):
    """
    Reserves a parking spot for a vehicle.

    Args:
    reg_number (str): The registration number of the vehicle.
    photo_name (str): The name of the photo associated with the entry.

    Returns:
    Tuple[int, dict]: A tuple containing the reserved spot ID and entry time.
    Error 404: if there is no free spot
    """
    if __is_reg_number_in_use(reg_number):
        raise HTTPException(status_code=409, detail='Registration number already in use')
    spot = __get_free_spot_id()
    if spot is None:
        raise HTTPException(status_code=404, detail='No free spots')
    query_update("""
                UPDATE spot SET status = %s, reg_number = %s, entry_time = CURRENT_TIMESTAMP WHERE id = %s;
                """,
                 (
                     SPOT_TAKEN,
                     reg_number,
                     spot,
                 )
                 )
    query_put("""
            INSERT INTO entry (
                reg_number,
                entry_time,
                photo_name
            ) VALUES (%s, CURRENT_TIMESTAMP, %s);
            """,
          (
              reg_number,
              photo_name
          )
          )
    entry_time = query_get("""
                    SELECT entry_time FROM entry WHERE reg_number = %s;
                    """,
                            (
                                 reg_number
                            )
                            )
    logger.debug(f"Got entry time: {entry_time}")
    logger.debug(f'Reserved spot {spot} for {reg_number}')
    return spot, entry_time

def __is_reg_number_in_use(reg_number) -> bool:
    """
    Checks if a registration number is already in use.

    Args:
    reg_number (str): The registration number to check.

    Returns:
    bool: True if the registration number is in use; False otherwise.
    """
    spot = query_get("""
                    SELECT status FROM spot WHERE reg_number = %s;
                    """,
                     (
                         reg_number
                     )
                     )
    logger.info(f"Got spot status: {spot} for reg_number {reg_number}")
    if len(spot) == 0:
        return False
    return int(spot[0]['status']) == SPOT_TAKEN
# Returns all spots data
def get_all_spots():
    """
    Retrieves information about all parking spots.

    Returns:
    List[Dict]: A list of dictionaries containing information about each parking spot.
    """
    spots = query_get("""
                    SELECT * FROM spot;
                    """,
                      (
                      )
                      )
    logger.debug(f"Got all spots: {spots}")
    return spots


def get_spot_info(spot_id):
    """
    Retrieves information about a specific parking spot by ID.

    Args:
    spot_id (str): The ID of the parking spot.

    Returns:
    Dict: A dictionary containing information about the parking spot.
    """
    spot = __get_spot_by_id(spot_id)
    logger.debug(f"Got spot: {spot}")
    return spot


def get_spot_history(spot_id):
    """
    Retrieves the history of a specific parking spot by ID.

    Args:
    spot_id (str): The ID of the parking spot.

    Returns:
    List[Dict]: A list of dictionaries containing the spot's history entries.
    """
    history = query_get("""
                    SELECT * FROM spot_history WHERE spot_id = %s
                    ORDER BY entry_time DESC;
                    """,
                        (
                            spot_id
                        )
                        )
    logger.debug(f"Got spot history: {history}")
    return history


def free_spot(spot_id):
    """
    Frees a reserved parking spot by ID.

    Args:
    spot_id (str): The ID of the parking spot.

    Returns:
    404 if spot is not taken
    """
    if not __is_spot_taken(spot_id):
        raise HTTPException(status_code=404, detail='Spot is not taken')
    # get spot data, update history, free spot
    spot = __get_spot_by_id(spot_id)

    # Update history
    query_put("""
                INSERT INTO spot_history (
                    spot_id,
                    entry_time,
                    departure_time,
                    reg_number
                ) VALUES (%s,%s,CURRENT_TIMESTAMP,%s);
                """,
              (
                  spot['id'],
                  spot['entry_time'],
                  spot['reg_number'],
              )
              )

    # Free the spot
    query_update("""
                UPDATE spot SET status = %s, reg_number = %s, entry_time = NULL WHERE id = %s;
                """,
                 (
                     SPOT_FREE,
                     None,
                     spot_id,
                 )
                 )
    logger.info(f"Freed spot {spot_id}")
    return None


def get_number_of_free_spots_out_of_all():
    """
    get_number_of_free_spots_out_of_all() -> Tuple[int, int]
    - Description: Retrieves the count of free parking spots and the total count of parking spots.
    - Returns:
       - Tuple[int, int]: A tuple containing the count of free parking spots and the total count of parking spots.

    """
    free_spots = query_get("""
                    SELECT COUNT(status) FROM spot WHERE status = %s;
                    """,
                      (
                            SPOT_FREE
                      )
                      )
    all_spots = query_get("""
                    SELECT COUNT(status) FROM spot;
                    """,
                        (
                        )
                        )
    logger.info(f"Free spots: {free_spots} / {all_spots}")
    return free_spots, all_spots
def get_spot_by_reg_number(reg_number):
    """
    get_spot_by_reg_number(reg_number: str) -> Dict
   - Description: Retrieves information about a parking spot based on its registration number.
   - Parameters:
       - reg_number (str): The registration number of the vehicle.
   - Returns:
       - Dict: A dictionary containing information about the parking spot.
    """
    spot = query_get("""
                    SELECT * FROM spot WHERE reg_number = %s;
                    """,
                     (
                         reg_number
                     )
                     )
    logger.debug(f"Got spot: {spot}")
    return spot[0]


def __get_free_spot_id():
    """
    __get_free_spot_id() -> Optional[int]
   - Description: Retrieves the ID of a free parking spot. Returns None if no free spots are available.
   - Returns:
       - Optional[int]: The ID of the free parking spot or None if no free spots are available.

    """
    spot_id = query_get("""
                    SELECT id FROM spot WHERE status = %s LIMIT 1;
                    """,
                        (
                            SPOT_FREE
                        )
                        )
    if len(spot_id) == 0:
        logger.debug(f"No free spots")
        return None
    logger.debug(f"Got free spot id: {spot_id[0]['id']}")
    return int(spot_id[0]["id"])


def __is_spot_taken(spot_id) -> bool:
    """
    __is_spot_taken(spot_id) -> bool
   - Description: Checks if a parking spot with a given ID is currently taken.
   - Parameters:
       - spot_id: The ID of the parking spot.
   - Returns:
       - bool: True if the spot is taken, False otherwise.

    """
    spot = query_get("""
                    SELECT status FROM spot WHERE id = %s;
                    """,
                     (
                         spot_id
                     )
                     )
    logger.debug(f"Got spot status: {spot[0]['status']} for spot {spot_id}")
    return int(spot[0]['status']) == SPOT_TAKEN

def get_spot_info_by_registration (registration):
    """
     get_spot_info_by_registration(registration: str) -> Dict
   - Description: Retrieves information about a parking spot based on the vehicle's registration number, including associated entry photo details.
   - Parameters:
       - registration (str): The registration number of the vehicle.
   - Returns:
       - Dict: A dictionary containing information about the parking spot and associated entry photo details.

    """
    spot = query_get("""
                    SELECT spot.*, entry.photo_name FROM spot
                    LEFT JOIN entry ON spot.reg_number = entry.reg_number
                    WHERE spot.reg_number = %s;
                    """,
                     (
                         registration
                     )
                     )
    logger.debug(f"Got spot: {spot[0]} for registration {registration}")
    return spot[0]

def __get_spot_by_id(spot_id):
    """
     __get_spot_by_id(spot_id: str) -> Dict
   - Description: Retrieves information about a parking spot based on its ID, including associated entry photo details.
   - Parameters:
       - spot_id (str): The ID of the parking spot.
   - Returns:
       - Dict: A dictionary containing information about the parking spot and associated entry photo details.

    """
    spot = query_get("""
                    SELECT spot.*, entry.photo_name FROM spot
                    LEFT JOIN entry ON spot.reg_number = entry.reg_number
                    WHERE spot.id = %s;
                    """,
                     (
                         spot_id
                     )
                     )
    logger.debug(f"Got spot: {spot[0]} for spot {spot_id}")
    return spot[0]


def get_free_spots_count():
    """
     get_free_spots_count() -> int
   - Description: Retrieves the count of currently free parking spots.
   - Returns:
       - int: The count of currently free parking spots.
    """
    count = query_get("""
                    SELECT COUNT(status) FROM spot WHERE status = 0;
                    """,
                      (
                      )
                      )
    logger.debug(f"Free spots: {count}")
    return count

