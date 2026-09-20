def determine_stage(qsofa, trend, persistent):
    if qsofa >= 2 and persistent:
        return "critical"
    if trend == "worsening":
        return "escalating"
    return "stable"
