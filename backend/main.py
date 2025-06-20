from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import openai
from logic import detect_emergency, ask_gpt, QUESTIONS, EMERGENCY_MESSAGE
from typing import List

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:4200"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class Message(BaseModel):
  role: str
  content: str

class ChatRequest(BaseModel):
  history: List[Message]
  question_index: int

class ChatRequest(BaseModel):
  history: list
  question_index: int

@app.post("/chat")
def chat(req: ChatRequest):
  history = req.history
  index = req.question_index

  if len(history) > 0 and detect_emergency(history[-1]["content"]):
    return {
      "emergency": True,
      "message": EMERGENCY_MESSAGE,
      "end": True
    }

  if index >= len(QUESTIONS):
    return {
      "message": "Merci d'avoir complété le questionnaire. Un professionnel vous recontactera si nécessaire.",
      "end": True
    }

  # Optionnel : réponse intermédiaire, ex : "Merci. Passons à la suite"
  gpt_reply = ask_gpt(history + [
    {"role": "assistant", "content": "Merci pour ta réponse. Prêt pour la suite ?"}
  ])

  return {
    "message": f"{gpt_reply}\n\n{QUESTIONS[index]}",
    "question_index": index + 1,
    "end": False
  }
