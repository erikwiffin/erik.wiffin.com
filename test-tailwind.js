const tailwindcss = require('tailwindcss');
const daisyui = require('daisyui');

console.log('DaisyUI plugin:', daisyui);

const config = {
  content: ['./test-daisyui.html'],
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "corporate", "business"],
  },
};

console.log('Config:', config);
