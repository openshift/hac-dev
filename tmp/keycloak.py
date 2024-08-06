import requests
import click
import json
import sys
import base64

TOKEN_ENDPOINT = "realms/redhat-external/protocol/openid-connect/token"
USER_ENDPOINT = "admin/realms/redhat-external/users"
SIGNUP_ENDPOINT = "api/v1/signup"

@click.command(context_settings=dict(help_option_names=["-h", "--help"]))
@click.argument("kc", type=str, required=True)
@click.argument("admin", type=str, required=True)
@click.argument("password", type=str, required=True)
@click.argument("user", type=str, required=True)
@click.argument("secret", type=str, required=True)
@click.argument("register", type=str, required=True)
@click.option("--verify/--no-verify", default=True, required=True)
def main(kc, admin, password, user, secret, register, verify):
    tokenUrl = f"{kc}{TOKEN_ENDPOINT}"
    userUrl = f"{kc}{USER_ENDPOINT}"
    registerUrl = f"{register}{SIGNUP_ENDPOINT}"
    params = {
        "grant_type": "password",
        "username": admin,
        "password": password,
        "scope": "openid",
        "client_id": "admin-cli",
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    if not verify:
        print("WARN: Verification of certificates is turned off.")
    
    session = requests.Session()
    session.verify=verify
    
    r = session.post(tokenUrl, data=params, headers=headers)
    access_token = r.json()["access_token"]

    headers["Content-Type"] = "application/json"
    headers["Authorization"] = f"Bearer {access_token}"

    decodedUser = secret_to_string(user)
    decodedPassword = secret_to_string(secret)

    user = {
        "enabled": "true",
        "username": decodedUser,
        "firstName": "Ephemeral",
        "lastName": "Environment",
        "email":  f"{decodedUser}@redhat.com",
        "attributes": {
            "firstName": "Ephemeral",
            "lastName": "Environment",
            "AccountID": "12345",
            "AccountNumber": 12345,
            "OrgID": "12345",
            "IsInternal": "false",
            "IsOrgAdmin": "true",
            "IsActive": "true",
            "entitlements": "{\"insights\": {\"is_entitled\": true, \"is_trial\": false}}"
        },
        "credentials": [
            {
                "type": "password", 
                "value": decodedPassword,
            }
        ],
        "realmRoles": [
            "default-roles-redhat-external"
        ],
    }
    resp = session.post(userUrl, headers=headers, json=user)
    if resp.status_code == 201:
        print(f"User created: request succeeded with {resp.status_code}")
    else:
        print(f"Request failed with {resp.status_code}")
        print(resp.text)

    new_user_params = {
        "grant_type": "password",
        "username": decodedUser,
        "password": decodedPassword,
        "scope": "openid",
        "client_id": "admin-cli",
    }
    user_header = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    new_user = session.post(tokenUrl, data=new_user_params, headers=user_header)
    user_bearer = new_user.json()["access_token"]

    headers["Authorization"] = f"Bearer {user_bearer}"

    reg = session.post(registerUrl, headers=headers)
    if reg.status_code == 202:
        print(f"User registered: request succeeded with {reg.status_code}")
    else:
        print(f"Registration failed with {reg.status_code}")
        print(reg.text)


def secret_to_string(secret):
    # Decodes from base64 to byte then from byte to UTF 8 string
    return base64.b64decode(secret).decode("UTF-8")

if __name__ == "__main__":
    main()