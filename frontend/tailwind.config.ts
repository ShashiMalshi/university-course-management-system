import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },

      // Your palette (normalized to kebab-case for safe class names)
      colors: {
        rose: { DEFAULT:'#f72585',100:'#37021a',200:'#6e0434',300:'#a5064e',400:'#dc0868',500:'#f72585',600:'#f9529d',700:'#fa7db5',800:'#fca8ce',900:'#fdd4e6' },
        fandango: { DEFAULT:'#b5179e',100:'#24051f',200:'#48093f',300:'#6c0e5e',400:'#90137e',500:'#b5179e',600:'#e326c7',700:'#ea5dd5',800:'#f193e3',900:'#f8c9f1' },
        grape: { DEFAULT:'#7209b7',100:'#170225',200:'#2e034a',300:'#45056f',400:'#5c0794',500:'#7209b7',600:'#980df4',700:'#b14af6',800:'#cb86f9',900:'#e5c3fc' },
        'chrysler-blue': { DEFAULT:'#560bad',100:'#110223',200:'#230445',300:'#340768',400:'#45098a',500:'#560bad',600:'#750fea',700:'#9747f3',800:'#ba84f7',900:'#dcc2fb' },
        'dark-blue': { DEFAULT:'#480ca8',100:'#0e0221',200:'#1c0543',300:'#2b0764',400:'#390986',500:'#480ca8',600:'#6210e5',700:'#8745f2',800:'#af83f6',900:'#d7c1fb' },
        zaffre: { DEFAULT:'#3a0ca3',100:'#0b0220',200:'#170541',300:'#220761',400:'#2e0a81',500:'#3a0ca3',600:'#4f11e0',700:'#7743f1',800:'#a582f6',900:'#d2c0fa' },
        'palatinate-blue': { DEFAULT:'#3f37c9',100:'#0c0b28',200:'#191650',300:'#252178',400:'#322ca0',500:'#3f37c9',600:'#655fd3',700:'#8b87de',800:'#b2afe9',900:'#d8d7f4' },
        'neon-blue': { DEFAULT:'#4361ee',100:'#050f38',200:'#0a1d70',300:'#102ca8',400:'#153ae0',500:'#4361ee',600:'#6a83f1',700:'#8fa2f5',800:'#b4c1f8',900:'#dae0fc' },
        'chefchaouen-blue': { DEFAULT:'#4895ef',100:'#051d39',200:'#0a3b72',300:'#0f58ac',400:'#1475e5',500:'#4895ef',600:'#6dabf2',700:'#91c0f5',800:'#b6d5f9',900:'#daeafc' },
        'vivid-sky-blue': { DEFAULT:'#4cc9f0',100:'#052e3a',200:'#095c75',300:'#0e8aaf',400:'#13b8ea',500:'#4cc9f0',600:'#70d5f3',700:'#93dff6',800:'#b7eaf9',900:'#dbf4fc' },

        // App theme aliases
        primary: { 50:'#e9efff',100:'#dae5ff',200:'#b8cbff',300:'#95b0ff',400:'#6f94ff',500:'#4361ee',600:'#3650c3',700:'#2b409a',800:'#223478',900:'#1b2a60' }, // neon-blue-ish
        secondary: { 50:'#fff0f6',100:'#ffe2ef',200:'#ffc5df',300:'#ff9fcc',400:'#ff6eb0',500:'#f72585',600:'#d21a6c',700:'#a91556',800:'#881346',900:'#6e1039' }, // rose
        accent: { 50:'#edfaff',100:'#daf5fe',200:'#b8ecfd',300:'#92e2fb',400:'#6bd7f8',500:'#4cc9f0',600:'#3aa2c3',700:'#2d7f9a',800:'#23657b',900:'#1c5264' }, // vivid-sky-blue
        success: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b' },
        danger:  { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337' },
      },

      boxShadow: {
        soft: '0 10px 20px rgba(2,6,23,0.08)',
        elevated: '0 12px 30px rgba(2,6,23,0.12)',
      },

      backgroundImage: {
        glow:
          'radial-gradient(800px circle at 0% 0%, rgba(67,97,238,0.12), transparent 40%), radial-gradient(800px circle at 100% 0%, rgba(247,37,133,0.12), transparent 40%)',
      },
    },
  },
  plugins: [],
} satisfies Config
