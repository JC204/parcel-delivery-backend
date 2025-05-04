from app import app, db, generate_tracking_number
from models import Parcel, TrackingUpdate, Customer
from datetime import datetime, timedelta

with app.app_context():
    # Ensure customers exist, or create them if not
    customer1 = Customer.query.filter_by(name='John Doe').first()
    if not customer1:
        customer1 = Customer(name='John Doe', email='johndoe@example.com')
        db.session.add(customer1)
        db.session.commit()

    customer2 = Customer.query.filter_by(name='Jane Smith').first()
    if not customer2:
        customer2 = Customer(name='Jane Smith', email='janesmith@example.com')
        db.session.add(customer2)
        db.session.commit()

    # Add parcels as before
    for i in range(8):
        tracking_number = generate_tracking_number()
        parcel = Parcel(
            tracking_number=tracking_number,
            sender_id=customer1.id,
            recipient_id=customer2.id,
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
        db.session.flush()  # Flush to ensure the parcel's ID is available

        # Create tracking updates
        tracking_updates = [
    TrackingUpdate(parcel_id=parcel.tracking_number, status='Dispatched', location='Warehouse A', description='Left the facility'),
    TrackingUpdate(parcel_id=parcel.tracking_number, status='In Transit', location='Distribution Center', description='On the way')
    ]  
        db.session.bulk_save_objects(tracking_updates)

    db.session.commit()
    print("8 demo parcels with tracking updates added.")
