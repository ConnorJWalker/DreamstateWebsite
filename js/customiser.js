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
