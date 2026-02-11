
# CoFound MVP — Startup Founder Platform

A mobile-first web app helping aspiring founders go from idea to company, with dummy users and data throughout.

## Design & Layout
- **Blue-themed UI** matching the CoFound branding (deep blue primary, light blue accents, white cards)
- **Mobile-first layout** with a bottom navigation bar (Home, Roadmap, Knowledge, Profile)
- Clean card-based design with rounded corners and subtle shadows

---

## Pages & Features

### 1. Home / Startup Pitch Feed
- Social feed where founders post their startup ideas (dummy posts with avatars, names, pitch descriptions, tags)
- Like and comment counts on each pitch card
- Trending Startups section at the top
- Search bar at the top

### 2. Personal Startup Roadmap
- Step-by-step checklist for starting a company (Register Company, GST Registration, Apply for Startup India, Find Incubator, etc.)
- Each step has a status: Not Started, In Progress, Completed
- Users can tap to toggle status (stored in local state)
- Progress bar at the top showing overall completion

### 3. Knowledge Hub
- Grid of category cards: Company Registration Guide, Government Schemes, License & Compliance, Funding & Incubators
- Tapping a category shows a list of dummy articles/guides
- Each article has a title, summary, and read time

### 4. Startup Reels (simplified)
- A simple scrollable list of video-style cards with thumbnails, titles, and creator info
- Dummy data — no actual video playback, just visual cards

### 5. Masterclass / Events
- List of upcoming webinars and masterclasses with title, date, speaker, and "Register" button
- One featured/live event card at the top

### 6. Profile Page
- Dummy user profile with avatar, name, bio, startup name
- Stats: pitches posted, roadmap progress, articles read
- Simple settings placeholder

---

## Dummy Data
- 6-8 dummy founder profiles with names, avatars (initials-based), and startup ideas
- 8-10 pitch feed posts
- 5-6 roadmap steps
- 8 knowledge hub articles across 4 categories
- 4-5 reels cards
- 3-4 upcoming masterclass events

## No Backend
- All data hardcoded as JSON/arrays in the frontend
- Local state only (no persistence)
