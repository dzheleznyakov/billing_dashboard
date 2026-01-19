from main import get_credit_used


def test_takes_credit_from_report_when_report_is_present():
    # Arrange
    expected_cost = 100.0
    message = {"text": "t"}
    report = {"credit_cost": 100}

    # Act
    actual_cost = get_credit_used(report=report, message=message)

    # Assert
    assert expected_cost == actual_cost


def test_calculates_credit_from_text_message_when_report_is_absent():
    # Arrange
    expected_cost = 1.6
    message = {"text": "0123456789ABCDEF"}

    # Act
    actual_cost = get_credit_used(report=None, message=message)

    # Assert
    assert expected_cost == actual_cost


def test_min_cost_is_1():
    # Arrange
    expected_cost = 1.0
    message = {"text": "t"}

    # Act
    actual_cost = get_credit_used(report=None, message=message)

    # Assert
    assert expected_cost == actual_cost
