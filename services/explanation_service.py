def generate_explanation(qsofa, trend, persistent):
    reasons = []

    if qsofa >= 2:
        reasons.append("qSOFA score reached high-risk threshold")

    if trend == "worsening":
        reasons.append("vital signs show worsening trend")

    if persistent:
        reasons.append("abnormal values persisted across readings")

    return ", ".join(reasons) if reasons else "Patient vitals within normal range"
