
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
				"solivrah-bg": "#0F0F0F",
				"solivrah-button": "#2C2C2C",
				"solivrah-button-start": "#373737",
				"solivrah-button-end": "#212121",
				"solivrah-border": "#464646",
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
				}
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
				'glow': 'glow 2s infinite ease-in-out'
			},
			backdropBlur: {
				xs: '2px'
			},
			backgroundImage: {
				'button-gradient': 'radial-gradient(206.3% 53.42% at 50% 50.94%, #373737 0%, #212121 100%)'
			},
			fontFamily: {
				sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
