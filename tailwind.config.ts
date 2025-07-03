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
				"solivrah-bg": "#0A0A0A",
				"solivrah-card": "#151515",
				"solivrah-card-hover": "#1A1A1A",
				"solivrah-button": "#222222",
				"solivrah-button-hover": "#2A2A2A",
				"solivrah-border": "#333333",
				"solivrah-border-hover": "#444444",
				"solivrah-text": "#FFFFFF",
				"solivrah-text-muted": "#999999",
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
				sans: ["Poppins", "system-ui", "sans-serif"],
				poppins: ["Poppins", "sans-serif"],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale': {
					from: {
						transform: 'scale(1)'
					},
					to: {
						transform: 'scale(0.95)'
					}
				},
				'slide-in': {
					from: {
						transform: 'translateX(-100%)'
					},
					to: {
						transform: 'translateX(0)'
					}
				},
				'slide-out': {
					from: {
						transform: 'translateX(0)'
					},
					to: {
						transform: 'translateX(-100%)'
					}
				},
				'pop-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.8)'
					},
					'70%': {
						transform: 'scale(1.05)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'blur-in': {
					from: {
						opacity: '0',
						filter: 'blur(8px)'
					},
					to: {
						opacity: '1',
						filter: 'blur(0)'
					}
				},
				'float': {
					'0%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				},
				'pulse': {
					'0%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.05)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				},
				'pulse-soft': {
					'0%': {
						opacity: '0.8'
					},
					'50%': {
						opacity: '1'
					},
					'100%': {
						opacity: '0.8'
					}
				},
				'glow': {
					'0%': {
						boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)'
					},
					'50%': {
						boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
					},
					'100%': {
						boxShadow: '0 0 5px rgba(255, 255, 255, 0.1)'
					}
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
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out forwards',
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
				'button-gradient': 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #121212 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
				'card-gradient': 'linear-gradient(135deg, #181818 0%, #101010 100%)',
				'subtle-glow': 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
			},
			boxShadow: {
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
