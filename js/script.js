let navList, albumData, modal

window.onload = () => {
    document.querySelector('.hamburger').addEventListener('click', () => {
        const isShown = navList.style.display === 'block'
        navList.style.display = isShown ? 'none' : 'block'
    })

    navList = document.querySelector('nav ul')

    init()
}

function init() {
    modal = document.getElementById('modal')

    if (modal) {
        modal.addEventListener('click', () => modal.style.display = 'none')
    }

    initAlbumModals()
}

function initAlbumModals() {
    document.querySelectorAll('.albums-list img').forEach(album => {
        album.addEventListener('click', showModal)
    })
}

function showModal() {
    modal.style.display = 'block'
}
