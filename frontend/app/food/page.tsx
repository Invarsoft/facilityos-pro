'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { FoodOrder } from '@/lib/types';
import {
  Utensils,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  QrCode,
  ArrowLeft,
  Search,
  ShoppingCart,
  ChefHat,
  Coffee,
  Pizza,
  Building2,
  Store,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Camera,
  Flame,
  Check,
  Plus,
  Minus,
  Trash2,
  X,
  Filter,
  Star,
  FileText,
  RefreshCw,
  Copy,
  Bell,
  Home,
  User,
  ShoppingBag,
  Zap,
  Tag,
  Play,
  ChevronRight,
  Users,
  Heart,
  Award,
} from 'lucide-react';

interface FoodRestaurant {
  id: string;
  name: string;
  brandTag: string;
  brandColor: string;
  category: string;
  description: string;
  isOpen: boolean;
  queueCount: number;
  rating: string;
  prepTime: string;
  image: string;
  vendorEmail: string;
}

const CANTEEN_RESTAURANTS: FoodRestaurant[] = [
  {
    id: 'rise-live',
    name: 'Rise Live Items',
    brandTag: 'RISE LIVE',
    brandColor: 'text-rose-600 border-rose-200 bg-rose-50/50',
    category: 'Snacks & Fresh Juice',
    description: 'Quick bites, live hot sandwiches, burgers and fresh juices.',
    isOpen: true,
    queueCount: 20,
    rating: '4.8',
    prepTime: '10 Mins',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    vendorEmail: 'vendor.expressbites@woxsen.edu.in',
  },
  {
    id: 'rise-ready',
    name: 'Rise Ready To Serve',
    brandTag: 'RISE READY',
    brandColor: 'text-rose-600 border-rose-200 bg-rose-50/50',
    category: 'Freshly Prepared Snacks',
    description: 'Freshly prepared snacks, bakery puffs, samosas, rolls and more.',
    isOpen: true,
    queueCount: 12,
    rating: '4.9',
    prepTime: '5 Mins',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    vendorEmail: 'vendor.asianwok@woxsen.edu.in',
  },
  {
    id: 'blue-embers',
    name: 'Blue Embers',
    brandTag: 'BLUE EMBERS',
    brandColor: 'text-sky-700 border-sky-200 bg-sky-50/50',
    category: 'Continental & Pizzas',
    description: 'Tasty continental specialties, wood-fired pizzas and sides.',
    isOpen: false,
    queueCount: 0,
    rating: '4.7',
    prepTime: 'Opens 6:00 PM',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    vendorEmail: 'vendor.burgerdeck@woxsen.edu.in',
  },
  {
    id: 'new-embers',
    name: 'New Embers',
    brandTag: 'NEW EMBERS',
    brandColor: 'text-indigo-900 border-indigo-200 bg-indigo-50/50',
    category: 'Indian & Chinese Specialities',
    description: 'Freshly prepared Indian thalis, Schezwan & more.',
    isOpen: false,
    queueCount: 0,
    rating: '4.6',
    prepTime: 'Opens 7:00 PM',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80',
    vendorEmail: 'vendor.crispycrunch@woxsen.edu.in',
  },
];

const FOOD_MENU_ITEMS = [
  // Rise Live Items
  { id: 'f-1', outletId: 'rise-live', name: 'Chicken Sandwich', category: 'Sandwich', price: 95.0, unitsLeft: 3, isNonVeg: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80', isBestSeller: true },
  { id: 'f-2', outletId: 'rise-live', name: 'Chicken Pink Sauce Pasta', category: 'Best Seller', price: 179.0, unitsLeft: 1, isNonVeg: true, image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=400&auto=format&fit=crop&q=80', isBestSeller: true },
  { id: 'f-3', outletId: 'rise-live', name: 'Grilled Cheese & Corn Toast', category: 'Sandwich', price: 85.0, unitsLeft: 5, isNonVeg: false, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80', isBestSeller: false },
  { id: 'f-4', outletId: 'rise-live', name: 'Oreo Thick Fudge Shake', category: 'Milkshake', price: 110.0, unitsLeft: 8, isNonVeg: false, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80', isBestSeller: true },

  // Rise Ready To Serve
  { id: 'f-5', outletId: 'rise-ready', name: 'Hot Samosa (2 Pcs) & Chutney', category: 'Quick Bite', price: 40.0, unitsLeft: 15, isNonVeg: false, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80', isBestSeller: true },
  { id: 'f-6', outletId: 'rise-ready', name: 'Crispy Flaky Egg Puff', category: 'Quick Bite', price: 35.0, unitsLeft: 4, isNonVeg: true, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop&q=80', isBestSeller: true },
  { id: 'f-7', outletId: 'rise-ready', name: 'Ginger Masala Chai (Kulhad Cup)', category: 'Quick Bite', price: 25.0, unitsLeft: 20, isNonVeg: false, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80', isBestSeller: true },

  // Blue Embers
  { id: 'f-8', outletId: 'blue-embers', name: 'Wood-Fired Margherita Pizza 10"', category: 'Best Seller', price: 240.0, unitsLeft: 0, isNonVeg: false, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80', isBestSeller: true },
  { id: 'f-9', outletId: 'blue-embers', name: 'Double Cheese Loaded Chicken Burger', category: 'Best Seller', price: 210.0, unitsLeft: 0, isNonVeg: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80', isBestSeller: true },

  // New Embers
  { id: 'f-10', outletId: 'new-embers', name: 'Schezwan Chicken Fried Rice Bowl', category: 'Best Seller', price: 190.0, unitsLeft: 0, isNonVeg: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80', isBestSeller: true },
];

const INITIAL_FOOD_ORDERS: FoodOrder[] = [
  {
    id: 'FOOD-8401',
    studentName: 'Aarav Sharma',
    studentRoom: 'Tower T1 - Room 502',
    items: ['1x Chicken Sandwich', '1x Oreo Thick Fudge Shake'],
    totalAmount: 205,
    outletId: 'rise-live',
    outletName: 'Rise Live Items',
    tokenCode: 'TK-9402',
    status: 'preparing',
    orderedAt: 'Today, 04:30 PM',
    paymentStatus: 'PAID_ONLINE',
  },
];

export default function CampusFoodPage() {
  const router = useRouter();
  const { currentUser } = useApp();

  const [restaurants] = useState<FoodRestaurant[]>(CANTEEN_RESTAURANTS);
  const [selectedOutlet, setSelectedOutlet] = useState<FoodRestaurant | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'wishlist'>('home');

  const [menuItems] = useState(FOOD_MENU_ITEMS);
  const [orders, setOrders] = useState<FoodOrder[]>(INITIAL_FOOD_ORDERS);
  const [wishlist, setWishlist] = useState<string[]>(['f-1', 'f-5']); // prefilled wishlist items
  const [cart, setCart] = useState<{ item: typeof FOOD_MENU_ITEMS[0]; qty: number }[]>([
    { item: FOOD_MENU_ITEMS[0], qty: 1 },
  ]);
  
  const [searchDish, setSearchDish] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Best Seller');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non_veg'>('all');
  const [notice, setNotice] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState<FoodOrder | null>(null);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  const updateCartQty = (item: typeof FOOD_MENU_ITEMS[0], delta: number) => {
    const existing = cart.find((c) => c.item.id === item.id);
    if (existing) {
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        setCart(cart.filter((c) => c.item.id !== item.id));
      } else {
        setCart(cart.map((c) => (c.item.id === item.id ? { ...c, qty: newQty } : c)));
      }
    } else if (delta > 0) {
      setCart([...cart, { item, qty: 1 }]);
    }
  };

  const toggleWishlist = (itemId: string) => {
    if (wishlist.includes(itemId)) {
      setWishlist(wishlist.filter((id) => id !== itemId));
    } else {
      setWishlist([...wishlist, itemId]);
    }
  };

  const getItemCartQty = (itemId: string) => {
    return cart.find((c) => c.item.id === itemId)?.qty || 0;
  };

  const totalCartItemsCount = cart.reduce((acc, c) => acc + c.qty, 0);
  const totalCartAmount = cart.reduce((acc, c) => acc + c.item.price * c.qty, 0);

  const handleCheckoutOrder = () => {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, c) => acc + c.item.price * c.qty, 0);
    const itemNames = cart.map((c) => `${c.qty}x ${c.item.name}`);
    const token = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: FoodOrder = {
      id: `FOOD-${Math.floor(8000 + Math.random() * 1000)}`,
      studentName: currentUser?.name || 'Aarav Sharma',
      studentRoom: currentUser?.roomOrUnit || 'Tower T1 - Room 502',
      items: itemNames,
      totalAmount: total,
      outletId: selectedOutlet?.id || 'rise-live',
      outletName: selectedOutlet?.name || 'Rise Live Items',
      tokenCode: token,
      status: 'preparing',
      orderedAt: 'Just now',
      paymentStatus: 'PAID_ONLINE',
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab('orders');
    setNotice(`ORDER PLACED: Food Token Code ${token} generated! Show code at counter.`);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedOutlet && item.outletId !== selectedOutlet.id) return false;
    
    const matchesSearch = item.name.toLowerCase().includes(searchDish.toLowerCase());
    const matchesCategory = selectedCategory === 'Best Seller' ? true : item.category === selectedCategory;
    
    let matchesDiet = true;
    if (dietaryFilter === 'veg') matchesDiet = !item.isNonVeg;
    if (dietaryFilter === 'non_veg') matchesDiet = item.isNonVeg;

    return matchesSearch && matchesCategory && matchesDiet;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-28 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER WITH WISHLIST AND KART ON TOP RIGHT */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 shadow-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (selectedOutlet) setSelectedOutlet(null);
                else if (activeTab !== 'home') setActiveTab('home');
                else router.push('/');
              }}
              className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Woxsen Food Court & Canteens
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                Fresh meals, hot snacks & iced beverages
              </p>
            </div>
          </div>

          {/* TOP RIGHT ACTION BUTTONS: WISHLIST AND KART (AS REQUESTED) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* WISHLIST BUTTON */}
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-9.5 h-9.5 rounded-2xl border flex items-center justify-center transition-all cursor-pointer relative ${
                activeTab === 'wishlist' ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title="My Wishlist"
            >
              <Heart className={`w-4.5 h-4.5 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* KART / CART BUTTON */}
            <button
              onClick={() => setActiveTab('cart')}
              className={`w-9.5 h-9.5 rounded-2xl border flex items-center justify-center transition-all cursor-pointer relative ${
                activeTab === 'cart' ? 'bg-rose-700 text-white border-rose-700' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs ring-2 ring-white">
                  {totalCartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 space-y-4">
        
        {/* NOTICE BANNER */}
        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{notice}</span>
            </div>
            <button onClick={() => setNotice(null)} className="font-black underline text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 1: CANTEEN OUTLETS DIRECTORY */}
        {/* =================================================================== */}
        {activeTab === 'home' && !selectedOutlet && (
          <div className="space-y-4 animate-in fade-in duration-200">

            {/* SEARCH & FILTER BAR */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchDish}
                  onChange={(e) => setSearchDish(e.target.value)}
                  placeholder="Search for outlets or cuisines..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500 shadow-xs"
                />
              </div>

              <button
                type="button"
                className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-600" />
                <span>Filter</span>
              </button>
            </div>



            {/* 4 VALUE FEATURE BADGES */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">Hygienic Food</h4>
                  <p className="text-[9px] text-slate-400 font-medium">Quality you can trust</p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
                  👨‍🍳
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">Live Kitchen</h4>
                  <p className="text-[9px] text-slate-400 font-medium">Hot & fresh food</p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                  ⏱️
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">Quick Delivery</h4>
                  <p className="text-[9px] text-slate-400 font-medium">On campus</p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5 shrink-0">
                <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                  🏷️
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">Great Offers</h4>
                  <p className="text-[9px] text-slate-400 font-medium">Every day</p>
                </div>
              </div>
            </div>

            {/* "CAMPUS OUTLETS" SECTION HEADER */}
            <div className="flex items-center justify-between pt-1">
              <div className="relative">
                <h2 className="text-sm sm:text-base font-black text-slate-900">Campus Outlets</h2>
                <span className="absolute -bottom-1 left-0 w-6 h-0.5 bg-rose-600 rounded-full" />
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black flex items-center gap-1.5 border border-emerald-200/60 shadow-2xs">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>32 Orders Active in Kitchens →</span>
              </span>
            </div>

            {/* 4 OUTLET CARDS LIST WITH QUEUE COUNT ON EACH BANNER (AS REQUESTED) */}
            <div className="space-y-3.5">
              {restaurants.map((rest) => (
                <div
                  key={rest.id}
                  onClick={() => setSelectedOutlet(rest)}
                  className="p-3 sm:p-3.5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex items-start justify-between gap-3 relative"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* LEFT FOOD PHOTO */}
                    <img
                      src={rest.image}
                      alt={rest.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 group-hover:scale-103 transition-transform"
                    />

                    {/* CENTER CONTENT */}
                    <div className="space-y-1 min-w-0 flex-1 pt-0.5">
                      {/* BRAND CIRCULAR BADGE NEXT TO TITLE */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border font-mono tracking-tight shrink-0 ${rest.brandColor}`}>
                          {rest.brandTag}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-rose-600 transition-colors truncate">
                          {rest.name}
                        </h3>
                      </div>

                      {/* CATEGORY IN BOLD CRIMSON RED */}
                      <p className="text-xs font-black text-rose-700 leading-tight">
                        {rest.category}
                      </p>

                      {/* DESCRIPTION */}
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {rest.description}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE BADGES (WITH NO. OF ORDERS IN QUEUE DISPLAYED ON EACH RESTAURANT BANNER) */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                    <div className="flex flex-col items-end gap-1.5">
                      {rest.isOpen ? (
                        <div className="flex items-center gap-1.5">
                          {/* QUEUE COUNT BADGE ON RESTAURANT BANNER (REQUESTED) */}
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-950 text-[9px] font-black border border-emerald-300 flex items-center gap-1">
                            <Users className="w-3 h-3 text-emerald-600" />
                            <span>{rest.queueCount} in Queue</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-950 text-[9px] font-black uppercase tracking-wider">
                            OPEN
                          </span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase border border-slate-200">
                          CLOSED
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-[11px] font-black text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rest.rating}</span>
                      </span>
                    </div>

                    <ChevronRight className="w-4.5 h-4.5 text-rose-800 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* "CRAVING SOMETHING?" DELIVERY PROMO CARD */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-50 via-rose-100/50 to-orange-50 border border-rose-100/80 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white text-2xl flex items-center justify-center shadow-xs shrink-0">
                  🛵
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">Craving something?</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Order from your favourite outlet and we'll deliver to you.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHowItWorksModal(true)}
                className="px-3.5 py-2 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-[11px] shadow-sm flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-all"
              >
                <span>How It Works</span>
                <Play className="w-3 h-3 fill-white" />
              </button>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: RESTAURANT MENU ITEMS */}
        {/* =================================================================== */}
        {activeTab === 'home' && selectedOutlet && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setSelectedOutlet(null)}
                className="text-xs font-black text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Canteen Outlets</span>
              </button>
            </div>

            {/* OUTLET HEADER BANNER WITH QUEUE COUNT */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-rose-600">{selectedOutlet.category}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-black border border-emerald-200">
                    {selectedOutlet.queueCount} Orders in Kitchen Queue
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900">{selectedOutlet.name}</h2>
                <p className="text-xs text-slate-500 font-medium">{selectedOutlet.description}</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black">
                ⭐ {selectedOutlet.rating}
              </span>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDish}
                onChange={(e) => setSearchDish(e.target.value)}
                placeholder="Search dish in menu..."
                className="w-full pl-9 pr-3.5 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 shadow-xs"
              />
            </div>

            {/* CATEGORY SCROLL TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 pb-2">
              {['Best Seller ⭐', 'Quick Bite', 'Sandwich', 'Milkshake'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rose-700 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* MENU ITEMS CARDS */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900">{selectedCategory}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMenuItems.map((item) => {
                  const qtyInCart = getItemCartQty(item.id);
                  const isWishlisted = wishlist.includes(item.id);
                  return (
                    <div key={item.id} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-between gap-4 relative">
                      <button
                        onClick={() => toggleWishlist(item.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                      </button>

                      <div className="space-y-1.5 flex-1 pr-6">
                        {item.unitsLeft > 0 && (
                          <span className="text-[10px] font-bold text-rose-600 block">
                            {item.unitsLeft} unit(s) left
                          </span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{item.isNonVeg ? '🔺' : '🟢'}</span>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">{item.name}</h4>
                        </div>

                        <p className="text-sm font-black text-slate-900">₹{item.price.toFixed(2)}</p>
                      </div>

                      <div className="space-y-2 shrink-0 text-center">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover shadow-xs" />

                        {qtyInCart > 0 ? (
                          <div className="flex items-center justify-between p-1 rounded-xl bg-rose-700 text-white font-black text-xs w-20 mx-auto">
                            <button onClick={() => updateCartQty(item, -1)} className="px-1 font-black cursor-pointer">-</button>
                            <span>{qtyInCart}</span>
                            <button onClick={() => updateCartQty(item, 1)} className="px-1 font-black cursor-pointer">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => updateCartQty(item, 1)}
                            className="w-20 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-black text-xs text-slate-900 shadow-xs cursor-pointer"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CART BASKET FLOATING BAR */}
            {totalCartItemsCount > 0 && (
              <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-2xl flex items-center justify-between sticky bottom-20 z-20">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">{totalCartItemsCount} Items Selected</span>
                  <span className="text-base font-black text-emerald-400">Total: ₹{totalCartAmount.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckoutOrder}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Place Order →
                </button>
              </div>
            )}

          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: FOOD ORDERS & PICKUP TOKENS */}
        {/* =================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xl flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">Kitchen Pickup Tokens</span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">My Active Food Orders ({orders.length})</h3>
                <p className="text-xs text-slate-500 font-medium">Show token code at the canteen pickup counter</p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-950 text-xs font-black flex items-center gap-1.5 border border-rose-200">
                <ChefHat className="w-4 h-4 text-rose-700" />
                <span>Preparing in Kitchen</span>
              </span>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden space-y-4">
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-[10px] text-amber-400 font-black uppercase block tracking-wider">{ord.outletName}</span>
                      <h4 className="text-xl font-black font-mono text-white">{ord.tokenCode}</h4>
                      <p className="text-xs text-slate-300 font-medium">{ord.orderedAt}</p>
                    </div>

                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase shadow-xs block w-fit ml-auto">
                        {ord.status}
                      </span>
                      <span className="text-xs text-slate-300 font-bold block mt-1">₹{ord.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowTokenModal(ord)}
                      className="w-full py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Show Counter Token Code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 4: MY CART VIEW */}
        {/* =================================================================== */}
        {activeTab === 'cart' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-rose-700" />
                  <span>My Food Cart ({totalCartItemsCount})</span>
                </h3>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="text-4xl">🍕</div>
                  <p className="text-xs text-slate-500 font-bold">Your food cart is empty.</p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 rounded-xl bg-rose-700 text-white font-black text-xs"
                  >
                    Browse Outlets Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(({ item, qty }) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{item.name}</h4>
                        <p className="text-[10px] text-slate-400">₹{item.price.toFixed(2)} x {qty}</p>
                      </div>

                      <div className="flex items-center justify-between p-1 rounded-xl bg-rose-700 text-white font-black text-xs w-20">
                        <button onClick={() => updateCartQty(item, -1)} className="px-1 font-black cursor-pointer">-</button>
                        <span>{qty}</span>
                        <button onClick={() => updateCartQty(item, 1)} className="px-1 font-black cursor-pointer">+</button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm font-black">
                    <span>Total Amount</span>
                    <span className="text-rose-700">₹{totalCartAmount.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleCheckoutOrder}
                    className="w-full py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    Place Order & Generate Pickup Token →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 5: WISHLIST VIEW */}
        {/* =================================================================== */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <span>My Wishlist Dishes ({wishlist.length})</span>
                </h3>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="text-4xl">❤️</div>
                  <p className="text-xs text-slate-500 font-bold">No dishes in your wishlist yet.</p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2 rounded-xl bg-rose-700 text-white font-black text-xs"
                  >
                    Explore Campus Dishes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {menuItems.filter((i) => wishlist.includes(i.id)).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 gap-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{item.name}</h4>
                          <p className="text-[10px] text-rose-700 font-bold">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item, 1)}
                          className="px-3 py-1.5 rounded-xl bg-rose-700 text-white font-black text-xs cursor-pointer"
                        >
                          + Add
                        </button>
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* COUNTER TOKEN MODAL */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Food Pickup Token</h3>
              <button onClick={() => setShowTokenModal(null)} className="font-black text-slate-400 hover:text-slate-900">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-bold block">{showTokenModal.outletName}</span>
              <span className="font-mono text-2xl font-black text-rose-700 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-300 inline-block">
                {showTokenModal.tokenCode}
              </span>
              <p className="text-xs text-slate-500 font-medium">Show this Token Code at the counter when your number is announced.</p>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl flex flex-col items-center justify-center space-y-3 text-white shadow-xl">
              <QrCode className="w-32 h-32 text-rose-400" />
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">Woxsen Food Court Token</span>
            </div>

            <button
              onClick={() => setShowTokenModal(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      {/* HOW IT WORKS MODAL */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">How Campus Delivery Works</h3>
              <button onClick={() => setShowHowItWorksModal(false)} className="font-black text-slate-400 hover:text-slate-900">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black shrink-0">1</span>
                <p>Browse your favourite campus food outlet and add meals to your cart.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black shrink-0">2</span>
                <p>Confirm order & receive a 4-digit live Pickup Token code.</p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black shrink-0">3</span>
                <p>Collect at the live counter or get fast delivery straight to your hostel block.</p>
              </div>
            </div>

            <button
              onClick={() => setShowHowItWorksModal(false)}
              className="w-full py-3 rounded-2xl bg-rose-700 text-white font-black text-xs uppercase"
            >
              Got It!
            </button>
          </div>
        </div>
      )}

      {/* CLEAN FOOD NAVIGATION BAR (HOME & PROFILE REMOVED AS REQUESTED) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/80 py-2 px-3 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 text-center text-[10px] font-bold">
          
          {/* TAB 1: OUTLETS / FOOD */}
          <button
            type="button"
            onClick={() => {
              setSelectedOutlet(null);
              setActiveTab('home');
            }}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'home' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <Utensils className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'text-rose-700' : 'text-slate-400'}`} />
            <span>Outlets</span>
            {activeTab === 'home' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

          {/* TAB 2: ORDERS */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'orders' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className={`w-5 h-5 mb-0.5 ${activeTab === 'orders' ? 'text-rose-700' : 'text-slate-400'}`} />
            <span>Orders</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

          {/* TAB 3: CART */}
          <button
            type="button"
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'cart' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <ShoppingCart className={`w-5 h-5 mb-0.5 ${activeTab === 'cart' ? 'text-rose-700' : 'text-slate-400'}`} />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                  {totalCartItemsCount}
                </span>
              )}
            </div>
            <span>Cart</span>
            {activeTab === 'cart' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

          {/* TAB 4: WISHLIST */}
          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'wishlist' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className={`w-5 h-5 mb-0.5 ${activeTab === 'wishlist' ? 'fill-rose-700 text-rose-700' : 'text-slate-400'}`} />
            <span>Wishlist</span>
            {activeTab === 'wishlist' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

        </div>
      </div>

    </div>
  );
}
