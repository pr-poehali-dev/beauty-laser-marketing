import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ─── DATA ─────────────────────────────────────────── */
const ZONES = ["Подмышки", "Ноги полностью", "Бикини глубокое", "Руки", "Лицо", "Живот", "Спина"];
const MASTERS = [
  { name: "Алина", exp: "5 лет", spec: "Деликатные зоны и лицо", img: "https://cdn.poehali.dev/projects/c10ce338-4385-41f6-8e4d-25fe6aca8f8d/files/110840f6-75ad-44db-9c0c-db3fdbf2942c.jpg" },
  { name: "Мария", exp: "4 года", spec: "Ноги, руки, тело", img: "https://cdn.poehali.dev/projects/c10ce338-4385-41f6-8e4d-25fe6aca8f8d/files/110840f6-75ad-44db-9c0c-db3fdbf2942c.jpg" },
  { name: "Дарья", exp: "3 года", spec: "Бикини зона, подмышки", img: "https://cdn.poehali.dev/projects/c10ce338-4385-41f6-8e4d-25fe6aca8f8d/files/110840f6-75ad-44db-9c0c-db3fdbf2942c.jpg" },
];
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const REVIEWS = [
  { name: "Катя, 22", text: "Девочки, СОВЕТУЮ! После первой процедуры уже заметила разницу. Никакого раздражения, как от бритвы 🙌", source: "Instagram", time: "2 дня назад" },
  { name: "Вика, 20", text: "Наконец-то нашла нормальный салон! Мастер Алина — просто огонь, всё объяснила, было совсем не больно", source: "Telegram", time: "1 неделю назад" },
  { name: "Настя, 24", text: "Уже 4 процедуры позади — рост волос стал реально меньше. Рекомендую всем подругам!", source: "ВКонтакте", time: "2 недели назад" },
  { name: "Лера, 19", text: "Записалась на комплекс «ноги + бикини» — довольна на 100%! Быстро, чисто, без боли 💕", source: "Instagram", time: "3 недели назад" },
];
const FAQ = [
  { q: "Это больно?", a: "Нет! Наш лазер оснащён системой охлаждения насадки — ощущается лёгкое тепло и покалывание. Большинство клиентов говорят, что бритьё приносит больше дискомфорта." },
  { q: "Сколько нужно процедур?", a: "Стандартный курс — 6–8 процедур с интервалом 4–6 недель. Уже после 1–2 процедур рост волос заметно замедляется." },
  { q: "Можно ли загорать после?", a: "Рекомендуем подождать 2 недели до и после процедуры. Если уже есть загар — мастер скорректирует настройки лазера. Всё безопасно." },
  { q: "Есть ли противопоказания?", a: "Беременность, некоторые кожные заболевания, приём фотосенсибилизирующих препаратов. Полный список уточняет мастер на бесплатной консультации перед процедурой." },
  { q: "Когда будет результат?", a: "Первый эффект — через 2–3 недели после первой процедуры. Через 3–4 процедуры большинство клиентов забывают о бритве на 2–4 недели." },
  { q: "Как подготовиться?", a: "Побрить зону за 1–2 дня до процедуры. Не эпилировать и не делать восковую депиляцию за 3–4 недели. Не наносить крем в день процедуры." },
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
        <div
          className="flex items-center justify-between px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid var(--pink-light)" }}
        >
          <div>
            <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--teal)" }}>
              Онлайн запись
            </p>
            <h3 className="text-xl font-bold" style={{ color: "var(--dark)" }}>
              {done ? "Готово! 🎉" : `Шаг ${step} из 3`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "var(--gray-light)" }}
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          {done ? (
            <div className="text-center py-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ background: "var(--teal-pale)" }}
              >
                ✨
              </div>
              <h4 className="text-xl font-bold mb-2" style={{ color: "var(--dark)" }}>
                Заявка принята!
              </h4>
              <p style={{ color: "var(--gray)" }} className="text-sm leading-relaxed">
                Мы свяжемся с тобой в WhatsApp/Telegram в течение 15 минут для подтверждения записи.
              </p>
              <div className="mt-4 p-4 rounded-2xl text-sm" style={{ background: "var(--pink-pale)" }}>
                <p className="font-semibold" style={{ color: "var(--pink)" }}>Не забудь: −30% на первый визит!</p>
              </div>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-2xl font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--teal)" }}
              >
                Закрыть
              </button>
            </div>
          ) : step === 1 ? (
            <>
              <p className="text-sm mb-4 font-medium" style={{ color: "var(--gray)" }}>Выбери зону</p>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.map((z) => (
                  <button
                    key={z}
                    onClick={() => setZone(z)}
                    className="py-3 px-4 rounded-2xl text-sm font-medium text-left transition-all border-2"
                    style={{
                      borderColor: zone === z ? "var(--pink)" : "var(--border)",
                      background: zone === z ? "var(--pink-pale)" : "white",
                      color: zone === z ? "var(--pink)" : "var(--dark)",
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
              <button
                disabled={!zone}
                onClick={() => setStep(2)}
                className="mt-5 w-full py-3 rounded-2xl font-semibold text-white transition-opacity"
                style={{
                  background: zone ? "var(--pink)" : "var(--pink-light)",
                  cursor: zone ? "pointer" : "not-allowed",
                }}
              >
                Далее →
              </button>
            </>
          ) : step === 2 ? (
            <>
              <p className="text-sm mb-4 font-medium" style={{ color: "var(--gray)" }}>Выбери мастера и время</p>
              <div className="space-y-2 mb-4">
                {MASTERS.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setMaster(m.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: master === m.name ? "var(--teal)" : "var(--border)",
                      background: master === m.name ? "var(--teal-pale)" : "white",
                    }}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{m.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>
                        {m.spec} · {m.exp}
                      </p>
                    </div>
                    {master === m.name && (
                      <Icon name="CheckCircle" size={18} className="ml-auto" style={{ color: "var(--teal)" }} />
                    )}
                  </button>
                ))}
              </div>
              {master && (
                <>
                  <p className="text-sm mb-2 font-medium" style={{ color: "var(--gray)" }}>Выбери время</p>
                  <div className="grid grid-cols-5 gap-2">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className="py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: time === t ? "var(--teal)" : "var(--teal-pale)",
                          color: time === t ? "white" : "var(--teal)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-5 rounded-2xl font-medium text-sm"
                  style={{ background: "var(--gray-light)", color: "var(--gray)" }}
                >
                  ← Назад
                </button>
                <button
                  disabled={!master || !time}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white"
                  style={{
                    background: master && time ? "var(--pink)" : "var(--pink-light)",
                    cursor: master && time ? "pointer" : "not-allowed",
                  }}
                >
                  Далее →
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm mb-4 font-medium" style={{ color: "var(--gray)" }}>Твои контакты</p>
              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 transition-colors"
                  style={{ borderColor: "var(--border)", fontFamily: "inherit" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                  type="tel"
                  className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 transition-colors"
                  style={{ borderColor: "var(--border)", fontFamily: "inherit" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--pink)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <div
                className="mt-4 p-3 rounded-2xl text-xs leading-relaxed"
                style={{ background: "var(--pink-pale)", color: "var(--gray)" }}
              >
                📍 Зона: <strong>{zone}</strong> · Мастер: <strong>{master}</strong> · Время: <strong>{time}</strong>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="py-3 px-5 rounded-2xl font-medium text-sm"
                  style={{ background: "var(--gray-light)", color: "var(--gray)" }}
                >
                  ← Назад
                </button>
                <button
                  disabled={!name || !phone}
                  onClick={submit}
                  className="flex-1 py-3 rounded-2xl font-semibold text-white"
                  style={{
                    background: name && phone ? "var(--pink)" : "var(--pink-light)",
                    cursor: name && phone ? "pointer" : "not-allowed",
                  }}
                >
                  Записаться со скидкой 30%
                </button>
              </div>
              <p className="text-xs text-center mt-3" style={{ color: "var(--gray)" }}>
                Нажимая кнопку, ты соглашаешься с политикой конфиденциальности
              </p>
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
    <div
      className="rounded-3xl overflow-hidden flex-shrink-0 w-72 md:w-80"
      style={{ background: "var(--gray-light)" }}
    >
      <div
        ref={ref}
        className="relative h-72 select-none cursor-ew-resize"
        onMouseDown={() => { dragging.current = true; }}
        onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        {/* Before */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)" }}
        >
          <div className="text-center">
            <div className="text-4xl mb-1">🪒</div>
            <p className="text-xs font-medium" style={{ color: "var(--gray)" }}>До</p>
          </div>
        </div>
        {/* After */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--pink-pale), var(--teal-pale))",
              width: `${10000 / pos}%`,
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-1">✨</div>
              <p className="text-xs font-medium" style={{ color: "var(--teal)" }}>После</p>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div
          className="absolute inset-y-0 w-0.5 z-10"
          style={{ left: `${pos}%`, background: "white", transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Icon name="ChevronsLeftRight" size={14} style={{ color: "var(--pink)" }} />
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{zone}</p>
        <p className="text-xs" style={{ color: "var(--teal)" }}>
          {label} · без раздражения
        </p>
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
      <section
        className="relative min-h-screen flex flex-col"
        style={{ background: "linear-gradient(160deg, var(--pink-pale) 0%, white 50%, var(--teal-pale) 100%)" }}
      >
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 pt-6">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--pink)" }}
            >
              D
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--dark)" }}>
              DENU beauty
            </span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--teal)" }}
          >
            <Icon name="Calendar" size={15} />
            Записаться
          </button>
        </nav>

        {/* Content */}
        <div className="flex-1 flex items-center px-6 md:px-12 pt-8 pb-16">
          <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: "var(--pink)", color: "white" }}
              >
                <Icon name="Sparkles" size={12} />
                −30% на первый визит
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4" style={{ color: "var(--dark)" }}>
                Гладкая кожа{" "}
                <span className="font-display italic" style={{ color: "var(--pink)" }}>
                  24/7
                </span>
              </h1>
              <p className="text-xl mb-2 font-medium" style={{ color: "var(--dark)" }}>
                Быстро, не больно, стильно
              </p>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "var(--gray)" }}>
                Диодный лазер нового поколения — забудь о бритве уже после первого сеанса
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "var(--pink)" }}
                >
                  <Icon name="Sparkles" size={18} />
                  Хочу со скидкой 30%
                </button>
                <a
                  href="#results"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm border-2 transition-colors"
                  style={{ borderColor: "var(--pink-light)", color: "var(--pink)" }}
                >
                  Смотреть результаты
                </a>
              </div>
              <div className="flex items-center gap-6 mt-8">
                {[
                  { val: "500+", label: "довольных гостей" },
                  { val: "6 лет", label: "опыт мастеров" },
                  { val: "10 мин", label: "подмышки" },
                ].map((stat, i) => (
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

            {/* Photo */}
            <div className="relative hidden md:block">
              <div
                className="absolute -inset-4 rounded-[3rem] opacity-30"
                style={{ background: "var(--pink-light)" }}
              />
              <img
                src="https://cdn.poehali.dev/projects/c10ce338-4385-41f6-8e4d-25fe6aca8f8d/files/110840f6-75ad-44db-9c0c-db3fdbf2942c.jpg"
                alt="Результат лазерной эпиляции"
                className="relative rounded-[2.5rem] w-full object-cover shadow-2xl"
                style={{ height: "520px" }}
              />
              <div className="absolute -left-6 top-1/3 bg-white rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--gray)" }}>Без боли</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <span key={i} className="text-xs">⭐</span>)}
                </div>
              </div>
              <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs font-medium" style={{ color: "var(--teal)" }}>
                  ✓ Результат с первой процедуры
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHY DIODE ══════════════════════════════════ */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>
              Технология
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--dark)" }}>
              Почему диодный лазер?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "Snowflake", title: "Не больно", desc: "Система охлаждения насадки снижает дискомфорт до нуля. Даже на чувствительной коже — комфортно.", teal: true },
              { icon: "Zap", title: "Быстро", desc: "Подмышки — 10 минут. Ноги полностью — 40 минут. Уйдёшь за один обеденный перерыв.", teal: false },
              { icon: "ShieldCheck", title: "Безопасно", desc: "Одноразовые расходники, стерильность, гипоаллергенный гель. Сертифицированное оборудование.", teal: true },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-3xl border-2 transition-all hover:shadow-lg"
                style={{ borderColor: "var(--border)", background: "white" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: item.teal ? "var(--teal-pale)" : "var(--pink-pale)" }}
                >
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
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--pink)" }}>
              До / После
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>
              Реальные результаты
            </h2>
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
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>
              Процесс
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--dark)" }}>Как всё проходит</h2>
          </div>
          <div className="space-y-6">
            {[
              { n: "1", title: "Запись онлайн", desc: "Выбираешь удобное время и мастера — прямо здесь, без звонков. Занимает 2 минуты.", icon: "Calendar" },
              { n: "2", title: "Консультация", desc: "Мастер отвечает на все вопросы, проводит тест-зону. Никаких сюрпризов.", icon: "MessageCircle" },
              { n: "3", title: "Процедура", desc: "Комфортно, можно слушать музыку. Быстро и аккуратно — как и обещали.", icon: "Sparkles" },
              { n: "4", title: "Результат", desc: "Гладкая кожа + рекомендации по уходу. Уходишь довольной и уже планируешь следующий визит.", icon: "Star" },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-6">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white"
                  style={{ background: "var(--pink)" }}
                >
                  {step.n}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={step.icon} size={16} style={{ color: "var(--teal)" }} />
                    <h3 className="font-bold text-lg" style={{ color: "var(--dark)" }}>{step.title}</h3>
                  </div>
                  <p style={{ color: "var(--gray)" }} className="text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══════════════════════════════ */}
      <section className="section-padding" style={{ background: "var(--teal-pale)" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>
              Отзывы
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--dark)" }}>Нас выбирают</h2>
            <p className="font-semibold" style={{ color: "var(--teal)" }}>Уже 500+ девушек в Рязани</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="p-5 rounded-3xl bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ background: "var(--pink)" }}
                    >
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--dark)" }}>{r.name}</p>
                      <p className="text-xs" style={{ color: "var(--gray)" }}>
                        {r.source} · {r.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => <span key={i} className="text-sm">⭐</span>)}
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dark)" }}>«{r.text}»</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-5 rounded-3xl bg-white text-center">
            <p className="font-medium mb-3" style={{ color: "var(--dark)" }}>Загляни к нам в соцсети</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-80"
                style={{ background: "var(--pink-pale)", color: "var(--pink)" }}
              >
                <Icon name="Instagram" size={15} />
                @denu_beauty
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:opacity-80"
                style={{ background: "var(--teal-pale)", color: "var(--teal)" }}
              >
                <Icon name="Send" size={15} />
                Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SPECIAL OFFER ══════════════════════════════ */}
      <section className="section-padding" style={{ background: "var(--dark)" }}>
        <div className="container-narrow text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{ background: "var(--pink)", color: "white" }}
          >
            <Icon name="Clock" size={12} />
            Ограниченное предложение
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">−30% на первый визит</h2>
          <p className="text-lg mb-10" style={{ color: "#B0A0A8" }}>
            + бесплатная тест-зона (подмышки или губа) при записи на комплекс
          </p>

          {/* Timer */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {[
              { val: pad(timer.days), label: "дней" },
              { val: pad(timer.hours), label: "часов" },
              { val: pad(timer.mins), label: "минут" },
              { val: pad(timer.secs), label: "секунд" },
            ].map((t, i) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    {t.val}
                  </div>
                  <p className="text-xs mt-1" style={{ color: "#B0A0A8" }}>{t.label}</p>
                </div>
                {i < 3 && (
                  <span className="text-2xl font-bold pb-5" style={{ color: "var(--pink)" }}>
                    :
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--teal)" }}
          >
            <Icon name="Sparkles" size={20} />
            Забрать скидку
          </button>
          <p className="text-xs mt-4" style={{ color: "#B0A0A8" }}>
            Только для новых гостей · Без скрытых условий
          </p>
        </div>
      </section>

      {/* ═══ MASTERS ════════════════════════════════════ */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--pink)" }}>
              Команда
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>Твои мастера</h2>
            <p style={{ color: "var(--gray)" }}>Понимаем твои страхи, поддержим и сделаем всё аккуратно</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {MASTERS.map((m) => (
              <div
                key={m.name}
                className="text-center p-6 rounded-3xl border-2 transition-all hover:shadow-lg"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-pink-100">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl mb-1" style={{ color: "var(--dark)" }}>{m.name}</h3>
                <p className="text-sm font-medium mb-1" style={{ color: "var(--teal)" }}>Опыт {m.exp}</p>
                <p className="text-sm" style={{ color: "var(--gray)" }}>{m.spec}</p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: "var(--pink-pale)", color: "var(--pink)" }}
                >
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
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--pink)" }}>
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "var(--dark)" }}>Частые вопросы</h2>
          </div>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden transition-all"
                style={{ border: "2px solid", borderColor: openFaq === i ? "var(--pink)" : "transparent" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-base" style={{ color: "var(--dark)" }}>{item.q}</span>
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ml-4 transition-transform"
                    style={{
                      background: "var(--pink-pale)",
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                    }}
                  >
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
        </div>
      </section>

      {/* ═══ CONTACTS ═══════════════════════════════════ */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-narrow">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--teal)" }}>
              Контакты
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--dark)" }}>Мы в Рязани</h2>
            <p style={{ color: "var(--gray)" }}>Запишись онлайн или напиши нам — ответим за 15 минут</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Map placeholder */}
            <div
              className="rounded-3xl overflow-hidden h-72 flex items-center justify-center"
              style={{ background: "var(--gray-light)" }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">📍</div>
                <p className="font-semibold" style={{ color: "var(--dark)" }}>ул. Примерная, 15</p>
                <p className="text-sm mt-1" style={{ color: "var(--gray)" }}>г. Рязань</p>
                <a
                  href="#"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--teal)" }}
                >
                  Построить маршрут <Icon name="ArrowUpRight" size={14} />
                </a>
              </div>
            </div>

            {/* Info + CTA */}
            <div className="space-y-4">
              {[
                { icon: "MapPin", text: "ул. Примерная, 15, ТЦ «Центральный», 2 этаж", label: "Адрес", teal: false },
                { icon: "Clock", text: "Пн–Пт: 10:00–21:00 · Сб–Вс: 10:00–19:00", label: "Режим работы", teal: true },
                { icon: "Car", text: "Бесплатная парковка у входа в ТЦ", label: "Парковка", teal: false },
              ].map((info) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 p-4 rounded-2xl"
                  style={{ background: "var(--gray-light)" }}
                >
                  <Icon
                    name={info.icon}
                    size={20}
                    style={{ color: info.teal ? "var(--teal)" : "var(--pink)" }}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold" style={{ color: "var(--dark)" }}>{info.label}</p>
                    <p className="text-sm" style={{ color: "var(--gray)" }}>{info.text}</p>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="https://wa.me/79001234567"
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: "#25D366" }}
                >
                  <Icon name="MessageCircle" size={16} />
                  WhatsApp
                </a>
                <a
                  href="https://t.me/denu_beauty"
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: "#229ED9" }}
                >
                  <Icon name="Send" size={16} />
                  Telegram
                </a>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95"
                style={{ background: "var(--pink)" }}
              >
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
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "var(--pink)" }}
            >
              D
            </div>
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
        <a
          href="https://t.me/denu_beauty"
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ background: "#229ED9" }}
        >
          <Icon name="Send" size={20} />
        </a>
        <a
          href="https://wa.me/79001234567"
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ background: "#25D366" }}
        >
          <Icon name="MessageCircle" size={20} />
        </a>
        <button
          onClick={() => setModalOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ background: "var(--pink)" }}
        >
          <Icon name="Calendar" size={20} />
        </button>
      </div>

      {/* ═══ BOOKING MODAL ═══════════════════════════════ */}
      {modalOpen && <BookingModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
