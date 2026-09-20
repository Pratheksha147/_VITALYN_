from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import create_user, get_user_by_email

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    hashed = generate_password_hash(data["password"])
    create_user(data["full_name"], data["email"], hashed)
    return jsonify({"message": "Registered"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = get_user_by_email(data["email"])

    if not user or not check_password_hash(user["password_hash"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"user_id": user["user_id"], "full_name": user["full_name"]})
