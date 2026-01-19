from httpx import AsyncClient
from logger import logger

MESSAGES_URL = (
    "https://owpublic.blob.core.windows.net/tech-task/messages/current-period"
)

REPORT_URL_PATTERN = "https://owpublic.blob.core.windows.net/tech-task/reports/"


async def fetch_messages(client: AsyncClient):
    response = await client.get(MESSAGES_URL)
    response.raise_for_status()

    logger.debug("Fetched messages data")

    return response.json()


async def fetch_report(report_id: int, client: AsyncClient):
    url = f"{REPORT_URL_PATTERN}{report_id}"
    response = await client.get(url)

    if response.status_code == 404:
        logger.warning(f"Report=[{report_id}] not found")
        return None

    response.raise_for_status()

    logger.debug(f"Fetched report=[{report_id}]")

    return response.json()
