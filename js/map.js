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
        if (!e.target.dataset.lat)
        {
            // if the user clicks the text it wont have the dataset
            // this prevents this from causing a crash
            this.moveToMarker({ target: e.target.parentElement })
            return
        }

        let data = e.target.dataset
        const latLng = new google.maps.LatLng(data.lat, data.long)
        this.map.panTo(latLng)
    }
}