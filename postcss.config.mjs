/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    // Tailwind v3 does not emit vendor prefixes itself — utilities like
    // `sticky`, `select-none` and `bg-clip-text` rely on autoprefixer being
    // in the pipeline, which its own setup docs assume. Build-time only, so
    // it adds nothing to the shipped bundle.
    autoprefixer: {},
  },
};

export default config;
