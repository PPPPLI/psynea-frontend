from fastapi import APIRouter
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialisation du routeur pour la génération du résumé du patient
router = APIRouter()

# Modèle Pydantic pour les données du patient
class Patient(BaseModel):
  score_anxiety: int
  score_moral: int
  suicidal_thoughts: str
  troubles: list
  goal: str
  autonomy: str

# Route pour générer un résumé du patient
@router.post("/generate-summary")
def generate_summary(patient: Patient):
  # Construction du prompt pour OpenAI
  prompt = f"""
    Voici les données d'un patient :
    Score d'anxiété: {patient.score_anxiety}/10
    Score moral: {patient.score_moral}/10
    Pensées suicidaires: {patient.suicidal_thoughts}
    Troubles: {', '.join(patient.troubles)}
    Objectif thérapeutique: {patient.goal}
    Autonomie: {patient.autonomy}
    Résumez l'état du patient.
    """

  try:
    # Appel à l'API OpenAI pour générer un résumé
    response = openai.Completion.create(
      model="gpt-4",
      prompt=prompt,
      max_tokens=150,
      temperature=0.7
    )

    summary = response.choices[0].text.strip()
    return {"summary": summary}

  except Exception as e:
    return {"error": str(e)}
