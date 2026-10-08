import os

class Settings:
    PROJECT_NAME: str = 'SUDHARSHAN — Dark Web Threat Attribution Engine'
    API_V1_STR: str = '/api/v1'
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'sqlite:///./sudarshan.db')
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'sudarshan_secret_key_ntro_sih_2026')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    CORS_ORIGINS: list[str] = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:8000',
        'http://127.0.0.1:8000'
    ]

settings = Settings()
