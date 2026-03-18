import React, { useState, useEffect, useLayoutEffect, useMemo, memo, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { 
  Sun, 
  Sparkles, 
  Droplets, 
  Heart, 
  MapPin, 
  Phone, 
  Instagram, 
  Menu, 
  X, 
  ChevronRight,
  ChevronLeft,
  Clock,
  Star,
  Check,
  Award
} from 'lucide-react';

// --- INÍCIO DA LÓGICA DO CARROSSEL 3D ---
const IS_SERVER = typeof window === "undefined"

export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

export function useMediaQuery(
  query,
  { defaultValue = false, initializeWithValue = true } = {}
) {
  const getMatches = (query) => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

const transition = { duration: 0.15, ease: [0.32, 0.72, 0, 1], filter: "blur(4px)" }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] }

// Componente de animação ao scroll
const RevealOnScroll = ({ children, className = "", delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Direction Aware Hover Component
const directionVariants = {
  initial: { x: 0 },
  exit: { x: 0, y: 0 },
  top: { y: 20 },
  bottom: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
};

const directionTextVariants = {
  initial: { y: 0, x: 0, opacity: 0 },
  exit: { y: 0, x: 0, opacity: 0 },
  top: { y: -20, opacity: 1 },
  bottom: { y: 2, opacity: 1 },
  left: { x: -2, opacity: 1 },
  right: { x: 20, opacity: 1 },
};

const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName = "",
  imageClassName = "",
  className = "",
}) => {
  const ref = useRef(null);
  const [direction, setDirection] = useState("left");

  const getDirection = (ev, obj) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  const handleMouseEnter = (event) => {
    if (!ref.current) return;
    const d = getDirection(event, ref.current);
    switch (d) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={`bg-transparent rounded-lg overflow-hidden group/card relative ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          <motion.div className="group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500" />
          <motion.div
            variants={directionVariants}
            className="h-full w-full relative bg-gray-50"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <img
              alt="image"
              className={`h-full w-full object-cover scale-[1.15] ${imageClassName}`}
              src={imageUrl}
            />
          </motion.div>
          <motion.div
            variants={directionTextVariants}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`text-white absolute bottom-4 left-4 z-40 ${childrenClassName}`}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Animated Underline Text Component
const AnimatedUnderlineText = ({
  text,
  className = "",
  textClassName = "",
  underlineClassName = "",
  underlinePath = "M 0,10 Q 75,0 150,10 Q 225,20 300,10",
  underlineHoverPath = "M 0,10 Q 75,20 150,10 Q 225,0 300,10",
  underlineDuration = 1.5,
}) => {
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: underlineDuration,
        ease: "easeInOut",
      },
    },
  };

  return (
    <span className={`inline-flex flex-col items-start ${className}`}>
      <span className="relative inline-block">
        <motion.span
          className={textClassName}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          {text}
        </motion.span>

        <motion.svg
          width="100%"
          height="20"
          viewBox="0 0 300 20"
          preserveAspectRatio="none"
          className={`absolute -bottom-2 left-0 ${underlineClassName}`}
        >
          <motion.path
            d={underlinePath}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              d: underlineHoverPath,
              transition: { duration: 0.8 },
            }}
          />
        </motion.svg>
      </span>
    </span>
  );
};

const Carousel = memo(
  ({ handleClick, cards, isCarouselActive }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 1100 : 1800
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    const isDraggingRef = useRef(false);
    const lastX = useRef(0);

    const handlePointerDown = (e) => {
      if (!isCarouselActive) return;
      e.preventDefault();
      isDraggingRef.current = true;
      lastX.current = e.clientX;
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current || !isCarouselActive) return;
      const deltaX = e.clientX - lastX.current;
      rotation.set(rotation.get() + deltaX * 0.5);
      lastX.current = e.clientX;
    };

    const handlePointerUp = (e) => {
      isDraggingRef.current = false;
    };

    // Efeito para girar a roleta lentamente e sozinha
    useEffect(() => {
      let animationFrameId;
      const loop = () => {
        if (isCarouselActive && !isDraggingRef.current) {
          rotation.set(rotation.get() - 0.08);
        }
        animationFrameId = requestAnimationFrame(loop);
      };
      loop();
      return () => cancelAnimationFrame(animationFrameId);
    }, [isCarouselActive, rotation]);

    return (
      <div
        className="flex h-full items-center justify-center bg-transparent"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing select-none"
          style={{
            transform,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
            touchAction: "none",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {cards.map((imgUrl, i) => (
            <motion.div
              key={`key-${imgUrl}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-[2rem] bg-transparent p-2"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${
                  i * (360 / faceCount)
                }deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(imgUrl, i)}
            >
              <motion.img
                src={imgUrl}
                alt={`gallery_image_${i}`}
                layoutId={`img-${imgUrl}`}
                className="pointer-events-none w-full rounded-[2rem] object-cover aspect-square shadow-xl border-4 border-white/80"
                initial={{ filter: "blur(4px)" }}
                layout="position"
                animate={{ filter: "blur(0px)" }}
                transition={transition}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
)

function ThreeDPhotoCarousel() {
  const [activeImg, setActiveImg] = useState(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)

  const cards = useMemo(
    () => [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507652313656-b1480407dd9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588820786963-f0273766a506?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ],
    []
  )

  const handleClick = (imgUrl) => {
    setActiveImg(imgUrl)
    setIsCarouselActive(false)
  }

  const handleClose = () => {
    setActiveImg(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout className="relative w-full max-w-5xl mx-auto">
      <AnimatePresence mode="sync">
        {activeImg && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            layoutId={`img-container-${activeImg}`}
            layout="position"
            onClick={handleClose}
            className="fixed inset-0 bg-[#0A3329]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 md:p-10 cursor-zoom-out"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            <motion.img
              layoutId={`img-${activeImg}`}
              src={activeImg}
              className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-[#fe6637]/50"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "transform" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-[400px] md:h-[500px] w-full mt-8 rounded-3xl cursor-grab active:cursor-grabbing" style={{ transformStyle: "preserve-3d" }}>
        <Carousel
          handleClick={handleClick}
          cards={cards}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  )
}
// --- FIM DA LÓGICA DO CARROSSEL 3D ---


const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const testimonialsRef = useRef(null);
  
  // Estados para o formulário de avaliação
  const [reviewForm, setReviewForm] = useState({ name: '', message: '', rating: 5 });
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = "5583988370593";
  const whatsappMessage = "Olá! Gostaria de agendar um horário.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const instagramLink = "https://www.instagram.com/cynthiaramalhobronzejp/";

  const spaServices = [
    {
      cursive: "Arte do",
      serif: "Bronze",
      items: ["Bronzeamento Natural", "Bronzeamento a Jato", "Banho de Lua"],
      img: "https://images.unsplash.com/photo-1507652313656-b1480407dd9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      cursive: "Detalhes de",
      serif: "Elegância",
      items: ["Manicure & Pedicure", "Alongamento de Unhas", "Spa dos Pés"],
      img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      cursive: "Ritual dos",
      serif: "Fios",
      items: ["Cortes & Escovas", "Mechas & Coloração", "Hidratação Profunda"],
      img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      cursive: "Olhar de",
      serif: "Nobreza",
      items: ["Design de Sobrancelha", "Brow Lamination", "Lash Lifting"],
      img: "https://images.unsplash.com/photo-1588820786963-f0273766a506?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      cursive: "Toque de",
      serif: "Brilho",
      items: ["Esfoliação Corporal", "Massagem Relaxante", "Banhos Especiais"],
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    }
  ];

  const scrollTestimonials = (direction) => {
    if (testimonialsRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      testimonialsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setIsReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewSubmitted(false);
      setReviewForm({ name: '', message: '', rating: 5 });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-[#fe6637]/30 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Satisfy&display=swap');
        html { scroll-behavior: smooth; }
        .font-cursive { font-family: 'Satisfy', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-4' : 'bg-transparent py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={isScrolled ? "/logo_transparente-black.png" : "/logo_transparente.png"} alt="Cynthia Ramalho Logo" className={`${isScrolled ? 'h-16 md:h-20' : 'h-32 md:h-40'} -my-8 w-auto object-contain transition-all duration-300`} />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className={`text-[17px] font-medium transition-colors ${isScrolled ? 'text-stone-700 hover:text-[#1E9276]' : 'text-white/90 hover:text-[#fe6637]'}`}>Início</a>
              <a href="#sobre" className={`text-[17px] font-medium transition-colors ${isScrolled ? 'text-stone-700 hover:text-[#1E9276]' : 'text-white/90 hover:text-[#fe6637]'}`}>Sobre</a>
              <a href="#servicos" className={`text-[17px] font-medium transition-colors ${isScrolled ? 'text-stone-700 hover:text-[#1E9276]' : 'text-white/90 hover:text-[#fe6637]'}`}>Serviços</a>
              <a href="#diferenciais" className={`text-[17px] font-medium transition-colors ${isScrolled ? 'text-stone-700 hover:text-[#1E9276]' : 'text-white/90 hover:text-[#fe6637]'}`}>Diferenciais</a>
              <a href="#depoimentos" className={`text-[17px] font-medium transition-colors ${isScrolled ? 'text-stone-700 hover:text-[#1E9276]' : 'text-white/90 hover:text-[#fe6637]'}`}>Depoimentos</a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
                 className="shimmer-btn text-white px-6 py-2.5 rounded-full text-[17px] font-medium transition-all shadow-lg flex items-center gap-2">
                Agendar Horário
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 ${isScrolled ? 'text-stone-800' : 'text-white'}`}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-stone-100 py-4 px-4 flex flex-col space-y-4">
            <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-600 hover:text-[#1E9276]">Início</a>
            <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-600 hover:text-[#1E9276]">Sobre</a>
            <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-600 hover:text-[#1E9276]">Serviços</a>
            <a href="#diferenciais" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-600 hover:text-[#1E9276]">Diferenciais</a>
            <a href="#depoimentos" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-600 hover:text-[#1E9276]">Depoimentos</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="shimmer-btn text-white text-center py-3 rounded-xl font-medium mt-4">
              Agendar Horário
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/bg.jpeg"
            alt="Spa Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A3329]/90 via-[#0A3329]/70 to-[#0A3329]/40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
          <div className="max-w-2xl">
            <RevealOnScroll delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fe6637]/20 border border-[#fe6637]/30 text-[#fe6637] text-sm font-medium mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span>O seu refúgio de beleza em João Pessoa</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-4">
                A estação que <br/>
                marca a sua{" "}
                <AnimatedUnderlineText
                  text="beleza"
                  className="block mt-2"
                  textClassName="font-cursive text-7xl md:text-8xl text-[#fe6637] font-normal tracking-wide"
                  underlineClassName="text-[#fe6637]"
                  underlinePath="M 0,15 Q 50,5 100,15 Q 150,25 200,15 Q 250,5 300,15"
                  underlineHoverPath="M 0,15 Q 50,25 100,15 Q 150,5 200,15 Q 250,25 300,15"
                  underlineDuration={2}
                />
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-lg font-light leading-relaxed">
                Descubra um espaço exclusivo desenhado para cuidar de si. Especialistas no bronze perfeito e tratamentos de spa luxuosos.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                   className="shimmer-btn text-white px-8 py-4 rounded-full font-medium transition-all shadow-xl shadow-[#fe6637]/20 hover:shadow-[#fe6637]/40 text-center flex justify-center items-center gap-2 text-lg">
                  Marcar Sessão
                  <ChevronRight className="w-5 h-5" />
                </a>
                <a href="#servicos"
                   className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-8 py-4 rounded-full font-medium transition-all text-center flex justify-center items-center text-lg backdrop-blur-sm">
                  Ver Serviços
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* SECÇÃO DE SERVIÇOS */}
      <section id="servicos" className="py-24 bg-[#F5F8F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-cursive text-4xl text-[#fe6637]">Nossas Experiências</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0A3329] mt-2 mb-6">Serviços Exclusivos</h2>
              <div className="w-24 h-1 bg-[#1E9276] mx-auto rounded-full opacity-50 mb-6"></div>
              <p className="text-stone-600 text-lg">
                Oferecemos uma variedade de tratamentos premium, pensados para o seu bem-estar, autoestima e relaxamento profundo.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaServices.map((service, idx) => (
              <RevealOnScroll key={idx} delay={idx * 0.1}>
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-stone-100 flex flex-col h-full">
                  <div className="h-64 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#0A3329]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img
                      src={service.img}
                      alt={service.serif}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg z-20 text-[#1E9276]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow relative">
                    <div className="mb-6">
                      <h3 className="font-cursive text-4xl text-[#fe6637] mb-[-10px]">{service.cursive}</h3>
                      <h4 className="font-serif text-2xl font-bold text-[#0A3329] uppercase tracking-wider">{service.serif}</h4>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-stone-600">
                          <Check className="w-5 h-5 text-[#1E9276] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                       className="w-full bg-stone-50 hover:bg-[#1E9276] text-[#1E9276] hover:text-white border border-[#1E9276]/20 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-between group/btn">
                      <span>Saber mais e Agendar</span>
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

        </div>
      </section>

      {/* Secção de Diferenciais */}
      <section id="diferenciais" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#fe6637]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#1E9276]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-cursive text-4xl text-[#fe6637]">Os Nossos Diferenciais</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0A3329] mt-2 mb-6">Padrão de Excelência em Cada Detalhe</h2>
              <div className="w-24 h-1 bg-[#1E9276] mx-auto rounded-full opacity-50 mb-6"></div>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Sparkles />, title: "Ambiente Sensorial", desc: "Um refúgio projetado para oferecer paz e proporcionar relaxamento absoluto a cada visita." },
              { icon: <Heart />, title: "Atendimento Personalizado", desc: "Cada cliente recebe um cuidado especial, com tratamentos adaptados às suas necessidades." },
              { icon: <Droplets />, title: "Produtos Premium", desc: "Utilizamos apenas as melhores marcas do mercado e produtos hipoalergênicos aprovados." },
              { icon: <Star />, title: "Experiências Únicas", desc: "Técnicas exclusivas para criar momentos de pura indulgência, renovação e bem-estar." }
            ].map((diff, idx) => (
              <RevealOnScroll key={idx} delay={idx * 0.1}>
                <div className="bg-[#F5F8F7] p-8 rounded-[2rem] text-center hover:-translate-y-2 transition-transform duration-300 border border-stone-100 shadow-sm hover:shadow-lg group h-full">
                  <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-[#1E9276] mx-auto mb-6 group-hover:bg-[#1E9276] group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(diff.icon, { className: "w-8 h-8" })}
                  </div>
                  <h4 className="text-xl font-bold text-[#0A3329] mb-3">{diff.title}</h4>
                  <p className="text-stone-600 text-sm leading-relaxed">{diff.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 bg-[#0A3329] text-stone-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1E9276]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#fe6637]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <RevealOnScroll direction="left" className="relative order-2 lg:order-1">
              <DirectionAwareHover
                imageUrl="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                className="aspect-[4/5] w-full rounded-[2rem] shadow-2xl border-4 border-white/10"
              >
                <div className="space-y-2">
                  <p className="font-serif font-bold text-2xl">Spa & Bronze</p>
                  <p className="font-light text-stone-200">Cuidado e relaxamento em João Pessoa</p>
                </div>
              </DirectionAwareHover>
            </RevealOnScroll>

            <div className="order-1 lg:order-2">
              <RevealOnScroll direction="right">
                <span className="font-cursive text-4xl text-[#fe6637] mb-2 block">Uma verdadeira Jornada de Bem-Estar!</span>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">Compromisso com a Estética e a Sua Essência</h3>
              </RevealOnScroll>

              <RevealOnScroll direction="right" delay={0.2}>
                <div className="space-y-6 text-stone-300 text-lg font-light leading-relaxed mb-10">
                  <p>
                    Localizado no coração de João Pessoa, o <strong>Cynthia Ramalho Spa & Bronze</strong> é fruto de um sonho focado em promover a verdadeira filosofia de cuidado, relaxamento e elevação da autoestima.
                  </p>
                  <p>
                    O nosso compromisso com a excelência impulsiona-nos a oferecer uma experiência sensorial completa. Acreditamos que cada detalhe importa, e que, em conjunto, compõem um momento verdadeiramente transformador — seja na busca do bronzeado perfeito ou de um instante de relaxamento.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="right" delay={0.3}>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[#0A3329] shimmer-btn px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl">
                  <Instagram className="w-5 h-5" />
                  Acompanhe o nosso Instagram
                </a>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Secção de Resultados (com o Novo Carrossel 3D) */}
      <section className="py-24 bg-white relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-xl">
                <span className="font-cursive text-4xl text-[#fe6637] block">Resultados Reais</span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#0A3329]">A marquinha dos sonhos</h3>
              </div>
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="mt-6 md:mt-0 text-[#1E9276] font-medium flex items-center gap-2 hover:text-[#166e59] transition-colors border border-[#1E9276] px-6 py-2.5 rounded-full z-10 relative">
              <Instagram className="w-5 h-5" /> Ver mais fotos
            </a>
            </div>
          </RevealOnScroll>

          {/* Integração do Carrossel 3D Aqui */}
          <ThreeDPhotoCarousel />

         </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-16 md:py-24 bg-[#F5F8F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
               <span className="font-cursive text-3xl md:text-4xl text-[#fe6637] block">Depoimentos</span>
              <h3 className="text-2xl md:text-4xl font-serif font-bold text-[#0A3329] mb-4 md:mb-6">O que as nossas clientes dizem</h3>
            </div>
          </RevealOnScroll>

          <div className="relative">
            {/* Carousel Controls */}
            <div className="absolute top-1/2 -left-4 md:-left-6 z-10 -translate-y-1/2 hidden md:block">
              <button 
                onClick={() => scrollTestimonials('left')}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1E9276] hover:bg-[#1E9276] hover:text-white transition-colors border border-stone-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            
            <div className="absolute top-1/2 -right-4 md:-right-6 z-10 -translate-y-1/2 hidden md:block">
              <button
                onClick={() => scrollTestimonials('right')}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1E9276] hover:bg-[#1E9276] hover:text-white transition-colors border border-stone-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Carousel Container */}
            <RevealOnScroll>
              <div
                ref={testimonialsRef}
                className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 pt-4 px-2 md:px-4 -mx-2 md:-mx-4"
              >
                {[
                  { name: "Mariana Silva", text: "O melhor bronze de JP! Ambiente super agradável, a equipa é um amor e os produtos deixam uma cor linda." },
                  { name: "Letícia Costa", text: "Fiz o bronze a jato para o meu casamento e ficou simplesmente perfeito. Cor natural, não manchou a roupa. Recomendo de olhos fechados!" },
                  { name: "Camila Barros", text: "O meu momento favorito do mês. O banho de lua com o spa renovam-me. Atendimento impecável e estrutura nota 1000." },
                  { name: "Beatriz Lins", text: "As unhas e o spa dos pés são maravilhosos. A Cynthia e toda a equipa fazem-nos sentir umas rainhas desde que chegamos." },
                  { name: "Juliana Mendes", text: "Sempre faço o design de sobrancelha e lash lifting aqui. Durabilidade incrível e um olhar muito natural." }
                ].map((testimonial, idx) => (
                  <div key={idx} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-stone-100 relative min-w-[280px] md:min-w-[400px] flex-shrink-0 snap-center">
                    <div className="flex gap-1 mb-3 md:mb-4 text-[#fe6637]">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />)}
                    </div>
                    <p className="text-stone-600 mb-4 md:mb-6 italic text-sm md:text-base">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#fe6637]/10 rounded-full flex items-center justify-center font-serif font-bold text-[#e6552b] text-sm md:text-base">
                        {testimonial.name.charAt(0)}
                      </div>
                      <span className="font-medium text-stone-900 text-sm md:text-base">{testimonial.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>

          {/* Formulário de Avaliação */}
          <RevealOnScroll delay={0.2}>
            <div className="mt-12 md:mt-20 max-w-2xl mx-auto bg-white p-5 md:p-10 rounded-2xl md:rounded-[2rem] shadow-sm border border-stone-100">
              <div className="text-center mb-6 md:mb-8">
                <h4 className="font-serif text-xl md:text-2xl font-bold text-[#0A3329]">Deixe a sua Avaliação</h4>
                <p className="text-stone-600 mt-2 text-sm md:text-base">Partilhe a sua experiência connosco.</p>
              </div>

              {isReviewSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1E9276]/10 text-[#1E9276] p-6 md:p-8 rounded-xl md:rounded-2xl text-center border border-[#1E9276]/20"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1E9276] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <h5 className="font-bold text-lg md:text-xl mb-2">Muito Obrigado!</h5>
                  <p className="font-medium text-[#166e59] text-sm md:text-base">A sua avaliação foi recebida com sucesso e ajuda-nos a melhorar cada vez mais.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5 md:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">A sua nota</label>
                    <div className="flex gap-1 md:gap-2 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className={`${reviewForm.rating >= star ? 'text-[#fe6637]' : 'text-stone-300'} hover:text-[#fe6637] transition-colors focus:outline-none`}
                      >
                        <Star className={`w-8 h-8 md:w-10 md:h-10 ${reviewForm.rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Nome</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1E9276]/50 focus:border-[#1E9276] transition-all bg-stone-50/50 text-base"
                    placeholder="O seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Mensagem</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={reviewForm.message}
                    onChange={(e) => setReviewForm({...reviewForm, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1E9276]/50 focus:border-[#1E9276] transition-all resize-none bg-stone-50/50"
                    placeholder="Conte-nos como foi a sua experiência..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0A3329] hover:bg-[#07241d] text-white px-6 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2"
                >
                  <Star className="w-5 h-5 fill-current" />
                  Enviar Avaliação
                </button>
              </form>
            )}
            </div>
          </RevealOnScroll>

        </div>
      </section>

      {/* Pre-Footer CTA Banner */}
      <section className="relative py-28 bg-[#0A3329] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Spa Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A3329] to-transparent z-0"></div>
        <RevealOnScroll className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">Permita-se Esta Experiência</h2>
          <p className="font-cursive text-4xl md:text-5xl text-[#fe6637] mb-10 tracking-wide">Descubra um refúgio onde paz e relaxamento a aguardam</p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                 className="inline-flex shimmer-btn text-[#0A3329] px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all shadow-xl hover:shadow-[#fe6637]/40 text-center items-center gap-2">
                Agende a sua Sessão
                <ChevronRight className="w-5 h-5" />
          </a>
        </RevealOnScroll>
      </section>

      {/* Footer / Contact */}
      <footer id="contato" className="bg-[#0A3329] pt-20 pb-10 text-stone-300 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <RevealOnScroll delay={0}>
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <Sun className="w-8 h-8 text-[#fe6637]" />
                  <div className="flex flex-col text-white">
                    <span className="font-serif font-bold text-xl leading-tight tracking-wide">
                      CYNTHIA RAMALHO
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#1E9276]">
                      Spa & Bronze
                    </span>
                  </div>
                </div>
                <p className="text-stone-400 text-sm mb-6 leading-relaxed">
                  Elevando a autoestima das mulheres de João Pessoa com responsabilidade, conforto e resultados impecáveis.
                </p>
              </div>
            </RevealOnScroll>

            {/* Links */}
            <RevealOnScroll delay={0.1}>
              <div>
                <h4 className="text-white font-medium mb-6 uppercase text-sm tracking-wider">Acesso Rápido</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#inicio" className="hover:text-[#fe6637] transition-colors">Início</a></li>
                  <li><a href="#sobre" className="hover:text-[#fe6637] transition-colors">Sobre Nós</a></li>
                  <li><a href="#servicos" className="hover:text-[#fe6637] transition-colors">Serviços</a></li>
                  <li><a href="#diferenciais" className="hover:text-[#fe6637] transition-colors">Diferenciais</a></li>
                  <li><a href="#depoimentos" className="hover:text-[#fe6637] transition-colors">Depoimentos</a></li>
                </ul>
              </div>
            </RevealOnScroll>

            {/* Contact Info */}
            <RevealOnScroll delay={0.2}>
              <div>
                <h4 className="text-white font-medium mb-6 uppercase text-sm tracking-wider">Contacto</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#1E9276] shrink-0" />
                    <span>João Pessoa, PB</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#1E9276] shrink-0" />
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#fe6637] transition-colors">
                      (83) 98837-0593
                    </a>
                  </li>
                <li className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-[#1E9276] shrink-0" />
                  <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#fe6637] transition-colors">
                    @cynthiaramalhobronzejp
                  </a>
                </li>
              </ul>
              </div>
            </RevealOnScroll>

            {/* Hours */}
            <RevealOnScroll delay={0.3}>
              <div>
                <h4 className="text-white font-medium mb-6 uppercase text-sm tracking-wider">Horários</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Seg - Sex</span>
                    <span className="text-[#fe6637]">08:00 - 17:00</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Sáb</span>
                    <span className="text-[#fe6637]">08:00 - 15:00</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Dom</span>
                    <span className="text-stone-500">Fechado</span>
                  </li>
                </ul>
                <div className="mt-6 flex items-center gap-2 text-xs text-white/80 bg-white/5 p-3 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-[#1E9276] shrink-0" />
                  <span>Atendimento exclusivo com marcação.</span>
                </div>
              </div>
            </RevealOnScroll>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
            <p>&copy; {new Date().getFullYear()} Cynthia Ramalho Spa & Bronze. Todos os direitos reservados.</p>
            <p>Desenvolvido por <a href="https://github.com/DevcomDavi" target="_blank" rel="noopener noreferrer" className="hover:text-[#fe6637] transition-colors">DevcomDavi</a></p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20b858] hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce"
        aria-label="Agendar via WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};

export default App;