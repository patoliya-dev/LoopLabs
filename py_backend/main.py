from fastapi import FastAPI
import uvicorn
from routes import router 

app = FastAPI()

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Hello, {name}!"}


# Default entrypoint
if __name__ == "__main__":
    # Run on default port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
