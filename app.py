from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Customer, Courier, Parcel, TrackingUpdate
from flask_migrate import Migrate
from faker import Faker
import random, string, datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///parcel_delivery.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app, origins=[
    "https://comforting-syrniki-99725d.netlify.app",  # Netlify frontend
    "http://localhost:5173"                           # Vite dev server
])

migrate = Migrate(app, db)
fake = Faker()
first_request = True

def generate_tracking_number():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

def get_or_create_customer(data):
    return Customer.query.filter_by(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        address=data['address']
    ).first() or Customer(**data)

def create_tracking_update(parcel, status, location='', description=''):
    update = TrackingUpdate(
        parcel_id=parcel.tracking_number,
        status=status,
        location=location,
        description=description
    )
    db.session.add(update)

@app.before_request
def initialize_app():
    global first_request
    if first_request:
        db.create_all()

        # Seed couriers
        if not Courier.query.first():
            db.session.bulk_save_objects([
                Courier(id='CR001', name='John Doe', email='john@example.com', phone='1234567890', vehicle='Van'),
                Courier(id='CR002', name='Jane Smith', email='jane@example.com', phone='0987654321', vehicle='Bike')
            ])
            db.session.commit()

        # Seed parcels
        if not Parcel.query.first():
            for _ in range(10):
                sender = Customer(name=fake.name(), email=fake.email(), phone=fake.phone_number(), address=fake.address())
                recipient = Customer(name=fake.name(), email=fake.email(), phone=fake.phone_number(), address=fake.address())
                tracking_number = generate_tracking_number()
                courier = random.choice(Courier.query.all())
                parcel = Parcel(
                    tracking_number=tracking_number,
                    sender=sender,
                    recipient=recipient,
                    weight=round(random.uniform(0.5, 10.0), 2),
                    length=round(random.uniform(10.0, 100.0), 2),
                    width=round(random.uniform(10.0, 100.0), 2),
                    height=round(random.uniform(5.0, 50.0), 2),
                    service_type=random.choice(['Standard', 'Express']),
                    courier_id=courier.id,
                    estimated_delivery=datetime.datetime.utcnow() + datetime.timedelta(days=3)
                )
                db.session.add_all([sender, recipient, parcel])
                create_tracking_update(parcel, 'Shipped', fake.city(), 'Parcel created')
            db.session.commit()

        print("App initialized with demo data and CORS setup.")
        first_request = False

@app.route('/parcels', methods=['GET'])
def get_all_parcels():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    parcels = Parcel.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'parcels': [p.to_dict() for p in parcels.items],
        'total': parcels.total,
        'pages': parcels.pages,
        'current_page': parcels.page
    })

@app.route('/parcels/<tracking_number>', methods=['GET'])
def get_parcel(tracking_number):
    parcel = Parcel.query.get(tracking_number)
    return jsonify(parcel.to_dict()) if parcel else (jsonify({'error': 'Parcel not found'}), 404)

@app.route('/parcels', methods=['POST'])
def create_parcel():
    data = request.json
    tracking_number = generate_tracking_number()
    sender = get_or_create_customer(data['sender'])
    recipient = get_or_create_customer(data['recipient'])

    if not sender.id: db.session.add(sender)
    if not recipient.id: db.session.add(recipient)
    db.session.commit()

    courier = random.choice(Courier.query.all())
    parcel = Parcel(
        tracking_number=tracking_number,
        sender_id=sender.id,
        recipient_id=recipient.id,
        weight=data.get('weight'),
        length=data.get('length'),
        width=data.get('width'),
        height=data.get('height'),
        service_type=data.get('service_type'),
        courier_id=courier.id,
        estimated_delivery=datetime.datetime.utcnow() + datetime.timedelta(days=3)
    )
    db.session.add(parcel)
    create_tracking_update(parcel, 'Shipped', 'Warehouse', 'Parcel has been shipped')
    db.session.commit()
    return jsonify({'tracking_number': tracking_number}), 201

@app.route('/parcels/<tracking_number>/update', methods=['POST'])
def update_parcel_status(tracking_number):
    parcel = Parcel.query.get(tracking_number)
    if not parcel:
        return jsonify({'error': 'Parcel not found'}), 404
    data = request.json
    create_tracking_update(parcel, data['status'], data.get('location', ''), data.get('description', ''))
    db.session.commit()
    return jsonify({'message': 'Tracking update added'}), 200

@app.route('/couriers', methods=['GET'])
def get_couriers():
    return jsonify([c.to_dict() for c in Courier.query.all()])

@app.route('/couriers/<courier_id>/parcels', methods=['GET'])
def get_parcels_for_courier(courier_id):
    parcels = Parcel.query.filter_by(courier_id=courier_id).all()
    return jsonify([p.to_dict() for p in parcels])

if __name__ == '__main__':
    app.run(debug=True)