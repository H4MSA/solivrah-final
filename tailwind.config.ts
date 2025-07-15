import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Premium Wellness-themed Color Palette
				calm: {
					50: '#f0fdfa',
					100: '#ccfbf1',
					200: '#99f6e4',
					300: '#5eead4',
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488',
					700: '#0f766e',
					800: '#115e59',
					900: '#134e4a',
				},
				serenity: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				},
				gold: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
				// Legacy colors for backward compatibility
				"solivrah-bg": "#0A0A0A",
				"solivrah-card": "#151515",
				"solivrah-card-hover": "#1A1A1A",
				"solivrah-button": "#222222",
				"solivrah-button-hover": "#2A2A2A",
				"solivrah-border": "#333333",
				"solivrah-border-hover": "#444444",
				"solivrah-text": "#FFFFFF",
				"solivrah-text-muted": "#999999",
				// Shadcn/ui colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				'background-end': 'hsl(var(--background-end))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ["SF Pro Display", "Poppins", "system-ui", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
				'sf-pro': ["SF Pro Display", "system-ui", "sans-serif"],
			},
			fontSize: {
				'hero': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
				'heading': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
				'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
				'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			keyframes: {
				// Enhanced animations for premium feel
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(20, 184, 166, 0.3)' },
					'50%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.6), 0 0 30px rgba(20, 184, 166, 0.4)' }
				},
				'breathe': {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
					'50%': { transform: 'scale(1.05)', opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'float-gentle': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'shimmer-premium': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'stagger-fade': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				// Legacy animations
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'scale': {
					from: { transform: 'scale(1)' },
					to: { transform: 'scale(0.95)' }
				},
				'slide-in': {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' }
				},
				'slide-out': {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(-100%)' }
				},
				'pop-in': {
					'0%': { opacity: '0', transform: 'scale(0.8)' },
					'70%': { transform: 'scale(1.05)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'blur-in': {
					from: { opacity: '0', filter: 'blur(8px)' },
					to: { opacity: '1', filter: 'blur(0)' }
				},
				'float': {
					'0%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
					'100%': { transform: 'translateY(0)' }
				},
				'pulse': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
					'100%': { transform: 'scale(1)' }
				},
				'pulse-soft': {
					'0%': { opacity: '0.8' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0.8' }
				},
				'glow': {
					'0%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)' },
					'50%': { boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)' },
					'100%': { boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)' }
				},
				'float-3d': {
					'0%': { transform: 'translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg)' },
					'50%': { transform: 'translateY(-5px) translateZ(5px) rotateX(2deg) rotateY(-2deg)' },
					'100%': { transform: 'translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg)' },
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' },
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' },
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'card-hover': {
					'0%': { transform: 'translateY(0) scale(1)' },
					'100%': { transform: 'translateY(-5px) scale(1.01)' },
				},
			},
			animation: {
				// Premium animations
				'fade-in': 'fade-in 0.3s ease-out forwards',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'breathe': 'breathe 4s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out forwards',
				'slide-down': 'slide-down 0.3s ease-out forwards',
				'scale-in': 'scale-in 0.2s ease-out forwards',
				'float-gentle': 'float-gentle 3s ease-in-out infinite',
				'shimmer-premium': 'shimmer-premium 2s linear infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'stagger-fade': 'stagger-fade 0.5s ease-out forwards',
				// Legacy animations
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'scale': 'scale 0.2s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'slide-out': 'slide-out 0.3s ease-out',
				'pop-in': 'pop-in 0.5s forwards',
				'blur-in': 'blur-in 0.5s ease-out',
				'float': 'float 5s infinite ease-in-out',
				'pulse': 'pulse 2s infinite ease-in-out',
				'pulse-soft': 'pulse-soft 2.5s infinite ease-in-out',
				'glow': 'glow 2s infinite ease-in-out',
				'float-3d': 'float-3d 6s ease-in-out infinite',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'shimmer': 'shimmer 3s linear infinite',
				'gradient-shift': 'gradient-shift 6s ease infinite',
				'card-hover': 'card-hover 0.3s forwards',
			},
			backdropBlur: {
				xs: '2px'
			},
			backgroundImage: {
				// Premium gradients
				'wellness-gradient': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)',
				'premium-gradient': 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
				'gold-gradient': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
				'glass-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
				'mood-button': 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(13,148,136,0.05) 100%)',
				'quest-card': 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.6) 100%)',
				'floating-action-button': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
				// Legacy gradients
				'button-gradient': 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #121212 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
				'card-gradient': 'linear-gradient(135deg, #181818 0%, #101010 100%)',
				'subtle-glow': 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
			},
			boxShadow: {
				// Premium shadows
				'glass-card': '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)',
				'premium-glow': '0 0 20px rgba(20,184,166,0.3), 0 8px 32px rgba(0,0,0,0.12)',
				'mood-button': '0 4px 16px rgba(20,184,166,0.2), 0 0 0 1px rgba(20,184,166,0.1)',
				'quest-card': '0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05)',
				'floating-action-button': '0 8px 24px rgba(20,184,166,0.4), 0 4px 12px rgba(0,0,0,0.15)',
				// Legacy shadows
				'glass': '0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05)',
				'glass-hover': '0 8px 30px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.07)',
				'premium': '0 10px 25px -3px rgba(0,0,0,0.3), 0 1px 10px -2px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
				'card-3d': '0 20px 40px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07)',
				'button': '0 2px 5px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
				'button-hover': '0 4px 10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
				'glow-sm': '0 0 10px rgba(79, 70, 229, 0.2)',
				'glow-md': '0 0 15px rgba(79, 70, 229, 0.3)',
				'glow-lg': '0 0 20px rgba(79, 70, 229, 0.4)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
