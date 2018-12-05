let navList, albumData, modal
let store = {}

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

    resize() {
        //TODO: update canvas sizes and redraw to smaller size
    }

    changeDesign(number) {
        this.selectedDesign = number
        this.render()
    }

    render() {
        //TODO: clear the canvas and redraw it
        this.context.clearRect(0, 0, this.size, this.size)

        let size = window.innerWidth < 900 ? this.canvas.width : this.canvas.height
        this.context.drawImage(this.background, 0, 0, size, size)

        size /= 4
        const imgX = ((this.size) - (size)) / 2
        const imgY = (this.size / 2) - (size / 2)
        console.log(imgX)
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
    }

    //find out which page the user is on to init the right functions
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
        album.addEventListener('click', showModal)
    })

    fetch('assets/album-data.json')
        .then(response => response.json())
        .then(data => albumData = data)
}

function showModal() {
    modal.style.display = 'block'
}
