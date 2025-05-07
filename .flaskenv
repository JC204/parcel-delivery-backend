

FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secure-random-secret-key-here
SQLALCHEMY_DATABASE_URI=sqlite:///parcel_delivery.db  # For development. Change for production DB.
SQLALCHEMY_TRACK_MODIFICATIONS=False

# Optional, for ngrok or local development (replace with your actual ngrok URL)
# If you are deploying to production, use your actual backend URL instead.
API_URL="https://4dac-2601-18f-687-72f0-5046-d41c-a640-b17f.ngrok-free.app"  # For ngrok, or use production URL

DEBUG=True  # Change to False for production