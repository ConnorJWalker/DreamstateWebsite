let navList, albumData, modal
let store = {}

class Customiser {
    constructor(canvas, textInput) {
        this.canvas = canvas
        this.context = canvas.getContext('2d')
        this.size = canvas.width
        this.designs = [ //TODO: replace these with actual links
            document.getElementById('design-1'), 'link2', 'link3'
        ]
        this.selectedDesign = 0
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

        const size = window.innerWidth < 900 ? this.canvas.width : this.canvas.height
        this.context.drawImage(this.designs[this.selectedDesign], 0, 0, size, size)

        // Draw the users custom text
        this.context.fillText(this.textInput.value, this.size / 2, this.size / 2)
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
    store.custom = new Customiser(document.querySelector('canvas'), store.textInput)

    store.clearTextBtn.addEventListener('click', () => {
        store.textInput.value = ''
        store.custom.render()
    })

    store.textInput.addEventListener('keyup', () => store.custom.render())
}

function initAlbumModals() {
    document.querySelectorAll('.albums-list img').forEach(album => {
        album.addEventListener('click', showModal)
    })
}

function showModal() {
    modal.style.display = 'block'
}
