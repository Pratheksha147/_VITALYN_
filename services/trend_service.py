def analyze_trend(vitals):
    if len(vitals) < 2:
        return "stable"

    latest = vitals[0]
    previous = vitals[1]

    if latest["respiratory_rate"] > previous["respiratory_rate"] \
       or latest["systolic_bp"] < previous["systolic_bp"]:
        return "worsening"

    return "stable"
