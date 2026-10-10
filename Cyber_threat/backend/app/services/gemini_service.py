import os
import json
import logging
import google.generativeai as genai
from typing import Dict, Any

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using the recommended model for text processing
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    model = None

def analyze_stylometry(text_a: str, text_b: str) -> Dict[str, Any]:
    """
    Uses Gemini API to perform stylometric analysis on two pieces of text to 
    determine if they were written by the same threat actor.
    Falls back to mock data if no API key is provided (for Hackathon Demo).
    """
    if not text_a or not text_b:
        return {"error": "Both texts must be provided."}
        
    if not model:
        logger.warning("No Gemini API key found. Returning realistic mock stylometry data.")
        return _get_mock_stylometry_data(text_a, text_b)

    prompt = f"""
    You are an expert cyber intelligence analyst specializing in forensic stylometry and linguistic fingerprinting.
    I am providing you with two posts scraped from underground dark web forums. 
    Analyze the linguistic style, vocabulary, slang, sentence structure, punctuation habits, and formatting of both texts.
    
    Text 1:
    "{text_a}"
    
    Text 2:
    "{text_b}"
    
    Determine the likelihood that these two texts were written by the SAME person.
    Return ONLY a raw JSON object with the following exact keys (no markdown formatting, no backticks):
    {{
        "confidence_score": 85,
        "match_level": "High",
        "analysis_summary": "A 2-3 sentence explanation of the specific linguistic markers (e.g. unique slang, identical typos) that led to this conclusion."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown backticks if Gemini includes them
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        result = json.loads(response_text.strip())
        result["is_mock"] = False
        return result
        
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return _get_mock_stylometry_data(text_a, text_b)

def _get_mock_stylometry_data(text_a: str, text_b: str) -> Dict[str, Any]:
    """
    Provides a highly realistic mock AI response for the SIH presentation.
    """
    # Simple heuristic to make the mock feel dynamic
    if "Shadow99" in text_a or "Shadow99" in text_b:
        return {
            "confidence_score": 92,
            "match_level": "Critical Match",
            "analysis_summary": "Both texts exhibit identical syntactic patterns, specifically the unusual capitalization of 'ONLY' and identical paragraph spacing. The use of specific threat-actor vocabulary indicates a 92% probability of same authorship.",
            "is_mock": True
        }
    else:
        return {
            "confidence_score": 88,
            "match_level": "High Match",
            "analysis_summary": "Linguistic fingerprinting reveals strong correlations in sentence structure and punctuation habits. Both actors use similar underground slang and identical contact format styles.",
            "is_mock": True
        }
