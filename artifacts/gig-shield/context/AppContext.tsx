import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Platform = "swiggy" | "zomato" | "zepto" | "blinkit" | "dunzo";
export type PolicyTier = "basic" | "standard" | "premium";
export type TriggerType = "aqi" | "rain" | "heat" | "curfew" | "flood";

export interface Worker {
  id: string;
  name: string;
  phone: string;
  platform: Platform;
  zone: string;
  pincode: string;
  upiId: string;
  aadhaarVerified: boolean;
  selfieVerified: boolean;
  weeklyEarnings: number;
  riskScore: number;
  streakWeeks: number;
  joinedAt: string;
  avatarInitials: string;
}

export interface Policy {
  id: string;
  tier: PolicyTier;
  weeklyPremium: number;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  active: boolean;
  autoRenew: boolean;
}

export interface Trigger {
  id: string;
  type: TriggerType;
  value: number;
  threshold: number;
  timestamp: string;
  zone: string;
  payoutAmount: number;
  status: "triggered" | "monitoring" | "cleared";
  description: string;
}

export interface Payout {
  id: string;
  triggerId: string;
  triggerType: TriggerType;
  amount: number;
  timestamp: string;
  upiRef: string;
  reason: string;
  estimatedLostEarnings: number;
}

export interface WeatherData {
  aqi: number;
  aqiMax: number;
  rainfall: number;
  rainfallMax: number;
  temperature: number;
  tempMax: number;
  zone: string;
  lastUpdated: string;
}

export interface AppState {
  worker: Worker | null;
  policy: Policy | null;
  triggers: Trigger[];
  payouts: Payout[];
  weather: WeatherData | null;
  onboarded: boolean;
  totalPaidOut: number;
  totalPremiums: number;
}

interface AppContextType extends AppState {
  setWorker: (w: Worker) => void;
  setPolicy: (p: Policy) => void;
  markOnboarded: () => void;
  addPayout: (p: Payout) => void;
  refreshWeather: () => void;
  selectPolicyTier: (tier: PolicyTier) => void;
}

const STORAGE_KEY = "gigshield_v1";

const defaultWeather: WeatherData = {
  aqi: 228,
  aqiMax: 300,
  rainfall: 32,
  rainfallMax: 50,
  temperature: 38,
  tempMax: 45,
  zone: "Andheri East, Mumbai",
  lastUpdated: new Date().toISOString(),
};

const defaultTriggers: Trigger[] = [
  {
    id: "t1",
    type: "rain",
    value: 32,
    threshold: 50,
    timestamp: new Date().toISOString(),
    zone: "Andheri East, Mumbai",
    payoutAmount: 0,
    status: "monitoring",
    description: "Rainfall is 32mm — needs 50mm for payout",
  },
  {
    id: "t2",
    type: "aqi",
    value: 228,
    threshold: 300,
    timestamp: new Date().toISOString(),
    zone: "Andheri East, Mumbai",
    payoutAmount: 0,
    status: "monitoring",
    description: "AQI is 228 — needs 300+ for payout",
  },
];

const defaultPayouts: Payout[] = [
  {
    id: "p1",
    triggerId: "trig_old1",
    triggerType: "aqi",
    amount: 180,
    timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
    upiRef: "UPI2024031811",
    reason: "AQI hit 320 in your zone",
    estimatedLostEarnings: 210,
  },
  {
    id: "p2",
    triggerId: "trig_old2",
    triggerType: "rain",
    amount: 230,
    timestamp: new Date(Date.now() - 14 * 86400000).toISOString(),
    upiRef: "UPI2024031002",
    reason: "Rainfall 62mm exceeded threshold",
    estimatedLostEarnings: 280,
  },
];

const defaultWorker: Worker = {
  id: "w1",
  name: "Rahul Sharma",
  phone: "+91 98765 43210",
  platform: "swiggy",
  zone: "Andheri East",
  pincode: "400069",
  upiId: "rahul@upi",
  aadhaarVerified: true,
  selfieVerified: true,
  weeklyEarnings: 4200,
  riskScore: 72,
  streakWeeks: 4,
  joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  avatarInitials: "RS",
};

const defaultPolicy: Policy = {
  id: "pol1",
  tier: "standard",
  weeklyPremium: 49,
  coverageAmount: 2500,
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
  active: true,
  autoRenew: true,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    worker: null,
    policy: null,
    triggers: defaultTriggers,
    payouts: defaultPayouts,
    weather: defaultWeather,
    onboarded: false,
    totalPaidOut: 410,
    totalPremiums: 196,
  });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setState((prev) => ({ ...prev, ...saved }));
        } catch {
          setState((prev) => ({
            ...prev,
            worker: defaultWorker,
            policy: defaultPolicy,
            onboarded: true,
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          worker: defaultWorker,
          policy: defaultPolicy,
          onboarded: true,
        }));
      }
    });
  }, []);

  const persist = useCallback((updates: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setWorker = useCallback(
    (w: Worker) => persist({ worker: w }),
    [persist]
  );
  const setPolicy = useCallback(
    (p: Policy) => persist({ policy: p }),
    [persist]
  );
  const markOnboarded = useCallback(
    () => persist({ onboarded: true }),
    [persist]
  );
  const addPayout = useCallback(
    (p: Payout) =>
      setState((prev) => {
        const next = {
          ...prev,
          payouts: [p, ...prev.payouts],
          totalPaidOut: prev.totalPaidOut + p.amount,
        };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      }),
    []
  );

  const refreshWeather = useCallback(() => {
    const updated: WeatherData = {
      ...defaultWeather,
      aqi: 200 + Math.floor(Math.random() * 80),
      rainfall: 20 + Math.floor(Math.random() * 25),
      temperature: 36 + Math.floor(Math.random() * 8),
      lastUpdated: new Date().toISOString(),
    };
    persist({ weather: updated });
  }, [persist]);

  const selectPolicyTier = useCallback(
    (tier: PolicyTier) => {
      const tiers = {
        basic: { weeklyPremium: 29, coverageAmount: 1000 },
        standard: { weeklyPremium: 49, coverageAmount: 2500 },
        premium: { weeklyPremium: 79, coverageAmount: 5000 },
      };
      const pol: Policy = {
        id: "pol_" + Date.now(),
        tier,
        ...tiers[tier],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        active: true,
        autoRenew: true,
      };
      persist({ policy: pol });
    },
    [persist]
  );

  return (
    <AppContext.Provider
      value={{
        ...state,
        setWorker,
        setPolicy,
        markOnboarded,
        addPayout,
        refreshWeather,
        selectPolicyTier,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
