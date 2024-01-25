import httpx
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db_connector import *

#setup logger
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI()

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

@app.get("/")
def read_root():
    return {"message": "Hello, this is parking app serer :)"}

@app.get("/test")
def test_connection():
    return {"status": "success", "message": "Connected successfully!"}

#info about all spot
@app.get("/spot/all")
def APIgetSpots():
    return get_all_spots()

@app.get("/spot/reserve/{registration}/{photo_name}")
def APIreserveSpot(registration: str, photo_name: str):
    return reserve_spot(registration, photo_name)

#info about spot by id
@app.get("/spot/info/{spotID}")
def APIGetSpotInfo(spotID: str):
    return get_spot_info(spotID)

#spot history by id
@app.get("/spot/history/{placeID}")
def APIGetSpotHistory(placeID: str):
    return get_spot_history(placeID)

#@app.get("/rates/all")

#@app.get("/rates/forClient")

#@app.get("/client/image")

#user login
@app.post("/user/login/{email}/{pwdHash}")
def APILoginUser(email: str, pwd: str):
    logger.log(signin_user(email, pwd))

#@app.post("/client/image")

@app.get("/spot/free/{spotID}")
def APIFreeSpot(spotID: int):
    free_spot(spotID)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)