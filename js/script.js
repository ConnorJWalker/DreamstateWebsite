let navList, albumData, modal, map, cart
let store = {}

window.onload = () => {
    document.querySelector('.hamburger').addEventListener('click', () => {
        const isShown = navList.style.display === 'block'
        navList.style.display = isShown ? 'none' : 'block'
    })

    navList = document.querySelector('nav ul')
    cart = new Cart()

    init()
}

function init() {
    modal = document.getElementById('modal')

    if (modal) {
        window.addEventListener('click', e => {
            if (e.target == modal) modal.style.display = 'none'
        })
        document.getElementById('modal-close')
            .addEventListener('click', () => modal.style.display = 'none')
    }

    // Find out which page the user is on to init the right functions
    const path = location.pathname.split('/')
    switch(path[path.length - 1]) {
        case 'store.html':
            initStore()
            break
        case 'albums.html':
            initAlbumModals()
            break
    }
}

async function initTours() {
    const data = await Map.getTourLocations()

    const template = document.getElementById('location-template')
        .content.querySelector('div')
    const toursList = document.querySelector('.venues')

    const sorted = map.orderArrayByDistance(data)

    sorted.forEach(venue => {
        let clone = document.importNode(template, true)

        clone.children[0].children[0].innerText = venue.venue
        clone.children[0].children[1].innerText = venue.location.name

        clone.setAttribute('data-lat', venue.location.latitude)
        clone.setAttribute('data-long', venue.location.longitude.replace(',', ''))

        let splitDist = venue.distance.toString().split('.')
        clone.children[1].innerText = `${splitDist[0]}.${splitDist[0][0]} miles`

        toursList.appendChild(clone)
    })

    // Add event listeners to the new elements
    for (let i = 0; i < toursList.children.length; i++) {
        toursList.children[i].addEventListener('click', e => map.moveToMarker(e))
    }
    map.addMarkers(data.dates)
}

function initStore() {
    store.clearTextBtn = document.getElementById('clear-text')
    store.textInput = document.getElementById('shirt-text')
    store.custom = new Customiser(document.querySelector('canvas'), store.textInput)

    store.clearTextBtn.addEventListener('click', () => {
        store.textInput.value = ''
        store.custom.render()
    })

    store.textInput.addEventListener('keyup', () => store.custom.render())

    // Click event listener for custom shirt editor designs
    document.querySelectorAll('.shirt-designs img').forEach(img => {
        img.addEventListener('click', e => store.custom.changeDesign(e.target.dataset.index))
    })

    // CLick event listener for Merch add to cart buttons
    document.querySelectorAll('.merch button').forEach(button => {
        button.addEventListener('click', e => cart.addShirt(e))
    })
}

function initAlbumModals() {
    document.querySelectorAll('.albums-list img').forEach(album => {
        album.addEventListener('click', () => showModal(album.dataset.index))
    })

    window.addEventListener('resize', () => positionModal())

    fetch('js/album-data.json')
        .then(response => response.json())
        .then(data => albumData = data.data)
}

function showModal(index) {
    modal.style.display = 'block'
    document.getElementById('modal-title').innerText = albumData[index].title
    document.getElementById('modal-art').src = 'assets/' + albumData[index].albumArt

    const template = document.getElementById('song-template')
        .content.querySelector('div')
    const songList = document.querySelector('.songs-list')

    // Remove elements ready to re-add them
    while (songList.firstChild) {
        songList.removeChild(songList.firstChild)
    }

    albumData[index].songs.forEach(song => {
        let clone = document.importNode(template, true)
        clone.children[0].innerText = song.title
        clone.children[1].children[1].innerText = song.duration
        songList.appendChild(clone)
    })

    positionModal()
}

function positionModal() {
    if (window.innerWidth < 900) {
        modal.children[0].style.left = null
        modal.children[0].style.top = null
        modal.children[0].style.bottom = '15%'

        return
    }

    const left = (window.innerWidth - modal.children[0].clientWidth) / 2
    const top = (window.innerHeight - modal.children[0].clientHeight) / 2
    modal.children[0].style.left = left + 'px';
    modal.children[0].style.top = top + 'px';
}

// TODO: update so map gets inited before user set location, then reset data for location after
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            map = new Map(position)
            initTours()
        })
    } else {
        fallback()
    }

    function fallback() {
        let postition = {
            coords: {
                longitude: 51.5074,
                latitude: 0.1278
            }
        }
        map = new Map(position)
        initTours()
    }
}