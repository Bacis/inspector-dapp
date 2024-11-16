import os
from dstack_sdk import AsyncTappdClient, DeriveKeyResponse, TdxQuoteResponse
from fastapi import FastAPI, Depends
# from fastapi.security import OAuth2PasswordBearer
import numpy as np
from utils import classify_text

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "The World! Call /derivekey, /tdxquote, or /predict"}

@app.get("/derivekey")
async def derivekey():
    client = AsyncTappdClient()
    deriveKey = await client.derive_key('/', 'test')
    assert isinstance(deriveKey, DeriveKeyResponse)
    asBytes = deriveKey.toBytes()
    assert isinstance(asBytes, bytes)
    limitedSize = deriveKey.toBytes(32)
    return {"deriveKey": asBytes.hex(), "derive_32bytes": limitedSize.hex()}

@app.get("/tdxquote")
async def tdxquote():
    client = AsyncTappdClient()
    tdxQuote = await client.tdx_quote('test')
    assert isinstance(tdxQuote, TdxQuoteResponse)
    return {"tdxQuote": tdxQuote}

@app.get("/predict")
async def predict(text: str):
    prediction = classify_text(text)
    return {"prediction": prediction}