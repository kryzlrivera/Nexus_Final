# Nexus Laravel Backend

This folder contains the Laravel backend for the Nexus social app. It is configured to use MySQL as the database driver.

## Setup

If the backend folder does not yet contain the full Laravel application skeleton, you can initialize a fresh Laravel application in a separate temporary directory and then merge the files from this scaffold.

For example:

```bash
composer create-project laravel/laravel temp-backend --prefer-dist
```

Then copy the `app/`, `database/`, `routes/`, `config/cors.php`, `.env.example`, and `composer.json` files from this scaffold into the new Laravel app.

After the Laravel skeleton is in place, perform the standard setup:

1. Copy `.env.example` to `.env`.
2. Update MySQL settings in `.env`:
   - `DB_DATABASE`
   - `DB_USERNAME`
   - `DB_PASSWORD`
3. Run:
   - `composer install`
   - `php artisan key:generate`
   - `php artisan migrate --seed`
4. Start the server:
   - `php artisan serve`

## React Frontend

The React SPA is now integrated into Laravel under `backend/resources/js/`.

Run the frontend from the `backend` folder with:

1. `npm install`
2. `npm run dev`

By default the React app connects to the Laravel API at `http://127.0.0.1:8000/api`.

## API Endpoints

- `POST /api/register` - register a new user
- `POST /api/login` - login and receive an API token
- `POST /api/logout` - logout and invalidate the token
- `GET /api/users` - list users for the React frontend
- `GET /api/posts` - list posts
- `POST /api/posts` - create a post
- `POST /api/posts/{post}/toggle-like` - like or unlike a post
- `POST /api/posts/{post}/comment` - add a comment
- `POST /api/posts/{post}/toggle-save` - save or unsave a post
- `GET /api/stories` - list stories
- `POST /api/stories` - create a story
- `GET /api/profiles/{username}` - get profile data
- `PUT /api/profiles/{username}` - update a profile
- `POST /api/profiles/{username}/follow` - follow or unfollow a user

## Notes

- Authentication is delivered using a simple bearer token stored on the `users` table.
- The backend uses MySQL by default and expects a `nexus` database.
