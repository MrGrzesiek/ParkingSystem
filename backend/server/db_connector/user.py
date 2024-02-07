"""
User Registration and Authentication Functions Documentation

This section includes functions related to user registration and authentication within the parking management system.

"""

from fastapi import HTTPException
from .query import query_get, query_put, query_update
from .auth import Auth
from .models import UserUpdateRequestModel, SignUpRequestModel

auth_handler = Auth()

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_user(user_model: SignUpRequestModel):
    """
    register_user(user_model: SignUpRequestModel) -> Dict
   - Description: Registers a new user in the system.
   - Parameters:
       - user_model (SignUpRequestModel): The user registration information.
   - Returns:
       - Dict: A dictionary containing information about the registered user.
   - Raises:
       - HTTPException 409: If the email is already associated with an existing user.
       - HTTPException 500: If an error occurs during user registration.
    """
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


def signin_user(email, incoming_password_hash):
    """
    signin_user(email: str, incoming_password_hash: str) -> Dict
   - Description: Authenticates a user based on the provided email and password hash.
   - Parameters:
       - email (str): The email of the user.
       - incoming_password_hash (str): The hashed password provided during login.
   - Returns:
       - Dict: A dictionary containing information about the authenticated user.
   - Raises:
       - HTTPException 401: If the provided email or password is invalid.
    """
    user = __get_user_by_email__(email)
    db_password_hash = user[0]['password_hash']
    if len(user) == 0:
        raise HTTPException(status_code=401, detail='Invalid email')

    if not incoming_password_hash == db_password_hash:
        raise HTTPException(status_code=401, detail='Invalid password')
    return user[0]

def __get_user_by_email__(email: str):
    """
    __get_user_by_email__(email: str) -> Dict
   - Description: Retrieves user information based on the provided email.
   - Parameters:
       - email (str): The email of the user.
   - Returns:
       - Dict: A dictionary containing user information.

    """
    user = query_get("""
        SELECT 
            users.id,
            users.email,
            users.password_hash
        FROM users 
        WHERE email = %s
        """, (email))
    return user

def __get_user_password_hash__(email: str):
    """
    __get_user_password_hash(email: str) -> str
   - Description: Retrieves the hashed password of a user based on the provided email.
   - Parameters:
       - email (str): The email of the user.
   - Returns:
       - str: The hashed password of the user.
   - Raises:
       - HTTPException 500: If an error occurs during password retrieval.
    """
    user = query_get("""
        SELECT 
            users_password.password_hash
        FROM users_password 
        INNER JOIN users ON users_password.user_id = users.id
        WHERE users.email = %s
        """, (email))
    return user[0]['password_hash']

"""
Module Dependencies:
   - Auth: Utilizes the Auth class for password encoding and decoding.
   - query_get, query_put: Importing query functions for database operations.
   - models: Importing user-related models for data validation.
"""
