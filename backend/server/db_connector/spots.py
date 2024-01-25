from fastapi import HTTPException
from .query import query_get, query_put, query_update
from .auth import Auth
import logging

auth_handler = Auth()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

SPOT_FREE = 0
SPOT_TAKEN = 1


# Returns id of reserved spot or raises 404 if no free spots
def reserve_spot(reg_number, photo_name):
    # check if registration number is already in use
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
    spots = query_get("""
                    SELECT * FROM spot;
                    """,
                      (
                      )
                      )
    logger.debug(f"Got all spots: {spots}")
    return spots


# Returns spot data
def get_spot_info(spot_id):
    spot = __get_spot_by_id(spot_id)
    logger.debug(f"Got spot: {spot}")
    return spot


# Returns spot history
def get_spot_history(spot_id):
    history = query_get("""
                    SELECT * FROM spot_history WHERE spot_id = %s
                    SORT BY entry_time DESC;
                    """,
                        (
                            spot_id
                        )
                        )
    logger.debug(f"Got spot history: {history}")
    return history


# Returns None or raises 404 if spot is not taken
def free_spot(spot_id):
    if not __is_spot_taken(spot_id):
        raise HTTPException(status_code=404, detail='Spot is not taken')
    # get spot data, update history, free spot
    spot = __get_spot_by_id(spot_id)

    # Update history
    query_put("""
                INSERT INTO spot_history (
                    spot_id,
                    entry_time,
                    exit_time,
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
    logger.debug(f"Freed spot {spot_id}")
    return None


def get_spot_by_reg_number(reg_number):
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
    spot = query_get("""
                    SELECT status FROM spot WHERE id = %s;
                    """,
                     (
                         spot_id
                     )
                     )
    logger.debug(f"Got spot status: {spot[0]['status']} for spot {spot_id}")
    return int(spot[0]['status']) == SPOT_TAKEN


def __get_spot_by_id(spot_id):
    spot = query_get("""
                    SELECT * FROM spot WHERE id = %s;
                    """,
                     (
                         spot_id
                     )
                     )
    logger.debug(f"Got spot: {spot[0]} for spot {spot_id}")
    return spot[0]


def get_free_spots_count():
    count = query_get("""
                    SELECT COUNT(status) FROM spot WHERE status = 0;
                    """,
                      (
                      )
                      )
    logger.debug(f"Free spots: {count}")
    return count

