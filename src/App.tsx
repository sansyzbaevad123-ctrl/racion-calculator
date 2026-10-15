import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, Flame, Award, Plus, Trash2, PieChart, Activity, 
  User, Check, Search, Sparkles, Sliders, ChevronDown, 
  ChevronUp, RefreshCw, Info, PlusCircle, Scale, ArrowRight,
  Coffee, Sun, Moon, Apple, Settings
} from 'lucide-react';

// --- БАЗА ДАННЫХ ПРОДУКТОВ (на 100г) ---
const INITIAL_FOOD_DB = [
  // Завтраки и крупы
  { id: 'f1', name: 'Овсяные хлопья (сухие)', kcal: 350, p: 12.5, f: 6.2, c: 61.0, category: 'Крупы и злаки', defaultWeight: 50 },
  { id: 'f2', name: 'Гречка отварная', kcal: 110, p: 4.2, f: 1.1, c: 21.3, category: 'Крупы и злаки', defaultWeight: 150 },
  { id: 'f3', name: 'Рис белый отварной', kcal: 116, p: 2.2, f: 0.5, c: 24.9, category: 'Крупы и злаки', defaultWeight: 150 },
  { id: 'f4', name: 'Макароны из ТСП отварные', kcal: 112, p: 3.5, f: 0.4, c: 23.2, category: 'Крупы и злаки', defaultWeight: 150 },
  { id: 'f5', name: 'Хлеб цельнозерновой', kcal: 247, p: 13.0, f: 3.4, c: 41.0, category: 'Крупы и злаки', defaultWeight: 40 },
  
  // Белковые продукты, мясо, рыба, яйца
  { id: 'f6', name: 'Куриная грудка (филе запеченное)', kcal: 137, p: 29.8, f: 1.8, c: 0.0, category: 'Мясо и птица', defaultWeight: 150 },
  { id: 'f7', name: 'Индейка (филе на пару)', kcal: 113, p: 24.0, f: 1.5, c: 0.0, category: 'Мясо и птица', defaultWeight: 150 },
  { id: 'f8', name: 'Говядина постная тушеная', kcal: 175, p: 26.0, f: 7.5, c: 0.0, category: 'Мясо и птица', defaultWeight: 130 },
  { id: 'f9', name: 'Лосось / Семга слабосоленая или запеченная', kcal: 208, p: 20.4, f: 13.4, c: 0.0, category: 'Рыба и морепродукты', defaultWeight: 100 },
  { id: 'f10', name: 'Треска запеченная', kcal: 82, p: 17.8, f: 0.7, c: 0.0, category: 'Рыба и морепродукты', defaultWeight: 150 },
  { id: 'f11', name: 'Тунец консервированный в с/с', kcal: 101, p: 23.0, f: 0.8, c: 0.0, category: 'Рыба и морепродукты', defaultWeight: 100 },
  { id: 'f12', name: 'Яйцо куриное вареное (1 шт ≈ 55г)', kcal: 157, p: 12.7, f: 11.5, c: 0.7, category: 'Яйца и молочные', defaultWeight: 110 },
  
  // Молочные продукты
  { id: 'f13', name: 'Творог 5%', kcal: 121, p: 17.2, f: 5.0, c: 1.8, category: 'Яйца и молочные', defaultWeight: 150 },
  { id: 'f14', name: 'Творог обезжиренный 0.5%', kcal: 71, p: 16.5, f: 0.5, c: 1.3, category: 'Яйца и молочные', defaultWeight: 150 },
  { id: 'f15', name: 'Греческий йогурт 2%', kcal: 66, p: 8.5, f: 2.0, c: 3.5, category: 'Яйца и молочные', defaultWeight: 140 },
  { id: 'f16', name: 'Сыр твердый (Российский/Гауда 45%)', kcal: 356, p: 24.0, f: 28.5, c: 0.0, category: 'Яйца и молочные', defaultWeight: 30 },
  { id: 'f17', name: 'Сыр Моцарелла', kcal: 280, p: 22.0, f: 21.0, c: 1.0, category: 'Яйца и молочные', defaultWeight: 50 },
  { id: 'f18', name: 'Молоко 2.5%', kcal: 52, p: 2.8, f: 2.5, c: 4.7, category: 'Яйца и молочные', defaultWeight: 200 },
  { id: 'f19', name: 'Кефир 1%', kcal: 40, p: 3.0, f: 1.0, c: 4.0, category: 'Яйца и молочные', defaultWeight: 250 },

  // Овощи и зелень
  { id: 'f20', name: 'Огурцы свежие', kcal: 15, p: 0.8, f: 0.1, c: 2.8, category: 'Овощи и фрукты', defaultWeight: 120 },
  { id: 'f21', name: 'Помидоры свежие', kcal: 20, p: 1.1, f: 0.2, c: 3.7, category: 'Овощи и фрукты', defaultWeight: 120 },
  { id: 'f22', name: 'Брокколи на пару', kcal: 34, p: 2.8, f: 0.4, c: 6.6, category: 'Овощи и фрукты', defaultWeight: 150 },
  { id: 'f23', name: 'Картофель отварной / запеченный', kcal: 82, p: 2.0, f: 0.4, c: 16.7, category: 'Овощи и фрукты', defaultWeight: 150 },
  { id: 'f24', name: 'Авокадо', kcal: 160, p: 2.0, f: 14.7, c: 1.8, category: 'Овощи и фрукты', defaultWeight: 70 },

  // Фрукты и ягоды
  { id: 'f25', name: 'Банан (очищенный)', kcal: 96, p: 1.5, f: 0.5, c: 21.0, category: 'Овощи и фрукты', defaultWeight: 120 },
  { id: 'f26', name: 'Яблоко зеленое / красное', kcal: 47, p: 0.4, f: 0.4, c: 9.8, category: 'Овощи и фрукты', defaultWeight: 150 },
  { id: 'f27', name: 'Голубика / Ягоды свежие', kcal: 57, p: 0.7, f: 0.3, c: 14.5, category: 'Овощи и фрукты', defaultWeight: 100 },

  // Жиры, орехи, сладости и готовые блюда
  { id: 'f28', name: 'Миндаль / Грецкий орех', kcal: 609, p: 18.6, f: 53.7, c: 13.0, category: 'Орехи и масла', defaultWeight: 25 },
  { id: 'f29', name: 'Масло оливковое / подсолнечное', kcal: 898, p: 0.0, f: 99.8, c: 0.0, category: 'Орехи и масла', defaultWeight: 10 },
  { id: 'f30', name: 'Масло сливочное 82.5%', kcal: 748, p: 0.6, f: 82.5, c: 0.8, category: 'Орехи и масла', defaultWeight: 15 },
  { id: 'f31', name: 'Арахисовая паста без сахара', kcal: 588, p: 25.0, f: 50.0, c: 20.0, category: 'Орехи и масла', defaultWeight: 25 },
  { id: 'f32', name: 'Шоколад горький 75%', kcal: 539, p: 6.2, f: 35.4, c: 48.2, category: 'Сладости и разное', defaultWeight: 20 },
  { id: 'f33', name: 'Протеиновый порошок (сывороточный)', kcal: 390, p: 78.0, f: 5.5, c: 7.0, category: 'Сладости и разное', defaultWeight: 30 },
  { id: 'f34', name: 'Сырники из творога запеченные', kcal: 185, p: 15.2, f: 6.8, c: 15.5, category: 'Готовые блюда', defaultWeight: 150 },
  { id: 'f35', name: 'Борщ с говядиной', kcal: 58, p: 3.8, f: 2.9, c: 4.3, category: 'Готовые блюда', defaultWeight: 300 },
];

// --- ПРИМЕР СБАЛАНСИРОВАННОГО РАЦИОНА ПО УМОЛЧАНИЮ ---
const INITIAL_MEALS = {
  breakfast: [
    { id: 'm1', foodId: 'f1', name: 'Овсяные хлопья (сухие)', weight: 50, kcal100: 350, p100: 12.5, f100: 6.2, c100: 61.0 },
    { id: 'm2', foodId: 'f12', name: 'Яйцо куриное вареное (1 шт ≈ 55г)', weight: 110, kcal100: 157, p100: 12.7, f100: 11.5, c100: 0.7 },
    { id: 'm3', foodId: 'f25', name: 'Банан (очищенный)', weight: 100, kcal100: 96, p100: 1.5, f100: 0.5, c100: 21.0 },
  ],
  lunch: [
    { id: 'm4', foodId: 'f2', name: 'Гречка отварная', weight: 160, kcal100: 110, p100: 4.2, f100: 1.1, c100: 21.3 },
    { id: 'm5', foodId: 'f6', name: 'Куриная грудка (филе запеченное)', weight: 150, kcal100: 137, p100: 29.8, f100: 1.8, c100: 0.0 },
    { id: 'm6', foodId: 'f21', name: 'Помидоры свежие', weight: 120, kcal100: 20, p100: 1.1, f100: 0.2, c100: 3.7 },
    { id: 'm7', foodId: 'f29', name: 'Масло оливковое / подсолнечное', weight: 10, kcal100: 898, p100: 0.0, f100: 99.8, c100: 0.0 },
  ],
  dinner: [
    { id: 'm8', foodId: 'f9', name: 'Лосось / Семга слабосоленая или запеченная', weight: 130, kcal100: 208, p100: 20.4, f100: 13.4, c100: 0.0 },
    { id: 'm9', foodId: 'f22', name: 'Брокколи на пару', weight: 150, kcal100: 34, p100: 2.8, f100: 0.4, c100: 6.6 },
  ],
  snacks: [
    { id: 'm10', foodId: 'f13', name: 'Творог 5%', weight: 150, kcal100: 121, p100: 17.2, f100: 5.0, c100: 1.8 },
    { id: 'm11', foodId: 'f28', name: 'Миндаль / Грецкий орех', weight: 20, kcal100: 609, p100: 18.6, f100: 53.7, c100: 13.0 },
  ]
};

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Минимальная', desc: 'Сидячая работа, отсутствие тренировок' },
  { value: 1.375, label: 'Низкая', desc: 'Легкие тренировки 1–3 раза в неделю или долгие прогулки' },
  { value: 1.55, label: 'Умеренная', desc: 'Тренировки средней тяжести 3–5 раз в неделю' },
  { value: 1.725, label: 'Высокая', desc: 'Интенсивные нагрузки 6–7 раз в неделю' },
  { value: 1.9, label: 'Экстремальная', desc: 'Тяжелый физический труд или тренировки 2 раза в день' }
];

const GOALS = [
  { id: 'loss_fast', label: 'Интенсивное похудение', factor: 0.78, badge: '-22%' },
  { id: 'loss', label: 'Комфортное похудение', factor: 0.85, badge: '-15%' },
  { id: 'maintain', label: 'Поддержание веса', factor: 1.0, badge: 'Норма' },
  { id: 'gain', label: 'Набор мышечной массы', factor: 1.15, badge: '+15%' },
];

const MACRO_PRESETS = [
  { id: 'balanced', name: 'Сбалансированный', p: 30, f: 25, c: 45, desc: 'Оптимально для здоровья и энергии' },
  { id: 'high_protein', name: 'Высокобелковый (Фитнес)', p: 35, f: 25, c: 40, desc: 'Для сохранения мышц и рельефа' },
  { id: 'low_carb', name: 'Низкоуглеводный (LCHF)', p: 30, f: 45, c: 25, desc: 'Снижение инсулиновых откликов' },
  { id: 'endurance', name: 'Выносливость и спорт', p: 25, f: 20, c: 55, desc: 'Максимум энергии для тренировок' },
];

const MEAL_SECTIONS = [
  { key: 'breakfast', title: 'Завтрак', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'lunch', title: 'Обед', icon: Sun, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { key: 'dinner', title: 'Ужин', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { key: 'snacks', title: 'Перекусы', icon: Apple, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
];

export default function App() {
  // --- СОСТОЯНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ ---
  const [profile, setProfile] = useState({
    gender: 'female',
    age: 28,
    weight: 65,
    height: 168,
    activity: 1.375,
    goal: 'loss'
  });

  // --- СОСТОЯНИЕ ПРОПОРЦИЙ БЖУ (в %) ---
  const [macroRatios, setMacroRatios] = useState({ p: 30, f: 25, c: 45 });
  const [activePreset, setActivePreset] = useState('balanced');

  // --- БАЗА ПРОДУКТОВ И ДНЕВНИК ПИТАНИЯ ---
  const [foodDb, setFoodDb] = useState(INITIAL_FOOD_DB);
  const [meals, setMeals] = useState(INITIAL_MEALS);

  // --- UI СОСТОЯНИЯ ---
  const [activeMealToAdd, setActiveMealToAdd] = useState(null); // 'breakfast' | 'lunch' | 'dinner' | 'snacks' | null
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedWeight, setSelectedWeight] = useState(100);
  const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Состояние нового пользовательского продукта
  const [customFood, setCustomFood] = useState({
    name: '',
    kcal: '',
    p: '',
    f: '',
    c: '',
    defaultWeight: 100
  });

  // Всплывающее уведомление
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- РАСЧЕТ НОРМЫ ПО МИФФЛИНУ - САН-ЖЕОРУ ---
  const targets = useMemo(() => {
    const { gender, age, weight, height, activity, goal } = profile;
    const baseBMR = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
    const bmr = gender === 'male' ? baseBMR + 5 : baseBMR - 161;
    const tdee = bmr * Number(activity);
    
    const goalObj = GOALS.find(g => g.id === goal) || GOALS[2];
    const targetCalories = Math.max(1200, Math.round(tdee * goalObj.factor));

    // 1г Белка = 4 ккал, 1г Жира = 9 ккал, 1г Углеводов = 4 ккал
    const targetP = Math.round((targetCalories * (macroRatios.p / 100)) / 4);
    const targetF = Math.round((targetCalories * (macroRatios.f / 100)) / 9);
    const targetC = Math.round((targetCalories * (macroRatios.c / 100)) / 4);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      kcal: targetCalories,
      p: targetP,
      f: targetF,
      c: targetC
    };
  }, [profile, macroRatios]);

  // --- РАСЧЕТ ФАКТИЧЕСКИ СЪЕДЕННОГО ЗА ДЕНЬ ---
  const consumed = useMemo(() => {
    let totalKcal = 0, totalP = 0, totalF = 0, totalC = 0;
    const byMeal = {};

    Object.keys(meals).forEach(mealKey => {
      let mKcal = 0, mP = 0, mF = 0, mC = 0;
      meals[mealKey].forEach(item => {
        const ratio = item.weight / 100;
        const itemKcal = item.kcal100 * ratio;
        const itemP = item.p100 * ratio;
        const itemF = item.f100 * ratio;
        const itemC = item.c100 * ratio;

        mKcal += itemKcal;
        mP += itemP;
        mF += itemF;
        mC += itemC;
      });
      byMeal[mealKey] = {
        kcal: Math.round(mKcal),
        p: Math.round(mP * 10) / 10,
        f: Math.round(mF * 10) / 10,
        c: Math.round(mC * 10) / 10
      };
      totalKcal += mKcal;
      totalP += mP;
      totalF += mF;
      totalC += mC;
    });

    return {
      kcal: Math.round(totalKcal),
      p: Math.round(totalP),
      f: Math.round(totalF),
      c: Math.round(totalC),
      byMeal
    };
  }, [meals]);

  // --- УПРАВЛЕНИЕ ПОЛЗУНКАМИ ПРОПОРЦИЙ БЖУ (сумма всегда 100%) ---
  const handleMacroSliderChange = (type, newValue) => {
    const val = Math.max(5, Math.min(85, Number(newValue)));
    setActivePreset('custom');

    setMacroRatios(prev => {
      const remainder = 100 - val;
      const otherKeys = ['p', 'f', 'c'].filter(k => k !== type);
      const otherSum = prev[otherKeys[0]] + prev[otherKeys[1]];

      let next0, next1;
      if (otherSum === 0) {
        next0 = Math.round(remainder / 2);
        next1 = remainder - next0;
      } else {
        next0 = Math.round((prev[otherKeys[0]] / otherSum) * remainder);
        next1 = remainder - next0;
      }

      return {
        ...prev,
        [type]: val,
        [otherKeys[0]]: Math.max(5, next0),
        [otherKeys[1]]: Math.max(5, 100 - val - Math.max(5, next0))
      };
    });
  };

  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setMacroRatios({ p: preset.p, f: preset.f, c: preset.c });
  };

  // --- ОПЕРАЦИИ С ДНЕВНИКОМ ПИТАНИЯ ---
  const addFoodToMeal = (mealKey, food, customGram = null) => {
    const weightToUse = customGram || food.defaultWeight || 100;
    const newItem = {
      id: 'item_' + Date.now() + Math.random().toString(36).substr(2, 4),
      foodId: food.id,
      name: food.name,
      weight: Number(weightToUse),
      kcal100: Number(food.kcal),
      p100: Number(food.p),
      f100: Number(food.f),
      c100: Number(food.c)
    };

    setMeals(prev => ({
      ...prev,
      [mealKey]: [...prev[mealKey], newItem]
    }));

    showToast(`Добавлено: ${food.name} (${weightToUse} г)`);
  };

  const updateItemWeight = (mealKey, itemId, newWeight) => {
    const validWeight = Math.max(0, Math.min(3000, Number(newWeight)));
    setMeals(prev => ({
      ...prev,
      [mealKey]: prev[mealKey].map(item => 
        item.id === itemId ? { ...item, weight: validWeight } : item
      )
    }));
  };

  const removeItemFromMeal = (mealKey, itemId) => {
    setMeals(prev => ({
      ...prev,
      [mealKey]: prev[mealKey].filter(item => item.id !== itemId)
    }));
  };

  const clearAllMeals = () => {
    setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
    showToast('Дневник питания очищен');
  };

  const resetDemoMeals = () => {
    setMeals(INITIAL_MEALS);
    showToast('Загружен пример сбалансированного меню');
  };

  // --- ДОБАВЛЕНИЕ СВОЕГО ПРОДУКТА ---
  const handleCreateCustomFood = (e) => {
    e.preventDefault();
    if (!customFood.name.trim()) return;

    const p = Math.max(0, Number(customFood.p) || 0);
    const f = Math.max(0, Number(customFood.f) || 0);
    const c = Math.max(0, Number(customFood.c) || 0);
    // Если калории не введены вручную, считаем автоматически из БЖУ
    const calculatedKcal = Math.round(p * 4 + f * 9 + c * 4);
    const kcal = customFood.kcal !== '' ? Math.max(0, Number(customFood.kcal)) : calculatedKcal;

    const newFood = {
      id: 'custom_' + Date.now(),
      name: customFood.name.trim(),
      kcal,
      p,
      f,
      c,
      category: 'Мои продукты',
      defaultWeight: Number(customFood.defaultWeight) || 100
    };

    setFoodDb(prev => [newFood, ...prev]);
    if (activeMealToAdd) {
      addFoodToMeal(activeMealToAdd, newFood, newFood.defaultWeight);
    }
    setCustomFood({ name: '', kcal: '', p: '', f: '', c: '', defaultWeight: 100 });
    setShowCustomFoodModal(false);
    showToast(`Продукт «${newFood.name}» сохранен в базу!`);
  };

  // --- КАТЕГОРИИ И ФИЛЬТРАЦИЯ БАЗЫ ПРОДУКТОВ ---
  const categories = useMemo(() => {
    const cats = new Set(foodDb.map(f => f.category));
    return ['Все', ...Array.from(cats)];
  }, [foodDb]);

  const filteredFoods = useMemo(() => {
    return foodDb.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'Все' || f.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [foodDb, searchQuery, selectedCategory]);

  // --- КОМПОНЕНТ КОЛЬЦЕВОЙ ДИАГРАММЫ (DONUT CHART) ---
  const MacroDonutChart = () => {
    const pCals = consumed.p * 4;
    const fCals = consumed.f * 9;
    const cCals = consumed.c * 4;
    const totalMacroCals = pCals + fCals + cCals;

    const pPct = totalMacroCals > 0 ? Math.round((pCals / totalMacroCals) * 100) : 0;
    const fPct = totalMacroCals > 0 ? Math.round((fCals / totalMacroCals) * 100) : 0;
    const cPct = totalMacroCals > 0 ? Math.max(0, 100 - pPct - fPct) : 0;

    const radius = 72;
    const circumference = 2 * Math.PI * radius;

    const pStroke = (pPct / 100) * circumference;
    const fStroke = (fPct / 100) * circumference;
    const cStroke = (cPct / 100) * circumference;

    const calProgress = Math.min(100, Math.round((consumed.kcal / targets.kcal) * 100));
    const isOver = consumed.kcal > targets.kcal;

    return (
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
            {/* Фоновый круг */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="18"
            />
            {totalMacroCals > 0 && (
              <>
                {/* Белки (Синий/Индиго) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="18"
                  strokeDasharray={`${pStroke} ${circumference}`}
                  strokeDashoffset={0}
                  strokeLinecap="butt"
                  className="transition-all duration-500"
                />
                {/* Жиры (Янтарный) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="18"
                  strokeDasharray={`${fStroke} ${circumference}`}
                  strokeDashoffset={-pStroke}
                  strokeLinecap="butt"
                  className="transition-all duration-500"
                />
                {/* Углеводы (Изумрудный) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray={`${cStroke} ${circumference}`}
                  strokeDashoffset={-(pStroke + fStroke)}
                  strokeLinecap="butt"
                  className="transition-all duration-500"
                />
              </>
            )}
          </svg>
          {/* Центр диаграммы */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Съедено</span>
            <span className={`text-2xl font-extrabold tracking-tight ${isOver ? 'text-rose-600' : 'text-slate-800'}`}>
              {consumed.kcal}
            </span>
            <span className="text-xs font-medium text-slate-500">из {targets.kcal} ккал</span>
            <span className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isOver ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {calProgress}% нормы
            </span>
          </div>
        </div>

        {/* Детализация распределения энергии */}
        <div className="flex-1 w-full space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Фактический баланс калорий (БЖУ)
          </div>
          
          {/* Белки */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></span>
              <div>
                <div className="text-sm font-semibold text-slate-700">Белки</div>
                <div className="text-xs text-slate-400">Цель: {macroRatios.p}% ({targets.p} г)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">{consumed.p} г</div>
              <div className="text-xs font-medium text-blue-600">{pPct}% энергии</div>
            </div>
          </div>

          {/* Жиры */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              <div>
                <div className="text-sm font-semibold text-slate-700">Жиры</div>
                <div className="text-xs text-slate-400">Цель: {macroRatios.f}% ({targets.f} г)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">{consumed.f} г</div>
              <div className="text-xs font-medium text-amber-600">{fPct}% энергии</div>
            </div>
          </div>

          {/* Углеводы */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
              <div>
                <div className="text-sm font-semibold text-slate-700">Углеводы</div>
                <div className="text-xs text-slate-400">Цель: {macroRatios.c}% ({targets.c} г)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">{consumed.c} г</div>
              <div className="text-xs font-medium text-emerald-600">{cPct}% энергии</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      {/* Уведомление */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* ВЕРХНЯЯ ШАПКА */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Калькулятор рациона и КБЖУ
              </h1>
              <p className="text-xs text-slate-500">
                Формула Миффлина — Сан-Жеора • Интерактивный планировщик меню
              </p>
            </div>
          </div>

          {/* Быстрая сводка в шапке */}
          <div className="flex items-center gap-3 sm:gap-6 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
            <div className="text-center">
              <div className="text-[11px] font-medium text-slate-400 uppercase">Цель</div>
              <div className="text-sm font-bold text-slate-800">{targets.kcal} ккал</div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-[11px] font-medium text-slate-400 uppercase">Рацион</div>
              <div className={`text-sm font-bold ${consumed.kcal > targets.kcal ? 'text-rose-600' : 'text-emerald-600'}`}>
                {consumed.kcal} ккал
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-[11px] font-medium text-slate-400 uppercase">Остаток</div>
              <div className="text-sm font-bold text-slate-700">
                {targets.kcal - consumed.kcal >= 0 
                  ? `${targets.kcal - consumed.kcal} ккал` 
                  : `+${Math.abs(targets.kcal - consumed.kcal)} профицит`}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ЛЕВАЯ КОЛОНКА: ПАРАМЕТРЫ ТЕЛА И НАСТРОЙКА БЖУ (5 колонок на десктопе) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* КАРТОЧКА 1: ПРОФИЛЬ И ПАРАМЕТРЫ ТЕЛА */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">1. Ваши параметры и цель</h2>
                    <p className="text-xs text-slate-500">Расчет базового метаболизма (BMR) и нормы</p>
                  </div>
                </div>
              </div>

              {/* Переключатель пола */}
              <div className="grid grid-cols-2 gap-2.5 p-1 bg-slate-100 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'female' })}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    profile.gender === 'female'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Женщина
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                  className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    profile.gender === 'male'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Мужчина
                </button>
              </div>

              {/* Возраст, Вес, Рост */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Возраст (лет)</label>
                  <input
                    type="number"
                    min="14"
                    max="100"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: Math.max(10, Number(e.target.value)) })}
                    className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Вес (кг)</label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    step="0.5"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: Math.max(25, Number(e.target.value)) })}
                    className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Рост (см)</label>
                  <input
                    type="number"
                    min="120"
                    max="230"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: Math.max(100, Number(e.target.value)) })}
                    className="w-full bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Уровень физической активности */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Физическая активность
                </label>
                <div className="space-y-1.5">
                  {ACTIVITY_LEVELS.map((act) => {
                    const isSelected = profile.activity === act.value;
                    return (
                      <button
                        key={act.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, activity: act.value })}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className={`text-sm font-semibold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                            {act.label} <span className="text-xs font-normal text-slate-400">({act.value})</span>
                          </div>
                          <div className="text-xs text-slate-500">{act.desc}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Выбор цели */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Ваша цель
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map((g) => {
                    const active = profile.goal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, goal: g.id })}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {g.badge}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold leading-snug">{g.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Справочная строка BMR и TDEE */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <div className="text-[11px] text-slate-400">Базовый обмен</div>
                  <div className="text-xs font-bold text-slate-700">{targets.bmr} ккал</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <div className="text-[11px] text-slate-400">Расход (TDEE)</div>
                  <div className="text-xs font-bold text-slate-700">{targets.tdee} ккал</div>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200/60">
                  <div className="text-[11px] text-emerald-700 font-medium">Целевая норма</div>
                  <div className="text-xs font-extrabold text-emerald-700">{targets.kcal} ккал</div>
                </div>
              </div>
            </section>

            {/* КАРТОЧКА 2: ИНТЕРАКТИВНЫЕ ПРОПОРЦИИ БЖУ */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">2. Пропорции макронутриентов</h2>
                    <p className="text-xs text-slate-500">Настройте баланс БЖУ под свой тип питания</p>
                  </div>
                </div>
              </div>

              {/* Пресеты */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {MACRO_PRESETS.map((preset) => {
                  const isCurrent = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-800">{preset.name}</div>
                      <div className="text-[11px] font-medium text-blue-600 mt-0.5">
                        Б: {preset.p}% • Ж: {preset.f}% • У: {preset.c}%
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ползунки */}
              <div className="space-y-4">
                {/* Белки */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      Белки ({macroRatios.p}%)
                    </span>
                    <span className="text-slate-700 font-bold">
                      {targets.p} г <span className="text-slate-400 font-normal">({ (targets.p / profile.weight).toFixed(1) } г/кг веса)</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={macroRatios.p}
                    onChange={(e) => handleMacroSliderChange('p', e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* Жиры */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Жиры ({macroRatios.f}%)
                    </span>
                    <span className="text-slate-700 font-bold">
                      {targets.f} г <span className="text-slate-400 font-normal">({ (targets.f / profile.weight).toFixed(1) } г/кг веса)</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    value={macroRatios.f}
                    onChange={(e) => handleMacroSliderChange('f', e.target.value)}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                </div>

                {/* Углеводы */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      Углеводы ({macroRatios.c}%)
                    </span>
                    <span className="text-slate-700 font-bold">
                      {targets.c} г <span className="text-slate-400 font-normal">({ (targets.c / profile.weight).toFixed(1) } г/кг веса)</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="75"
                    value={macroRatios.c}
                    onChange={(e) => handleMacroSliderChange('c', e.target.value)}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Визуальная полоса соотношения */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100">
                  <div style={{ width: `${macroRatios.p}%` }} className="bg-blue-500 transition-all duration-300" title={`Белки ${macroRatios.p}%`} />
                  <div style={{ width: `${macroRatios.f}%` }} className="bg-amber-500 transition-all duration-300" title={`Жиры ${macroRatios.f}%`} />
                  <div style={{ width: `${macroRatios.c}%` }} className="bg-emerald-500 transition-all duration-300" title={`Углеводы ${macroRatios.c}%`} />
                </div>
              </div>
            </section>

          </div>

          {/* ПРАВАЯ КОЛОНКА: ДАШБОРД КБЖУ И ДНЕВНИК ПРИЕМОВ ПИЩИ (7 колонок на десктопе) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* КАРТОЧКА 3: СВОДНАЯ АНАЛИТИКА И ПРОГРЕСС-БАРЫ */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">3. Сводка дня: Рацион vs Норма</h2>
                    <p className="text-xs text-slate-500">Динамический контроль калорий и нутриентов</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetDemoMeals}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                    title="Заполнить примерным сбалансированным меню"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Пример меню
                  </button>
                  <button
                    type="button"
                    onClick={clearAllMeals}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Очистить день
                  </button>
                </div>
              </div>

              {/* Кольцевая диаграмма + распределение */}
              <MacroDonutChart />

              {/* Детальные шкалы выполнения цели по граммам */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Прогресс Белков */}
                <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-3.5">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs font-bold text-blue-900">Белки</span>
                    <span className="text-xs font-semibold text-blue-700">
                      {consumed.p} / {targets.p} г
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        consumed.p > targets.p * 1.15 ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((consumed.p / Math.max(1, targets.p)) * 100))}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-500 flex justify-between">
                    <span>{Math.round((consumed.p / Math.max(1, targets.p)) * 100)}%</span>
                    <span>
                      {targets.p - consumed.p >= 0 ? `Осталось ${targets.p - consumed.p} г` : `Перебор +${consumed.p - targets.p} г`}
                    </span>
                  </div>
                </div>

                {/* Прогресс Жиров */}
                <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3.5">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs font-bold text-amber-900">Жиры</span>
                    <span className="text-xs font-semibold text-amber-700">
                      {consumed.f} / {targets.f} г
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        consumed.f > targets.f * 1.15 ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((consumed.f / Math.max(1, targets.f)) * 100))}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-500 flex justify-between">
                    <span>{Math.round((consumed.f / Math.max(1, targets.f)) * 100)}%</span>
                    <span>
                      {targets.f - consumed.f >= 0 ? `Осталось ${targets.f - consumed.f} г` : `Перебор +${consumed.f - targets.f} г`}
                    </span>
                  </div>
                </div>

                {/* Прогресс Углеводов */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs font-bold text-emerald-900">Углеводы</span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {consumed.c} / {targets.c} г
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        consumed.c > targets.c * 1.15 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((consumed.c / Math.max(1, targets.c)) * 100))}%` }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-500 flex justify-between">
                    <span>{Math.round((consumed.c / Math.max(1, targets.c)) * 100)}%</span>
                    <span>
                      {targets.c - consumed.c >= 0 ? `Осталось ${targets.c - consumed.c} г` : `Перебор +${consumed.c - targets.c} г`}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* КАРТОЧКА 4: ПЛАНИРОВЩИК ПРИЕМОВ ПИЩИ */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-base font-bold text-slate-900">4. Дневник и конструктор рациона</h2>
                  <p className="text-xs text-slate-500">Меняйте граммовку на лету или добавляйте продукты в любой прием пищи</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomFoodModal(true)}
                  className="text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Свой продукт
                </button>
              </div>

              {MEAL_SECTIONS.map((section) => {
                const Icon = section.icon;
                const items = meals[section.key] || [];
                const stats = consumed.byMeal[section.key] || { kcal: 0, p: 0, f: 0, c: 0 };
                const isAddingHere = activeMealToAdd === section.key;

                return (
                  <div
                    key={section.key}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all"
                  >
                    {/* Заголовок приема пищи */}
                    <div className="p-4 sm:px-5 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${section.bg} ${section.color} border ${section.border} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">{section.title}</h3>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                              {stats.kcal} ккал
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Б: <span className="font-semibold text-slate-700">{stats.p} г</span> •{' '}
                            Ж: <span className="font-semibold text-slate-700">{stats.f} г</span> •{' '}
                            У: <span className="font-semibold text-slate-700">{stats.c} г</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveMealToAdd(isAddingHere ? null : section.key)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          isAddingHere
                            ? 'bg-slate-800 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        {isAddingHere ? 'Закрыть поиск' : 'Добавить продукт'}
                      </button>
                    </div>

                    {/* Встроенная панель поиска и выбора продуктов */}
                    {isAddingHere && (
                      <div className="p-4 bg-emerald-50/40 border-b border-emerald-200/70">
                        <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
                          <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Поиск продукта (например: творог, гречка, лосось...)"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shrink-0">
                            <Scale className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">Вес порции:</span>
                            <input
                              type="number"
                              min="5"
                              max="1500"
                              step="10"
                              value={selectedWeight}
                              onChange={(e) => setSelectedWeight(Number(e.target.value))}
                              className="w-16 text-sm font-bold text-center bg-slate-100 rounded-lg py-1 focus:outline-none"
                            />
                            <span className="text-xs text-slate-500">г</span>
                          </div>
                        </div>

                        {/* Фильтр по категориям */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                                selectedCategory === cat
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Список найденных продуктов */}
                        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 bg-white rounded-xl border border-slate-200">
                          {filteredFoods.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">
                              Продукт не найден.{' '}
                              <button
                                type="button"
                                onClick={() => setShowCustomFoodModal(true)}
                                className="text-emerald-600 font-semibold underline"
                              >
                                Создать свой продукт
                              </button>
                            </div>
                          ) : (
                            filteredFoods.map((food) => {
                              const previewKcal = Math.round((food.kcal * selectedWeight) / 100);
                              return (
                                <div
                                  key={food.id}
                                  className="p-2.5 px-3.5 hover:bg-slate-50 flex items-center justify-between gap-2 transition"
                                >
                                  <div>
                                    <div className="text-xs sm:text-sm font-semibold text-slate-800">{food.name}</div>
                                    <div className="text-[11px] text-slate-400">
                                      На 100г: {food.kcal} ккал (Б: {food.p} • Ж: {food.f} • У: {food.c})
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addFoodToMeal(section.key, food, selectedWeight)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold transition shrink-0 flex items-center gap-1"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    {selectedWeight}г ({previewKcal} ккал)
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {/* Список добавленных в прием пищи продуктов */}
                    <div className="divide-y divide-slate-100">
                      {items.length === 0 ? (
                        <div className="p-5 text-center text-xs text-slate-400">
                          В этот прием пищи пока ничего не добавлено
                        </div>
                      ) : (
                        items.map((item) => {
                          const factor = item.weight / 100;
                          const itemKcal = Math.round(item.kcal100 * factor);
                          const itemP = (item.p100 * factor).toFixed(1);
                          const itemF = (item.f100 * factor).toFixed(1);
                          const itemC = (item.c100 * factor).toFixed(1);

                          return (
                            <div
                              key={item.id}
                              className="p-3.5 sm:px-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:bg-slate-50/70 transition"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-slate-800 truncate">{item.name}</div>
                                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                                  <span className="text-blue-600 font-medium">Б: {itemP}г</span>
                                  <span>•</span>
                                  <span className="text-amber-600 font-medium">Ж: {itemF}г</span>
                                  <span>•</span>
                                  <span className="text-emerald-600 font-medium">У: {itemC}г</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                                {/* Редактирование веса в граммах */}
                                <div className="flex items-center bg-slate-100 rounded-xl px-2.5 py-1 border border-slate-200/80">
                                  <input
                                    type="number"
                                    min="0"
                                    max="2000"
                                    step="10"
                                    value={item.weight}
                                    onChange={(e) => updateItemWeight(section.key, item.id, e.target.value)}
                                    className="w-14 bg-transparent text-right text-sm font-bold text-slate-800 focus:outline-none"
                                  />
                                  <span className="text-xs text-slate-500 ml-1">г</span>
                                </div>

                                <div className="w-20 text-right">
                                  <span className="text-sm font-extrabold text-slate-800">{itemKcal}</span>
                                  <span className="text-xs text-slate-400 ml-1">ккал</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeItemFromMeal(section.key, item.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title="Удалить из приема пищи"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </section>

          </div>
        </div>
      </main>

      {/* МОДАЛЬНОЕ ОКНО: ДОБАВЛЕНИЕ СВОЕГО ПРОДУКТА */}
      {showCustomFoodModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Добавить свой продукт</h3>
              <button
                type="button"
                onClick={() => setShowCustomFoodModal(false)}
                className="text-sm text-slate-400 hover:text-slate-700 font-semibold"
              >
                Закрыть
              </button>
            </div>

            <form onSubmit={handleCreateCustomFood} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Название продукта или блюда *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Домашняя запеканка"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-blue-600 mb-1">Белки (на 100г)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    placeholder="0.0"
                    value={customFood.p}
                    onChange={(e) => setCustomFood({ ...customFood, p: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-600 mb-1">Жиры (на 100г)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    placeholder="0.0"
                    value={customFood.f}
                    onChange={(e) => setCustomFood({ ...customFood, f: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-600 mb-1">Углеводы (100г)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    placeholder="0.0"
                    value={customFood.c}
                    onChange={(e) => setCustomFood({ ...customFood, c: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Калории на 100г (опционально)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="900"
                    placeholder="Авторасчет из БЖУ"
                    value={customFood.kcal}
                    onChange={(e) => setCustomFood({ ...customFood, kcal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Стандартная порция (г)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={customFood.defaultWeight}
                    onChange={(e) => setCustomFood({ ...customFood, defaultWeight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomFoodModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Сохранить в базу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}