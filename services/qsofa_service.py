def calculate_qsofa(vital):
    score = 0
    if vital["respiratory_rate"] >= 22:
        score += 1
    if vital["systolic_bp"] <= 100:
        score += 1
    if vital["mental_status"] == "altered":
        score += 1
    return score
