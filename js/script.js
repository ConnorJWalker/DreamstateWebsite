const navList = document.querySelector('nav ul')

document.querySelector('.hamburger').addEventListener('click', () => {
    const isShown = navList.style.display === 'block'
    navList.style.display = isShown ? 'none' : 'block'
})