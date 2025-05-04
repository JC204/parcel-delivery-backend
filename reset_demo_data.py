from app import app, db
from models import Customer, Courier, Parcel, TrackingUpdate
from datetime import datetime, timedelta
import random

with app.app_context():
    # Clear old data
    TrackingUpdate.query.delete()
    Parcel.query.delete()
    Customer.query.delete()
    Courier.query.delete()
    db.session.commit()

    # Create couriers with vehicle types
    courier1 = Courier(id="C001", name="John Doe", vehicle_type="Bike")
    courier2 = Courier(id="C002", name="Jane Smith", vehicle_type="Van")
    db.session.add_all([courier1, courier2])
    db.session.commit()

    # Fake data pools
    first_names = ["Alex", "Jamie", "Morgan", "Taylor", "Jordan", "Casey", "Reese", "Avery"]
    last_names = ["Carter", "Parker", "Lee", "Nguyen", "Patel", "Khan", "Garcia", "Diaz"]
    descriptions = ["Books", "Clothing", "Electronics", "Shoes", "Toys", "Laptop", "Camera", "Snacks"]
    statuses = ["Created", "Dispatched", "In Transit", "Delivered"]

    def random_name():
        return f"{random.choice(first_names)} {random.choice(last_names)}"

    for i in range(8):
        sender = Customer(name=random_name())
        recipient = Customer(name=random_name())
        db.session.add_all([sender, recipient])
        db.session.flush()  # Gets IDs

        courier = courier1 if i % 2 == 0 else courier2
        tracking_id = f"T{1000 + i}"
        weight = round(random.uniform(1.0, 10.0), 2)
        description = descriptions[i % len(descriptions)]

        parcel = Parcel(
            tracking_id=tracking_id,
            sender_id=sender.id,
            recipient_id=recipient.id,
            courier_id=courier.id,
            weight=weight,
            description=description,
            status="Delivered"
        )
        db.session.add(parcel)
        db.session.flush()  # Gets parcel.id for updates

        now = datetime.utcnow()
        updates = [
            TrackingUpdate(
                parcel_id=parcel.id,
                status=status,
                timestamp=now - timedelta(days=(3 - j)),
                notes=f"{status} update for parcel {tracking_id}"
            )
            for j, status in enumerate(statuses)
        ]
        db.session.add_all(updates)

    db.session.commit()
    print("✅ Demo data reset: 2 couriers (with vehicle types), 8 parcels with full tracking history.")