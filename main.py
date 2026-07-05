from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class Quote(BaseModel):
    id: int
    text: str
    author: str

quotes_db = [
    Quote(id=1, text="The only way to do great work is to love what you do.", author="Steve Jobs"),
    Quote(id=2, text="Believe you can and you're halfway there.", author="Theodore Roosevelt"),
    Quote(id=3, text="Strive not to be a success, but rather to be of value.", author="Albert Einstein")
]

@app.get("/quotes", response_model=list[Quote])
def get_quotes():
    return quotes_db

@app.post("/quotes", response_model=Quote)
def add_quote(quote: Quote):
    quotes_db.append(quote)
    return quote

@app.get("/quotes/random", response_model=Quote)
def get_random_quote():
    return random.choice(quotes_db)

@app.get("/quotes/{id}", response_model=Quote)
def get_quote_by_id(id: int):
    for quote in quotes_db:
        if quote.id == id:
            return quote
    return {"detail": "Quote not found"}

@app.put("/quotes/{id}", response_model=Quote)
def update_quote(id: int, updated_quote: Quote):
    for i, quote in enumerate(quotes_db):
        if quote.id == id:
            quotes_db[i] = updated_quote
            return updated_quote
    return {"detail": "Quote not found"}

@app.delete("/quotes/{id}", response_model=dict)
def delete_quote(id: int):
    global quotes_db
    initial_length = len(quotes_db)
    quotes_db = [quote for quote in quotes_db if quote.id != id]
    if len(quotes_db) < initial_length:
        return {"message": "Quote deleted successfully"}
    return {"detail": "Quote not found"}
