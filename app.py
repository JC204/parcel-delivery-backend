import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import random
import string
from models import db, Customer, Courier, Parcel, TrackingUpdate
from dotenv import load_dotenv  # ✅ For .env support
from database import db
from parcels import parcels_bp


load_dotenv()  # ✅ Load environment variables from .env

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",  # Vite local dev
    "https://comforting-syrniki-99725d.netlify.app",  # Your Netlify site
    "https://51ff-2603-3005-2b2c-a680-f8b0-39e7-97d2-4e42.ngrok-free.app"  # Current ngrok URL
])

# ✅ Secure session handling
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-unsafe')

app.register_blueprint(parcels_bp)  #

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///parcel_delivery.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def generate_tracking_number():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

@app.before_request
def before_request():
    db.create_all()

    if not Courier.query.first():
        couriers = [
            Courier(id='CR001', name='John Doe', email='john@example.com', phone='555-0100', vehicle='Van'),
            Courier(id='CR002', name='Jane Smith', email='jane@example.com', phone='555-0200', vehicle='Bike'),
        ]
        db.session.bulk_save_objects(couriers)
        db.session.commit()

    if not Parcel.query.first():
        customers = [
            Customer(name='Alice Johnson', email='alice@example.com', phone='555-1111', address='123 Apple St'),
            Customer(name='Bob Williams', email='bob@example.com', phone='555-2222', address='456 Banana Ave')
        ]
        db.session.bulk_save_objects(customers)
        db.session.commit()

        for i in range(8):
            tracking_number = generate_tracking_number()
            parcel = Parcel(
                tracking_number=tracking_number,
                sender_id=customers[0].id,
                recipient_id=customers[1].id,
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
                TrackingUpdate(parcel_id=tracking_number, status='Dispatched', location='Warehouse A', description='Left the facility'),
                TrackingUpdate(parcel_id=tracking_number, status='In Transit', location='Distribution Center', description='On the way'),
            ]
            db.session.bulk_save_objects(updates)
        db.session.commit()

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
        session['courier_id'] = courier_id  # Store in session
        return jsonify({'message': 'Login successful', 'courier_id': courier_id}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/parcels', methods=['GET'])
def get_all_parcels():
    parcels = Parcel.query.all()
    return jsonify([parcel.to_dict() for parcel in parcels])

@app.route('/parcels/<tracking_number>', methods=['GET'])
def track_parcel(tracking_number):
    parcel = Parcel.query.get(tracking_number)
    if not parcel:
        return jsonify({'error': 'Parcel not found'}), 404
    return jsonify(parcel.to_dict())

@app.route('/parcels', methods=['POST'])
def create_parcel():
    data = request.json
    tracking_number = generate_tracking_number()
    sender = Customer(
        name=data['sender']['name'],
        email=data['sender']['email'],
        phone=data['sender']['phone'],
        address=data['sender']['address']
    )
    recipient = Customer(
        name=data['recipient']['name'],
        email=data['recipient']['email'],
        phone=data['recipient']['phone'],
        address=data['recipient']['address']
    )
    db.session.add(sender)
    db.session.add(recipient)
    db.session.flush()

    couriers = Courier.query.all()
    courier = random.choice(couriers) if couriers else None

    parcel = Parcel(
        tracking_number=tracking_number,
        sender_id=sender.id,
        recipient_id=recipient.id,
        courier_id=courier.id if courier else None,
        weight=data['weight'],
        length=data.get('length'),
        width=data.get('width'),
        height=data.get('height'),
        service_type=data.get('service_type'),
        estimated_delivery=datetime.utcnow() + timedelta(days=3),
        description=data.get('description'),
        status='Created'
    )
    db.session.add(parcel)

    update = TrackingUpdate(
        parcel_id=tracking_number,
        status='Created',
        location='System',
        description='Parcel record created'
    )
    db.session.add(update)
    db.session.commit()

    created_parcel = Parcel.query.get(tracking_number)
    return jsonify(created_parcel.to_dict()), 201

@app.route('/parcels/<tracking_number>/status', methods=['PUT'])
def update_parcel_status(tracking_number):
    parcel = Parcel.query.get(tracking_number)
    if not parcel:
        return jsonify({'error': 'Parcel not found'}), 404

    data = request.json
    parcel.status = data['status']
    update = TrackingUpdate(
        parcel_id=tracking_number,
        status=data['status'],
        location=data.get('location', 'Unknown'),
        description=data.get('description', '')
    )
    db.session.add(update)
    db.session.commit()
    return jsonify({'message': 'Status updated'}), 200

@app.route('/couriers', methods=['GET'])
def get_couriers():
    couriers = Courier.query.all()
    print("Couriers in DB:", couriers)  # Check terminal logs
    return jsonify([courier.to_dict() for courier in couriers])


@app.route('/couriers/<courier_id>/parcels', methods=['GET'])
def get_parcels_for_courier(courier_id):
    parcels = Parcel.query.filter_by(courier_id=courier_id).all()
    return jsonify([parcel.to_dict() for parcel in parcels])

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


@app.route('/demo/add_parcels', methods=['POST'])
def add_demo_parcels():
    customers = Customer.query.all()
    if len(customers) < 2:
        return jsonify({'error': 'Not enough customers to create demo parcels'}), 400

    for i in range(3):
        tracking_number = generate_tracking_number()
        parcel = Parcel(
            tracking_number=tracking_number,
            sender_id=customers[0].id,
            recipient_id=customers[1].id,
            courier_id='CR001' if i % 2 == 0 else 'CR002',
            weight=2.0 + i,
            length=12 + i,
            width=6 + i,
            height=3 + i,
            service_type='Standard',
            estimated_delivery=datetime.utcnow() + timedelta(days=5),
            description=f"Extra demo parcel {i + 1}",
            status='In Transit'
        )
        db.session.add(parcel)
        db.session.flush()
        updates = [
            TrackingUpdate(parcel_id=tracking_number, status='Dispatched', location='Warehouse B', description='Parcel dispatched'),
            TrackingUpdate(parcel_id=tracking_number, status='In Transit', location='On the way', description='Parcel in transit'),
        ]
        db.session.bulk_save_objects(updates)
    db.session.commit()
    return jsonify({'message': 'Demo parcels added'}), 200

if __name__ == '__main__':
    app.run(debug=True)
