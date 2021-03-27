module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   darkMode: false, // or 'media' or 'class'
   theme: {
     extend: {
      backgroundImage: theme => ({
        'profile-1': "url('https://images.pexels.com/photos/1617366/pexels-photo-1617366.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'profile-2': "url('https://images.pexels.com/photos/4751420/pexels-photo-4751420.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'profile-3': "url('https://images.pexels.com/photos/105809/pexels-photo-105809.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'profile-4': "url('https://images.pexels.com/photos/179221/pexels-photo-179221.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'profile-5': "url('https://images.pexels.com/photos/7203687/pexels-photo-7203687.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
        'app-1': "url('https://images.pexels.com/photos/6827265/pexels-photo-6827265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",

       })
     },
   },
   variants: {
     extend: {},
   },
   plugins: [],
 }