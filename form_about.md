### **Prompt for Windsurf AI**

**Project Type:** Next.js (App Router) + TypeScript + Tailwind CSS + Shadcn/UI
**Goal:** Build a **publicly accessible, multi-step application form** for **Wavelaunch Studio**, available without login.

---

### **📄 Page Overview**

Create a **form-based web page** at route `/apply` titled **“Wavelaunch Studio Application”**.
The purpose is to collect detailed applications from creators and entrepreneurs who want to collaborate with Wavelaunch Studio in launching their brand.

The form should:

* Be **multi-step**, grouped by question themes (e.g., Career, Vision, Audience, Brand, Growth, Final).
* Save responses in state until submission.
* Have a **progress bar** or step indicator.
* Be **accessible without login**, mobile-friendly, and visually aligned with Wavelaunch branding (dark, minimal, elegant).
* Include client-side validation (required fields, valid email, etc.).
* Submit responses to an API endpoint (e.g., `/api/submit-application`) as JSON.

---

### **🎨 Design & Layout**

**Overall Aesthetic:**

* Dark theme (`bg-neutral-950`, `text-gray-100`)
* Accent color: Wavelaunch purple (`#7B3FE4`)
* Rounded containers, minimal shadows, generous white space
* Smooth fade/slide animations between steps
* Progress indicator at the top showing step count

**Form UI Style:**

* Use Shadcn components (`Card`, `Input`, `Textarea`, `Select`, `Button`, `Progress`, `Stepper`).
* Questions should appear in grouped “cards” per section.
* Include a confirmation screen on submission (“Thank you, your application has been received.”).

---

### **🧠 Form Logic**

* Use `useState` or `react-hook-form` to manage fields.
* Auto-save responses to localStorage in case of refresh.
* Disable the "Next" button until all required questions in that section are answered.
* Include a “Back” button on every step except the first.

---

### **🪜 Steps & Questions**

#### **Step 1: Personal Info**

* Timestamp (auto-generated)
* Full Name *(Input)*
* Email *(Input, required)*

#### **Step 2: Career Background**

* Share with us the significant milestones that have shaped your professional career history. *(Textarea)*
* Tell us about the main turning points in your personal career. *(Textarea)*

#### **Step 3: Vision**

* What is your vision for this venture? *(Textarea)*
* What do you hope to achieve? *(Textarea)*
* Do you have a specific industry or niche in mind? *(Select or Input)*

#### **Step 4: Target Audience**

* Who do you envision as your target audience? *(Textarea)*
* Can you provide demographic details (gender, location, interests, etc.)? *(Textarea)*
* What are their key needs and pain points? *(Textarea)*
* How old is your target demographic? *(Select or Input)*

#### **Step 5: Brand Differentiation**

* How will you set your venture apart from the competition? *(Textarea)*
* What unique value propositions (USPs) will you offer? *(Textarea)*
* Are there any competitors you’re closely monitoring? *(Textarea)*

#### **Step 6: Brand Personality**

* How would you describe the ideal brand image? *(Textarea)*
* Are there specific influencers or brands you admire? *(Textarea)*
* Do you have preferences for branding aesthetics, tone of voice, or visuals? *(Textarea)*
* What emotions or adjectives should your brand evoke? *(Textarea)*
* If your brand were a person, which word group best describes them? *(Select)*
* Which font style best suits your brand? *(Select: Modern Sans / Elegant Serif / Bold Display / Minimal Monospace)*

#### **Step 7: Growth & Strategy**

* Do you have goals for scaling the business? *(Textarea)*
* Any specific strategies or channels you want to explore for growth? *(Textarea)*
* How do you envision your brand evolving in the long term? *(Textarea)*

#### **Step 8: Final Details**

* Any other relevant information before we proceed? *(Textarea)*
* Any specific deadlines or milestones we should consider? *(Input/Date)*
* How does your current audience discover your social media profile? *(Textarea)*
* Is your audience primarily male or female? *(Select)*
* Are they married or single? *(Select)*
* What values or principles should your brand communicate? *(Textarea)*

---

### **✅ Submission**

* On form submit:

  * Validate all required fields.
  * POST to `/api/submit-application` with the full JSON payload.
  * Show success screen:
    “🎉 Thank you for applying to Wavelaunch Studio. Our team will review your responses and reach out within 7 business days.”
* Include a **“Start Over”** button on the success page.

---

### **💡 Additional Notes**

* Add a favicon and meta title: **Wavelaunch Studio Application Form**
* Use a sticky top navigation with Wavelaunch logo and minimal link to “About Wavelaunch Studio”.
* Animate transitions between steps (fade or slide left-right).
* Make form embeddable later inside another site (e.g., `wavelaunch.org/apply`).
* Ensure accessibility (labels, focus states, keyboard navigation).

---