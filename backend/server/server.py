"""
Parking Management System Server

This script initializes and runs a FastAPI server for the Parking Management System.
"""
import httpx
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db_connector import *

# Setup logger
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI()

# Set up CORS middleware
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:8000",
    "http://127.0.0.1",
    # Add other origins if needed
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, this is parking app server :)"}

# Connection test endpoint
@app.get("/test")
def test_connection():
    return {"status": "success", "message": "Connected successfully!"}

# Spot-related endpoints
@app.get("/spot/all")
def APIgetSpots():
    return get_all_spots()

# Get the number of free spots out of all.
@app.get("/spot/number_of_free_out_of_all")
def APIgetNumberOfFreeSpots():
    return get_number_of_free_spots_out_of_all()

# Reserve a parking spot.
@app.get("/spot/reserve/{registration}/{photo_name}")
def APIreserveSpot(registration: str, photo_name: str):
    return reserve_spot(registration, photo_name)

# Get information about a parking spot by ID.
@app.get("/spot/info/{spotID}")
def APIGetSpotInfo(spotID: str):
    return get_spot_info(spotID)

# Get information about a parking spot by registration number.
@app.get("/spot/info/registration/{registration}")
def APIGetSpotInfoByRegistration(registration: str):
    return get_spot_info_by_registration(registration)

# Get the history of a parking spot.
@app.get("/spot/history/{placeID}")
def APIGetSpotHistory(placeID: str):
    return get_spot_history(placeID)

# Rates-related endpoints
@app.get("/rates/all")
def APIGetRates():
    return get_rates()
# Get parking rates for a client.
@app.get("/rates/{registration}")
def APIGetRatesClient(registration: str):
    return get_rates_for_client(registration)

# User login endpoint
@app.post("/user/login/{email}/{pwdHash}")
def APILoginUser(email: str, pwdHash: str):
    return signin_user(email, pwdHash)

# Rates update endpoint
@app.post("/rates/update/{hourly_rate}/{entry_grace_minutes}/{exit_grace_minutes}")
def APIUpdateRates(hourly_rate: float, entry_grace_minutes: int, exit_grace_minutes: int):
    return update_rates(hourly_rate, entry_grace_minutes, exit_grace_minutes)

# Free spot endpoint
@app.post("/spot/free/{spotID}")
def APIFreeSpot(spotID: str):
    free_spot(spotID)

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


"""
Modules and Packages:
- httpx: Used for making HTTP requests.
- uvicorn: ASGI server for running FastAPI applications.
- FastAPI: Modern, fast web framework for building APIs with Python.
- CORSMiddleware: Middleware for handling Cross-Origin Resource Sharing.
- db_connector: Module containing database connection functions.
- logging: Python's built-in logging module for handling logs.

Setup and Configuration:
- The logger is configured with the level set to INFO.
- FastAPI app is created.
- CORS middleware is added to handle Cross-Origin Resource Sharing.

"""