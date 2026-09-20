def check_persistence(vitals):
    if len(vitals) < 2:
        return False

    return (
        vitals[0]["respiratory_rate"] >= 22 and
        vitals[1]["respiratory_rate"] >= 22
    )
