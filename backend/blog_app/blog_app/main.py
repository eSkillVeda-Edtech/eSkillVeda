from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .routes import routes
from .models import models
from .services import database

app = FastAPI()

# Add CORS middleware - MUST be added before other middleware and routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.on_event("startup")
async def startup():
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

# Add this to run on port 8001 programmatically
if __name__ == "__main__":
    uvicorn.run("blog_app.main:app", host="127.0.0.1", port=8001, reload=True)
