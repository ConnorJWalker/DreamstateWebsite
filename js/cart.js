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