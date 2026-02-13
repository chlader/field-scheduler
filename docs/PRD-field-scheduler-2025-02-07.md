# Product Requirements Document: Field Scheduler

**Document Version:** 1.0
**Created:** February 7, 2025
**Status:** Draft
**Project Type:** Passion Project

---

## Executive Summary

Field Scheduler is a web application that enables municipalities and sports leagues to manage their field inventory and allows external users (coaches, leagues, organizers, families) to self-service book fields for games, practices, or tournaments. The platform addresses the current pain points of phone-based booking systems by providing a single source of truth for field availability and a seamless peer-to-peer booking experience.

---

## 1. Background

### 1.1 Context

Currently, municipalities and sports leagues manage field bookings through manual processes, typically requiring users to call a hotline and speak with a staff member to reserve a field. This approach creates several challenges:

- No centralized, real-time view of field availability
- Inconsistent information between what staff members communicate and actual availability
- High friction for users who must work within hotline hours and wait times
- Administrative burden on staff to manually track and coordinate bookings

### 1.2 Strategy

The opportunity exists to create a focused, streamlined booking platform that prioritizes ease of use and data accuracy. While platforms like TeamSideline exist, they bundle booking with full league management features, creating complexity that may not be needed by organizations primarily seeking better scheduling tools.

### 1.3 Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| Municipalities / Parks Departments | Efficient field utilization, reduced administrative overhead, improved constituent satisfaction |
| Sports Leagues | Easy access to fields for scheduled activities, reliable booking confirmation |
| Coaches / Organizers | Quick, self-service booking without phone calls or delays |
| Families | Ability to rent fields for events with clear availability and pricing |
| Park Directors / Admins | Tools to manage inventory, handle exceptions, maintain control over field usage |

### 1.4 Current Scope

| Scope Type | Description |
|-----------------|-------------|
| Platform | Web-only for MVP and near-term releases |
| Timeline | No fixed deadline; passion project with flexible pacing |
| Business Reason | Focused on booking/scheduling only; not a full league management platform |

---

## 2. Data Observations

### 2.1 Qualitative Insights

- Phone-based booking is cumbersome for users and creates bottlenecks
- Single source of truth is often lacking, leading to scheduling conflicts and confusion
- Parents, players, and sports leagues desire better organization and clarity around field availability
- Existing solutions (e.g., TeamSideline) bundle booking with league management, which may be more than some organizations need

### 2.2 Competitive Landscape

| Competitor | Notes |
|------------|-------|
| TeamSideline | Full league management platform that includes booking; more comprehensive but potentially complex for booking-only use cases |
| Other solutions | Further competitive research recommended to identify gaps and opportunities |

### 2.3 Data Confidence

**Medium** - Based on general understanding of the space rather than formal user research. Recommend validating assumptions with potential municipal partners and end users before major development investment.

---

## 3. User Types

### 3.1 End User (Booker)

| Attribute | Description |
|-----------|-------------|
| **Description** | Coaches, league organizers, event coordinators, or families who need to reserve fields |
| **Characteristics** | Varying technical proficiency; time-constrained; may book infrequently or regularly depending on role |
| **Goals** | Find available field time quickly; book with confidence; receive confirmation; know the cost upfront |
| **Pain Points** | Phone-only booking is slow and inconvenient; unclear availability; inconsistent information; no self-service option |
| **Current Behavior** | Call hotline during business hours, wait for staff, hope desired time is available, receive verbal or email confirmation |
| **Success Criteria** | Can browse availability and complete a booking in under 5 minutes without human interaction |

### 3.2 Administrator (Park Director)

| Attribute | Description |
|-----------|-------------|
| **Description** | Municipal staff or league administrators responsible for managing field inventory and bookings |
| **Characteristics** | Needs oversight and control; handles edge cases and exceptions; may manage multiple fields |
| **Goals** | Maintain accurate field inventory; control availability windows; handle weather cancellations; resolve booking conflicts; set and manage pricing |
| **Pain Points** | Manual tracking is error-prone; no centralized system; difficult to communicate changes to bookers; time spent on phone calls |
| **Current Behavior** | Maintains spreadsheets or paper records; takes booking calls; manually updates availability; contacts bookers individually for changes |
| **Success Criteria** | Single dashboard to manage all fields; ability to quickly block/unblock time; override or cancel bookings with ease |

---

## 4. Hypothesis

### 4.1 Core Hypothesis

We believe that **providing a web-based self-service booking platform with real-time availability** for **coaches, organizers, and families** will result in **reduced booking friction, fewer scheduling conflicts, and higher user satisfaction** because **eliminating phone-based processes creates a single source of truth and empowers users to book on their own schedule**.

We will know this is true when:
- Users can complete bookings without staff intervention
- Double-bookings and scheduling conflicts are eliminated
- Time-to-book is reduced significantly compared to phone-based systems

### 4.2 Key Assumptions

- Municipalities and leagues will adopt a web-based system over existing manual processes
- End users prefer self-service booking over calling a hotline
- A focused booking tool (without full league management) has market appeal
- Flat-rate pricing is acceptable for initial adoption

### 4.3 Risks

| Risk | Mitigation |
|------|------------|
| Low adoption by municipalities accustomed to manual processes | Start with pilot partner; demonstrate clear time savings |
| Users expect more features (league management, mobile apps) | Clearly position as booking-focused; roadmap future features |
| Competitors add similar focused booking features | Move quickly; differentiate on simplicity and user experience |
| Edge cases require more manual intervention than expected | Build robust admin tools; gather feedback and iterate |

---

## 5. Problem Statement

### 5.1 Primary Problem - End Users

**For coaches, organizers, and families**, the problem of **having to call a hotline to book a field** results in **wasted time, booking uncertainty, and frustration** due to limited hours, wait times, and inconsistent information.

### 5.2 Primary Problem - Administrators

**For park directors and administrators**, the problem of **managing bookings through manual processes** results in **administrative overhead, scheduling conflicts, and difficulty maintaining accurate availability** because there is no centralized system serving as a single source of truth.

### 5.3 Problem Impact

| Dimension | Assessment |
|-----------|------------|
| **Severity** | Medium-High - Impacts ability to efficiently use and access public resources |
| **Frequency** | High - Every booking interaction involves these pain points |
| **Scope** | Broad - Affects all users of municipal and league fields |

---

## 6. Proposed Solution

### 6.1 Solution Overview

A web-based field scheduling platform with two primary experiences:

1. **Booker Experience**: Browse field availability, view pricing, and instantly book time slots
2. **Admin Experience**: Manage field inventory, set availability, configure pricing, handle cancellations, and override bookings

### 6.2 Key Differentiators

- **Focused scope**: Booking and scheduling only, not full league management
- **Self-service first**: Eliminate phone-based booking friction
- **Single source of truth**: Real-time sync ensures consistent, accurate availability
- **Simplicity**: Clean, intuitive interface for both bookers and admins

---

## 7. Feature Requirements

### 7.1 MVP - Basic Schedule System

**Goal**: Establish a synchronized, accurate calendar as the single source of truth for field availability.

| Feature | Description | Priority |
|---------|-------------|----------|
| Field inventory display | View all fields in the system with basic information | Must Have |
| Calendar view | Visual schedule showing availability across fields | Must Have |
| Real-time sync | All users see the same, current availability data | Must Have |
| Basic field details | Field name, type, location, amenities | Must Have |
| Admin: Add/remove fields | Create and manage field inventory | Must Have |
| Admin: Set availability | Define when fields are available or blocked | Must Have |

**MVP Success Criteria**: A reliable, synchronized calendar that accurately reflects field availability and can be managed by administrators.

---

### 7.2 Version 1.5 - Booking Functionality

**Goal**: Enable self-service booking with instant confirmation.

| Feature | Description | Priority |
|---------|-------------|----------|
| Browse available times | Users can see open time slots for fields | Must Have |
| View pricing | Display flat-rate cost for booking | Must Have |
| Instant booking | Book a time slot without approval workflow | Must Have |
| Booking confirmation | User receives confirmation of their booking | Must Have |
| User booking information | Capture necessary details (name, contact, purpose) | Must Have |
| Flat-rate payment | Simple payment processing for bookings | Nice to Have |
| Admin: View all bookings | See complete booking schedule | Must Have |
| Admin: Cancel/override bookings | Manually handle conflicts and edge cases | Must Have |
| Admin: Weather cancellations | Block fields and cancel bookings due to weather | Must Have |
| Admin: Define field types/amenities | Categorize fields by characteristics | Must Have |
| Admin: Set pricing | Configure flat booking rates | Must Have |

**v1.5 Success Criteria**: Users can discover available fields and complete a booking without staff assistance. Admins have full control over the booking system.

---

### 7.3 MLP (Minimum Lovable Product) and Beyond

**Goal**: Enhance the platform with power features for efficiency and scale.

| Feature | Description | Phase |
|---------|-------------|-------|
| Recurring bookings | Book the same slot on a recurring schedule (e.g., every Saturday) | MLP |
| Auto-cancel with notifications | Automatically cancel bookings (e.g., weather) with user notifications | MLP |
| Expanded payment tiers | Resident/non-resident rates, peak/off-peak pricing, field-type pricing | MLP |
| Filters and search | Filter fields by type, amenities, location | MLP |
| Mobile-responsive design | Optimized experience for mobile browsers | Future |
| Native mobile apps | iOS and Android applications | Future |
| Waitlist functionality | Join waitlist for fully-booked time slots | Future |
| Reporting and analytics | Usage reports, revenue tracking, popular times | Future |
| Multi-organization support | Single platform serving multiple municipalities | Future |

---

## 8. Success Metrics

### 8.1 MVP Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Calendar data accuracy | 100% sync reliability | Foundation for booking trust |
| Admin adoption | At least 1 pilot organization actively using | Validates core value |

### 8.2 v1.5 Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Booking completion rate | > 80% of started bookings completed | Indicates usable flow |
| Time to book | < 5 minutes from start to confirmation | Beats phone-based experience |
| Double-booking incidents | 0 | Single source of truth working |
| User satisfaction | Qualitative positive feedback | Validates user experience |

### 8.3 Long-term Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| Reduction in phone-based bookings | > 70% shift to self-service | Core value proposition achieved |
| Field utilization rate | Increase vs. baseline | Better access drives more usage |
| Admin time savings | Measurable reduction in booking-related tasks | Operational efficiency |

---

## 9. Open Questions

- [ ] What specific information should be captured during booking (name, organization, contact, purpose, number of participants)?
- [ ] Are there different field types that require different booking rules (e.g., turf vs. grass, lighted vs. non-lighted)?
- [ ] How should weather cancellations work in MVP/v1.5 before auto-cancel is built?
- [ ] What is the refund policy when admins cancel a paid booking?
- [ ] Should there be user accounts, or can booking be done without registration?
- [ ] What are the actual booking rates municipalities typically charge?
- [ ] Are there any accessibility requirements for the web application?
- [ ] What happens when a booking time has passed - archival, deletion, or historical record?

---

## 10. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Municipalities hesitant to change processes | Medium | High | Offer pilot program; demonstrate ROI with time savings |
| Users expect mobile app | Medium | Medium | Ensure responsive web design; roadmap native apps |
| Payment integration complexity | Medium | Medium | Start with flat rate; defer complex pricing to MLP |
| Manual conflict resolution overwhelms admins | Low | Medium | Monitor usage; prioritize auto-cancel feature if needed |
| Competitors release similar focused product | Low | High | Focus on UX quality and municipal relationships |

---

## 11. Next Steps

- [ ] Validate problem assumptions with 2-3 potential municipal partners
- [ ] Conduct brief competitive analysis to identify gaps
- [ ] Create wireframes for MVP calendar/schedule view
- [ ] Define technical architecture for real-time sync
- [ ] Identify pilot organization for initial testing
- [ ] Prioritize and scope MVP development

---

## Appendix A: Phasing Summary

```
MVP                     v1.5                      MLP                       Future
---                     ----                      ---                       ------
Synced calendar    -->  Instant booking      -->  Recurring bookings   -->  Mobile apps
Field inventory         Pricing display           Auto-cancel/notify        Analytics
Admin: manage fields    Flat-rate payment         Expanded pricing          Waitlists
Admin: set availability Admin: cancel/override    Filters/search            Multi-org
                        Admin: weather cancel
```

---

## Appendix B: User Journey - Booking a Field (v1.5)

```
1. User visits Field Scheduler website
2. User browses calendar to see field availability
3. User selects desired date and time slot
4. System displays field details and pricing
5. User enters booking information (name, contact, purpose)
6. User confirms booking (and pays, if payment enabled)
7. System confirms booking and updates availability
8. User receives booking confirmation
9. Field appears as booked to all other users immediately
```

---

## Appendix C: User Journey - Admin Managing Fields (MVP/v1.5)

```
1. Admin logs into admin dashboard
2. Admin views all fields in inventory
3. Admin can add new field with details (name, type, location, amenities)
4. Admin sets availability windows for each field
5. Admin sets pricing for bookings (v1.5)
6. Admin views all upcoming bookings (v1.5)
7. Admin can cancel or override any booking (v1.5)
8. Admin can block field for maintenance or weather (v1.5)
9. Affected users are notified of cancellation (MLP - manual notification in v1.5)
```

---

*This document serves as the foundation for Field Scheduler development. It should be reviewed and updated as the project evolves and additional user research is conducted.*
