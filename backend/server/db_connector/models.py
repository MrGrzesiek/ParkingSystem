"""
Models Documentation

This module includes Pydantic models used for data validation and serialization in the parking management system.
"""

from pydantic import BaseModel, EmailStr


class SignInRequestModel(BaseModel):
    """
    SignInRequestModel(BaseModel)
   - Description: Represents the data model for user sign-in requests.
   - Fields:
       - email (str): The user's email address.
       - password (str): The user's password for authentication.
    """
    email: str
    password: str


class SignUpRequestModel(BaseModel):
    """
    SignUpRequestModel(BaseModel)
   - Description: Represents the data model for user sign-up requests.
   - Fields:
       - email (EmailStr): The user's email address.
       - sign_in (str): The user's sign-in method.
    """
    email: EmailStr
    sign_in: str



class UserResponseModel(BaseModel):
    """
    UserResponseModel(BaseModel)
   - Description: Represents the data model for user responses.
   - Fields:
       - id (int): The unique identifier of the user.
       - email (EmailStr): The user's email address.
       - first_name (str): The user's first name.
       - last_name (str): The user's last name.
    """
    id: int
    email: EmailStr
    first_name: str
    last_name: str

class UserUpdateRequestModel(BaseModel):
    """
     UserUpdateRequestModel(BaseModel)
   - Description: Represents the data model for updating user information.
   - Fields:
       - id (int): The unique identifier of the user.
       - name (str): The user's name.
       - email (EmailStr): The user's email address.
       - phone (str): The user's phone number.
       - city (str): The user's city of residence.
       - postal_code (str): The user's postal code.
       - street (str): The user's street name.
       - street_number (str): The user's street number.
       - website (str): The user's website.
    """
    id: int
    name: str
    email: EmailStr
    phone: str
    city: str
    postal_code: str
    street: str
    street_number: str
    website: str


class TokenModel(BaseModel):
    """
    TokenModel(BaseModel)
   - Description: Represents the data model for authentication tokens.
   - Fields:
       - access_token (str): The access token for user authentication.
       - refresh_token (str): The refresh token for refreshing access tokens.
    """
    access_token: str
    refresh_token: str


class UserAuthResponseModel(BaseModel):
    """
    UserAuthResponseModel(BaseModel)
   - Description: Represents the data model for user authentication responses.
   - Fields:
       - token (TokenModel): The authentication token model.
       - user (UserResponseModel): The user response model.
    """
    token: TokenModel
    user: UserResponseModel

"""
Module Dependencies:
   - BaseModel: Imported from Pydantic for creating base models.
   - EmailStr: Imported from Pydantic for validating email strings.
"""