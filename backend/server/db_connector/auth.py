"""
Authentication Module Documentation

This module contains the Auth class responsible for handling user authentication, including password hashing,
token encoding, decoding, and refreshing.
"""

import os
import jwt  # used for encoding and decoding jwt tokens
from fastapi import HTTPException  # used to handle error handling
from passlib.context import CryptContext  # used for hashing the password
# used to handle expiry time for tokens
from datetime import datetime, timedelta


class Auth():
    hasher = CryptContext(schemes=['bcrypt'])
    secret = os.getenv("APP_SECRET_STRING")

    def encode_password(self, password):
        """
        encode_password(self, password: str) -> str:
        - Description: Hashes the input password using the bcrypt algorithm.
        - Parameters:
            - password (str): The plaintext password to be hashed.
        - Returns:
            - str: The hashed password.
        """
        return self.hasher.hash(password)

    def verify_password(self, password, encoded_password):
        """
        verify_password(self, password: str, encoded_password: str) -> bool:
        - Description: Verifies the input password against its hashed version.
        - Parameters:
            - password (str): The plaintext password to be verified.
            - encoded_password (str): The hashed password for comparison.
        - Returns:
            - bool: True if the passwords match, False otherwise.
        """
        return self.hasher.verify(password, encoded_password)

    def encode_token(self, email):
        """
        encode_token(self, email: str) -> str:
        - Description: Encodes an access token with a specified expiry time.
        - Parameters:
            - email (str): The user's email address.
        - Returns:
            - str: The encoded access token.
        """
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, minutes=30),
            'iat': datetime.utcnow(),
            'scope': 'access_token',
            'sub': email
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm='HS256'
        )

    def decode_token(self, token):
        """
         decode_token(self, token: str) -> str:
        - Description: Decodes an access token and verifies its validity.
        - Parameters:
            - token (str): The encoded access token.
        - Returns:
            - str: The decoded user's email if successful.
        - Raises:
            - HTTPException: Raised for expired or invalid tokens.
        """
        try:
            payload = jwt.decode(token, self.secret, algorithms=['HS256'])
            if (payload['scope'] == 'access_token'):
                return payload['sub']
            raise HTTPException(
                status_code=401, detail='Scope for the token is invalid')
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail='Token expired')
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail='Invalid token')

    def encode_refresh_token(self, email):
        """
         encode_refresh_token(self, email: str) -> str:
        - Description: Encodes a refresh token with a specified expiry time.
        - Parameters:
            - email (str): The user's email address.
        - Returns:
            - str: The encoded refresh token.
        """
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, hours=10),
            'iat': datetime.utcnow(),
            'scope': 'refresh_token',
            'sub': email
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm='HS256'
        )

    def refresh_token(self, refresh_token):
        """
        refresh_token(self, refresh_token: str) -> str:
        - Description: Refreshes an access token using a valid refresh token.
        - Parameters:
            - refresh_token (str): The encoded refresh token.
        - Returns:
            - str: The newly encoded access token.
        - Raises:
            - HTTPException: Raised for expired or invalid refresh tokens.
        """
        try:
            payload = jwt.decode(
                refresh_token, self.secret, algorithms=['HS256'])
            if (payload['scope'] == 'refresh_token'):
                email = payload['sub']
                new_token = self.encode_token(email)
                return new_token
            raise HTTPException(
                status_code=401, detail='Invalid scope for token')
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=401, detail='Refresh token expired')
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401, detail='Invalid refresh token')
        
"""
Module Dependencies:
    - os: Imported for accessing environment variables.
    - jwt: Imported for encoding and decoding JSON Web Tokens.
    - HTTPException: Imported from FastAPI for handling HTTP exceptions.
    - CryptContext: Imported from passlib for password hashing.
    - datetime, timedelta: Imported for handling token expiry times.

"""