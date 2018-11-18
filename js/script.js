let navList, albumData, modal
let store = {}

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

    //find out which page the user is on to init the right functions
    switch(location.pathname) {
        case '/store.html':
            initStore()
            break
        case '/albums.html':
            initAlbumModals()
            break
    }
}

function initStore() {
    store.clearTextBtn = document.getElementById('clear-text')
    store.textInput = document.getElementById('shirt-text')

    store.clearTextBtn.addEventListener('click', () => {
        store.textInput.value = ''
    })
}

function initAlbumModals() {
    document.querySelectorAll('.albums-list img').forEach(album => {
        album.addEventListener('click', showModal)
    })
}

function showModal() {
    modal.style.display = 'block'
}
