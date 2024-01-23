from pydantic import BaseModel, EmailStr


class SignInRequestModel(BaseModel):
    email: str
    password: str


class SignUpRequestModel(BaseModel):
    email: EmailStr
    sign_in: str



class UserResponseModel(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str

class UserUpdateRequestModel(BaseModel):
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
    access_token: str
    refresh_token: str


class UserAuthResponseModel(BaseModel):
    token: TokenModel
    user: UserResponseModel
