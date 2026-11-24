import React, { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Bell, Bike, Check, ChevronDown, ChevronRight, Clock3, Compass, Flag, Heart, HelpCircle, Leaf, LogOut, MapPin, Map as MapIcon, Search, Share2, SlidersHorizontal, Salad, Croissant, ShoppingBasket, Coffee, Sparkles, Sprout, Star, Store, TrendingUp, Utensils, Wallet, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import "../styles/fonts.css";
import "../styles/theme.css";
import LoginPage from "./components/LoginPage";

const photo = (id: string, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const offers = [
  { id: 1, name: "Quinoa & vegetable bowl", shop: "Campus Kitchen", category: "Meals", price: 3.99, original: 10.5, rating: "4.9", reviews: 86, distance: 0.3, time: "16:00 – 18:00", tags: ["Vegan", "Gluten-free"], left: 4, image: photo("photo-1511690743698-d9d85f2fbf38"), ingredients: "Quinoa, roasted sweet potato, avocado, chickpeas, mixed greens and tahini dressing.", address: "DCU Glasnevin Campus, Collins Avenue, Dublin 9" },
  { id: 2, name: "Assorted bakery bag", shop: "Glasnevin Bakehouse", category: "Bakery", price: 2.99, original: 9, rating: "4.8", reviews: 124, distance: 0.5, time: "17:00 – 18:30", tags: ["Vegetarian"], left: 3, image: photo("photo-1555507036-ab1f4038808a"), ingredients: "A surprise selection of today's croissants, pastries and sourdough. Contains wheat, milk and eggs; may contain nuts.", address: "Ballymun Road, Glasnevin, Dublin 9" },
  { id: 3, name: "Chicken, rice & hummus", shop: "Ballymun Kitchen", category: "Meals", price: 4.5, original: 12, rating: "4.9", reviews: 62, distance: 0.7, time: "15:30 – 17:30", tags: ["Halal"], left: 5, image: photo("photo-1547592180-85f173990554"), ingredients: "Spiced chicken, rice, tomato, cucumber, hummus and fresh herbs. Contains sesame. Prepared with halal-certified chicken.", address: "Ballymun Road, near Collins Avenue, Dublin 9" },
  { id: 4, name: "Margherita pizza", shop: "Campus Pizza", category: "Meals", price: 3.5, original: 11, rating: "4.7", reviews: 95, distance: 0.8, time: "18:00 – 19:00", tags: ["Vegetarian"], left: 2, image: photo("photo-1579751626657-72bc17010498"), ingredients: "Sourdough pizza with tomato, mozzarella and basil. Contains wheat and milk.", address: "Collins Avenue, Glasnevin, Dublin 9" },
  { id: 5, name: "Seasonal fruit & vegetables", shop: "Neighbourhood Grocer", category: "Groceries", price: 3, original: 8.5, rating: "4.8", reviews: 48, distance: 1.2, time: "16:30 – 18:00", tags: ["Vegan", "Gluten-free"], left: 6, image: photo("photo-1542838132-92c53300491e"), ingredients: "A seasonal selection of surplus fresh fruit and vegetables. Contents vary daily.", address: "Botanic Avenue, Glasnevin, Dublin 9" },
  { id: 6, name: "Vegetable maki selection", shop: "Drumcondra Maki", category: "Meals", price: 4.25, original: 12.5, rating: "4.9", reviews: 71, distance: 0.9, time: "17:30 – 19:00", tags: ["Vegetarian"], left: 4, image: photo("photo-1579871494447-9811cf80d66c"), ingredients: "Avocado and cucumber maki, seasoned rice, nori and edamame. Contains soy and sesame.", address: "Drumcondra Road Upper, Dublin 9" },
];
type Review = { id: number; rating: number; comment: string; image: string | null; demo?: boolean };
type Profile = { name: string; email: string; university: string; city: string };
function loadLocal<T>(key: string, fallback: T): T {
  try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : fallback; } catch { return fallback; }
}
const sampleCoordinates = [[53.3852, -6.2571], [53.3826, -6.2680], [53.3894, -6.2640], [53.3840, -6.2540], [53.3787, -6.2685], [53.3725, -6.2545]];
const neighbourhoods = [
  { name: "DCU · Glasnevin Campus", latitude: 53.3850, longitude: -6.2565 },
  { name: "DCU · St Patrick’s Campus", latitude: 53.3707, longitude: -6.2532 },
  { name: "Dublin city centre", latitude: 53.3498, longitude: -6.2603 },
];
function distanceKm(latitude: number, longitude: number, targetLatitude: number, targetLongitude: number) {
  const radians = Math.PI / 180;
  const deltaLatitude = (targetLatitude - latitude) * radians;
  const deltaLongitude = (targetLongitude - longitude) * radians;
  const haversine = Math.sin(deltaLatitude / 2) ** 2 + Math.cos(latitude * radians) * Math.cos(targetLatitude * radians) * Math.sin(deltaLongitude / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(Math.max(0, 1 - haversine)));
}
type Offer = typeof offers[number];
const nav = [{ name: "Discover", icon: Compass }, { name: "Saved offers", icon: Heart }, { name: "My impact", icon: Leaf }];

function NeighborhoodMap({ onSelect, items }: { onSelect: (offer: Offer) => void; items: Offer[] }) {
  return <div className={`relative overflow-hidden rounded-xl bg-muted h-[460px]`}>
    <svg viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice" className="absolute h-full w-full" aria-label="Illustrative map of offers near the DCU Glasnevin Campus" role="img">
      <rect width="500" height="400" fill="#F3E9D2" /><path d="M0 50L150 0 215 115 94 180 0 143ZM330 210L500 160V400H359L300 300Z" fill="#F4A261" />
      <g stroke="#F9F7F0" strokeWidth="14" fill="none"><path d="M-20 320L520 40M50-20L300 420M280-20L490 410M-20 150L510 285M-10 390L510 130"/><path d="M0 60L500 365M150 0L80 400" strokeWidth="7" /></g>
      <path d="M-20 320L520 40" stroke="#F4A261" strokeWidth="5"/><path d="M50-20L300 420" stroke="#F4A261" strokeWidth="5"/>
      <g fill="#164E42" fontSize="12" fontFamily="sans-serif"><text x="200" y="85" transform="rotate(-28 200 85)">BALLYMUN ROAD</text><text x="300" y="335">DCU · GLASNEVIN</text><text x="310" y="351">CAMPUS</text><text x="22" y="100">GLASNEVIN</text></g>
      <circle cx="250" cy="225" r="39" fill="#8EBF8A" opacity=".10"/><circle cx="250" cy="225" r="10" fill="#164E42" stroke="#F9F7F0" strokeWidth="4"/>
    </svg>
    {items.map((offer, index) => <button key={offer.id} onClick={() => onSelect(offer)} aria-label={`View ${offer.name}, €${offer.price.toFixed(2)}`} className={`absolute rounded-full border-2 border-card bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-md transition hover:scale-110 ${["left-[20%] top-[27%]", "left-[61%] top-[20%]", "left-[55%] top-[65%]", "left-[20%] top-[65%]", "left-[74%] top-[45%]", "left-[39%] top-[10%]"][index]}`}>€{offer.price.toFixed(2)}</button>)}
    {<span className="absolute bottom-3 left-3 rounded-lg bg-card/95 p-2 text-xs text-muted-foreground">Illustrative Dublin map · sample business locations</span>}
  </div>;
}

function AppContent({ onLogout }: { onLogout: () => void }) {
  useEffect(() => { document.title = "MealDeal | Nearby food offers"; }, []);
  const [profile, setProfile] = useState<Profile>(() => {
    const stored = loadLocal<Profile>("crumb-profile", { name: "Jamie Lee", email: "jamie.lee@example.com", university: "Dublin City University (DCU)", city: "Dublin" });
    return { ...stored, university: stored.university.includes("Manchester") ? "Dublin City University (DCU)" : stored.university, city: stored.city === "Manchester" ? "Dublin" : stored.city };
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const initials = profile.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  const openProfile = () => { setDraftProfile(profile); setPanel("profile"); };
  const [coordinates, setCoordinates] = useState(neighbourhoods[0]);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const useCurrentPosition = () => {
    setLocationError("");
    if (!navigator.geolocation) { setLocationError("Geolocation is not available in this browser."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(position => {
      setCoordinates({ name: "My current location", latitude: position.coords.latitude, longitude: position.coords.longitude });
      setLocation("My current location");
      setSort("Nearest first");
      setLocating(false);
      setPanel(null);
      toast.success("Your location is now used to calculate distances.");
    }, error => {
      setLocating(false);
      setLocationError(error.code === 1 ? "Location access was denied. Allow it in your browser or choose a neighbourhood below. If the preview blocks location access, open the app in a separate tab." : "Your location is unavailable. Try again or choose a neighbourhood manually.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  };
  const nearbyOffers = useMemo(() => offers.map((offer, index) => ({ ...offer, distance: Math.round(distanceKm(coordinates.latitude, coordinates.longitude, sampleCoordinates[index][0], sampleCoordinates[index][1]) * 10) / 10 })), [coordinates]);
  const [page, setPage] = useState("Discover");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All food");
  const [diet, setDiet] = useState<string[]>([]);
  const [saved, setSaved] = useState<number[]>(() => {
    const existing = loadLocal<number[]>("crumb-saved", []);
    return loadLocal("crumb-saved-example-v1", false) ? existing : Array.from(new Set([...existing, 1]));
  });
  useEffect(() => {
    try { localStorage.setItem("crumb-saved", JSON.stringify(saved)); localStorage.setItem("crumb-saved-example-v1", "true"); }
    catch { toast.error("Saved offers could not be stored on this device."); }
  }, [saved]);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [sort, setSort] = useState("Nearest first");
  const [maxPrice, setMaxPrice] = useState(6);