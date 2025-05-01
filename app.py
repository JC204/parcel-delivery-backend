from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string

app = Flask(__name__)

# Fully working CORS for production frontend on Netlify
CORS(app, resources={r"/api/*": {"origins": [
    "https://lambent-zuccutto-51a147.netlify.app",
    "https://68092bc8e13a1f00c21b6c83--lambent-zuccutto-51a147.netlify.app"
]}}, supports_credentials=True)

# In-memory storage
parcels = {}
couriers = {
    "john_doe": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "status": "available"
    },
    "jane_smith": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "987-654-3210",
        "status": "available"
    }
}

def generate_tracking_number():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

# Create a new parcel
@app.route('/api/parcels', methods=['POST'])
def create_parcel():
    data = request.json
    tracking_number = generate_tracking_number()
    parcels[tracking_number] = {
        "sender": data.get("sender"),
        "recipient": data.get("recipient"),
        "weight": data.get("weight"),
        "description": data.get("description"),
        "status": "pending",
        "courier": None,
        "history": [{"status": "pending", "note": "Parcel created"}]
    }
    return jsonify({"message": "Parcel created successfully", "tracking_number": tracking_number}), 201

# Track a parcel
@app.route('/api/parcels/track/<tracking_number>', methods=['GET'])
def track_parcel(tracking_number):
    parcel = parcels.get(tracking_number)
    if parcel:
        return jsonify({
            "tracking_number": tracking_number,
            **parcel
        }), 200
    return jsonify({"error": "Parcel not found"}), 404

# Update parcel status
@app.route('/api/parcels/<tracking_number>/update', methods=['POST'])
def update_parcel_status(tracking_number):
    data = request.json
    parcel = parcels.get(tracking_number)
    if parcel:
        status = data.get("status")
        note = data.get("note", "")
        parcel["status"] = status
        parcel["history"].append({"status": status, "note": note})
        return jsonify({"message": "Status updated"}), 200
    return jsonify({"error": "Parcel not found"}), 404

# Assign courier to parcel
@app.route('/api/parcels/<tracking_number>/assign-courier', methods=['POST'])
def assign_courier(tracking_number):
    data = request.json
    courier_id = data.get("courier_id")
    parcel = parcels.get(tracking_number)
    courier = couriers.get(courier_id)
    if parcel and courier:
        if courier["status"] != "available":
            return jsonify({"error": "Courier not available"}), 400
        parcel["courier"] = courier_id
        courier["status"] = "assigned"
        parcel["history"].append({"status": "assigned", "note": f"Assigned to {courier['name']}"})
        return jsonify({"message": "Courier assigned"}), 200
    return jsonify({"error": "Parcel or courier not found"}), 404

# Get list of couriers
@app.route('/api/couriers', methods=['GET'])
def get_couriers():
    return jsonify({"couriers": couriers}), 200

@app.route('/api/parcels/<tracking_number>/unassign-courier', methods=['POST'])
def unassign_courier(tracking_number):
    parcel = parcels.get(tracking_number)
    if parcel and parcel["courier"]:
        courier_id = parcel["courier"]
        courier = couriers.get(courier_id)
        if courier:
            courier["status"] = "available"
        parcel["history"].append({"status": "unassigned", "note": f"Courier {courier_id} unassigned"})
        parcel["courier"] = None
        return jsonify({"message": "Courier unassigned"}), 200
    return jsonify({"error": "Parcel not found or no courier assigned"}), 404

if __name__ == '__main__':
    app.run(debug=True)