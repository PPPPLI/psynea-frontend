from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()

EMERGENCY_KEYWORDS = [
  "suicide", "me suicider", "envie d’en finir", "plus envie de vivre",
  "pensées suicidaires", "mettre fin à mes jours", "je veux mourir"
]

EMERGENCY_MESSAGE = """
Vous venez d’exprimer des pensées suicidaires.
Votre sécurité est la priorité. Veuillez arrêter cette session et contacter immédiatement :
- France : 3114 (numéro national de prévention du suicide)
- Ou votre médecin traitant.
Un professionnel de santé sera informé pour vous aider.
"""

QUESTIONS = [
  # 1. Informations générales
  "Quel est ton âge ?",
  "Quel est ton genre ? (Femme, Homme, Autre, Préfère ne pas dire)",
  "Quelle est ta situation actuelle ? (Étudiant, En emploi, Sans emploi, En arrêt maladie, Autre)",
  "Souhaites-tu que ton parcours reste strictement confidentiel ? (Oui, Non)",
  "As-tu déjà suivi un accompagnement psychologique ou psychiatrique ? Si oui, lequel et quand ?",

  # 2. Santé physique et mode de vie
  "As-tu un problème de santé physique important ?",
  "Prends-tu un traitement médical régulier ?",
  "As-tu des troubles du sommeil ?",
  "As-tu des conduites addictives ? (tabac, alcool, écrans, nourriture, autres)",

  # 3. Anxiété & stress
  "Sur une échelle de 1 à 10, à combien évaluerais-tu ton niveau d’anxiété aujourd’hui ?",
  "As-tu régulièrement des crises d’angoisse ou attaques de panique ?",
  "As-tu du mal à contrôler tes pensées ou anticipations négatives ?",
  "As-tu déjà évité des situations par peur ou stress excessif ?",

  # 4. Humeur & dépression
  "Sur une échelle de 1 à 10, à combien évaluerais-tu ton moral ces dernières semaines ?",
  "As-tu eu une baisse de motivation, d’énergie ou de plaisir ?",
  "Ressens-tu un sentiment de vide, d’inutilité ou de tristesse fréquente ?",
  "As-tu eu des pensées suicidaires ces derniers temps ? (Non, Oui mais passagères, Oui avec envie d’agir)",

  # 5. Objectifs & motivation
  "Qu’est-ce qui t’a poussé à chercher un accompagnement aujourd’hui ?",
  "Es-tu prêt(e) à suivre un programme en autonomie avec IA + quelques points humains ?",
  "À quel rythme souhaites-tu t’engager ? (1 module/jour, 2-3 modules/semaine, selon mon état)",

  # 6. Accord & orientation
  "Souhaites-tu être contacté(e) ou dirigé(e) vers un professionnel si nécessaire ?"
]

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def detect_emergency(text):
  text_lower = text.lower()
  return any(keyword in text_lower for keyword in EMERGENCY_KEYWORDS)

def ask_gpt(messages):
  response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    temperature=0.3
  )
  return response.choices[0].message.content

