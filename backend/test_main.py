import pytest 
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app, get_db, verify_admin
from database import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

def override_verify_admin():
    return None

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[verify_admin] = override_verify_admin

client = TestClient(app)

def test_read_root():
    # Fire a fake GET request to the root URL
    response = client.get("/")
    
    # Assert that the server responded with 200 OK
    assert response.status_code == 200
    
    # Assert that the JSON payload matches exactly what we expect
    assert response.json() == {"message": "Backend running"}

def test_get_empty_commissions():
    response = client.get("/api/commissions")

    assert response.status_code == 200 

    assert response.json() == []

def test_create_commission():
    response = client.post("/api/commissions", json={"client_name": "Test Client", "discord_tag": "test#1234", "description": "A new project", "budget": 50, "status": "Pending"})

    assert response.status_code == 200 

    assert response.json()["client_name"] == "Test Client"