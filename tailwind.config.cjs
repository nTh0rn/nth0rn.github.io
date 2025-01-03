/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.astro"],
  safelist: [
    'delay-[25ms]',
    'delay-[50ms]',
    'delay-[75ms]',
    'delay-[100ms]',
    'delay-[125ms]',
    'delay-[150ms]',
    'delay-[175ms]',
    'delay-[200ms]',
    'delay-[225ms]',
    'delay-[250ms]',
    'delay-[275ms]',
    'delay-[300ms]',
    'delay-[325ms]',
    'delay-[350ms]',
    'delay-[375ms]',
    'delay-[400ms]',
    'delay-[425ms]',
    'delay-[450ms]',
    'delay-[475ms]',
    'delay-[500ms]',
    'delay-[525ms]',
    'delay-[550ms]',
    'delay-[575ms]',
    'delay-[600ms]',
    'delay-[625ms]',
    'delay-[650ms]',
    'delay-[675ms]',
    'delay-[700ms]',
    'delay-[725ms]',
    'delay-[750ms]',
    'delay-[775ms]',
    'delay-[800ms]',
    'delay-[825ms]',
    'delay-[850ms]',
    'delay-[875ms]',
    'delay-[900ms]',
    'delay-[925ms]',
    'delay-[950ms]',
    'delay-[975ms]',
    'delay-[1000ms]',
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        shine: 'shine 3s linear infinite',
      },
      transitionProperty: {
        'width':'width'
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '200% 0%' },
          '100%': { backgroundPosition: '-200% 0%' },
        },
      },
      fontFamily: {
        body: ["Roboto Mono", "sans-serif"],
        heading: ["Roboto Mono", "sans-serif"],
      },
      colors: {
        'main-c':'#339AF0',
        blueLight:'#0069FF',
        
        blueDark:'#339AF0',
        transparent: "transparent",
        current: "currentColor",
        primary: {
          main: "rgb(var(--color-primary-main) / <alpha-value>)",
          100: "rgb(var(--color-tech-dark-dark) / <alpha-value>)",
          200: "rgb(var(--color-tech-dark) / <alpha-value>)",
          800: "rgb(var(--color-tech-light) / <alpha-value>)",
          900: "rgb(var(--color-tech-light-light) / <alpha-value>)",
          blueDark: "rgb(var(--color-box-blue-dark) / <alpha-value>)",
          blueLight: "rgb(var(--color-box-blue-light) / <alpha-value>)",
        },
        
        text: {
          body: "rgb(var(--color-text-body) / <alpha-value>)",
          bold: "rgb(var(--color-text-bold) / <alpha-value>)",
          heading: "rgb(var(--color-text-heading) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          code: "rgb(var(--color-text-code) / <alpha-value>)",
          link: "rgb(var(--color-text-link) / <alpha-value>)",
          selection: "rgb(var(--color-text-selection) / <alpha-value>)",
        },
        bg: {
          body: "rgb(var(--color-bg-body) / <alpha-value>)",
          code: "rgb(var(--color-bg-code) / <alpha-value>)",
          selection: "rgb(var(--color-bg-selection) / <alpha-value>)",
        },
        border: {
          code: "rgb(var(--color-border-code) / <alpha-value>)",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              "text-decoration": "none",
              "background-repeat": "no-repeat",
              "background-size": "100% 1.5px",
              "background-position": "0 100%",
              "background-image":
                "linear-gradient(to right, rgb(var(--color-text-link)/1), rgb(var(--color-text-link)/1))",
              "&:hover": {
                color: "rgb(var(--color-text-link))",
              },
            },
            "h1, h2, h3, h4, h5": {
              color: "rgb(var(--color-text-heading))",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            blockquote: {
              border: "none",
              position: "relative",
              width: "96%",
              margin: "0 auto",
              "font-size": "1.0625em",
              "padding-top": "1.5rem",
              "padding-bottom": "0.5rem",
              "padding-left": "1.5rem",
              "padding-right": "1.5rem",
            },
            "blockquote::before": {
              "font-family": "Arial",
              content: "'“'",
              "font-size": "4em",
              color: "rgb(var(--color-text-link))",
              position: "absolute",
              left: "-10px",
              top: "-10px",
            },
            "blockquote::after": {
              content: "",
            },
            "blockquote p:first-of-type::before": {
              content: "",
            },
            "blockquote p:last-of-type::after": {
              content: "",
            },
          },
        },
        newspaper: {
          css: {
            "--tw-prose-body": "rgb(var(--color-text-body))",
            "--tw-prose-headings": "rgb(var(--color-text-heading))",
            "--tw-prose-lead": "rgb(var(--color-text-body))",
            "--tw-prose-links": "rgb(var(--color-text-body))",
            "--tw-prose-bold": "rgb(var(--color-text-bold))",
            "--tw-prose-counters": "rgb(var(--color-text-body))",
            "--tw-prose-bullets": "rgb(var(--color-text-body))",
            "--tw-prose-hr": "rgb(var(--color-text-muted))",
            "--tw-prose-quotes": "rgb(var(--color-text-body))",
            "--tw-prose-quote-borders": "rgb(var(--color-primary-main))",
            "--tw-prose-captions": "rgb(var(--color-primary-heading))",
            "--tw-prose-quote-captions": "rgb(var(--color-primary-heading))",
            "--tw-prose-code": "rgb(var(--color-text-code))",
            "--tw-prose-pre-code": "rgb(var(--color-text-code))",
            "--tw-prose-pre-bg": "rgb(var(--color-bg-code))",
            "--tw-prose-th-borders": "rgb(var(--color-text-muted))",
            "--tw-prose-td-borders": "rgb(var(--color-text-muted))",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animated")],
};
