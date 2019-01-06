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