from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
import uuid

app = FastAPI(title="CiviTwin AI Backend")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Complaint(BaseModel):
    id: str = None
    category: str
    description: str
    location: str
    severity: int = None

class Intervention(BaseModel):
    id: str
    name: str
    category: str
    budget: int

# In-memory database for the MVP
complaints_db = [
    Complaint(id="1", category="Water", description="No water supply for 3 days", location="Sector 4", severity=90),
    Complaint(id="2", category="Roads", description="Huge potholes causing accidents", location="Main Street", severity=85)
]

@app.post("/api/complaints")
async def create_complaint(complaint: Complaint):
    complaint.id = str(uuid.uuid4())
    # AI Simulation: automatically assign severity
    complaint.severity = random.randint(50, 100)
    complaints_db.append(complaint)
    return {"message": "Complaint logged successfully", "complaint": complaint}

@app.get("/api/complaints", response_model=List[Complaint])
async def get_complaints():
    return complaints_db

class SimulationRequest(BaseModel):
    interventions: List[Intervention]
    budget_constraint: int

@app.post("/api/simulate")
async def run_simulation(req: SimulationRequest):
    # Mock Simulation Logic for the Digital Twin
    base_satisfaction = 45 # Out of 100
    base_infra_index = 50
    total_cost = 0
    
    impact_details = []
    
    for intervention in req.interventions:
        total_cost += intervention.budget
        # Simulate impact
        sat_boost = random.randint(5, 15)
        infra_boost = random.randint(10, 20)
        
        base_satisfaction += sat_boost
        base_infra_index += infra_boost
        
        impact_details.append({
            "intervention": intervention.name,
            "satisfaction_impact": f"+{sat_boost}%",
            "infra_impact": f"+{infra_boost}",
            "reasoning": f"Improves {intervention.category} significantly in affected areas."
        })
        
    base_satisfaction = min(100, base_satisfaction)
    
    return {
        "status": "success" if total_cost <= req.budget_constraint else "warning",
        "message": "Simulation Complete" if total_cost <= req.budget_constraint else "Budget Exceeded",
        "metrics": {
            "projected_satisfaction": base_satisfaction,
            "projected_infra_index": base_infra_index,
            "total_cost": total_cost,
            "budget_remaining": req.budget_constraint - total_cost
        },
        "details": impact_details
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
