------

# ✅ **KheirBox – System Requirements**

## 1. System Overview

KheirBox is a **food donation and redistribution platform** that connects **donors, receivers, volunteers, NGOs, and administrators** to reduce food waste and help communities efficiently and safely.

------

## 2. Actors

- **Donor**
- **Receiver** (Individual / NGO)
- **Volunteer**
- **NGO**
- **Administrator**
- **System (Automated Services)**

------

## 3. Functional Requirements (FR)

### 3.1 User Management

FR1. The system shall allow users to register as **Donor, Receiver, Volunteer, NGO, or Admin**.
FR2. The system shall allow users to log in using email and password.
FR3. The system shall verify NGOs, large donors, and volunteers before activation.
FR4. The system shall allow administrators to approve, reject, or deactivate users.

------

### 3.2 Donation Management

FR5. The system shall allow donors to create food donation listings with food details and expiry date.
FR6. The system shall allow donors to edit or cancel pending donations.
FR7. The system shall support recurring donation scheduling.
FR8. The system shall automatically match donations with nearby verified receivers and volunteers.

------

### 3.3 Volunteer & Delivery Management

FR9. The system shall allow volunteers to browse nearby donation pickups.
FR10. The system shall allow volunteers to accept or decline pickup assignments.
FR11. The system shall track donations in real time during pickup and delivery using GPS.
FR12. The system shall allow receivers to confirm donation receipt.

------

### 3.4 Safety & Quality

FR13. The system shall provide a food safety checklist before pickup.
FR14. The system shall allow users to report unsafe food or misconduct.

------

### 3.5 Communication & Notifications

FR15. The system shall send automatic notifications for donations, pickups, and deliveries.
FR16. The system shall support in-app chat between donors, volunteers, and receivers.

------

### 3.6 Gamification & Impact

FR17. The system shall award points to donors and volunteers for completed donations.
FR18. The system shall display leaderboards by region.
FR19. The system shall display personal impact summaries for users.
FR20. The system shall calculate environmental impact metrics such as CO₂ reduction.

------

### 3.7 Reports & Analytics

FR21. The system shall generate weekly and monthly reports for administrators.
FR22. The system shall allow NGOs to export reports in CSV or PDF format.
FR23. The system shall display analytics dashboards and activity maps.

------

### 3.8 Feedback & Localization

FR24. The system shall collect user feedback and suggestions.
FR25. The system shall support bilingual UI (Arabic and English).

------

# ✅ **KheirBox – Use Case Model**

## UC-1: User Registration

**Actors:** Donor, Receiver, Volunteer, NGO
**Description:** User creates a new account and submits required information.
**Outcome:** Account created (pending approval if required).

------

## UC-2: User Login

**Actors:** All Users
**Description:** User logs in using email and password.
**Outcome:** User accesses role-based dashboard.

------

## UC-3: Approve User Account

**Actor:** Admin
**Description:** Admin reviews and approves or rejects user registrations.
**Outcome:** Account activated or rejected.

------

## UC-4: Create Donation

**Actor:** Donor
**Description:** Donor creates a food donation listing.
**Outcome:** Donation is published and available for matching.

------

## UC-5: Edit / Cancel Donation

**Actor:** Donor
**Description:** Donor modifies or cancels a pending donation.
**Outcome:** Donation updated or removed.

------

## UC-6: Match Donation

**Actor:** System
**Description:** System matches donation with receivers and volunteers.
**Outcome:** Notifications sent to matched users.

------

## UC-7: Accept Pickup

**Actor:** Volunteer
**Description:** Volunteer accepts a pickup and delivery task.
**Outcome:** Delivery process starts.

------

## UC-8: Track Delivery

**Actors:** Volunteer, Receiver, Admin
**Description:** Track donation pickup and delivery in real time.
**Outcome:** Live status updates available.

------

## UC-9: Confirm Receipt

**Actor:** Receiver
**Description:** Receiver confirms donation receipt after delivery.
**Outcome:** Donation marked as completed.

------

## UC-10: Report Safety Issue

**Actors:** Donor, Volunteer, Receiver
**Description:** User reports unsafe food or misconduct.
**Outcome:** Admin notified and issue logged.

------

## UC-11: View Impact & Rewards

**Actors:** Donor, Volunteer
**Description:** User views points, badges, leaderboard rank, and impact summary.
**Outcome:** User motivation and transparency.

------

## UC-12: Generate Reports

**Actors:** Admin, NGO
**Description:** Generate and export donation and activity reports.
**Outcome:** Reports available for analysis.

------

## UC-13: Send Notifications

**Actor:** System
**Description:** System sends notifications for key events.
**Outcome:** Users stay informed.

------

## UC-14: Provide Feedback

**Actors:** All Users
**Description:** Users submit feedback and suggestions.
**Outcome:** Feedback stored for improvement.

------

