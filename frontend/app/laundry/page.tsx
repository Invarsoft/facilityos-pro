'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Shirt,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowLeft,
  Calendar,
  Layers,
  Wind,
  Droplets,
  QrCode,
  Check,
  Building,
  ShoppingCart,
  RefreshCw,
  Package,
  CreditCard,
  FileText,
  Lock,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Receipt,
  Grid,
  ShieldCheck,
  Star,
  Award,
  Crown,
  Copy,
  Zap,
  Bell,
  Home,
  User,
  Info,
  Truck,
  ShoppingBag,
} from 'lucide-react';

interface PastSubscription {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  coverage: string;
  remainingItems: number;
  expiredOn: string;
  status: 'Active' | 'Expired';
  amount: string;
}

interface LaundryOrder {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: string;
  status: 'Processing' | 'Ready' | 'Delivered';
  stepIndex?: number;
}

interface GarmentItem {
  id: string;
  name: string;
  serviceType: 'Laundry' | 'Pressing' | 'Dry Cleaning' | 'Shoes Wash';
  category: 'Bedding' | "Women's Wear" | "Men's Wear" | 'Footwear';
  price: number;
}

const GARMENT_ITEMS_CATALOG: GarmentItem[] = [
  // 1. LAUNDRY (WASH & TUMBLE DRY)
  { id: 'lnd-1', name: 'Quilt - Single', serviceType: 'Laundry', category: 'Bedding', price: 150.0 },
  { id: 'lnd-2', name: 'Blouse', serviceType: 'Laundry', category: "Women's Wear", price: 30.0 },
  { id: 'lnd-3', name: 'Shorts', serviceType: 'Laundry', category: "Men's Wear", price: 30.0 },
  { id: 'lnd-4', name: 'Hanky', serviceType: 'Laundry', category: 'Bedding', price: 10.0 },
  { id: 'lnd-5', name: 'Blanket - Single', serviceType: 'Laundry', category: 'Bedding', price: 150.0 },
  { id: 'lnd-6', name: 'Sweater', serviceType: 'Laundry', category: "Women's Wear", price: 60.0 },
  { id: 'lnd-7', name: 'T-Shirt', serviceType: 'Laundry', category: "Men's Wear", price: 25.0 },
  { id: 'lnd-8', name: 'Jeans / Trousers', serviceType: 'Laundry', category: "Men's Wear", price: 35.0 },
  { id: 'lnd-9', name: 'Bedsheet - Double', serviceType: 'Laundry', category: 'Bedding', price: 80.0 },

  // 2. PRESSING (STEAM IRONING)
  { id: 'prs-1', name: 'Hanky - Pressing', serviceType: 'Pressing', category: 'Bedding', price: 5.0 },
  { id: 'prs-2', name: 'Shorts - Pressing', serviceType: 'Pressing', category: "Men's Wear", price: 15.0 },
  { id: 'prs-3', name: 'Hand Towel - Pressing', serviceType: 'Pressing', category: 'Bedding', price: 15.0 },
  { id: 'prs-4', name: 'Bath Towel - Pressing', serviceType: 'Pressing', category: 'Bedding', price: 15.0 },
  { id: 'prs-5', name: 'Salwar - Pressing', serviceType: 'Pressing', category: "Women's Wear", price: 15.0 },
  { id: 'prs-6', name: 'Saree - Pressing', serviceType: 'Pressing', category: "Women's Wear", price: 37.5 },
  { id: 'prs-7', name: 'Shirt / T-Shirt - Pressing', serviceType: 'Pressing', category: "Men's Wear", price: 15.0 },
  { id: 'prs-8', name: 'Trouser - Pressing', serviceType: 'Pressing', category: "Men's Wear", price: 15.0 },

  // 3. DRY CLEANING / SHOE CARE
  { id: 'sh-1', name: 'Sports Sneakers Wash', serviceType: 'Shoes Wash', category: 'Footwear', price: 120.0 },
  { id: 'sh-2', name: 'White Canvas Shoes Wash', serviceType: 'Shoes Wash', category: 'Footwear', price: 100.0 },
  { id: 'sh-3', name: 'Leather Shoes Deep Clean', serviceType: 'Shoes Wash', category: 'Footwear', price: 200.0 },
  { id: 'sh-4', name: 'Suede Boots / Heels Clean', serviceType: 'Shoes Wash', category: 'Footwear', price: 250.0 },
];

const PAST_SUBSCRIPTIONS: PastSubscription[] = [
  {
    id: 'SUB-801',
    title: 'Monthly Subscription Pass',
    startDate: '16 Sep',
    endDate: '16 Oct',
    coverage: 'Covers all services (Laundry, Pressing)',
    remainingItems: 0,
    expiredOn: '16 Oct',
    status: 'Expired',
    amount: '₹1400.00',
  },
  {
    id: 'SUB-704',
    title: 'Monthly Subscription Pass',
    startDate: '12 Sep',
    endDate: '12 Oct',
    coverage: 'Covers all services (Laundry, Pressing)',
    remainingItems: 0,
    expiredOn: '12 Oct',
    status: 'Expired',
    amount: '₹1400.00',
  },
];

const INITIAL_LAUNDRY_ORDERS: LaundryOrder[] = [
  {
    id: 'LND-WOX-0764',
    date: '3 Aug 2026 at 8:47 PM',
    itemsCount: 2,
    totalAmount: '₹283.20',
    status: 'Processing',
    stepIndex: 2,
  },
  {
    id: 'LND-WOX-5252',
    date: '27 Feb 2026 at 12:36 PM',
    itemsCount: 4,
    totalAmount: '₹0.00 (Pass)',
    status: 'Processing',
    stepIndex: 1,
  },
];

export default function CampusLaundryPage() {
  const router = useRouter();
  const { currentUser } = useApp();

  // Navigation states: 'services_menu' | 'selected_service' | 'plans' | 'orders' | 'basket'
  const [activeTab, setActiveTab] = useState<'services_menu' | 'selected_service' | 'plans' | 'orders' | 'basket'>('services_menu');
  const [selectedServiceType, setSelectedServiceType] = useState<'Laundry' | 'Pressing' | 'Dry Cleaning' | 'Shoes Wash'>('Laundry');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const [orders, setOrders] = useState<LaundryOrder[]>(INITIAL_LAUNDRY_ORDERS);
  const [pastSubs] = useState<PastSubscription[]>(PAST_SUBSCRIPTIONS);
  
  // Cart state: { item: GarmentItem; qty: number }[]
  const [cart, setCart] = useState<{ item: GarmentItem; qty: number }[]>([
    { item: GARMENT_ITEMS_CATALOG[2], qty: 2 }, // prefilled 2 items in basket matching media_1788438738100.jpg
  ]);
  const [notice, setNotice] = useState<string | null>(null);

  const [subscribedPlan, setSubscribedPlan] = useState<string | null>('Monthly Subscription Pass (Active)');
  const [showBillModal, setShowBillModal] = useState<PastSubscription | null>(null);
  const [showQrModal, setShowQrModal] = useState<LaundryOrder | null>(null);

  const updateCartQty = (item: GarmentItem, delta: number) => {
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

  const getItemQtyInCart = (itemId: string) => {
    return cart.find((c) => c.item.id === itemId)?.qty || 0;
  };

  const totalCartItemsCount = cart.reduce((acc, c) => acc + c.qty, 0);
  const totalCartAmount = cart.reduce((acc, c) => acc + c.qty * c.item.price, 0);

  const handleCheckoutLaundryOrder = () => {
    if (cart.length === 0) return;

    const orderCode = `LND-WOX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: LaundryOrder = {
      id: orderCode,
      date: 'Just now',
      itemsCount: totalCartItemsCount,
      totalAmount: `₹${totalCartAmount.toFixed(2)}`,
      status: 'Processing',
      stepIndex: 1,
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab('orders');
    setNotice(`ORDER PLACED: Laundry Batch ${orderCode} created! Drop clothes at Hostel Laundry Bay.`);
  };

  const currentCategoryTabs =
    selectedServiceType === 'Shoes Wash'
      ? ['All', 'Footwear']
      : ['All', 'Bedding', "Women's Wear", "Men's Wear"];

  const activeCategoryFilter = currentCategoryTabs.includes(selectedCategoryFilter)
    ? selectedCategoryFilter
    : 'All';

  const filteredGarmentItems = GARMENT_ITEMS_CATALOG.filter((item) => {
    if (item.serviceType !== selectedServiceType) return false;
    if (activeCategoryFilter === 'All') return true;
    return item.category === activeCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-slate-100 pb-28 animate-in fade-in duration-300">
      
      {/* 1. WOXSEN DEEP CRIMSON RED GRADIENT HEADER (EXACT MATCH FOR media_1788438738100.jpg) */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 text-white px-4 py-4 shadow-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'selected_service') setActiveTab('services_menu');
                else if (activeTab !== 'services_menu') setActiveTab('services_menu');
                else router.push('/');
              }}
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Woxsen Campus Laundry
              </h1>
              <p className="text-[10px] sm:text-xs text-rose-200 font-semibold leading-tight">
                Hostel Laundry, Dry Cleaning & Shoe Care
              </p>
            </div>
          </div>

          {/* TOP RIGHT ICONS: NOTIFICATION BELL + BASKET WITH RED BADGE (EXACT MATCH) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => router.push('/notifications')}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white relative cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-red-950" />
            </button>

            <button
              onClick={() => setActiveTab('basket')}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white relative cursor-pointer"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                  {totalCartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-5 space-y-5">
        
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
        {/* VIEW 1: MAIN SERVICES LANDING (EXACT MATCH FOR media_1788438738100.jpg) */}
        {/* =================================================================== */}
        {activeTab === 'services_menu' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* TOP CARD BANNER (WASHER BAY B + WASHING MACHINE IMAGE) */}
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-md flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    <span>CENTRAL WASHER BAY B</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black flex items-center gap-1 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Desks Operational</span>
                  </span>
                </div>

                <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                  Woxsen Campus Laundry & Care Desks
                </h2>
                <p className="text-xs text-slate-500 font-medium max-w-md">
                  Select a service desk below to view itemized price rates and add garments to your basket.
                </p>
              </div>

              {/* WASHING MACHINE & LAUNDRY BASKET ILLUSTRATION */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 p-2 shrink-0 flex items-center justify-center text-4xl shadow-inner">
                🧺
              </div>
            </div>

            {/* "OUR SERVICE DESKS" LIST SECTION */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Our Service Desks</h3>

              {/* DESK 1: LAUNDRY SERVICE (EXPANDED HIGHLIGHTED CARD) */}
              <div className="rounded-3xl bg-white border-2 border-rose-200 shadow-md overflow-hidden transition-all duration-200">
                <div
                  onClick={() => {
                    setSelectedServiceType('Laundry');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100/60 text-rose-700 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                      🧺
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">Service Desk 01</span>
                      <h4 className="text-base font-black text-slate-900">Laundry Service</h4>
                      <p className="text-xs text-slate-500 font-medium">Wash, Anti-Bacterial Treatment & Tumble Dry</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black">
                      From ₹10.00
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* EXPANDED ACTION LINE BELOW DESK 01 */}
                <div
                  onClick={() => {
                    setSelectedServiceType('Laundry');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="px-5 py-3 border-t border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs font-black text-rose-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>Browse Laundry Rates ({GARMENT_ITEMS_CATALOG.filter((i) => i.serviceType === 'Laundry').length} items)</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* DESK 2: STEAM PRESSING */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-md hover:border-amber-400 overflow-hidden transition-all duration-200">
                <div
                  onClick={() => {
                    setSelectedServiceType('Pressing');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl shrink-0 border border-amber-100">
                      👔
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Service Desk 02</span>
                      <h4 className="text-base font-black text-slate-900">Steam Pressing</h4>
                      <p className="text-xs text-slate-500 font-medium">High-Temp Steam Ironing & Crisp Folding</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black">
                      From ₹5.00
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedServiceType('Pressing');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="px-5 py-3 border-t border-amber-100 bg-amber-50/40 flex items-center justify-between text-xs font-black text-amber-800 cursor-pointer hover:bg-amber-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>Browse Pressing Rates ({GARMENT_ITEMS_CATALOG.filter((i) => i.serviceType === 'Pressing').length} items)</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* DESK 3: DRY CLEANING */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-md hover:border-purple-400 overflow-hidden transition-all duration-200">
                <div
                  onClick={() => {
                    setSelectedServiceType('Dry Cleaning');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-purple-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-3xl shrink-0 border border-purple-100">
                      🧥
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Service Desk 03</span>
                      <h4 className="text-base font-black text-slate-900">Dry Cleaning</h4>
                      <p className="text-xs text-slate-500 font-medium">Formals, Suits, Blazers & Heavy Outerwear</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-black">
                      From ₹180.00
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedServiceType('Dry Cleaning');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="px-5 py-3 border-t border-purple-100 bg-purple-50/40 flex items-center justify-between text-xs font-black text-purple-800 cursor-pointer hover:bg-purple-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-700" />
                    <span>Browse Dry Cleaning Rates ({GARMENT_ITEMS_CATALOG.filter((i) => i.serviceType === 'Dry Cleaning').length} items)</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* DESK 4: SHOE CARE */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-md hover:border-sky-400 overflow-hidden transition-all duration-200">
                <div
                  onClick={() => {
                    setSelectedServiceType('Shoes Wash');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-sky-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-3xl shrink-0 border border-sky-100">
                      👟
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Service Desk 04</span>
                      <h4 className="text-base font-black text-slate-900">Shoe Care</h4>
                      <p className="text-xs text-slate-500 font-medium">Shoe Cleaning, Whitening & Protection</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-black">
                      From ₹20.00
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedServiceType('Shoes Wash');
                    setSelectedCategoryFilter('All');
                    setActiveTab('selected_service');
                  }}
                  className="px-5 py-3 border-t border-sky-100 bg-sky-50/40 flex items-center justify-between text-xs font-black text-sky-800 cursor-pointer hover:bg-sky-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-700" />
                    <span>Browse Shoe Care Rates ({GARMENT_ITEMS_CATALOG.filter((i) => i.serviceType === 'Shoes Wash').length} items)</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>

            {/* "HOW IT WORKS" STEP-BY-STEP FLOW */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>How it works</span>
              </h4>

              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-700">
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-lg mx-auto shadow-xs">
                    🛍️
                  </div>
                  <p className="font-black text-slate-900 leading-tight">Choose Service</p>
                  <p className="text-[9px] text-slate-400 font-normal">Select a desk</p>
                </div>

                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-lg mx-auto shadow-xs">
                    👕
                  </div>
                  <p className="font-black text-slate-900 leading-tight">Add Items</p>
                  <p className="text-[9px] text-slate-400 font-normal">Add to basket</p>
                </div>

                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mx-auto shadow-xs">
                    📋
                  </div>
                  <p className="font-black text-slate-900 leading-tight">Place Order</p>
                  <p className="text-[9px] text-slate-400 font-normal">Confirm & pay</p>
                </div>

                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-lg mx-auto shadow-xs">
                    🚚
                  </div>
                  <p className="font-black text-slate-900 leading-tight">We Care</p>
                  <p className="text-[9px] text-slate-400 font-normal">Clean & deliver</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: ITEMIZED GARMENT PRICE RATE LIST */}
        {/* =================================================================== */}
        {activeTab === 'selected_service' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setActiveTab('services_menu')}
                className="text-xs font-black text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Services Menu</span>
              </button>
            </div>

            {/* HORIZONTAL CATEGORY SCROLL TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {currentCategoryTabs.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
                    activeCategoryFilter === cat
                      ? 'bg-rose-700 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* GARMENT RATE LIST CARDS */}
            <div className="space-y-3">
              {filteredGarmentItems.map((item) => {
                const qtyInCart = getItemQtyInCart(item.id);
                return (
                  <div key={item.id} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md flex items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h4 className="text-base font-black text-slate-900 leading-tight">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{item.category}</p>
                      <p className="text-base font-black text-rose-700">₹{item.price.toFixed(2)}</p>
                    </div>

                    <div className="shrink-0">
                      {qtyInCart > 0 ? (
                        <div className="flex items-center justify-between p-1 rounded-2xl bg-rose-700 text-white font-black text-xs w-24">
                          <button onClick={() => updateCartQty(item, -1)} className="px-2 font-black cursor-pointer text-sm">-</button>
                          <span>{qtyInCart}</span>
                          <button onClick={() => updateCartQty(item, 1)} className="px-2 font-black cursor-pointer text-sm">+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateCartQty(item, 1)}
                          className="px-5 py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs shadow-md shadow-rose-700/30 cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
                        >
                          <span>+ Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FLOATING CART BASKET BAR */}
            {totalCartItemsCount > 0 && (
              <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-2xl flex items-center justify-between sticky bottom-20 z-20">
                <div>
                  <span className="text-xs font-bold text-slate-400 block">{totalCartItemsCount} Items Selected</span>
                  <span className="text-base font-black text-emerald-400">Total: ₹{totalCartAmount.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckoutLaundryOrder}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Place Order →
                </button>
              </div>
            )}

          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: MY BASKET VIEW */}
        {/* =================================================================== */}
        {activeTab === 'basket' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-rose-700" />
                  <span>My Garment Basket ({totalCartItemsCount})</span>
                </h3>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="text-4xl">🧺</div>
                  <p className="text-xs text-slate-500 font-bold">Your laundry basket is empty.</p>
                  <button
                    onClick={() => setActiveTab('services_menu')}
                    className="px-4 py-2 rounded-xl bg-rose-700 text-white font-black text-xs"
                  >
                    Add Garments Now
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
                    onClick={handleCheckoutLaundryOrder}
                    className="w-full py-3.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    Confirm & Submit Batch Order →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 4: MY ORDERS TRACKER */}
        {/* =================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xl flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">Campus Batch Tracker</span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">My Active Laundry Orders ({orders.length})</h3>
                <p className="text-xs text-slate-500 font-medium">Track your garments at Central Washer Bay B</p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-xs font-black flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>2 Active Batches</span>
              </span>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden space-y-4">
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                        📦
                      </div>
                      <div>
                        <span className="font-mono text-sm font-black text-amber-400 tracking-wider block">{ord.id}</span>
                        <span className="text-[11px] text-slate-300 font-medium">{ord.date}</span>
                      </div>
                    </div>

                    <span className="px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black uppercase border border-sky-400/40">
                      {ord.status}
                    </span>
                  </div>

                  <div className="px-5 pb-5 space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-50 text-xs font-bold text-slate-700 flex justify-between">
                      <span>Items: {ord.itemsCount} Garments</span>
                      <span className="text-rose-700">{ord.totalAmount}</span>
                    </div>

                    <button
                      onClick={() => setShowQrModal(ord)}
                      className="w-full py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Show Counter Pickup QR Code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FIXED BOTTOM NAVIGATION BAR FOR LAUNDRY (4 TABS) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-2 px-3 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 text-center text-[10px] font-bold">
          
          {/* TAB 1: SERVICES (LAUNDRY HOME PAGE) */}
          <button
            type="button"
            onClick={() => setActiveTab('services_menu')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'services_menu' || activeTab === 'selected_service' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <Grid className={`w-5 h-5 mb-0.5 ${activeTab === 'services_menu' || activeTab === 'selected_service' ? 'text-rose-700' : 'text-slate-400'}`} />
            <span>Services</span>
            {(activeTab === 'services_menu' || activeTab === 'selected_service') && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

          {/* TAB 2: MY ORDERS */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'orders' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className={`w-5 h-5 mb-0.5 ${activeTab === 'orders' ? 'text-rose-700' : 'text-slate-400'}`} />
            <span>My Orders</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

          {/* TAB 3: MY BASKET */}
          <button
            type="button"
            onClick={() => setActiveTab('basket')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'basket' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-5 h-5 mb-0.5 ${activeTab === 'basket' ? 'text-rose-700' : 'text-slate-400'}`} />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {totalCartItemsCount}
                </span>
              )}
            </div>
            <span>My Basket</span>
            {activeTab === 'basket' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

          {/* TAB 4: PASSES & SUBSCRIPTIONS */}
          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
              activeTab === 'plans' ? 'text-rose-700 font-black' : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            <CreditCard className={`w-5 h-5 mb-0.5 ${activeTab === 'plans' ? 'text-rose-700' : 'text-slate-400'}`} />
            <span>Passes</span>
            {activeTab === 'plans' && (
              <span className="absolute bottom-0 w-8 h-0.5 bg-rose-700 rounded-full" />
            )}
          </button>

        </div>
      </div>

    </div>
  );
}
