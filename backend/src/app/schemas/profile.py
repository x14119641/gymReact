from pydantic import BaseModel,ConfigDict
from typing import List
from datetime import datetime


class ProfileIn(BaseModel):
    goal:str
    days_per_week:str
    experience_level:str
    equipment_access:List[str]
    session_length:str
    injuries:List[str]
    sports_background:List[str]


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    goal:str
    days_per_week:str
    experience_level:str
    equipment_access:List[str]
    session_length:str
    injuries:List[str]
    sports_background:List[str]
    created_at:datetime
    onboarding_completed_at:datetime
    