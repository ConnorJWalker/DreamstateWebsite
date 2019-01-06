/*--- cart.js ---*/
class Cart {
    constructor() {
        let storage = localStorage.getItem('cart')

        // See if the user already has cart object saved, if not then create one
        if (storage) {
            this.store = JSON.parse(storage)
        } else {
            this.createCartObject()
        }

        this.renderCart()
    }

    addCustomShirt(shirt) {
        this.store.customShirts.push({
            img: shirt.canvas.toDataURL(),
            text: shirt.text,
            design: shirt.design
        })

        this.save()
    }

    addShirt(event) {
        const target = event.target
        let shirt = {}

        shirt.name = target.previousElementSibling.children[0].innerText

        const index = this.store.shirts.findIndex(s => {
            return s.name === shirt.name
        })

        // Index will be -1 if it was not found
        if (index === -1) {
            shirt.price = target.previousElementSibling.children[1].innerText
            shirt.price = parseFloat(shirt.price.replace('£', ''))
            shirt.img = target.parentElement.previousElementSibling.src
            shirt.quantity = 1

            this.store.shirts.unshift(shirt)
        } else {
            this.store.shirts[index].quantity++
        }

        this.save()
    }

    createCartObject() {
        this.store = {
            customShirts: [],
            customAlbum: {
                title: '',
                songs: []
            },
            shirts: []
        }

        this.save()
    }

    emptyCart() {
        if (confirm('Are you sure you want to empty your cart?')) {
            this.createCartObject()
        }
    }

    renderCart() {
        let dropdown = document.querySelector('.dropdown-list')

        if (this.store.shirts.length === 0) {
            dropdown.innerHTML += "<p>You have nothing in your cart :(</p>"
            return
        }

        // remove any items already in the cart so they can be re rendered
        for (let i = dropdown.children.length - 1; i >= 0; i--) {
            dropdown.children[i].remove();
        }

        this.store.shirts.forEach(shirt => {
            dropdown.innerHTML += this.getCartItemLayout(shirt)
        })

        // Add event listeners to all of the cart remove buttons
        document.querySelectorAll('.cart-remove-item').forEach(button => {
            button.addEventListener('click', e => this.removeFromCart(e))
        })
    }

    removeFromCart(e) {
        const shirtName = e.target.dataset.shirtname

        this.store.shirts.forEach(shirt => {
            if (shirt.name !== shirtName) return

            // If there is more than one shirt in the cart, reduce quantity, else remove element
            if (shirt.quantity > 1) {
                shirt.quantity--
            } else {
                this.store.shirts.splice(this.store.shirts.indexOf(shirt, 1))
            }

            // Rerender the new cart
            this.renderCart();
            this.save();
        })
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.store))
    }

    getCartItemLayout(shirt) {
        return `
            <div class="cart-item-shirt">
                <div title="${shirt.name} ${shirt.price}" class="cart-item-img">
                    <img src="${shirt.img}" alt="${shirt.name}">
                    <p>£${shirt.price}</p>
                </div>
                <div class="cart-item-remove">
                    <span class="cart-quantity">X${shirt.quantity}</span>
                    <button class="cart-remove-item" data-shirtName="${shirt.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
    } 
}
/*--- customiser.js ---*/
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

/*--- map.js ---*/
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
        this.userLatLng = {
            lat: location.coords.latitude,
            lng: location.coords.longitude
        }
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

    getDistanceBetweenPoints(start, end) {
        let distances = []

        start = new google.maps.LatLng(start)

        end.forEach(point => {
            point.lat = parseFloat(point.lat)
            point.lng = parseFloat(point.lng)

            point = new google.maps.LatLng(point)
            const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(start, point)
            // Convert the distance into miles
            distances.push(distanceMeters * 0.000621371192)
        })

        return distances
    }

    orderArrayByDistance(data) {
        // Structure array in way get distance function needs
        let functionData = data.dates.map(location => ({
            lat: location.location.latitude,
            lng: location.location.longitude
        }))

        // Get and sort the distances
        const distances = this.getDistanceBetweenPoints(this.userLatLng, functionData)
        const sortedDistances = [...distances].sort((a, b) => {
            a = parseFloat(a)
            b = parseFloat(b)

            // Return data specified by MDN for sort function parameter
            if (a < b) return -1
            else if (a > b) return 1
            else return 0
        })

        let returnData = []
        for (let i = 0; i < sortedDistances.length; i++) {
            returnData.push(data.dates[distances.indexOf(sortedDistances[i])])
            returnData[i].distance = sortedDistances[i]
        }

        return returnData
    }

    moveToMarker(e) {
        let data = e.target.dataset
        const latLng = new google.maps.LatLng(data.lat, data.long)
        this.map.panTo(latLng)
    }
}
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

