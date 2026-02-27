"""
Gestión de contraseñas con bcrypt
"""
import bcrypt


def hash_password(password: str) -> str:
    """
    Genera un hash seguro de la contraseña.
    Usa bcrypt con salt automático.
    
    Nota: bcrypt tiene un límite de 72 bytes, truncamos si es necesario.
    """
    # Convertir a bytes y truncar a 72 bytes (límite de bcrypt)
    password_bytes = password.encode('utf-8')[:72]
    
    # Generar salt y hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contraseña coincide con su hash.
    """
    try:
        password_bytes = plain_password.encode('utf-8')[:72]
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False
