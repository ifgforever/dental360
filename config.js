/* =====================================================================
   DENTAL 360 LOBBY SIGNAGE  —  CONFIG
   ---------------------------------------------------------------------
   This is the ONLY file you normally need to edit.
   Change text inside the quotes, save, and the TV picks it up on its
   next refresh (the player reloads itself every few hours, or press F5).
   Lines starting with // are comments and are ignored.
   ===================================================================== */

window.SIGNAGE = {

  /* ---------- The office ---------- */
  business: {
    name: "Dental 360",
    office: "Irving Park Family Dentistry",
    tagline: "Your trusted dentist in Chicago for healthy, beautiful smiles",
    address1: "3435 W. Irving Park Rd",
    address2: "Chicago, IL 60618",
    phone: "(773) 588-8200",
    website: "dental360grp.com",
    bookingUrl: "https://dental360grp.com/book-appointment/",
    yearsInBusiness: "14+",
    // Google rating shown on the reviews slide. Set stars to null to hide.
    // Check the current numbers on the office's Google Business Profile.
    rating: { stars: 4.9, count: "900+" },
    // Used for the weather chip (Irving Park, Chicago). Set weather:false to hide.
    weather: true,
    lat: 41.9535,
    lon: -87.7144,
    timezone: "America/Chicago"
  },

  /* ---------- Hours ---------- */
  hours: [
    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { day: "Saturday",        time: "9:00 AM – 2:00 PM" },
    { day: "Sunday",          time: "Closed" }
  ],

  /* ---------- Playback ---------- */
  // Seconds each slide stays on screen unless a slide sets its own "seconds".
  defaultSeconds: 12,
  // Reload the page this often (hours) so edits to this file show up on the TV.
  reloadEveryHours: 4,

  /* ---------- Scrolling ticker at the bottom ---------- */
  ticker: [
    "Welcome to Dental 360 Irving Park Family Dentistry",
    "New patients always welcome — ask our front desk about scheduling your family",
    "Walk-in and emergency visits: please let the front desk know if you are in pain",
    "Book online any time at dental360grp.com",
    "Call us: (773) 588-8200",
    "Follow us on Facebook @dental360usa"
  ],

  /* ---------- Services (services slide) ---------- */
  services: [
    { icon: "🦷", title: "General Dentistry",     text: "Cleanings, exams, fillings and preventive care for all ages" },
    { icon: "✨", title: "Cosmetic Dentistry",    text: "Teeth whitening, veneers and complete smile makeovers" },
    { icon: "🔧", title: "Restorative Dentistry", text: "Dental implants, crowns, bridges and dentures" },
    { icon: "🩺", title: "Oral Surgery",          text: "Wisdom tooth removal, extractions and implant placement" },
    { icon: "🧒", title: "Pediatric Dentistry",   text: "Gentle, friendly care that keeps kids smiling" },
    { icon: "😁", title: "Orthodontics",          text: "Custom braces and Invisalign® clear aligners" }
  ],

  /* ---------- Values (why-us slide) ---------- */
  values: ["Honesty", "Integrity", "Compassion", "Community", "Commitment"],

  /* ---------- Patient reviews (one shows each time the slide comes up) ---------- */
  reviews: [
    { name: "Natasha",  text: "Scheduling was easy, the staff was welcoming, and the dentist explained my treatment clearly." },
    { name: "Michelle", text: "My root canal was explained well and went smoothly, with minimal discomfort." },
    { name: "William",  text: "An outstanding routine check-up. I was greeted warmly and treated professionally." }
  ],

  /* ---------- Dental tips (one shows each time a tip slide comes up) ---------- */
  tips: [
    { title: "Two minutes, twice a day",     text: "Brush for a full two minutes, morning and night, with a fluoride toothpaste." },
    { title: "Floss every day",              text: "Brushing alone can't reach between your teeth. Floss once a day to protect your gums." },
    { title: "Swap your brush",              text: "Replace your toothbrush (or brush head) every three months, or sooner if the bristles are frayed." },
    { title: "Visit every six months",       text: "Regular cleanings catch small problems before they become painful — and expensive." },
    { title: "Bleeding gums aren't normal",  text: "Gums that bleed when you brush can be an early sign of gum disease. Mention it to your hygienist today." },
    { title: "Rinse with water",             text: "After snacks or sugary drinks, swish with plain water to wash away acids and sugar." },
    { title: "First tooth, first visit",     text: "Children should see a dentist by their first birthday or within six months of their first tooth." },
    { title: "Protect your smile",           text: "Playing sports? A custom mouthguard prevents chipped and knocked-out teeth." },
    { title: "Limit the sips",               text: "Sipping soda or juice all day bathes teeth in sugar. Enjoy it with a meal instead." },
    { title: "Don't wait on pain",           text: "A toothache rarely fixes itself. Tell our front desk if something hurts — we can help." }
  ],

  /* ---------- Slide order ----------
     Types: welcome, services, tip, reviews, promo, values, hours, locations
     Remove a line to drop a slide, duplicate it to show it more often,
     add "seconds: 20" to keep it up longer. Promo slides take a "photo"
     from the assets folder and an optional "photoPosition" (e.g. "center 20%")
     to choose which part of a tall photo shows.                        */
  slides: [
    { type: "welcome" },
    { type: "services", seconds: 15 },
    { type: "tip" },
    { type: "promo",
      eyebrow: "Orthodontics",
      title: "Straighter teeth, your way",
      text: "Traditional braces or nearly invisible Invisalign® aligners for kids, teens and adults. Ask us which is right for you.",
      photo: "assets/photo-smile.jpg", photoPosition: "center 30%" },
    { type: "reviews" },
    { type: "values" },
    { type: "tip" },
    { type: "promo",
      eyebrow: "Dental Implants",
      title: "A permanent fix for missing teeth",
      text: "Implants look, feel and work like natural teeth — eat, speak and smile with confidence again.",
      photo: "assets/photo-patient.jpg", photoPosition: "center 22%" },
    { type: "hours", seconds: 15 },
    { type: "locations" },
    { type: "tip" },
    { type: "promo",
      eyebrow: "Cosmetic Dentistry",
      title: "A brighter smile in one visit",
      text: "Professional whitening, veneers and bonding. Ask the front desk about a smile consultation.",
      photo: "assets/photo-dentist.jpg" }
  ],

  /* ---------- ADS (optional) ----------
     Leave the list empty for no ads. When you add some, one ad plays
     after every "adEvery" regular slides, rotating through the list.

     Image ad (drop the picture in the assets folder, 1920x1080 works best):
       { type: "image", src: "assets/ads/joes-pizza.jpg", seconds: 10 }

     Simple text ad:
       { type: "text", eyebrow: "Neighborhood partner", title: "Joe's Pizza",
         text: "Show your Dental 360 appointment card for 10% off", footer: "4000 W Irving Park Rd" }

     Video ad (mp4, plays muted, moves on when it ends):
       { type: "video", src: "assets/ads/clip.mp4" }
  */
  adEvery: 4,
  ads: [
    // { type: "image", src: "assets/ads/example.jpg", seconds: 10 }
  ]
};
