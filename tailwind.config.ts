
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
			fontFamily: {
				sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				'background-end': 'hsl(var(--background-end))',
				foreground: 'hsl(var(--foreground))',
				
				// New color palette
				'rich-black': '#000000',
				'dark-purple': '#150F1E',
				'neon-green': '#00FF85',
				'soft-lime': '#BFFF00',
				'soft-purple': '#A78BFA',
				'electric-blue': '#38BDF8',
				'subdued-orange': '#FF901F',
				'success': '#2DD4BF',
				'warning': '#FBBF24',
				
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
			boxShadow: {
				'glass': '0 8px 24px 0 rgba(0, 0, 0, 0.3)',
				'glass-hover': '0 12px 28px 0 rgba(0, 0, 0, 0.4)'
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
				'glow': {
					'0%': {
						boxShadow: '0 0 5px rgba(0, 255, 133, 0.5), 0 0 10px rgba(0, 255, 133, 0.2)'
					},
					'50%': {
						boxShadow: '0 0 10px rgba(0, 255, 133, 0.7), 0 0 20px rgba(0, 255, 133, 0.4)'
					},
					'100%': {
						boxShadow: '0 0 5px rgba(0, 255, 133, 0.5), 0 0 10px rgba(0, 255, 133, 0.2)'
					}
				},
				'particle-float': {
					'0%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '0' },
					'50%': { opacity: '0.5' },
					'100%': { transform: 'translateY(-100px) translateX(20px) rotate(180deg)', opacity: '0' }
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
				'glow': 'glow 2s infinite ease-in-out',
				'particle-float': 'particle-float 5s forwards'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'accent-gradient': 'linear-gradient(to right, #00FF85, #BFFF00)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
