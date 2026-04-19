# Cauvery Bhavan Hostel Management Platform

A responsive static hostel management website for Cauvery Bhavan. The project includes student-facing pages for hostel information, facilities, fees, leave applications, location, authentication, and a protected dashboard.

## Features

- Responsive home page with hostel overview and quick statistics
- Room and resident overview page
- Facilities page with local hostel, mess, security, and sports images
- Fee structure table with a fee due calculator
- Leave application form with date validation
- Location page with embedded Google map
- Login and signup flow using browser local storage
- Protected dashboard that opens only after successful login
- Logout support from the dashboard
- Mobile-friendly navigation menu

## Pages

- `index.html` - Home page and platform entry point
- `overview.html` - Hostel capacity and room overview
- `facilities.html` - Study, mess, security, and sports facilities
- `fees.html` - Hostel fee table and calculator
- `leave.html` - Leave request form
- `location.html` - Hostel location and campus access details
- `login.html` - Login and signup
- `dashboard.html` - Logged-in user dashboard

## Assets

Local image assets are stored in `assets/`:

- `hostel-photo.jpg`
- `mess-photo.jpg`
- `security-photo.jpg`
- `sports-ground.jpg`

## How To Run

This is a plain HTML, CSS, and JavaScript project. No build step is required.

Open `index.html` directly in a browser.

For the login flow:

1. Open `login.html`.
2. Click `Sign up`.
3. Create an account with role, name, username, and password.
4. Login with the same role, username, and password.
5. After successful login, the site redirects to `dashboard.html`.

## Authentication Note

This project uses `localStorage` for demo authentication:

- Created accounts are saved in the browser as `hostelAccounts`.
- The active session is saved as `hostelCurrentUser`.
- Dashboard access depends on `hostelCurrentUser`.

This is suitable for a front-end demo, not production security. A real hostel system should use a backend database, password hashing, and server-side sessions or tokens.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Browser `localStorage`

## Project Structure

```text
HOSTEL/
  assets/
  dashboard.html
  facilities.html
  fees.html
  index.html
  leave.html
  location.html
  login.html
  overview.html
  script.js
  style.css
  README.md
```
