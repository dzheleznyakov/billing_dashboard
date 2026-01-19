from fastapi.testclient import TestClient
from pytest_httpx import HTTPXMock

from app import app
from fetch import MESSAGES_URL, REPORT_URL_PATTERN


def test_usage_happy_path(httpx_mock: HTTPXMock):
    # Arrange
    message_id = 1000
    report_id = 42
    timestamp = "2024-04-29T02:08:29.375Z"
    credit_cost = 100
    report_name = "Test report name"
    expected_credit_used = 100.0

    httpx_mock.add_response(
        url=MESSAGES_URL,
        json={
            "messages": [
                {
                    "text": "Message text",
                    "timestamp": timestamp,
                    "report_id": report_id,
                    "id": message_id,
                }
            ]
        },
        status_code=200,
    )

    httpx_mock.add_response(
        url=f"{REPORT_URL_PATTERN}{report_id}",
        json={
            "id": report_id,
            "name": report_name,
            "credit_cost": credit_cost,
        },
        status_code=200,
    )

    # Act
    with TestClient(app) as client:
        response = client.get("/usage")

        # Assert
        assert response.status_code == 200
        assert response.json() == {
            "usage": [
                {
                    "message_id": message_id,
                    "timestamp": timestamp,
                    "report_name": report_name,
                    "credits_used": expected_credit_used,
                }
            ]
        }


def test_missing_report_id_falls_back_to_credit_by_text(httpx_mock: HTTPXMock):
    # Arrange
    message_id = 1000
    timestamp = "2024-04-29T02:08:29.375Z"
    expected_credit_used = 1.0

    httpx_mock.add_response(
        url=MESSAGES_URL,
        json={
            "messages": [
                {
                    "text": "t",
                    "timestamp": timestamp,
                    "id": message_id,
                }
            ]
        },
        status_code=200,
    )

    # Act
    with TestClient(app) as client:
        response = client.get("/usage")

        # Assert
        assert response.status_code == 200
        assert response.json() == {
            "usage": [
                {
                    "message_id": message_id,
                    "timestamp": timestamp,
                    "credits_used": expected_credit_used,
                }
            ]
        }


def test_invalid_report_id_falls_back_to_credit_by_text(httpx_mock: HTTPXMock):
    # Arrange
    message_id = 1000
    timestamp = "2024-04-29T02:08:29.375Z"
    expected_credit_used = 1.0

    httpx_mock.add_response(
        url=MESSAGES_URL,
        json={
            "messages": [
                {
                    "text": "t",
                    "timestamp": timestamp,
                    "report_id": "report_id",
                    "id": message_id,
                }
            ]
        },
        status_code=200,
    )

    # Act
    with TestClient(app) as client:
        response = client.get("/usage")

        # Assert
        assert response.status_code == 200
        assert response.json() == {
            "usage": [
                {
                    "message_id": message_id,
                    "timestamp": timestamp,
                    "credits_used": expected_credit_used,
                }
            ]
        }


def test_report_call_returns_404_falls_back_to_credit_by_text(httpx_mock: HTTPXMock):
    # Arrange
    message_id = 1000
    report_id = 42
    timestamp = "2024-04-29T02:08:29.375Z"
    expected_credit_used = 1.0

    httpx_mock.add_response(
        url=MESSAGES_URL,
        json={
            "messages": [
                {
                    "text": "t",
                    "timestamp": timestamp,
                    "report_id": report_id,
                    "id": message_id,
                }
            ]
        },
        status_code=200,
    )

    httpx_mock.add_response(url=f"{REPORT_URL_PATTERN}{report_id}", status_code=404)

    # Act
    with TestClient(app) as client:
        response = client.get("/usage")

        # Assert
        assert response.status_code == 200
        assert response.json() == {
            "usage": [
                {
                    "message_id": message_id,
                    "timestamp": timestamp,
                    "credits_used": expected_credit_used,
                }
            ]
        }
