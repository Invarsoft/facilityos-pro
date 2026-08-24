# FacilityOS Pro — Executive Platform Documentation

**Enterprise Facility Operations, Multi-Tenant Service Architecture & SLA Engine**

---

## 1. Executive Summary

FacilityOS Pro is a multi-tenant facility operations platform built to digitize, automate, and resolve maintenance workflows across diverse organization types:

- **Higher Education Campuses**: Universities, colleges, hostels, mess halls, academic labs.
- **Healthcare & Hospitals**: Hospitals, clinics, emergency wings, cleanrooms.
- **Corporate & Commercial**: Tech parks, software bays, corporate headquarters, shopping malls.
- **Residential Communities**: Gated apartment complexes, residential towers, clubhouses.

By unifying request creation, specialist technician dispatch, mobile PWA capabilities, and 4-digit OTP resolution verification, FacilityOS eliminates SLA breaches, prevents premature ticket closures, and provides real-time operational visibility.

---

## 2. Platform Architecture & Core Features

### 🏢 1. Multi-Tenant Logical Isolation
- **Tenant Scope**: Complete data isolation for 21+ registered facilities (*WOXSEN University, Manipal Academy, Apollo Hospitals, Green Valley Heights, InvarTech Solutions, etc.*).
- **Custom Facility Codes & Branding**: Auto-generated facility codes (*WOXSEN-2026, APOLLO-2026*) with custom primary/secondary color schemes.

### 🛠️ 2. Dynamic 14 Service Category Matrix
Organizations can dynamically activate or deactivate any of the 14 service categories in real-time:
1. **Plumbing & Sanitary**: Pipe leakages, water taps, flush valves.
2. **Electrical & Power**: MCB trips, lighting, wiring, power sockets.
3. **AC & HVAC Systems**: Chiller maintenance, AC gas refills, filter cleaning.
4. **Elevators & Escalators**: Door sensors, motor maintenance, emergency alarms.
5. **IT Support & Network**: Wi-Fi routers, access points, LAN ports, AV projectors.
6. **Carpentry & Door Locks**: Wooden furniture, door handles, lock replacements.
7. **Civil & Painting**: Plastering, wall dampness, tile repair, touch-ups.
8. **Cleaning & Housekeeping**: Room sanitization, garbage clearance, deep cleaning.
9. **Furniture & Fixtures**: Desk chairs, office tables, hostel beds, curtains.
10. **Hostel & Mess Maintenance**: Common room, laundry equipment, mess appliances.
11. **Transport & EV Charging**: Shuttle buses, parking bay sensors, EV chargers.
12. **Security & Biometrics**: CCTV cameras, RFID barriers, access gates.
13. **Water Supply & Hydro Pumps**: Water tanks, pump valves, overflow sensors.
14. **General Maintenance**: Custom facility tasks and touch-ups.

### 📱 3. Mobile-First Categorized UI & PWA Architecture
- **Responsive Navigation**: Categorized bottom app bar (`Home`, `Facilities`, `+ New Request`, `My Requests`, `Admin/Profile`).
- **Segmented Filter Tabs**: 1-Tap tab filtering (`All`, `Active`, `Action Needed`, `Closed`) on mobile.
- **PWA Capabilities**: Installed as a standalone app on iPhone Safari or Android Chrome.

### 🎯 4. Specialist Dispatch & Match Engine
- **Trade-Accurate Matching**: Matches plumbing tickets to certified plumbers and IT tickets to network specialists.
- **Workload & Rating Ranking**: Ranks technicians based on lowest active job count and highest star rating (4.8+ Stars).
- **1-Click Dispatch**: Managers assign top-ranked specialists in seconds.

### 🔐 5. OTP Verification & Quality Control
- **4-Digit Resolution OTP**: Requester receives a unique 4-digit security PIN upon completion.
- **Strict Closure Sign-Off**: Technician must obtain the PIN from the requester to officially close the ticket.
- **Reopen Guarantee**: Reopened ticket tracking and customer rating feedback loop.

### ⏱️ 6. SLA Hierarchy & Escalations
- **Emergency SLA**: 2 Hours (Fire, short-circuit, major pipe burst).
- **Critical SLA**: 4 Hours (Elevator stuck, server room down).
- **High SLA**: 12-24 Hours (AC chiller, Wi-Fi outage).
- **Normal SLA**: 24-48 Hours (Housekeeping, carpentry).
- **Low SLA**: 72 Hours (Routine touch-ups).

---

## 3. Technical Stack & Deployment

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
- **State Management**: Scoped React Context API.
- **Mobile Native**: PWA Manifest & CapacitorJS (.ipa / .apk) Support.
- **Hosting**: Vercel Global Edge Network & Production Dockerfile.

---

## 4. Live Presentation & Resource Links

- 🌐 **Live Web Application**: [https://facilityos-brown.vercel.app](https://facilityos-brown.vercel.app)
- 🐙 **GitHub Repository**: [https://github.com/Invarsoft/facilityos-pro](https://github.com/Invarsoft/facilityos-pro)
- 📊 **14-Slide PowerPoint Presentation**: [`/Users/trigun/Desktop/FacilityOS_14_Slide_Presentation.pptx`](file:///Users/trigun/Desktop/FacilityOS_14_Slide_Presentation.pptx)
- 📄 **Downloadable PDF Document**: [`/Users/trigun/Desktop/FacilityOS_Executive_Documentation.pdf`](file:///Users/trigun/Desktop/FacilityOS_Executive_Documentation.pdf)
- 📝 **Markdown Documentation**: [`/Users/trigun/Desktop/FacilityOS_Executive_Documentation.md`](file:///Users/trigun/Desktop/FacilityOS_Executive_Documentation.md)
