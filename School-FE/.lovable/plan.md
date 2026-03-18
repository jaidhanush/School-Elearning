

# School Enrollment Management System

## Overview
A complete, modern School Enrollment Management System with a professional university-style design in a Blue/Indigo theme. All API services will be built with Axios pointing to `localhost:8080/api`, with mock data powering the UI so everything works in preview. When your backend is ready, you just swap out the mock layer.

---

## 1. Authentication System
- **Login page** with email/password form, styled with university branding
- **Register page** with role selection (Student/Teacher)
- **Auth Context** storing JWT token in localStorage, providing user info & role
- **Axios interceptor** that attaches the Bearer token to all requests
- **Protected routes** that redirect unauthenticated users to login
- **Role-based route guards** (Admin, Teacher, Student see only their allowed pages)
- Mock login supports 3 demo accounts (one per role)

## 2. Layout & Navigation
- **Collapsible sidebar** with role-based menu items and icons
- **Top navbar** with app title, profile dropdown (name, role, avatar), and logout button
- **Responsive design** — sidebar collapses to icon-only on smaller screens
- Blue/Indigo color theme applied globally

### Sidebar Menus by Role
- **Admin:** Dashboard, Students, Teachers, Courses, Departments, Enrollments
- **Teacher:** My Courses, Roster, Grades, Attendance
- **Student:** My Profile, Available Courses, My Enrollments

## 3. Admin Dashboard
- Summary cards showing Total Students, Teachers, Courses, and Enrollments
- Clean card layout with icons and counts
- Quick-action links to manage each entity

## 4. Students Module
- **List page** with search bar, pagination, and a reusable table component
- **Details page** showing student profile info and enrollment history
- **Edit page** with a form to update student information

## 5. Courses Module
- **List page** displaying all courses with search/filter
- **Create/Edit form** in a modal or dedicated page
- **Capacity progress bar** showing enrolled vs. max capacity
- Display assigned teacher name

## 6. Enrollments Module
- **Student view:** "Enroll" button on available courses, list of current enrollments with status
- **Admin/Teacher view:** Pending enrollments list with Approve/Reject actions via modal confirmation
- Status badges (Pending, Approved, Rejected)

## 7. Teachers, Departments & Other Pages
- **Teachers list** (Admin view) with search and details
- **Departments list** (Admin view)
- **Teacher pages:** My Courses list, Student Roster per course, Grades entry, Attendance tracking
- **Student pages:** Profile view/edit, My Enrollments list

## 8. Shared Components & Architecture
- **Reusable Table** component with sorting, pagination, and search
- **Reusable Modal** component for forms and confirmations
- **Loading spinner** for async states
- **Toast notifications** (using Sonner) for success/error feedback
- Clean folder structure: `components/`, `pages/`, `layouts/`, `services/`, `context/`, `routes/`
- All API service files organized per module with Axios, ready to connect to your real backend

## 9. Design & UX
- Professional Blue/Indigo university theme
- Fully responsive across desktop, tablet, and mobile
- Consistent spacing, typography, and component styling
- Smooth transitions on sidebar collapse and page navigation

