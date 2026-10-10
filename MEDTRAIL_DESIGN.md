# MediTrail Design System Specification (MEDTRAIL_DESIGN.md)

**Version:** 1.0.0  
**Project:** MediTrail — HealthTech Hackathon Platform  
**Tagline:** "Your Medical History. One Secure Trail."  
**Target Audience:** Patients seeking control over personal health data, and Doctors reviewing temporary shared medical records.

---

## 1. Design Philosophy & Visual Direction

### 1.1 Core Principles
MediTrail operates at the intersection of **patient trust**, **clinical precision**, and **modern SaaS efficiency**.

1. **Patient-First Authority & Privacy:** Medical records belong strictly to the patient. The UI clearly signals privacy boundaries, encryption, active sharing states, and revocation controls with high-visibility security cues.
2. **Clinical Clarity, Not Sterile Coldness:** Move away from harsh pure-white hospital aesthetics and avoid gloomy dark modes. MediTrail uses a daylight off-white canvas (`#F8FAFC`), crisp white elevated cards (`#FFFFFF`), and deep slate text (`#0F172A`) paired with soothing, reassuring medical teals (`#0F766E`) and trust blues (`#0284C7`).
3. **Zero Visual Noise:** In a medical context, ambiguity can be dangerous. Shadows are soft and diffused, borders are precise hairlines (`#E2E8F0`), and color is applied with strict semantic discipline rather than decorative indulgence.
4. **Legibility at All Costs:** Strict adherence to WCAG 2.1 AA standards (minimum 4.5:1 contrast ratio for all normal text, 3:1 for graphical controls and large text). High-density data tables and timelines utilize tabular numerical figures (`tnum`) for effortless scanning.

---

## 2. Color Tokens & Semantic Roles

All tokens are provided in exact HEX format with designated semantic roles and mapped to Tailwind CSS utilities.

### 2.1 Canvas & Surfaces
| Token | Hex Value | Role | Tailwind Class |
| :--- | :--- | :--- | :--- |
| `canvas-default` | `#F8FAFC` | Global background canvas | `bg-slate-50` |
| `canvas-card` | `#FFFFFF` | Elevated content card surfaces | `bg-white` |
| `canvas-subtle` | `#F1F5F9` | Recessed areas / sidebars | `bg-slate-100` |
| `canvas-active` | `#E2E8F0` | Hover / Active item background | `bg-slate-200` |
| `canvas-overlay` | `rgba(15,23,42,0.5)` | Modal backdrop | `bg-slate-900/50` |

### 2.2 Ink (Typography)
| Token | Hex Value | Role | Tailwind Class |
| :--- | :--- | :--- | :--- |
| `ink-primary` | `#0F172A` | Headings & primary copy | `text-slate-900` |
| `ink-secondary` | `#334155` | Secondary descriptions | `text-slate-700` |
| `ink-muted` | `#64748B` | Metadata, labels, hints | `text-slate-500` |
| `ink-faint` | `#94A3B8` | Placeholders, timestamps | `text-slate-400` |
| `ink-inverted` | `#FFFFFF` | Text on dark/accent CTAs | `text-white` |

### 2.3 Hairlines & Borders
| Token | Hex Value | Role | Tailwind Class |
| :--- | :--- | :--- | :--- |
| `hairline-subtle` | `#F1F5F9` | Internal cell dividers | `border-slate-100` |
| `hairline-default` | `#E2E8F0` | Card & container borders | `border-slate-200` |
| `hairline-strong` | `#CBD5E1` | Input default borders | `border-slate-300` |
| `hairline-focus` | `#0284C7` | Focused element stroke | `border-sky-600` |

### 2.4 Brand & Interactive Accents
| Token | Hex Value | Role | Tailwind Class |
| :--- | :--- | :--- | :--- |
| `brand-primary` | `#0F766E` | Deep medical teal (hero / trust) | `bg-teal-700` |
| `brand-primary-hover` | `#115E59` | Primary button hover | `hover:bg-teal-800` |
| `brand-accent` | `#0284C7` | Interactive sky-blue (actions) | `bg-sky-600` |
| `brand-accent-hover` | `#0369A1` | Accent button hover | `hover:bg-sky-700` |
| `brand-light` | `#CCFBF1` | Teal surface highlight | `bg-teal-50` |

### 2.5 Semantic Status & Security
| Token | Hex Value | Role | Tailwind Class |
| :--- | :--- | :--- | :--- |
| `status-success` | `#059669` | Verified, Active Share | `text-emerald-600` / `bg-emerald-50` |
| `status-warning` | `#D97706` | Expiring Soon, Caution | `text-amber-600` / `bg-amber-50` |
| `status-danger` | `#DC2626` | Revoked Access, Delete | `text-rose-600` / `bg-rose-50` |
| `status-info` | `#2563EB` | Informational notes | `text-blue-600` / `bg-blue-50` |

### 2.6 Medical Record Category Tokens
| Category | Text Hex | Bg Hex | Border Hex / Badge Classes |
| :--- | :--- | :--- | :--- |
| 💊 **Prescription** | `#4F46E5` | `#EEF2FF` | `text-indigo-700 bg-indigo-50 border-indigo-200` |
| 🧪 **Lab Report** | `#0D9488` | `#F0FDFA` | `text-teal-700 bg-teal-50 border-teal-200` |
| 🩺 **Diagnosis** | `#D97706` | `#FFFBEB` | `text-amber-700 bg-amber-50 border-amber-200` |
| 🏥 **Hospital Visit** | `#2563EB` | `#EFF6FF` | `text-blue-700 bg-blue-50 border-blue-200` |
| 📄 **Certificate** | `#475569` | `#F8FAFC` | `text-slate-700 bg-slate-50 border-slate-200` |
| ⚠️ **Allergy Note** | `#E11D48` | `#FFF1F2` | `text-rose-700 bg-rose-50 border-rose-200` |

---

## 3. Typography & Hierarchy

### 3.1 Font Families
- **Primary Body & Display:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  * Rationale: Inter delivers exceptional optical balance at small sizes (11px–14px), perfect for complex medical reports, metadata, and timestamps.
- **Monospace & Security:** `"JetBrains Mono", "SF Mono", Menlo, monospace`
  * Applied to: Share tokens (`tok_7b8a...`), QR codes, cryptographic verification IDs, and exact countdown counters.

### 3.2 Typography Scale
| Token | Size | Line Height | Weight | Tracking | Primary Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-2xl` | 36px (2.25rem) | 1.15 (42px) | Bold (700) | -0.03em | Landing Hero, Auth headlines |
| `display-xl` | 30px (1.875rem)| 1.20 (36px) | SemiBold (600)| -0.025em | Main Section Headings (Dashboard, Vault)|
| `heading-lg` | 24px (1.5rem)  | 1.25 (30px) | SemiBold (600)| -0.02em | Modal titles, Card group headers |
| `heading-md` | 18px (1.125rem)| 1.35 (24px) | SemiBold (600)| -0.01em | Record card titles, Section subheadings |
| `body-base` | 15px (0.9375rem)| 1.50 (22px) | Regular (400) | 0.0em | Primary description copy, form instructions|
| `body-sm` | 13px (0.8125rem)| 1.45 (19px) | Regular (400) | +0.01em | Table data cells, secondary notes |
| `caption` | 12px (0.75rem) | 1.40 (17px) | Medium (500) | +0.02em | Category tags, input helper texts |
| `micro` | 11px (0.6875rem)| 1.35 (15px) | SemiBold (600)| +0.04em | Uppercase badges, security indicators |

---

## 4. Spacing, Sizing, Breakpoints & Layout

### 4.1 Spacing Scale (8-Point Modular Grid)
* `2px` (0.125rem) — Micro adjustments, tight badge paddings
* `4px` (0.25rem) — Icon-to-text gaps
* `8px` (0.5rem) — Element internal micro-spacing, small buttons
* `12px` (0.75rem) — Standard button vertical padding, input padding
* `16px` (1.0rem) — Standard button horizontal padding, card content gap
* `24px` (1.5rem) — Card internal padding, grid column gap
* `32px` (2.0rem) — Section separation, modal container padding
* `48px` (3.0rem) — Major dashboard section rhythm
* `64px` (4.0rem) — Page header to content spacing

### 4.2 Breakpoints & Container Widths
* **Mobile (`sm`):** `640px` (single column layout, drawer navigation)
* **Tablet (`md`):** `768px` (2-column record grid, collapsed sidebar)
* **Desktop (`lg`):** `1024px` (expanded 3-column vault grid, sticky sidebar)
* **Wide Desktop (`xl`):** `1280px` (Max container constraint: `max-w-7xl mx-auto px-6`)

---

## 5. Border Radii, Elevation & Surface Treatments

### 5.1 Corner Radii
* `rounded-md` (`6px`): Small badges, action icon buttons
* `rounded-lg` (`8px`): Form inputs, standard buttons, dropdown menus
* `rounded-xl` (`12px`): Content cards, record list items, timeline nodes
* `rounded-2xl` (`16px`): Modals, QR container cards, hero banners
* `rounded-full` (`9999px`): Status pills, avatar bubbles, toggle switches

### 5.2 Elevation & Shadows
* **Hairline Only (`shadow-none border border-slate-200`):** Default for in-page content containers.
* **Ambient Float (`shadow-sm`):** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` — Interactive record cards.
* **Hover Lift (`shadow-md`):** `0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` — Record cards on hover.
* **Elevated Modal (`shadow-xl`):** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` — Modals and Share link dialogs.

---

## 6. Component Specifications

### 6.1 Buttons
* **Primary (Patient Action):**
  * Class: `bg-teal-700 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-teal-800 transition-colors shadow-sm focus:ring-2 focus:ring-teal-500/20`
* **Accent (Quick Action / Upload):**
  * Class: `bg-sky-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-sky-700 transition-colors shadow-sm focus:ring-2 focus:ring-sky-500/20`
* **Secondary / Outline:**
  * Class: `bg-white border border-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors`
* **Destructive (Revoke Access / Delete):**
  * Class: `bg-white border border-rose-200 text-rose-600 font-medium px-4 py-2.5 rounded-lg hover:bg-rose-50 hover:border-rose-300 transition-colors`

### 6.2 Form Inputs
* Label: `block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5`
* Input: `w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-500/15 transition-all text-sm`

### 6.3 Medical Record Card (Vault)
* Container: `bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all`
* Header: Category Badge (top-left), Record Date (top-right, `text-xs text-slate-400 font-medium`).
* Title: `text-base font-semibold text-slate-900 mt-2 mb-1`
* Subtitle: `text-xs text-slate-500 flex items-center gap-1.5 mb-3`
* Action Footer: Preview file button, checkbox for selective doctor sharing, delete button.

### 6.4 Chronological Medical Timeline
* Central/Left Spine: `2px solid #E2E8F0`
* Timeline Node: `w-3 h-3 rounded-full border-2 border-white ring-2 ring-teal-600 bg-teal-600`
* Date Tag: `text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider`
* Content Card: Attached horizontal card with category icon, doctor note, and file preview chip.

### 6.5 AI Health Summary Container
* Container: `bg-sky-50/50 border border-sky-100 rounded-2xl p-6`
* Disclaimer Banner:
  * `text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5 flex items-center gap-2 mb-6`
  * Text: *"AI-generated information is for informational purposes only and does not replace professional medical advice."*
* Sections:
  * 🩺 **Conditions Found** (Clean badges)
  * 💊 **Current Medications** (Table with dosage/frequency)
  * 🧪 **Recent Test Results** (Indicator cards with normal/abnormal badges)
  * ⚠️ **Known Allergies** (Rose warning pill tags)
  * 📋 **Key History Events**
  * ❗ **Missing / Incomplete Information**

### 6.6 Temporary Doctor Sharing & QR Experience
* Selection Interface: Selectable checklist with badge counter (`3 of 12 records selected`).
* Expiry Selector: Segmented radio group (`1h`, `24h`, `7d`).
* QR Card: High contrast white square container with centered QR code and `[Download QR]` / `[Copy Link]` buttons.
* Security Assurance: *"The doctor will only be granted access to the 3 selected records. Access automatically expires."*

### 6.7 Active Share & Revocation Card
* Header: Recipient Name / Specialty (e.g. `Dr. Ahmed - General Hospital`).
* Status: `bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full`
* Expiration: `⏱ Expires in: 23h 42m` (`font-mono text-xs text-slate-500`)
* Revoke Button: `[Revoke Access]` in `text-rose-600 border-rose-200 hover:bg-rose-50` which triggers instant invalidation.

### 6.8 Activity & Audit History
* Event Item: `flex items-start gap-3 py-3 border-b border-slate-100 last:border-0`
* Timestamp: `text-xs font-mono text-slate-400`
* Icons:
  * 🔗 Share link created
  * 👨‍⚕️ Doctor accessed shared records
  * 🚫 Access revoked by patient
  * ⏱ Share expired

---

## 7. Interaction States & Accessibility

* **Hover Transitions:** `transition-colors duration-150` (or `transition-all duration-200`)
* **Focus States:** `focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 outline-none`
* **Contrast Compliance:** All text tokens meet or exceed WCAG 2.1 AA (4.5:1 ratio against surface background).
* **Keyboard Navigation:** Tab order preserved across all interactive forms, modal focus trapping, and `Escape` key listeners.

---

## 8. Integration Guidance for Existing Frontend

* **Tailwind Config:** All tokens map cleanly to Tailwind CSS 3.4 standard color families (`slate`, `teal`, `sky`, `indigo`, `amber`, `rose`, `emerald`).
* **Icons:** Standardized on `lucide-react` (already installed in `frontend/package.json`).
* **Supabase Integration:** Matches backend schema with clean decoupling between real Supabase queries and UI state handlers.

---

## 9. Design Evolution & Hackathon Context

* **Observed Trends in 74 Systems:** Heavy dominance of dark mode in developer tools (Linear, Raycast, Vercel) vs. daylight trust in workflow tools (Supabase, Cal.com, Stripe).
* **MediTrail Specific Adaptation:** Healthcare demands calm daylight clarity. We adopted the clean card layouts and segmented controls from Supabase and Cal.com, tuned with medical teal accents and patient-controlled security workflows to guarantee an unforgettable hackathon presentation.
