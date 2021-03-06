# Patient
The patient module contains the dedicated API to manage patient personal data in mediscreen.

# Endpoints
The doctor API provides the following URIs :
* GET /patients
* GET /patients/{id}
* PUT /patients/{id}
* POST /patients/add
* POST /patients/random/{expectedNumberOfPatients}
Please refer to specifications for further details.

# Database configuration

## Host name
To provide a flexible database access in production as well as during code maintenance,
the environment variable DATABASE_HOST is used to define where the database is hosted.

## Password encryption
To secure database access the connection password is encrypted with JASYPT 
and the encryption key is hidden in the JASYPT_ENCRYPTOR_PASSWORD environment variable. 
To generate an encrypted password use the following command : 
mvn jasypt:encrypt-value -Djasypt.encryptor.password="Encryption key" 
    -Djasypt.plugin.value="Password to be encrypted"
    