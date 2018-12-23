let navList, albumData, modal, map
let store = {}

class Map {
    constructor(location) {
        this.mapElement = document.getElementById('map')
        this.map = new google.maps.Map(this.mapElement, {
            zoom: 10,
            center: {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }
        })
    }

    static async getTourLocations() {
        let data = await fetch('js/tours.json')
        data = data.json()

        return data;
    }

    addMarkers(locations) {
        locations.forEach(location => {
            new google.maps.Marker({
                position: {
                    lat: parseFloat(location.location.latitude),
                    lng: parseFloat(location.location.longitude)
                },
                map: map.map
            })
        })
    }
}

class Customiser {
    constructor(canvas, textInput) {
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.background = document.getElementById('background')
        this.size = canvas.width
        this.designs = [
            document.getElementById('design-1'),
            document.getElementById('design-2'),
            document.getElementById('design-3')
        ]
        this.selectedDesign = 1
        this.textInput = textInput

        this.canvas.height = this.canvas.width

        this.render()
    }

    changeDesign(number) {
        this.selectedDesign = number
        this.render()
    }

    render() {
        // Clear the canvas ready to redraw
        this.context.clearRect(0, 0, this.size, this.size)

        // Draw the background depending on the window size
        let size = window.innerWidth < 900 ? this.canvas.width : this.canvas.height
        this.context.drawImage(this.background, 0, 0, size, size)

        // Set the size of the of the designs and draw them
        size /= 4
        const imgX = ((this.size) - (size)) / 2
        const imgY = (this.size / 2) - (size / 2)
        this.context.drawImage(this.designs[this.selectedDesign], imgX, imgY, size, size)

        // Draw the users custom text
        const textX = (this.size / 2) - (this.context.measureText(this.textInput.value).width / 2)
        const textY = this.size - ((this.size / 4) * 2.7)
        this.context.fillText(this.textInput.value, textX, textY)
    }
}

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

    data.dates.forEach(venue => {
        let clone = document.importNode(template, true)

        clone.children[0].children[0].innerText = venue.venue
        clone.children[0].children[1].innerText = venue.location.name

        // TODO: get actual distance
        clone.children[1].innerText = '0.1 miles'

        toursList.appendChild(clone)
    })

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

    document.querySelectorAll('.shirt-designs img').forEach(img => {
        img.addEventListener('click', e => store.custom.changeDesign(e.target.dataset.index))
    })
}

function initAlbumModals() {
    document.querySelectorAll('.albums-list img').forEach(album => {
        album.addEventListener('click', () => showModal(album.dataset.index))
    })

    window.addEventListener('resize', () => positionModal())

    fetch('assets/album-data.json')
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
