# Quick Start Guide

This will be a short guide to creating maps using the helper scripts located in `common/`. The maps are built using [Cytoscape.js](https://js.cytoscape.org/) and the data is fetched from [Nominatim](https://nominatim.org/), an open-source geocoding API using data from OpenStreetMaps.

The following steps replicate the Drielandentrein map.

## Setup the work folder

Create a folder within `map/` that we will use to store all related files for this map.

```bash
mkdir maps/drielandentrein-demo
```

We will also need a list of stations to plot, we can either create a text file within our folder or in this case copy an existing one. Since we are replicating an existing map I will copy the `stations.txt` from the Drielandentrein folder.

```bash
cp maps/drielandentrein/stations.txt maps/drielandentrein-demo/
```

## Setup stations to plot
Once we have a list of stations, in the example labeled `stations.txt` we will need to format this with the correct coordinates as a JSON file. This can be done using the helper script called `format_stations.py`. The first parameter is the stations text file followed by the output file and location.

```bash
python3 common/format_stations.py maps/drielandentrein-demo/stations.txt maps/drielandentrein-demo/stations.json
```

The station queries Nominatim and caches the results within the destination folder under `nodes/`. This folder will be searched for each time you run this script.

The script will output a stream of text with three possible outcomes.

1. A station that is successfully formatted will display the following text:

```
Fetched: Luik-Guillemins
```

2. A station that was not successfully found will mention the station name was fetched but not found:
```
Fetched: Wezet
not a station: Wezet
```

3. No output at all. This indicates all the stations within the text file have already been found and are formatted within the JSON file.

### Finding missing stations

If any of the stations from your text file was not found there are three possible actions you can take.

1. Re-run the `format_stations.py` script. Running the script again will fetch different results from the previous attempts as the results are cached. This usually addresses most missing stations.

2. If running the script again doesn't work, try changing the name of the station in the text file to something more specific.

3. Lastly, if all else fails you can manually edit the cached file in `nodes/` that corresponds to the name of your station. If you find the coordinates yourself you can format the contents of the file as follows:

```json
[
    {
        "osm_type": "node",
        "lat": "51.6135231",
        "lon": "0.3006105",
        "type": "station"
    }
]
```

## Create connections
After formatting all the stations, you will need to create a `lines.json` file. This specifies the connections between each station. All stations within the `stations.json` file created before are assigned a number based on the order of the stations text file.

In our example we have 14 stations numbered 00 to 13. You can use the `create_line.py` helper function to create a correctly formatted `lines.json` file. Pass in the name of the line, destination work directory, and start and end number of the station IDs.

```bash
python3 common/create_line.py RE18 maps/drielandentrein-demo/ 0 13
```

This will create a file named `lines.json` in the destination directory, with contents in the following format.

```json
[
    {
        "l_name": "RE18",
        "stations": []
    }
]
```

You can manually add branches to an existing line or create new lines by appending them to the list. Examples of this can be found in the Elizabeth line and Amsterdam metro maps.

## Create the web page

To display the line and stations you can copy the HTML, javascript, and stylesheet files from `maps/drielandentrein` into the working directory.

```bash
cp maps/drielandentrein/index.html maps/drielandentrein/script.js maps/drielandentrein/style.css maps/drielandentrein-demo/
```

### Modifying the HTML and CSS

As a minimum you will need a div element with an id of `cy` and to import the Cytoscape.js, script.js, and CSS files in `<head>`.

```html
<head>
  <script src="https://unpkg.com/cytoscape/dist/cytoscape.min.js"></script>
  <script type="module" src="./script.js"></script>
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div id="cy"></div>
</body>
```

The stylesheet just sets the `cy` div to the entire screen height and width. If you include any commentary like in the sample files you can add those styles here as well.

### Configuring the nodes

Within the instantiated cytoscape object you can set the text and node formatting in the style list.

```javascript
{
    selector: 'node',
    style: {
        'content': 'data(s_name)',
        'background-color': 'white',
        'border-color': 'black',
        'border-width': 1,
        'width': 7,
        'height': 7,
        'text-rotation': 0,
        'text-halign': 'right',
        'font-size': 8
    }
}
```

Add colour to your lines by selecting the name defined in the `lines.json` file and specifying the colour.

```javascript
    selector: '.RE13',
    style: {
        'line-color': 'red'
    }
```

Custom styles can also be used for specific stations, these override the general setup for `node`'s. See the Elizabeth line map for examples of this.

```javascript
    var bottom_nodes = [
        "[s_name = 'Custom House']", "[s_name = 'Canary Wharf']",
        "[s_name = 'Heathrow Terminal 5']", "[s_name = 'Heathrow Terminal 4']"
    ]
    for (var n_selector of bottom_nodes) {
        var n = cy.elements(n_selector)
        console.log(n)
        n.style('text-halign', 'left')
        n.style('text-valign', 'bottom')
    }
```