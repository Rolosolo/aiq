# File: api/query/handler.py
import json
import logging
import os
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

import numpy as np
import requests

# --------------------------------------------------------------------------- #
# Logging
# --------------------------------------------------------------------------- #
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# --------------------------------------------------------------------------- #
# Environment variables
# --------------------------------------------------------------------------- #
NEPTUNE_ENDPOINT = os.getenv("NEPTUNE_ENDPOINT")
OPENSEARCH_ENDPOINT = os.getenv("OPENSEARCH_ENDPOINT")

NVIDIA_AIQ_ENDPOINT = os.getenv(
    "NVIDIA_AIQ_ENDPOINT", "https://ai.api.nvidia.com/v1"
)
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
VECTOR_INDEX_NAME = os.getenv("VECTOR_INDEX_NAME", "coralfil-formulations")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nvidia/nv-embedqa-e5-v5")
GENERATION_MODEL = os.getenv(
    "GENERATION_MODEL", "meta/llama3-70b-instruct"
)

# --------------------------------------------------------------------------- #
# NVIDIA AIQ client
# --------------------------------------------------------------------------- #
class NVIDIAAIQClient:
    """NVIDIA AIQ client for RAG retrieval and generation"""

    def __init__(self) -> None:
        self.base_url = NVIDIA_AIQ_ENDPOINT
        self.api_key = NVIDIA_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    # ------------------------------------------------------------------- #
    # Retrieval
    # ------------------------------------------------------------------- #
    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        index_name: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant documents using NVIDIA AIQ vector search."""
        if not self.api_key:
            logger.warning("NVIDIA_API_KEY not configured")
            return []

        try:
            response = requests.post(
                f"{self.base_url}/retrieval/nemo/retrieve",
                headers=self.headers,
                json={
                    "query": {"text": query},
                    "passages": {"top_k": top_k},
                },
                timeout=30,
            )
            if response.status_code != 200:
                logger.error(
                    f"NVIDIA retrieval failed: {response.status_code} - {response.text}"
                )
                return []

            data = response.json()
            retrieval_results = data.get("passages", [])
            logger.info(
                f"Retrieved {len(retrieval_results)} results from NVIDIA AIQ"
            )
            formatted = []
            for r in retrieval_results:
                formatted.append(
                    {
                        "text": r.get("text", ""),
                        "source": r.get("metadata", {}).get("source", "Unknown"),
                        "confidence": r.get("score", 0.0),
                    }
                )
            return formatted

        except requests.exceptions.RequestException as e:
            logger.error(f"NVIDIA AIQ retrieval failed: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error during retrieval: {e}")
            return []

    # ------------------------------------------------------------------- #
    # Generation
    # ------------------------------------------------------------------- #
    def generate(
        self,
        prompt: str,
        context: Optional[List[str]] = None,
        model: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate response using NVIDIA NIM models."""
        if not self.api_key:
            logger.warning("NVIDIA_API_KEY not configured")
            return {"error": "API key not configured"}

        try:
            model = model or GENERATION_MODEL

            # Build enhanced prompt with optional context
            if context:
                context_text = "\n\n".join(
                    [f"[{i+1}] {c}" for i, c in enumerate(context)]
                )
                full_prompt = f"""You are a coral formulation expert. Use the following research context to provide evidence‑based recommendations.

RESEARCH CONTEXT:
{context_text}

QUESTION: {prompt}

Provide a detailed, scientifically‑grounded response citing the context where applicable."""
            else:
                full_prompt = prompt

            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers=self.headers,
                json={
                    "model": model,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert marine biologist specializing in coral restoration and formulation science. Provide accurate, evidence‑based recommendations.",
                        },
                        {"role": "user", "content": full_prompt},
                    ],
                    "temperature": 0.3,
                    "max_tokens": 1024,
                    "stream": False,
                },
                timeout=60,
            )
            if response.status_code != 200:
                logger.error(
                    f"NVIDIA generation failed: {response.status_code} - {response.text}"
                )
                return {"error": f"Generation failed: {response.status_code}"}

            data = response.json()
            generated_text = data["choices"][0]["message"]["content"]
            return {
                "response": generated_text,
                "model": model,
                "usage": data.get("usage", {}),
                "finish_reason": data["choices"][0].get("finish_reason", "stop"),
            }

        except requests.exceptions.RequestException as e:
            logger.error(f"NVIDIA AIQ generation failed: {e}")
            return {"error": str(e)}
        except Exception as e:
            logger.error(f"Unexpected error during generation: {e}")
            return {"error": str(e)}

    # ------------------------------------------------------------------- #
    # Embedding
    # ------------------------------------------------------------------- #
    def get_embedding(
        self, text: str, model: Optional[str] = None
    ) -> Optional[np.ndarray]:
        """Generate embeddings using NVIDIA embedding models."""
        if not self.api_key:
            return None

        try:
            model = model or EMBEDDING_MODEL
            response = requests.post(
                f"{self.base_url}/embeddings",
                headers=self.headers,
                json={"input": [text], "model": model, "encoding_format": "float"},
                timeout=30,
            )
            if response.status_code == 200:
                data = response.json()
                return np.array(data["data"][0]["embedding"])
            else:
                logger.error(
                    f"Embedding generation failed: {response.status_code}"
                )
                return None
        except Exception as e:
            logger.error(f"Embedding generation error: {e}")
            return None


# --------------------------------------------------------------------------- #
# Global client (only created if the API key is present)
# --------------------------------------------------------------------------- #
nvidia_client = NVIDIAAIQClient() if NVIDIA_API_KEY else None

# --------------------------------------------------------------------------- #
# Helper functions – building the rich biological context
# --------------------------------------------------------------------------- #
def build_biological_context(event: Dict) -> str:
    """Construct a human‑readable context string from the incoming payload."""
    species = event.get("species", {})
    environment = event.get("environment", {})
    microbiome = event.get("microbiome", {})
    nearby_species = event.get("nearby_species", [])

    parts: List[str] = []

    # 1️⃣ Target Species
    if species:
        taxonomy = species.get("taxonomy", {})
        parts.append(f"TARGET SPECIES: {species.get('name', 'Unknown')}")
        parts.append(
            f"  Taxonomy: {taxonomy.get('family', 'Unknown')} family, {taxonomy.get('order', 'Unknown')} order"
        )
        if species.get("genotype"):
            parts.append(f"  Genotype: {species['genotype']}")
        if species.get("health_status"):
            parts.append(f"  Health Status: {species['health_status']}")
        if species.get("growth_stage"):
            parts.append(f"  Growth Stage: {species['growth_stage']}")

    # 2️⃣ Environmental Parameters
    if environment:
        parts.append("\nENVIRONMENTAL CONDITIONS:")
        env_items = []
        if environment.get("temperature"):
            env_items.append(f"Temperature: {environment['temperature']}°C")
        if environment.get("salinity"):
            env_items.append(f"Salinity: {environment['salinity']} ppt")
        if environment.get("ph"):
            env_items.append(f"pH: {environment['ph']}")
        if environment.get("dissolved_oxygen"):
            env_items.append(
                f"Dissolved Oxygen: {environment['dissolved_oxygen']} mg/L"
            )
        if environment.get("flow_rate"):
            env_items.append(f"Flow Rate: {environment['flow_rate']} cm/s")
        if environment.get("light_intensity"):
            env_items.append(
                f"Light Intensity: {environment['light_intensity']} μmol/m²/s PAR"
            )
        nutrients = environment.get("nutrient_levels", {})
        if nutrients:
            if nutrients.get("nitrate"):
                env_items.append(f"Nitrate: {nutrients['nitrate']} ppm")
            if nutrients.get("phosphate"):
                env_items.append(f"Phosphate: {nutrients['phosphate']} ppm")
        if env_items:
            parts.append("  " + ", ".join(env_items))

    # 3️⃣ Microbiome
    if microbiome:
        parts.append("\nMICROBIOME ANALYSIS:")
        bacteria = microbiome.get("bacteria_profiles", [])
        if bacteria:
            parts.append("  Bacterial Community Composition:")
            for b in bacteria:
                name = b.get("name", "Unknown")
                ab = b.get("relative_abundance", 0)
                status = b.get("status", "neutral")
                parts.append(f"    - {name}: {ab}% ({status})")

        # Pathogen / beneficial ratio
        vib = microbiome.get("vibrio_count", 0)
        ben = microbiome.get("beneficial_bacteria_count", 0)
        if vib and ben:
            ratio = vib / ben
            parts.append(f"\n  Pathogen/Beneficial Ratio: {ratio:.2f}")
            if ratio > 1.0:
                parts.append(
                    "  ⚠️ HIGH pathogenic load – immediate intervention recommended"
                )
            elif ratio > 0.5:
                parts.append(
                    "  ⚡ Elevated pathogen levels – monitor closely"
                )

        diversity = microbiome.get("diversity_index")
        if diversity is not None:
            parts.append(f"  Diversity Index (Shannon): {diversity:.2f}")
            if diversity < 0.5:
                parts.append("  ⚠️ LOW DIVERSITY – risk of instability")

    # 4️⃣ Nearby Species / Ecosystem Context
    if nearby_species:
        parts.append("\nECOSYSTEM CONTEXT (Nearby Species Interactions):")
        for nb in nearby_species:
            name = nb.get("name", "Unknown")
            interaction = nb.get("interaction_type", "unknown")
            distance = nb.get("distance_cm", 0)
            icon = (
                "🔴"
                if interaction == "competition"
                else "🟢"
                if interaction == "symbiosis"
                else "⚪"
            )
            parts.append(
                f"  {icon} {name}: {interaction.upper()} at {distance} cm"
            )
            # Add a quick note
            if interaction == "competition" and distance < 10:
                parts.append(
                    "     → CRITICAL: Close competition may stress target species"
                )
            elif interaction == "allelopathy":
                parts.append(
                    "     → WARNING: Chemical interference possible"
                )
            elif interaction == "symbiosis":
                parts.append(
                    "     → BENEFICIAL: Positive ecological relationship"
                )

    return "\n".join(parts)


def analyze_microbiome_interventions(microbiome: Dict) -> List[Dict]:
    """Rule‑based quick‑response suggestions based on microbiome data."""
    interventions: List[Dict] = []
    for b in microbiome.get("bacteria_profiles", []):
        name = b.get("name", "")
        abundance = b.get("relative_abundance", 0)
        status = b.get("status", "neutral")

        # 1️⃣ High Vibrio
        if "Vibrio" in name and abundance > 5:
            interventions.append(
                {
                    "type": "chemical_free",
                    "target": "Vibrio suppression",
                    "recommendation": "Consider phage therapy or temperature adjustment (<28 °C)",
                    "priority": "critical",
                    "scientific_basis": "Vibrio coralliilyticus virulence rises above 28 °C",
                }
            )

        # 2️⃣ Pathogenic bacteria >10 %
        if status == "pathogenic" and abundance > 10:
            interventions.append(
                {
                    "type": "probiotic",
                    "target": name,
                    "recommendation": "Increase beneficial bacteria competition (Endozoicomonas augmentation)",
                    "priority": "high",
                    "scientific_basis": "Competitive exclusion reduces pathogen colonization",
                }
            )

        # 3️⃣ Low Endozoicomonas
        if name == "Endozoicomonas" and abundance < 20:
            interventions.append(
                {
                    "type": "probiotic",
                    "target": "Microbiome restoration",
                    "recommendation": "Inoculate with Endozoicomonas culture",
                    "priority": "medium",
                    "scientific_basis": "Endozoicomonas provides antimicrobial protection",
                }
            )

    # 4️⃣ Overall dysbiosis ratio
    vib = microbiome.get("vibrio_count", 0)
    ben = microbiome.get("beneficial_bacteria_count", 0)
    if vib and ben:
        ratio = vib / ben
        if ratio > 1.0:
            interventions.append(
                {
                    "type": "ecosystem",
                    "target": "Microbiome rebalancing",
                    "recommendation": "Immediate probiotic treatment + water‑quality optimization",
                    "priority": "critical",
                    "scientific_basis": f"Pathogen/beneficial ratio of {ratio:.2f} indicates dysbiosis",
                }
            )
    return interventions


def analyze_ecosystem_interactions(nearby_species: List[Dict]) -> List[Dict]:
    """Generate high‑level ecosystem recommendations."""
    recs: List[Dict] = []
    for nb in nearby_species:
        interaction = nb.get("interaction_type", "unknown")
        distance = nb.get("distance_cm", 0)
        name = nb.get("name", "Unknown")

        if interaction == "competition" and distance < 10:
            recs.append(
                {
                    "concern": f"Competition stress from {name}",
                    "action": "Consider physical separation or removal",
                    "priority": "high",
                    "rationale": f"Distance of {distance} cm is below critical threshold (10 cm)",
                }
            )
        elif interaction == "allelopathy":
            recs.append(
                {
                    "concern": f"Chemical interference from {name}",
                    "action": "Increase water flow or relocate specimen",
                    "priority": "medium",
                    "rationale": "Allelopathic compounds may inhibit growth/health",
                }
            )
        elif interaction == "symbiosis":
            recs.append(
                {
                    "concern": None,
                    "action": f"Maintain proximity to {name}",
                    "priority": "low",
                    "rationale": "Positive ecological relationship supports health",
                }
            )
    return recs


# --------------------------------------------------------------------------- #
# Lambda / Vercel entry point
# --------------------------------------------------------------------------- #
def lambda_handler(event: Dict, context: Any) -> Dict:
    """Main entry point – works both as AWS Lambda and Vercel Serverless Function."""
    logger.info(f"Received event: {json.dumps(event)}")

    # ------------------------------------------------------------------- #
    # 1️⃣ Normalise payload (API‑Gateway vs direct invoke)
    # ------------------------------------------------------------------- #
    if "body" in event:
        body = (
            json.loads(event["body"])
            if isinstance(event["body"], str)
            else event["body"]
        )
    else:
        body = event

    # ------------------------------------------------------------------- #
    # 2️⃣ Extract core fields
    # ------------------------------------------------------------------- #
    species_info = body.get("species", {})
    symptom = body.get("symptom", "general_health")
    threat = body.get("threat", "none")
    use_nvidia = body.get("use_nvidia_aiq", True)
    query_type = body.get("query_type", "formulation")

    environment = body.get("environment", {})
    microbiome = body.get("microbiome", {})
    nearby_species = body.get("nearby_species", [])

    # ------------------------------------------------------------------- #
    # 3️⃣ Build the rich biological context string
    # ------------------------------------------------------------------- #
    biological_context = build_biological_context(body)

    # ------------------------------------------------------------------- #
    # 4️⃣ Rule‑based quick interventions (microbiome & ecosystem)
    # ------------------------------------------------------------------- #
    rule_based_interventions = (
        analyze_microbiome_interventions(microbiome) if microbiome else []
    )
    ecosystem_recommendations = (
        analyze_ecosystem_interactions(nearby_species) if nearby_species else []
    )

    # ------------------------------------------------------------------- #
    # 5️⃣ NVIDIA AIQ retrieval (optional)
    # ------------------------------------------------------------------- #
    aiq_query = f"{species_info.get('name', 'coral')} {symptom} {threat} microbiome formulation treatment"
    aiq_results: List[Dict] = []
    if use_nvidia and nvidia_client:
        aiq_results = nvidia_client.retrieve(aiq_query, top_k=5)

    # ------------------------------------------------------------------- #
    # 6️⃣ Structured query to Neptune (graph DB) – optional but kept
    # ------------------------------------------------------------------- #
    interventions: List[Dict] = []
    if NEPTUNE_ENDPOINT:
        try:
            from gremlinpython.driver.client import Client

            client = Client(
                f"wss://{NEPTUNE_ENDPOINT}:8182/gremlin", "g"
            )
            gremlin = f"""
                g.V().hasLabel('Intervention')
                .where(
                    __.out('targets').has('name', '{species_info.get('name', '')}')
                )
                .or(
                    __.out('mitigates').has('name', '{symptom}'),
                    __.out('mitigates').has('name', '{threat}')
                )
                .valueMap(true)
            """
            result = client.submitAsync(gremlin).result().all().result()
            interventions = result
            client.close()
            logger.info(f"Retrieved {len(interventions)} interventions from Neptune")
        except Exception as e:
            logger.error(f"Neptune query failed: {e}")

    # ------------------------------------------------------------------- #
    # 7️⃣ NVIDIA generation (final AI answer)
    # ------------------------------------------------------------------- #
    nvidia_response: Optional[Dict] = None
    if use_nvidia and nvidia_client:
        aiq_prompt = f"""
You are an expert marine biologist and coral formulation specialist. Analyze the following comprehensive biological context and provide evidence‑based recommendations.

{biological_context}

SYMPTOM: {symptom}
THREAT: {threat}
QUERY TYPE: {query_type}

REQUIREMENTS:
1. Analyse the correlation between microbiome status and observed symptoms
2. Consider the impact of nearby species interactions on health
3. Recommend a formulation that addresses the threat while maintaining microbiome balance
4. If Vibrio or pathogenic bacteria levels are high, prioritize non‑antibiotic interventions
5. Account for environmental parameters in dosing recommendations
6. Provide specific actionable steps with scientific justification

Respond in **JSON** with the following keys:
- analysis
- formulation_recipe
- microbiome_strategy
- ecosystem_considerations
- environmental_adjustments
- monitoring_plan
"""
        context_texts = [r["text"] for r in aiq_results] if aiq_results else None
        nvidia_response = nvidia_client.generate(aiq_prompt, context=context_texts)

    # ------------------------------------------------------------------- #
    # 8️⃣ Assemble final response payload
    # ------------------------------------------------------------------- #
    response_body = {
        "request_id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "input_summary": {
            "species": species_info.get("name", "Unknown"),
            "taxonomy": species_info.get("taxonomy", {}),
            "symptom": symptom,
            "threat": threat,
            "microbiome_analyzed": bool(microbiome),
            "nearby_species_count": len(nearby_species),
            "environmental_params_count": len(environment),
        },
        "rule_based_interventions": rule_based_interventions,
        "ecosystem_recommendations": ecosystem_recommendations,
        "structured_interventions": interventions,
        "ai_analysis": nvidia_response,
        "retrieved_references": aiq_results,
        "biological_context_used": biological_context,
        "metadata": {
            "model_used": GENERATION_MODEL,
            "embedding_model": EMBEDDING_MODEL,
            "context_length": len(biological_context),
            "processing_type": "nvidia_aiq_enhanced",
            "results_count": {
                "neptune_interventions": len(interventions),
                "aiq_retrievals": len(aiq_results),
                "rule_based_actions": len(rule_based_interventions),
                "ecosystem_recommendations": len(ecosystem_recommendations),
            },
        },
    }

    return {
        "statusCode": 200,
        "body": json.dumps(response_body, default=str),
    }
