def required_fields(data, fields):
    missing = []

    for field in fields:
        value = data.get(field)

        if value is None or str(value).strip() == "":
            missing.append(field)

    return missing


def normalize_company_code(company_code):
    return str(company_code or "").strip().upper()


def normalize_email(email):
    return str(email or "").strip().lower()


def success_response(message, data=None, status=200):
    response = {
        "message": message,
        "success": True,
    }

    if data is not None:
        response["data"] = data

    return response, status


def error_response(message, status=400):
    return {
        "message": message,
        "success": False,
    }, status