module.exports = {
    

    config: {
        "type": process.env.GOOGLE_ACCOUNT_TYPE, 
        "project_id": "corona-aid-271522", 
        "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID, 
        "private_key": "", 
        "client_email": process.env.GOOGLE_CLIENT_EMAIL, 
        "client_id": "101426883593371058189", 
        "auth_uri": "https://accounts.google.com/o/oauth2/auth", 
        "token_uri": "https://oauth2.googleapis.com/token", 
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", 
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/edit-google-sheets%40corona-aid-271522.iam.gserviceaccount.com"
    }
};