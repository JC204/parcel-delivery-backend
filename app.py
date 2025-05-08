import os
import random
import string
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, session

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Optional, avoids HTTPS errors in dev


# Initialize Flask app
app = Flask(__name__)

# CORS setup (add or adjust domains as needed)
from flask_cors import CORS

CORS(app, supports_credentials=True, resources={r"/*": {"origins": [
    "http://localhost:5173",
    "https://comforting-syrniki-99725d.netlify.app",
    "https://parcel-delivery-frontend.netlify.app"
]}}, methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# App config
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-unsafe')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///parcel_delivery.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Optional: Make cookies secure (for HTTPS deployment)
app.config['SESSION_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'

# Initialize DB and migration
from database import db
db.init_app(app)
migrate = Migrate(app, db)

# Import models
from models import Customer, Courier, Parcel, TrackingUpdate

# Logging
logging.basicConfig(level=logging.INFO)

@app.route("/")
def index():
    return "Backend is running!", 200


def generate_tracking_number():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))


def setup_demo_data():
    if Courier.query.first():
        logging.info("Demo data already exists. Skipping setup.")
        return

    logging.warning("Using hardcoded credentials. Do not use in production.")
    logging.info("Setting up demo data...")
    
    couriers = [
        Courier(id='CR001', name='John Doe', email='john@example.com', phone='555-0100', vehicle='Van'),
        Courier(id='CR002', name='Jane Smith', email='jane@example.com', phone='555-0200', vehicle='Bike'),
    ]
    db.session.bulk_save_objects(couriers)

    customers = [
        Customer(name='Alice Johnson', email='alice@example.com', phone='555-1111', address='123 Apple St'),
        Customer(name='Bob Williams', email='bob@example.com', phone='555-2222', address='456 Banana Ave')
    ]
    db.session.add_all(customers)
    db.session.commit()

    for i in range(20):
        tracking_number = generate_tracking_number()
        sender = customers[i % len(customers)]
        recipient = customers[(i + 1) % len(customers)]
        parcel = Parcel(
            tracking_number=tracking_number,
            sender_id=sender.id,
            recipient_id=recipient.id,
            courier_id='CR001' if i % 2 == 0 else 'CR002',
            weight=1.5 + i,
            length=10 + i,
            width=5 + i,
            height=2 + i,
            service_type='Express',
            estimated_delivery=datetime.utcnow() + timedelta(days=3),
            description=f"Demo parcel {i + 1}",
            status='In Transit'
        )
        db.session.add(parcel)
        db.session.flush()

        updates = [
            TrackingUpdate(parcel_id=parcel.id, status='Dispatched', location='Warehouse A', description='Left the facility'),
            TrackingUpdate(parcel_id=parcel.id, status='In Transit', location='Distribution Center', description='On the way'),
        ]
        db.session.bulk_save_objects(updates)

    db.session.commit()
    logging.info("Demo data setup complete.")


@app.route('/init-demo', methods=['GET'])
def run_demo_data_setup():
    if os.getenv("ENV") == "production":
        return jsonify({'error': 'Disabled in production'}), 403
    with app.app_context():
        db.create_all()  # Ensures tables exist before adding data
        setup_demo_data()
    return jsonify({'message': 'Demo data triggered manually'}), 200



@app.route('/couriers', methods=['GET'])
def get_all_couriers():
    couriers = Courier.query.all()
    return jsonify([c.to_dict() for c in couriers]), 200


@app.route('/couriers/login', methods=['POST'])
def courier_login():
    data = request.json
    courier_id = data.get('courier_id')
    password = data.get('password')

    valid_credentials = {
        'CR001': 'john123',
        'CR002': 'jane123'
    }

    if valid_credentials.get(courier_id) == password:
        session['courier_id'] = courier_id
        return jsonify({'message': 'Login successful', 'courier_id': courier_id}), 200

    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/couriers/<courier_id>/parcels', methods=['GET'])
def get_parcels_by_courier(courier_id):
    parcels = Parcel.query.filter_by(courier_id=courier_id).all()
    return jsonify([p.to_dict() for p in parcels]), 200


@app.route('/couriers/me', methods=['GET'])
def get_logged_in_courier():
    courier_id = session.get('courier_id')
    if not courier_id:
        return jsonify({'error': 'Not logged in'}), 401
    courier = Courier.query.get(courier_id)
    return jsonify(courier.to_dict()) if courier else jsonify({'error': 'Courier not found'}), 404


@app.route('/couriers/logout', methods=['POST'])
def courier_logout():
    session.pop('courier_id', None)
    return jsonify({'message': 'Logged out'}), 200


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200



# Run the app for local development only
if __name__ == '__main__':
    with app.app_context():
        # For development use only: avoid this in production
        db.create_all()
        setup_demo_data()
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)))
