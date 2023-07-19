const GoogleMapStyle = [
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',

        stylers: [{color: '#444444'}]
    },
    {
        featureType: 'landscape',
        elementType: 'all',

        stylers: [{color: '#f2f2f2'}]
    },
    {
        featureType: 'road',
        elementType: 'all',

        stylers: [{saturation: -100}, {lightness: 45}]
    },
    {
        featureType: 'road.highway',
        elementType: 'all',

        stylers: [{visibility: 'simplified'}]
    },
    {featureType: 'water', elementType: 'all', stylers: [{color: '#b7dbf5'}, {visibility: 'on'}]}
]
export default GoogleMapStyle;
