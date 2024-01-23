from fastapi import HTTPException
from .query import query_get, query_put, query_update
from .auth import Auth
from .models import UserUpdateRequestModel, SignUpRequestModel

auth_handler = Auth()

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_user(user_model: SignUpRequestModel):
    user = __get_user_by_email__(user_model.email)
    if len(user) != 0:
        raise HTTPException(
            status_code=409, detail='Email user already exist.')
    hashed_password = auth_handler.encode_password(user_model.password)
    query_put("""
                INSERT INTO users (
                    name,
                    email
                ) VALUES (%s,%s);
                """,
              (
                  user_model.name,
                  user_model.email
              )
              )
    user = __get_user_by_email__(user_model.email)
    if len(user) == 0:
        raise HTTPException(status_code=500, detail='Error in register_user->get_user_by_email, user not found.')
    else:
        query_put("""
                    INSERT INTO users_password (
                        user_id,
                        password_hash
                    ) VALUES (%s,%s);
                    """,
                (
                    user[0]['id'],
                    hashed_password
                )
                )
    return user[0]


def signin_user(email, password):
    user = __get_user_by_email__(email)
    password_hash = ''
    if len(user) == 0:
        print('Invalid email')
        raise HTTPException(status_code=401, detail='Invalid email')
    else:
        password_hash = __get_user_password_hash__(email)

    if (not auth_handler.verify_password(password, password_hash)):
        print('Invalid password')
        raise HTTPException(status_code=401, detail='Invalid password')
    return user[0]

def __get_user_by_email__(email: str):
    user = query_get("""
        SELECT 
            users.id,
            users.name,
            users.email
        FROM users 
        WHERE email = %s
        """, (email))
    return user

def __get_user_password_hash__(email: str):
    user = query_get("""
        SELECT 
            users_password.password_hash
        FROM users_password 
        INNER JOIN users ON users_password.user_id = users.id
        WHERE users.email = %s
        """, (email))
    return user[0]['password_hash']
