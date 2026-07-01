import time


def generate_tenant_id(company_code):
    return f"TNT-{company_code.upper()}-{int(time.time())}"


def generate_number(prefix):
    return f"{prefix}-{int(time.time() * 1000)}"