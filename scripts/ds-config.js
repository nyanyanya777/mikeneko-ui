tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a5f',
          950: '#172554',
        },
        body: '#3d4b5f',
        wf: {
          bg: 'var(--wf-bg)',
          surface: 'var(--wf-surface)',
          border: 'var(--wf-border)',
          text: 'var(--wf-text)',
          'text-sub': 'var(--wf-text-sub)',
          accent: 'var(--wf-accent)',
        },
      },
      fontFamily: {
        sans: ['Inter','Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','sans-serif'],
        mono: ['JetBrains Mono','SF Mono','monospace'],
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.4' }],
        sm: ['0.9375rem', { lineHeight: '1.7' }],
        base: ['1.125rem', { lineHeight: '2.0' }],
        lg: ['1.25rem', { lineHeight: '1.5' }],
        xl: ['1.375rem', { lineHeight: '1.4' }],
        2xl: ['1.625rem', { lineHeight: '1.4' }],
        3xl: ['2rem', { lineHeight: '1.4' }],
      },
    },
  },
}
