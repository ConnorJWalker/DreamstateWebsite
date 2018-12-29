class Cart {
    constructor() {
        let storage = localStorage.getItem('cart')

        // See if the user already has cart object saved, if not then create one
        if (storage) {
            this.store = JSON.parse(storage)
        } else {
            this.createCartObject()
        }
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

    save() {
        localStorage.setItem('cart', JSON.stringify(this.store))
    }
}