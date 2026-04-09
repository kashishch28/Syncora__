export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT:'#111111', card:'#181818', elevated:'#282828', hover:'#2a2a2a' },
        accent: { green:'#1db954', blue:'#2d7dd2', purple:'#7c4dff' },
        text: { primary:'#ffffff', secondary:'#b3b3b3', muted:'#535353' }
      },
      fontFamily: {
        sans: ['Circular','DM Sans','system-ui','sans-serif'],
        display: ['Bricolage Grotesque','Syne','sans-serif']
      }
    }
  },
  plugins: []
}
