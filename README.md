# HolidaZe: Project Exam 2

<img width="1435" height="754" alt="Skjermbilde 2025-09-25 kl  22 47 30" src="https://github.com/user-attachments/assets/e16f653b-1663-41f0-889d-6d8f1a6df9ae" />

# Purpose

The purpose of this project is to demonstrate the skills learned during the two-year Frontend Development program at Noroff. As the final exam, the project reflects my overall development capabilities, technical skills, and focus on building accessible and user-friendly applications.

The brief was to develop a modern front-end for Holidaze, a fictional accommodation booking service, using the official API documentation.

# Description

Holidaze is a responsive and dynamic booking application where users can browse venues, make bookings, and manage their profile. Venue managers have access to create, edit, and manage venues and bookings. The design and UX were up to me, while feature requirements were defined in the brief.

### Key features include:

- View and browse venues
- Search for venues by name
- View a venue page with details, images, price, facilities, and availability
- User registration as customer or venue manager (requires stud.noroff.no email)
- Customers can create bookings, edit existing bookings (dates and people), view upcoming bookings, and update avatar
- Venue managers can create, edit, and delete venues, manage bookings for their venues and view upcoming bookings for their venues
- Authentication with login and logout
- Calendar integration with booked/available dates
- Responsive design and accessibility features (ARIA roles, keyboard navigation, live regions)

### Learning Outcomes:

Through the development of this project, I have demonstrated the following skills:

- Planning, structuring, and implementing a complete React + TypeScript application
- UI Design and Development: Built an intuitive, responsive interface using Tailwind CSS
- API Integration: Authentication, profile management, venues, and bookings via Noroff API
- Form Handling: React Hook Form with Yup validation schemas
- Routing and Navigation: React Router DOM for client-side routing
- State Management: Controlled components and hooks for dynamic UI
- Accessibility: ARIA attributes, semantic HTML, keyboard interaction, screen reader support
- Version Control and Deployment: GitHub for version control, Netlify for deployment
- Error handling and user feedback with alerts, skeleton loaders, and modals

### Client and Target Audience

The fictional client is Holidaze, a booking service targeting both travelers and venue managers.

- Visitors can browse venues.
- Customers can register, log in, make bookings, view and edit bookings, and manage their profile.
- Venue Managers can register, log in, manage and view their venues, bookings, and manage their profile.

# Project Technologies

- React – component-based UI
- TypeScript – typed components and data models
- Vite – development and build tool
- Tailwind CSS – utility-first styling
- react-router-dom – routing and navigation
- react-hook-form – form state management
- @hookform/resolvers/yup – integration between RHF and Yup
- yup – validation schemas
- react-icons – icon library (Font Awesome)
- react-calendar – date range selection
- ESLint & Prettier – linting and formatting
- Netlify – hosting and deployment

# Project Structure:

The site is built as a single-page application with feature-based organization:

- Homepage – Hero section, search, venues list with filtering and sorting
- Authentication – Signup and login pages with validation
- Profile – Avatar update, profile information, upcoming bookings, manager tools
- Venue – Detail page with venue information and availability calendar
- Booking – Sidebar on venue view with date range picker, guest selector, and price calculation
- Shared Components – Alerts, modals, skeleton loaders, pagination, search box

### Development Tools

- Figma – wireframing, prototyping, and design guide
- Visual Studio Code as the primary editor
- GitHub for version control and project management
- Netlify for deployment and live demo

# Getting started

To get the project running on your local machine, follow these steps:

### Clone the repository:

`git clone https://github.com/marned91/Holidaze-PE2`

### Install Dependencies:

`npm install`

### Running the Development Server:

Start the development server with Vite:

`npm run dev`

### Build the project for production:

`npm run build`

### Test Build the project for production:

`npm run preview`

# Linting & formatting
This project uses ESLint and Prettier.

### Check lint issues:

`npm run lint`

### Fix auto-fixable issues:

`npm run lint:fix`

### Format code with Prettier:

`npm run format`



# Deployment

The project is hosted on Netlify for live demo purposes.
You can view the live version [here](https://holidaze-pe2-mn.netlify.app/).

# Contributing

As this project is a final exam submission for my Noroff study, I am not currently accepting external contributions. However, I welcome any feedback or suggestions for improvement. Feel free to create an issue in the repository if you have any thoughts on how to enhance the project.

Thank you for your understanding!

# Contact

[My Linkedin Page](https://www.linkedin.com/in/marte-n-18aab5101/)

# Sources used in project

- Unsplash for all images. Free/unlicensed images only
- Noroff's API documentation: https://docs.noroff.dev/docs/v2/about
- https://fonts.google.com/
- https://logo.com/
- https://tailwindcss.com/docs
- React Router: https://content.noroff.dev/front-end-frameworks/react-router.html
- React Hook Form: https://content.noroff.dev/front-end-frameworks/react-hook-form.html
- Yup validation: https://github.com/jquense/yup
- React Icons: https://react-icons.github.io/react-icons/
- React Calendar: https://github.com/wojtekmaj/react-calendar
- Flowbite Skeleton: https://flowbite.com/docs/components/skeleton/
- Airbnb (design inspiration): https://www.airbnb.no/
- MDN Web Docs: https://developer.mozilla.org/
- Noroff course content: useState, useEffect, TypeScript, API hooks
