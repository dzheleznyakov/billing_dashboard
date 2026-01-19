from fetch import fetch_report
from httpx import AsyncClient


class CacheService:
    def __init__(self, client: AsyncClient):
        self._cache = {}
        self._http_client = client

    async def get_report(self, report_id: int):
        if report_id in self._cache:
            return self._cache[report_id]

        report = await fetch_report(report_id, self._http_client)
        self._cache[report_id] = report
        return report
