# Implementation Plan - Vendor UI/UX Redesign (100% Figma Match)

This plan details the steps to fully redesign and align the vendor-side pages to match the provided Figma UX designs. We will update the layouts, components, and pages to ensure a premium, pixel-perfect feel, including responsive CSS, visual accents, hover states, and smooth flows.

## User Review Required

> [!IMPORTANT]
> **Layout & Sidebar Changes**: Sidebar navigation styling will be updated to match Figma spacing (white background sidebar, with active state as background light-gray `#F9F9F9` and dark-green text).
> **Two-Step Post/Edit Flow**: We are implementing the success view (`Post listing 2`) within `PostListingPage.tsx`. When a vendor successfully submits a listing, it will show the "Your listing is LIVE!" view with share/view options rather than immediately navigating back to the dashboard.
> **Verify Business**: Simplifying the page from multiple inputs to registration type, registration number, and CAC document upload fields to match `verifybusiness.html` exactly.

---

## Proposed Changes

### 1. Vendor Layout & Navigation

#### [MODIFY] [VendorSidebar.tsx](file:///c:/Users/SAMTECK/Desktop/Projects/Food%20Bridge/src/components/VendorSidebar.tsx)
- Update layout structure to be a clean white sidebar with a thin border.
- Highlight the active sidebar page utilizing `#F9F9F9` background and `#0A2623` color.
- Match icons/emojis and labels to Figma sidebar links.
- Style the bottom "Post" button as a rounded-full pill button with a light-gray background and black border/plus icon.

#### [MODIFY] [VendorTopBar.tsx](file:///c:/Users/SAMTECK/Desktop/Projects/Food%20Bridge/src/components/VendorTopBar.tsx)
- Streamline top bar layout. The right side will display the location selector, the notification bell with red badge, a QR scan action, and the user profile menu.

---

### 2. Vendor Pages Redesign

#### [MODIFY] [VendorDashboardPage.tsx](file:///c:/Users/SAMTECK/Desktop/Projects/Food%20Bridge/src/pages/app/vendor/VendorDashboardPage.tsx)
- Redesign stats cards to match the Figma theme (e.g. green icons, badge deltas `+12 today` or `+₦3K today` in light green-tinted background badges).
- Redesign "Your Active Listings" section heading with a count badge.
- Map and style the active listing cards, featuring time remaining (alarm-clock icon) and claims progress (fire icon).

#### [MODIFY] [VendorListingsPage.tsx](file:///c:/Users/SAMTECK/Desktop/Projects/Food%20Bridge/src/pages/app/vendor/VendorListingsPage.tsx)
- Redesign tabs (Active, Completed, Expired) with count badges matching the Figma active state.
- Redesign search and filter bars with rounded-full fields and icons.
- Redesign cards to show proper status tags: "45 mins left" (clock icon), "Awaiting pickup" (green double-check icon for fully claimed listings), or "Expired" (red dead face icon).

#### [MODIFY] [VendorListingDetailPage.tsx](file:///c:/Users/SAMTECK/Desktop/Projects/Food%20Bridge/src/pages/app/vendor/VendorListingDetailPage.tsx)
- Restyle the header back button and actions menu into circular border buttons.
- Display the banner photo with a "Fully Claimed" or "Active" badge.
- Build the performance card: Views, Claims, and Revenue metrics.
- Build the claimers and reviews listing card to show comment, rating stars, Alhaji Ikunisoro, "Picked Up" badge with green checkmarks (or "Confirm pickup" dark green action button for pending claims).

#### [MODIFY] [PostListingPage.tsx](file:///c:/Users/SAMTECK/Desktop/Projects/Food%20Bridge/src/pages/app/PostListingPage.tsx)
- **Step 1 Form**:
  - Align fields to Figma form inputs (Food Name, Quantity, Original Price, Discounted Price, mark as FREE checkbox, Pickup Time start/end, and description).
  - Redesign file upload box into a dashed border file selector.
  - Implement real-time preview card on the right column.
- **Step 2 Success View**:
  - Show "Your listing is LIVE!" banner with checkmark graphic.
  - Display the preview card of the listing.
  - Render circular "Share" and "View Listing" button actions.

#### [MODIFY] [VerifyBusinessPage.tsx](file:///c:/Users/SAMTECK/Desktop/Projects/Food%20Bridge/src/pages/auth/VerifyBusinessPage.tsx)
- Align verify page fields with Figma design (How did you register business, registration number, Upload CAC file area, Submit button, and "Skip for later").

---

## Verification Plan

### Automated Tests
- Run typescript build check (`npm run build`) to ensure all import declarations and page routing compile error-free.

### Manual Verification
- Navigate through all vendor views (/vendor/dashboard, /vendor/listings, /vendor/listings/:id, /vendor/post-listing, /vendor/verify-business).
- Validate listing creation flow shows the success card step and details preview.
- Validate verification document submission displays the correct success screen.
- Verify desktop, tablet, and mobile layouts remain responsive and aligned.
