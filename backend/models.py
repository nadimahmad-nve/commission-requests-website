from sqlalchemy import Column, Integer, String
from database import Base

class Commission(Base):
    __tablename__ = "commissions"
    id = Column(Integer, primary_key=True, index=True)  
    client_name = Column(String)
    discord_tag = Column(String)
    description = Column(String)
    budget = Column(Integer)
    status = Column(String, default="Pending")

