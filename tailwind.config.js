/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: { 
      body: ['Nunito', 'sans-serif'],
      sans: ['Nunito', 'sans-serif']
    },
    extend: {
      colors: {
        primary : { DEFAULT:'#4D90FF', hover:'#2A7BFF', pressed:'#1F69FF' },
        mintLight: '#66E0B3',
        purpleLight: '#B58EDB',
        amberLight: '#FFD277',
        neutralLight: '#FFFFFF',
        neutralDark: '#333333',
        success : '#2EB67D',
        warning : '#FFB840',
        error   : '#FF4D4F',
        gray: {
          50:'#FAFAFA',100:'#F5F5F4',200:'#E5E5E5',300:'#DADADA',
          400:'#BFBFBF',500:'#8E8E8E',600:'#5E5E5E',
          700:'#444444',800:'#333333',900:'#1A1A1A'
        }
      },
      fontSize: {
        h1:['32px','1.2'], h2:['26px','1.25'], h3:['21px','1.3'],
        body:['16px','1.6'], helper:['13px','1.4']
      },
      borderRadius:{ lg:'8px' },
      spacing:{ 7:'28px' }
    }
  },
  plugins: [],
}
