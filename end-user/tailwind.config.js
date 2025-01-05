/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		gridTemplateColumns: {
  			'13': 'repeat(13, minmax(0, 1fr))'
  		},
  		colors: {
  			white: {
  				'100': '#333333',
  				'200': '#666666',
  				'300': '#999999',
  				'400': '#cccccc',
  				'500': '#ffffff',
  				'600': '#ffffff',
  				'700': '#ffffff',
  				'800': '#ffffff',
  				'900': '#ffffff',
  				DEFAULT: '#ffffff'
  			},
  			battleship_gray: {
  				'100': '#191c1d',
  				'200': '#333839',
  				'300': '#4c5356',
  				'400': '#666f73',
  				'500': '#808b8f',
  				'600': '#99a2a5',
  				'700': '#b3b9bb',
  				'800': '#ccd0d2',
  				'900': '#e6e8e8',
  				DEFAULT: '#808b8f'
  			},
  			rich_black: {
  				'100': '#000506',
  				'200': '#00090c',
  				'300': '#000e12',
  				'400': '#001218',
  				'500': '#00171f',
  				'600': '#005f7e',
  				'700': '#00a7de',
  				'800': '#3fcfff',
  				'900': '#9fe7ff',
  				DEFAULT: '#00171f'
  			},
  			prussian_blue: {
  				'100': '#000a11',
  				'200': '#001423',
  				'300': '#001e34',
  				'400': '#002845',
  				'500': '#003459',
  				'600': '#0064ab',
  				'700': '#0195ff',
  				'800': '#56b8ff',
  				'900': '#aadcff',
  				DEFAULT: '#003459'
  			},
  			lapis_lazuli: {
  				'100': '#00121a',
  				'200': '#002433',
  				'300': '#00364d',
  				'400': '#004766',
  				'500': '#005980',
  				'600': '#008fcc',
  				'700': '#1abaff',
  				'800': '#66d1ff',
  				'900': '#b3e8ff',
  				DEFAULT: '#005980'
  			},
  			cerulean: {
  				'100': '#001922',
  				'200': '#003243',
  				'300': '#004c65',
  				'400': '#006587',
  				'500': '#007ea7',
  				'600': '#00b1ed',
  				'700': '#32ccff',
  				'800': '#76ddff',
  				'900': '#bbeeff',
  				DEFAULT: '#007ea7'
  			},
  			'blue_(ncs)': {
  				'100': '#001d28',
  				'200': '#003a50',
  				'300': '#005877',
  				'400': '#00759f',
  				'500': '#0093c8',
  				'600': '#06bdff',
  				'700': '#44cdff',
  				'800': '#83deff',
  				'900': '#c1eeff',
  				DEFAULT: '#0093c8'
  			},
  			picton_blue: {
  				'100': '#00212e',
  				'200': '#00425c',
  				'300': '#00638a',
  				'400': '#0084b8',
  				'500': '#00a8e8',
  				'600': '#1fbfff',
  				'700': '#57cfff',
  				'800': '#8fdfff',
  				'900': '#c7efff',
  				DEFAULT: '#00a8e8'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
