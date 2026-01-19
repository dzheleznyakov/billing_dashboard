from fastapi import Request
from fastapi.responses import JSONResponse
import math

from app import app
from cache import CacheService
from fetch import fetch_messages
from logger import logger


BASE_MODEL_RATE = 40


@app.get("/usage")
async def get_usage(request: Request):
    try:
        usage = await try_get_usage(request)
        return JSONResponse(content={"usage": usage})
    except Exception as ex:
        logger.error(ex)
        return JSONResponse(
            status_code=503,
            content={
                "error": {
                    "message": "Unexpected error while fetching usage. Try again later."
                }
            },
        )


async def try_get_usage(request: Request):
    data = await fetch_messages(request.app.state.http_client)

    messages = data.get("messages", [])
    if messages is None:
        logger.debug("No messages were fetched")
        return []

    usage = []
    for message in messages:
        usage.append(await build_usage_item(message, request.app.state.cache_service))

    return usage


async def build_usage_item(message: map, cache_service: CacheService):
    report_id = message.get("report_id")

    if report_id is None:
        report = None
    elif isinstance(report_id, int):
        report = await cache_service.get_report(report_id)
    else:
        logger.warning(
            f"Invalid report_id format: [{report_id}], type=[{type(report_id)}]"
        )
        report = None

    usage_item = {
        "message_id": message["id"],
        "timestamp": message["timestamp"],
        "credits_used": get_credit_used(report, message),
    }
    if report is not None:
        usage_item["report_name"] = report["name"]

    return usage_item


def get_credit_used(report: map, message: map):
    if report is not None:
        return float(report["credit_cost"])

    tokens = math.ceil(
        len(message["text"]) / 4
    )  # Rounding up since tokens are discrete units
    cost = tokens / 100 * BASE_MODEL_RATE
    return max(1.0, math.ceil(cost * 100) / 100)
