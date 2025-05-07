

FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secure-random-secret-key-here
SQLALCHEMY_DATABASE_URI=sqlite:///parcel_delivery.db  # For development. Change for production DB.
SQLALCHEMY_TRACK_MODIFICATIONS=False

# Optional, for ngrok or local development (replace with your actual ngrok URL)
# If you are deploying to production, use your actual backend URL instead.
API_URL="https://51ff-2603-3005-2b2c-a680-f8b0-39e7-97d2-4e42.ngrok-free.app"  # For ngrok, or use production URL

DEBUG=True  # Change to False for production