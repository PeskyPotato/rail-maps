from geocode import get_node
import argparse
import os
import json

def format_stations(stations_file, formatted_file, scale=1000):
    with open(stations_file, 'r') as f:
        stations = f.readlines()
    
    formatted_stations = []
    current_id = 0
    
    for station_name in stations:
        station_name = station_name.strip()
        node_path = os.path.join(os.path.dirname(formatted_file), "nodes")
        os.makedirs(node_path, exist_ok=True)
        node = get_node(station_name, node_path)
        if not node:
            continue

        station = {
           "data": {},
           "position": {}
        }
        station["data"]["id"] = f'{current_id:05d}'
        station["data"]["s_name"] = station_name
        station["position"]["x"] = float(node["lon"])*scale
        station["position"]["y"] = float(node["lat"])*-scale
        
        current_id += 1
        formatted_stations.append(station)

    with open(os.path.join(formatted_file), "w") as f:
        json.dump(formatted_stations, f)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("stations")
    parser.add_argument("formatted_stations")
    parser.add_argument("--scale", type=int)
    args = parser.parse_args()

    stations_file  = os.path.abspath(args.stations)
    formatted_file = os.path.abspath(args.formatted_stations)

    if args.scale:
        format_stations(stations_file, formatted_file, args.scale)
    else:
        format_stations(stations_file, formatted_file)