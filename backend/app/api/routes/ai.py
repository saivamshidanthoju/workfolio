from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


class AIRequest(BaseModel):
    prompt: str


class AIResponse(BaseModel):
    answer: str


@router.post("/ask", response_model=AIResponse)
def ask_ai(req: AIRequest):
    # Lightweight local assistant stub — replace with real LLM integration.
    prompt = req.prompt.strip().lower()

    if "summar" in prompt:
        answer = "Summary: This assignment requires creating a responsive React + TypeScript frontend, integrating auth, real-time chat, and AI assistant."
    elif "how to" in prompt or "help" in prompt:
        answer = "You can use the search field to find jobs, open an assignment to chat with participants, and use the AI assistant for summaries and help."
    else:
        answer = f"Echo: {req.prompt}"

    return {"answer": answer}
