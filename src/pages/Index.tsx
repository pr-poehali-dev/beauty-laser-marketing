import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ─── DATA ─────────────────────────────────────────── */
const ZONES = ["Подмышки", "Ноги полностью", "Бикини глубокое", "Руки", "Лицо", "Живот", "Спина"];
const MASTERS = [
  { name: "Алина", exp: "5 лет", spec: "Деликатные зоны и лицо", emoji: "👩‍⚕️" },
  { name: "Мария", exp: "4 года", spec: "Ноги, руки, тело", emoji: "💆‍♀️" },
  { name: "Дарья", exp: "3 года", spec: "Бикини зона, подмышки", emoji: "✨" },
];
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const REVIEWS = [
  { name: "Катя, 22", text: "Боялась идти — думала будет больно. Пришла и прямо во время процедуры слушала музыку 😅 Мастер Алина всё объяснила, было тепло и всё. Уже записалась на второй раз!", source: "Instagram", time: "2 дня назад", first: true },
  { name: "Вика, 20", text: "До этого никогда не делала лазер, всё тянула. Наконец решилась — и зря тянула столько! Уже после первой процедуры раздражения от бритвы нет совсем.", source: "Telegram", time: "1 неделю назад", first: true },
  { name: "Настя, 24", text: "Уже 4 процедуры позади — рост волос стал реально меньше. Рекомендую всем подругам!", source: "ВКонтакте", time: "2 недели назад", first: false },
  { name: "Лера, 19", text: "Записалась на комплекс «ноги + бикини» — довольна на 100%! Быстро, чисто, без боли 💕", source: "Instagram", time: "3 недели назад", first: false },
];

const FAQ = [
  { q: "Я никогда не делала лазер — с чего начать?", a: "Просто запишись на первый визит! Мастер перед процедурой проведёт бесплатную консультацию: расскажет всё, ответит на вопросы и сделает тест на маленькой зоне. Никаких сюрпризов — только когда ты сама будешь готова, начнём." },
  { q: "Это больно?", a: "Нет. Лазер оснащён системой охлаждения насадки — ощущается лёгкое тепло и покалывание, как будто резинкой щёлкнули. Большинство клиентов говорят, что бритьё по утрам приносит больше дискомфорта." },
  { q: "Сколько нужно процедур и сколько это стоит?", a: "Стандартный курс — 6–8 процедур с интервалом 4–6 недель. Уже после 1–2 процедур рост волос заметно замедляется. Стоимость курса дешевле, чем тратить деньги на бритвы и кремы годами." },
  { q: "А вдруг у меня чувствительная кожа?", a: "Именно для чувствительной кожи диодный лазер и создан. Мастер подбирает мощность индивидуально. Никаких порезов, врастаний и раздражения — только гладкость." },
  { q: "Можно ли загорать после?", a: "Рекомендуем подождать 2 недели до и после процедуры. Если уже есть загар — мастер скорректирует настройки. Всё безопасно." },
  { q: "Как подготовиться к первому разу?", a: "Побрить зону за 1–2 дня до процедуры. Не эпилировать и не делать воск за 3–4 недели. Не наносить крем в день процедуры. Вот и всё — ничего сложного!" },
];

const MYTHS = [
  { myth: "«Это очень больно»", truth: "Лёгкое покалывание — как щелчок резинкой. С системой охлаждения почти не чувствуется.", icon: "Zap" },
  { myth: "«Лазер опасен для кожи»", truth: "Диодный лазер — самый безопасный метод. Никаких ожогов, рубцов и аллергий.", icon: "ShieldCheck" },
  { myth: "«Результата нет после 1 раза»", truth: "Уже после первой процедуры волосы растут медленнее и тоньше. Эффект виден через 2 недели.", icon: "Sparkles" },
  { myth: "«Это только для тёмных волос»", truth: "Наш лазер работает с любым типом волос и кожи. Мастер подберёт настройки под тебя.", icon: "Star" },
];

const COMPARE = [
  { param: "Боль", razor: "Порезы, раздражение, врастания", laser: "Лёгкое тепло, никаких ран", laserWins: true },
  { param: "Время", razor: "Каждые 2–3 дня по 10–20 мин", laser: "1 раз в 6 недель, 10–40 мин", laserWins: true },
  { param: "Деньги", razor: "~5 000 ₽/год бесконечно", laser: "Курс раз в жизни, экономия навсегда", laserWins: true },
  { param: "Результат", razor: "Кожа гладкая 1–2 дня", laser: "Гладко 4–6 недель, потом навсегда", laserWins: true },
  { param: "Раздражение", razor: "Красные точки, зуд, врастания", laser: "Ноль — кожа как шёлк", laserWins: true },
];

/* ─── BOOKING MODAL ─────────────────────────────────── */
function BookingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [zone, setZone] = useState("");
  const [master, setMaster] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    if (name && phone) setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ background: "rgba(30,20,24,0.6)", backdropFilter: "blur(8px)" }}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: "1px solid var(--pink-light)" }}>
          <div>
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--teal)" }}>Онлайн запись</p>
            <h3 className="text-xl font-bold" style={{ color: "var(--dark)" }}>
              {done ? "Готово! 🎉" : `Шаг ${step} из 3`}
            </h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--gray-light)" }}>
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ background: "var(--teal-pale)" }}>✨</div>
              <h4 className="text-xl font-bold mb-2" style={{ color: "var(--dark)" }}>Заявка принята!</h4>
              <p style={{ color: "var(--gray)" }} className="text-sm leading-relaxed">
                Мы свяжемся с тобой в WhatsApp/Telegram в течение 15 минут для подтверждения записи.
              </p>
              <div className="mt-4 p-4 rounded-2xl text-sm" style={{ background: "var(--pink-pale)" }}>
                <p className="font-semibold" style={{ color: "var(--pink)" }}>Не забудь: −30% на первый визит!</p>
              </div>
              <button onClick={onClose} className="mt-6 w-full py-3 rounded-2xl font-semibold text-white" style={{ background: "var(--teal)" }}>Закрыть</button>
            </div>
          ) : step === 1 ? (
            <>
              <p className="text-sm mb-4 font-medium" style={{ color: "var(--gray)" }}>Выбери зону</p>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.map((z) => (
                  <button key={z} onClick={() => setZone(z)}
                    className="py-3 px-4 rounded-2xl text-sm font-medium text-left transition-all border-2"
                    style={{ borderColor: zone === z ? "var(--pink)" : "var(--border)", background: zone === z ? "var(--pink-pale)" : "white", color: zone === z ? "var(--pink)" : "var(--dark)" }}>
                    {z}
                  </button>
                ))}
              </div>
              <button disabled={!zone} onClick={() => setStep(2)}
                className="mt-5 w-full py-3 rounded-2xl font-semibold text-white"
                style={{ background: zone ? "var(--pink)" : "var(--pink-light)", cursor: zone ? "pointer" : "not-allowed" }}>
                Далее →
              </button>
            </>
          ) : step === 2 ? (
            <>
              <p className="text-sm mb-4 font-medium" style={{ color: "var(--gray)" }}>Выбери мастера и время</p>
              <div className="space-y-2 mb-4">
                {MASTERS.map((m) => (
                  <button key={m.name} onClick={() => setMaster(m.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all"
                    style={{ borderColor: master === m.name ? "var(--teal)" : "var(--border)", background: master === m.name ? "var(--teal-pale)" : "white" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: "var(--pink-pale)" }}>{m.emoji}</div>
                    <div className="text-left">
                      <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{m.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>{m.spec} · {m.exp}</p>
                    </div>
                    {master === m.name && <Icon name="CheckCircle" size={18} className="ml-auto" style={{ color: "var(--teal)" }} />}
                  </button>
                ))}
              </div>
              {master && (
                <>
                  <p className="text-sm mb-2 font-medium" style={{ color: "var(--gray)" }}>Выбери время</p>
                  <div className="grid grid-cols-5 gap-2">
                    {TIMES.map((t) => (
                      <button key={t} onClick={() => setTime(t)}
                        className="py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ background: time === t ? "var(--teal)" : "var(--teal-pale)", color: time === t ? "white" : "var(--teal)" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="flex gap-2 mt-5">
                <button onClick={() => setStep(1)} className="py-3 px-5 rounded-2xl font-medium text-sm" style={{ background: "var(--gray-light)", color: "var(--gray)" }}>← Назад</button>
                <button disabled={!master || !time} onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white"
                  style={{ background: master && time ? "var(--pink)" : "var(--pink-light)", cursor: master && time ? "pointer" : "not-allowed" }}>
                  Далее →
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm mb-4 font-medium" style={{ color: "var(--gray)" }}>Твои контакты</p>
              <div className="space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
                  style={{ borderColor: "var(--border)", fontFamily: "inherit" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" type="tel"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
                  style={{ borderColor: "var(--border)", fontFamily: "inherit" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
              </div>
              <div className="mt-4 p-3 rounded-2xl text-xs leading-relaxed" style={{ background: "var(--pink-pale)", color: "var(--gray)" }}>
                📍 Зона: <strong>{zone}</strong> · Мастер: <strong>{master}</strong> · Время: <strong>{time}</strong>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setStep(2)} className="py-3 px-5 rounded-2xl font-medium text-sm" style={{ background: "var(--gray-light)", color: "var(--gray)" }}>← Назад</button>
                <button disabled={!name || !phone} onClick={submit}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white"
                  style={{ background: name && phone ? "var(--pink)" : "var(--pink-light)", cursor: name && phone ? "pointer" : "not-allowed" }}>
                  Записаться со скидкой 30%
                </button>
              </div>
              <p className="text-xs text-center mt-3" style={{ color: "var(--gray)" }}>Нажимая кнопку, ты соглашаешься с политикой конфиденциальности</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── TIMER ──────────────────────────────────────────── */
function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ─── RESULTS SLIDER ─────────────────────────────────── */
const RESULTS = [
  { zone: "Подмышки", label: "После 2-й процедуры" },
  { zone: "Голени", label: "После 3-й процедуры" },
  { zone: "Бикини", label: "После 1-й процедуры" },
];

function ResultCard({ zone, label }: { zone: string; label: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
  };

  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0 w-72 md:w-80" style={{ background: "var(--gray-light)" }}>
      <div ref={ref} className="relative h-72 select-none cursor-ew-resize"
        onMouseDown={() => { dragging.current = true; }}
        onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchMove={(e) => move(e.touches[0].clientX)}>
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)" }}>
          <div className="text-center">
            <div className="text-4xl mb-1">🪒</div>
            <p className="text-xs font-medium" style={{ color: "var(--gray)" }}>До</p>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--pink-pale), var(--teal-pale))", width: `${10000 / pos}%` }}>
            <div className="text-center">
              <div className="text-4xl mb-1">✨</div>
              <p className="text-xs font-medium" style={{ color: "var(--teal)" }}>После</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 w-0.5 z-10" style={{ left: `${pos}%`, background: "white", transform: "translateX(-50%)" }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Icon name="ChevronsLeftRight" size={14} style={{ color: "var(--pink)" }} />
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{zone}</p>
        <p className="text-xs" style={{ color: "var(--teal)" }}>{label} · без раздражения</p>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────── */
export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const timer = useCountdown(deadline);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col"
        style={{ background: "linear-gradient(160deg, var(--pink-pale) 0%, white 50%, var(--teal-pale) 100%)" }}>
        <nav className="flex items-center justify-between px-6 md:px-12 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--pink)" }}>D</div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--dark)" }}>DENU beauty</span>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--teal)" }}>
            <Icon name="Calendar" size={15} />Записаться
          </button>
        </nav>

        <div className="flex-1 flex items-center px-6 md:px-12 pt-8 pb-16">
          <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ background: "var(--pink)", color: "white" }}>
                <Icon name="Sparkles" size={12} />−30% на первый визит
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4" style={{ color: "var(--dark)" }}>
                Гладкая кожа <span className="font-display italic" style={{ color: "var(--pink)" }}>24/7</span>
              </h1>
              <p className="text-xl mb-2 font-medium" style={{ color: "var(--dark)" }}>Быстро, не больно, стильно</p>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--gray)" }}>
                Диодный лазер нового поколения — забудь о бритве уже после первого сеанса
              </p>

              {/* Pain points — для тех, кто ещё не пробовал */}
              <div className="flex flex-col gap-2 mb-8">
                {[
                  "Надоело раздражение и врастания после бритвы?",
                  "Стесняешься в купальнике или открытой одежде?",
                  "Тратишь время на бритьё каждые 2 дня?",
                ].map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm" style={{ color: "var(--gray)" }}>
                    <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "var(--pink-pale)" }}>
                      <Icon name="Check" size={11} style={{ color: "var(--pink)" }} />
                    </div>
                    {p}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "var(--pink)" }}>
                  <Icon name="Sparkles" size={18} />Хочу со скидкой 30%
                </button>
                <a href="#compare" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm border-2 transition-colors"
                  style={{ borderColor: "var(--pink-light)", color: "var(--pink)" }}>
                  Сравнить с бритвой
                </a>
              </div>

              <div className="flex items-center gap-6 mt-8">
                {[{ val: "500+", label: "довольных гостей" }, { val: "6 лет", label: "опыт мастеров" }, { val: "10 мин", label: "подмышки" }].map((stat, i) => (
                  <div key={stat.val} className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: "var(--dark)" }}>{stat.val}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>{stat.label}</p>
                    </div>
                    {i < 2 && <div className="w-px h-10" style={{ background: "var(--border)" }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden md:block">
              <div className="absolute -inset-4 rounded-[3rem] opacity-30" style={{ background: "var(--pink-light)" }} />
              <img
                src="https://cdn.poehali.dev/projects/c10ce338-4385-41f6-8e4d-25fe6aca8f8d/files/110840f6-75ad-44db-9c0c-db3fdbf2942c.jpg"
                alt="Результат лазерной эпиляции"
                className="relative rounded-[2.5rem] w-full object-cover shadow-2xl"
                style={{ height: "520px" }}
              />
              <div className="absolute -left-6 top-1/3 bg-white rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--gray)" }}>Без боли</p>
                <div className="flex gap-0.5">{[1,2,3,4,5].map((i) => <span key={i} className="text-xs">⭐</span>)}</div>
              </div>
              <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs font-medium" style={{ color: "var(--teal)" }}>✓ Результат с первой процедуры</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FIRST TIME BLOCK — для тех, кто никогда не пробовал ═══ */}
      <section className="section-padding" style={{ background: "var(--dark)" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(232,132,154,0.2)", color: "var(--pink)" }}>
              👋 Специально для тех, кто ещё не пробовал
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Первый раз? Мы тебя поймём
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "#B0A0A8" }}>
              9 из 10 наших клиентов приходят впервые. Все боятся одного и того же. Давай честно разберём каждый страх.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                fear: "«А вдруг будет больно?»",
                answer: "Самый частый страх — и самый беспочвенный. Наш лазер охлаждает кожу во время процедуры. Ты почувствуешь лёгкое тепло — примерно как тёплая вспышка. Не больнее, чем щелчок резинкой.",
                emoji: "🧊",
              },
              {
                fear: "«Вдруг мне не подойдёт?»",
                answer: "Перед первой процедурой мастер делает тест на маленьком участке кожи. Только убедившись, что всё хорошо — продолжаем. Никакого риска.",
                emoji: "🔍",
              },
              {
                fear: "«Я не знаю, как себя вести»",
                answer: "Просто прийти — и всё. Мастер сам всё объяснит, расскажет что будет происходить, ответит на любые вопросы. Никаких сложных правил.",
                emoji: "💬",
              },
              {
                fear: "«Это дорого и долго»",
                answer: "Первая процедура — от 800 ₽. Курс выходит дешевле, чем ты тратишь на бритвы, кремы и эпиляторы за год. И занимает меньше часа.",
                emoji: "💸",
              },
            ].map((item) => (
              <div key={item.fear} className="p-5 rounded-3xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex items-start gap-4">
                  <div className="text-2xl flex-shrink-0">{item.emoji}</div>
                  <div>
                    <p className="font-bold text-white mb-2">{item.fear}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "#B0A0A8" }}>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90"
              style={{ background: "var(--pink)" }}>
              <Icon name="Calendar" size={18} />
              Записаться на первый раз — бесплатная консультация
            </button>
            <p className="text-xs mt-3" style={{ color: "#B0A0A8" }}>Мастер ответит на все вопросы до начала процедуры</p>
          </div>
        </div>
      </section>

      {/* ═══ COMPARE: БРИТВА VS ЛАЗЕР ═══════════════════ */}
      <section id="compare" className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>Сравнение</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>Бритва или лазер?</h2>
            <p style={{ color: "var(--gray)" }}>Честное сравнение — реши сама, что выгоднее</p>
          </div>

          {/* Header */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div />
            <div className="text-center py-3 rounded-2xl text-sm font-semibold" style={{ background: "var(--gray-light)", color: "var(--gray)" }}>
              🪒 Бритва
            </div>
            <div className="text-center py-3 rounded-2xl text-sm font-bold text-white" style={{ background: "var(--pink)" }}>
              ✨ Лазер
            </div>
          </div>

          <div className="space-y-2">
            {COMPARE.map((row) => (
              <div key={row.param} className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm font-semibold py-3 px-2" style={{ color: "var(--dark)" }}>{row.param}</div>
                <div className="text-xs py-4 px-3 rounded-2xl leading-relaxed" style={{ background: "var(--gray-light)", color: "var(--gray)" }}>
                  {row.razor}
                </div>
                <div className="text-xs py-4 px-3 rounded-2xl leading-relaxed font-medium" style={{ background: "var(--pink-pale)", color: "var(--dark)" }}>
                  <span style={{ color: "var(--teal)" }}>✓ </span>{row.laser}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-3xl text-center" style={{ background: "linear-gradient(135deg, var(--pink-pale), var(--teal-pale))" }}>
            <p className="font-bold text-lg mb-1" style={{ color: "var(--dark)" }}>Средняя экономия за 5 лет — от 25 000 ₽</p>
            <p className="text-sm" style={{ color: "var(--gray)" }}>Не считая сэкономленное время и нервы от раздражения</p>
            <button onClick={() => setModalOpen(true)} className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: "var(--pink)" }}>
              <Icon name="Sparkles" size={16} />Хочу попробовать
            </button>
          </div>
        </div>
      </section>

      {/* ═══ MYTHS ══════════════════════════════════════ */}
      <section className="section-padding" style={{ background: "var(--teal-pale)" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>Правда и мифы</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>Развенчиваем страхи</h2>
            <p style={{ color: "var(--gray)" }}>То, что говорят в интернете — и как всё есть на самом деле</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {MYTHS.map((m) => (
              <div key={m.myth} className="bg-white rounded-3xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--pink-pale)" }}>
                    <Icon name={m.icon} size={18} style={{ color: "var(--pink)" }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1 line-through" style={{ color: "var(--gray)" }}>{m.myth}</p>
                    <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--dark)" }}>
                      <span style={{ color: "var(--teal)" }}>На самом деле: </span>{m.truth}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY DIODE ══════════════════════════════════ */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>Технология</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--dark)" }}>Почему диодный лазер?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "Snowflake", title: "Не больно", desc: "Система охлаждения насадки снижает дискомфорт до нуля. Даже на чувствительной коже — комфортно.", teal: true },
              { icon: "Zap", title: "Быстро", desc: "Подмышки — 10 минут. Ноги полностью — 40 минут. Уйдёшь за один обеденный перерыв.", teal: false },
              { icon: "ShieldCheck", title: "Безопасно", desc: "Одноразовые расходники, стерильность, гипоаллергенный гель. Сертифицированное оборудование.", teal: true },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-3xl border-2 transition-all hover:shadow-lg" style={{ borderColor: "var(--border)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: item.teal ? "var(--teal-pale)" : "var(--pink-pale)" }}>
                  <Icon name={item.icon} size={22} style={{ color: item.teal ? "var(--teal)" : "var(--pink)" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--dark)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESULTS ════════════════════════════════════ */}
      <section id="results" className="section-padding" style={{ background: "var(--pink-pale)" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--pink)" }}>До / После</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>Реальные результаты</h2>
            <p style={{ color: "var(--gray)" }}>Перетащи разделитель, чтобы увидеть разницу</p>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
            {RESULTS.map((r) => <ResultCard key={r.zone} {...r} />)}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-10 text-center">
            {[
              { emoji: "🚫", text: "Без раздражения и врастаний" },
              { emoji: "✨", text: "Эффект виден после 1-й процедуры" },
              { emoji: "💕", text: "Гладко до 4–6 недель" },
            ].map((item) => (
              <div key={item.text} className="p-4 rounded-2xl" style={{ background: "white" }}>
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="text-xs font-medium leading-tight" style={{ color: "var(--dark)" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════ */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>Процесс</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--dark)" }}>Как всё проходит</h2>
            <p className="mt-2" style={{ color: "var(--gray)" }}>Пошагово — чтобы ты знала заранее, чего ожидать</p>
          </div>
          <div className="space-y-6">
            {[
              { n: "1", title: "Запись онлайн", desc: "Выбираешь удобное время и мастера — прямо здесь, без звонков. Занимает 2 минуты.", icon: "Calendar", note: "Можно выбрать мастера-девушку — большинство наших клиентов так и делают" },
              { n: "2", title: "Консультация перед процедурой", desc: "Мастер отвечает на все вопросы, рассказывает что будет происходить и делает тест-зону. Никакого давления — только когда будешь готова.", icon: "MessageCircle", note: "Это бесплатно и ни к чему не обязывает" },
              { n: "3", title: "Процедура", desc: "Комфортно, можно слушать музыку. Мастер всё время рядом — спрашивай что хочешь.", icon: "Sparkles", note: "Среднее время: подмышки 10 мин, ноги 40 мин, бикини 20 мин" },
              { n: "4", title: "Результат + уход", desc: "Гладкая кожа + подробные рекомендации по уходу на дом. Мастер в мессенджере — если вдруг возникнут вопросы.", icon: "Star", note: "Следующий визит — через 4–6 недель" },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white" style={{ background: "var(--pink)" }}>
                  {step.n}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={step.icon} size={16} style={{ color: "var(--teal)" }} />
                    <h3 className="font-bold text-lg" style={{ color: "var(--dark)" }}>{step.title}</h3>
                  </div>
                  <p style={{ color: "var(--gray)" }} className="text-sm leading-relaxed mb-2">{step.desc}</p>
                  <div className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full" style={{ background: "var(--teal-pale)", color: "var(--teal)" }}>
                    <Icon name="Info" size={11} />
                    {step.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══════════════════════════════ */}
      <section className="section-padding" style={{ background: "var(--gray-light)" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>Отзывы</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--dark)" }}>Они тоже боялись</h2>
            <p style={{ color: "var(--gray)" }}>Реальные отзывы от тех, кто пришёл впервые</p>
          </div>

          {/* Highlighted first-timers */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {REVIEWS.filter((r) => r.first).map((r) => (
              <div key={r.name} className="p-5 rounded-3xl bg-white shadow-sm" style={{ border: "2px solid var(--pink-light)" }}>
                <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mb-3" style={{ background: "var(--pink-pale)", color: "var(--pink)" }}>
                  ✨ Первый раз на лазере
                </div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: "var(--pink)" }}>{r.name[0]}</div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{r.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>{r.source} · {r.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map((i) => <span key={i} className="text-sm">⭐</span>)}</div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dark)" }}>«{r.text}»</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {REVIEWS.filter((r) => !r.first).map((r) => (
              <div key={r.name} className="p-5 rounded-3xl bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: "var(--teal)" }}>{r.name[0]}</div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{r.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>{r.source} · {r.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map((i) => <span key={i} className="text-sm">⭐</span>)}</div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dark)" }}>«{r.text}»</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-3xl bg-white text-center">
            <p className="font-medium mb-3" style={{ color: "var(--dark)" }}>Загляни к нам в соцсети</p>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "var(--pink-pale)", color: "var(--pink)" }}>
                <Icon name="Instagram" size={15} />@denu_beauty
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "var(--teal-pale)", color: "var(--teal)" }}>
                <Icon name="Send" size={15} />Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SPECIAL OFFER ══════════════════════════════ */}
      <section className="section-padding" style={{ background: "var(--dark)" }}>
        <div className="container-narrow text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ background: "var(--pink)", color: "white" }}>
            <Icon name="Clock" size={12} />Ограниченное предложение
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">−30% на первый визит</h2>
          <p className="text-lg mb-10" style={{ color: "#B0A0A8" }}>
            + бесплатная тест-зона (подмышки или губа) при записи на комплекс
          </p>
          <div className="flex items-center justify-center gap-3 mb-10">
            {[{ val: pad(timer.days), label: "дней" }, { val: pad(timer.hours), label: "часов" }, { val: pad(timer.mins), label: "минут" }, { val: pad(timer.secs), label: "секунд" }].map((t, i) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: "rgba(255,255,255,0.1)" }}>{t.val}</div>
                  <p className="text-xs mt-1" style={{ color: "#B0A0A8" }}>{t.label}</p>
                </div>
                {i < 3 && <span className="text-2xl font-bold pb-5" style={{ color: "var(--pink)" }}>:</span>}
              </div>
            ))}
          </div>
          <button onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--teal)" }}>
            <Icon name="Sparkles" size={20} />Забрать скидку
          </button>
          <p className="text-xs mt-4" style={{ color: "#B0A0A8" }}>Только для новых гостей · Без скрытых условий</p>
        </div>
      </section>

      {/* ═══ MASTERS ════════════════════════════════════ */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--pink)" }}>Команда</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>Твои мастера</h2>
            <p style={{ color: "var(--gray)" }}>Понимаем твои страхи, поддержим и сделаем всё аккуратно</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {MASTERS.map((m) => (
              <div key={m.name} className="text-center p-6 rounded-3xl border-2 transition-all hover:shadow-lg" style={{ borderColor: "var(--border)" }}>
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl" style={{ background: "var(--pink-pale)" }}>
                  {m.emoji}
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: "var(--dark)" }}>{m.name}</h3>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--teal)" }}>Опыт {m.exp}</p>
                <p className="text-sm mb-4" style={{ color: "var(--gray)" }}>{m.spec}</p>
                <div className="text-xs px-3 py-2 rounded-xl mb-4" style={{ background: "var(--teal-pale)", color: "var(--teal)" }}>
                  Всегда объясняет и поддерживает новичков
                </div>
                <button onClick={() => setModalOpen(true)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: "var(--pink-pale)", color: "var(--pink)" }}>
                  Записаться к {m.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: "var(--pink-pale)" }}>
        <div className="container-narrow max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--pink)" }}>FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--dark)" }}>Частые вопросы</h2>
          </div>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden transition-all"
                style={{ border: "2px solid", borderColor: openFaq === i ? "var(--pink)" : "transparent" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-semibold text-base" style={{ color: "var(--dark)" }}>{item.q}</span>
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ml-4 transition-transform"
                    style={{ background: "var(--pink-pale)", transform: openFaq === i ? "rotate(45deg)" : "none" }}>
                    <Icon name="Plus" size={14} style={{ color: "var(--pink)" }} />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 animate-fade-in">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--gray)" }}>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center p-6 rounded-3xl bg-white">
            <p className="font-semibold mb-1" style={{ color: "var(--dark)" }}>Остался вопрос?</p>
            <p className="text-sm mb-4" style={{ color: "var(--gray)" }}>Напиши нам — ответим за 15 минут, без давления и продаж</p>
            <div className="flex justify-center gap-3">
              <a href="https://wa.me/79001234567" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "#25D366" }}>
                <Icon name="MessageCircle" size={15} />WhatsApp
              </a>
              <a href="https://t.me/denu_beauty" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "#229ED9" }}>
                <Icon name="Send" size={15} />Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACTS ═══════════════════════════════════ */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>Контакты</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>Мы в Рязани</h2>
            <p style={{ color: "var(--gray)" }}>Запишись онлайн или напиши нам — ответим за 15 минут</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="rounded-3xl overflow-hidden h-72 flex items-center justify-center" style={{ background: "var(--gray-light)" }}>
              <div className="text-center">
                <div className="text-4xl mb-3">📍</div>
                <p className="font-semibold" style={{ color: "var(--dark)" }}>ул. Примерная, 15</p>
                <p className="text-sm mt-1" style={{ color: "var(--gray)" }}>г. Рязань</p>
                <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--teal)" }}>
                  Построить маршрут <Icon name="ArrowUpRight" size={14} />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: "MapPin", text: "ул. Примерная, 15, ТЦ «Центральный», 2 этаж", label: "Адрес", teal: false },
                { icon: "Clock", text: "Пн–Пт: 10:00–21:00 · Сб–Вс: 10:00–19:00", label: "Режим работы", teal: true },
                { icon: "Car", text: "Бесплатная парковка у входа в ТЦ", label: "Парковка", teal: false },
              ].map((info) => (
                <div key={info.label} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: "var(--gray-light)" }}>
                  <Icon name={info.icon} size={20} style={{ color: info.teal ? "var(--teal)" : "var(--pink)" }} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold" style={{ color: "var(--dark)" }}>{info.label}</p>
                    <p className="text-sm" style={{ color: "var(--gray)" }}>{info.text}</p>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a href="https://wa.me/79001234567" className="flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white" style={{ background: "#25D366" }}>
                  <Icon name="MessageCircle" size={16} />WhatsApp
                </a>
                <a href="https://t.me/denu_beauty" className="flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white" style={{ background: "#229ED9" }}>
                  <Icon name="Send" size={16} />Telegram
                </a>
              </div>
              <button onClick={() => setModalOpen(true)}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--pink)" }}>
                Записаться онлайн со скидкой 30%
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════ */}
      <footer className="px-6 py-8" style={{ background: "var(--dark)" }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--pink)" }}>D</div>
            <span className="font-bold text-white">DENU beauty</span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: "#B0A0A8" }}>
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Оферта</a>
            <a href="#" className="hover:text-white transition-colors">@denu_beauty</a>
          </div>
          <p className="text-xs" style={{ color: "#B0A0A8" }}>© 2024 DENU beauty · Рязань</p>
        </div>
      </footer>

      {/* ═══ FLOATING BUTTONS ═══════════════════════════ */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-2 z-50">
        <a href="https://t.me/denu_beauty"
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          style={{ background: "#229ED9" }}>
          <Icon name="Send" size={20} />
        </a>
        <a href="https://wa.me/79001234567"
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          style={{ background: "#25D366" }}>
          <Icon name="MessageCircle" size={20} />
        </a>
        <button onClick={() => setModalOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          style={{ background: "var(--pink)" }}>
          <Icon name="Calendar" size={20} />
        </button>
      </div>

      {modalOpen && <BookingModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
