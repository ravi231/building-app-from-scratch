import secrets
import string

chars = string.ascii_letters + string.digits
print(''.join(secrets.choice(chars) for _ in range(24)))
