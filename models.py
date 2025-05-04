from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address
        }

class Courier(db.Model):
    id = db.Column(db.String(10), primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    vehicle = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'vehicle': self.vehicle
        }

class Parcel(db.Model):
    tracking_number = db.Column(db.String(12), primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    courier_id = db.Column(db.String(10), db.ForeignKey('courier.id'))

    weight = db.Column(db.Float, nullable=False)
    length = db.Column(db.Float)
    width = db.Column(db.Float)
    height = db.Column(db.Float)
    service_type = db.Column(db.String(20))
    estimated_delivery = db.Column(db.DateTime)
    description = db.Column(db.String(200))
    status = db.Column(db.String(50), default="Created")

    sender = db.relationship('Customer', foreign_keys=[sender_id])
    recipient = db.relationship('Customer', foreign_keys=[recipient_id])
    courier = db.relationship('Courier', backref='parcels')
    tracking_updates = db.relationship('TrackingUpdate', backref='parcel', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'tracking_number': self.tracking_number,
            'sender': self.sender.to_dict(),
            'recipient': self.recipient.to_dict(),
            'courier_name': self.courier.name if self.courier else None,
            'courier_id': self.courier.id if self.courier else None,
            'weight': self.weight,
            'length': self.length,
            'width': self.width,
            'height': self.height,
            'service_type': self.service_type,
            'estimated_delivery': self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            'description': self.description,
            'status': self.status,
            'tracking_history': [update.to_dict() for update in self.tracking_updates]
        }

class TrackingUpdate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parcel_id = db.Column(db.String(12), db.ForeignKey('parcel.tracking_number'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50))
    location = db.Column(db.String(100))
    description = db.Column(db.String(200))

    def to_dict(self):
        return {
            'timestamp': self.timestamp.isoformat(),
            'status': self.status,
            'location': self.location,
            'description': self.description
        }