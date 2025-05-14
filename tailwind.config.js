/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [

    "./src/**/*.{html,ts,scss}",
  ],
  safelist:[
    'bg-red-600',
    'bg-green-600'
  ],
  theme: {
    
    extend: {

        colors: {

            headerColor: "#FF64C3",
            hightlightText: "#1e40af"
        },

        fontFamily:{

            Peridot: "Peridot PE Variable"
        },
        
        screens:{

            xxs: '376px'
        }
    },
  },

  plugins: [],
}

