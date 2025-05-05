from flask import Blueprint, jsonify
from models import Parcel  # adjust import based on your project
from database import db  # your SQLAlchemy instance

parcels_bp = Blueprint('parcels', __name__)

@parcels_bp.route('/parcels/track/<string:tracking_number>', methods=['GET'])
def track_parcel(tracking_number):
    parcel = Parcel.query.filter_by(tracking_number=tracking_number).first()
    if parcel is None:
        return jsonify({'error': 'Parcel not found'}), 404

    return jsonify(parcel.serialize())  # assuming you have a .serialize() method
