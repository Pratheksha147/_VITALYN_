from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.patient_routes import patient_bp
from routes.vital_routes import vital_bp
from routes.alert_routes import alert_bp
from routes.report_routes import report_bp
from routes.audit_routes import audit_bp

app = Flask(__name__)

app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

# ✅ HOME ROUTE MUST BE ABOVE app.run
@app.route("/")
def home():
    return "Sepsis Monitoring Backend is Running"

# Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(patient_bp, url_prefix="/api/patients")
app.register_blueprint(vital_bp, url_prefix="/api/vitals")
app.register_blueprint(alert_bp, url_prefix="/api/alerts")
app.register_blueprint(report_bp, url_prefix="/api/report")
app.register_blueprint(audit_bp, url_prefix="/api/audit-logs")



if __name__ == "__main__":
    app.run(debug=True)


