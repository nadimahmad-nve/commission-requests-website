import os 
import requests
from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
import models 
from database import engine, SessionLocal
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)

load_dotenv()

app = FastAPI()
origins = {"http://localhost:5173"}
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommissionRequest(BaseModel):
    client_name: str 
    discord_tag: str
    description: str
    budget: int

class StatusUpdate(BaseModel):
    status: str

def get_db():
    db = SessionLocal()
    try:
        yield(db)
    finally:
        db.close()
        

@app.get("/")
def read_root():
    return {"message": "Hello from the Python Backend! The kitchen is open."}

@app.post("/api/commissions")
def send_commission(new_commission : CommissionRequest, db : Session = Depends(get_db)):
    db_commission = models.Commission(client_name = new_commission.client_name, discord_tag = new_commission.discord_tag, description = new_commission.description, budget = new_commission.budget)
    db.add(db_commission)
    db.commit()
    db.refresh(db_commission)

    return db_commission

@app.get("/api/commissions")
def get_all_commissions(db : Session = Depends(get_db)):
    all_commissions = db.query(models.Commission).all()
    return all_commissions

@app.get("/api/music")
def get_currently_playing():
    api_key = os.getenv("LASTFM_API_KEY")
    username = os.getenv("LASTFM_USERNAME")

    if not api_key or not username:
        return {"error": "Missing Last.fm API Key or Username in .env"}

    # Last.fm provides the single most recent track
    url = f"http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={username}&api_key={api_key}&format=json&limit=1"
    
    response = requests.get(url)
    if response.status_code != 200:
        return {"error": "Failed to fetch data from Last.fm"}

    data = response.json()
    
    try:
        # Navigate through the Last.fm JSON structure
        recent_tracks = data.get("recenttracks", {}).get("track", [])
        if not recent_tracks:
            return {"is_playing": False}
            
        track = recent_tracks[0]
        
        # Look for the "@attr" tag - determines if the song is currently playing right now
        is_playing = track.get("@attr", {}).get("nowplaying") == "true"
        
        if not is_playing:
            return {"is_playing": False}
        
        images = track.get("image", [])
        album_cover = images[-1].get("#text", "") if images else ""

        return {
            "is_playing": True,
            "title": track.get("name"),
            "artist": track.get("artist", {}).get("#text"), 
            "album_cover": album_cover
        }
    except Exception as e:
        return {"error": f"Error parsing data: {str(e)}"}

@app.delete("/api/commissions/{commission_id}")
def delete_commission(commission_id: int, db: Session = Depends(get_db)):
    commission_to_delete = db.query(models.Commission).filter(models.Commission.id == commission_id).first()
    if not commission_to_delete:
        raise HTTPException(status_code=404, detail="Commission not found")

    db.delete(commission_to_delete)
    db.commit()

    return {"message": f"Commission {commission_id} deleted from database successfully."}

@app.patch("/api/commissions/{commission_id}")
def update_commission_status(commission_id: int, status_data: StatusUpdate, db: Session = Depends(get_db)):
    commission_to_update = db.query(models.Commission).filter(models.Commission.id == commission_id).first()

    if not commission_to_update: 
        raise HTTPException(status_code=404, detail="Commission not found")

    commission_to_update.status = status_data.status

    db.commit()
    db.refresh(commission_to_update)