import requests
import json
import os
import argparse
from time import sleep

def find_station_node(data,  node_type='station'):
    for node in data:
        if node["type"] == node_type:
            return node
    return False



def get_station_api(name, node_path, exclude_place_ids=[], node_type='station'):
    BASE = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": name,
        "format": "json",
        "exclude_place_ids": ",".join(map(str, exclude_place_ids))
    }

    print(f"Fetched: {name}")
    r = requests.get(BASE, params=params)
    data = r.json()

    with open(os.path.join(node_path, f"{params['q']}.json"), "w") as f:
        json.dump(data, f)
    sleep(1)
    return find_station_node(data, node_type)

def get_node(station_name, node_path, node_type="station"):
    if not os.path.isfile(os.path.join(node_path, f"{station_name}.json")):
        node = get_station_api(station_name, node_path)
    else:
        with open(os.path.join(node_path, f"{station_name}.json")) as f:
            data = json.load(f)
        node = find_station_node(data, node_type)
        if not node:
            exclude_place_ids = []
            for node in data:
                exclude_place_ids.append(node['place_id'])
            node = get_station_api(station_name, node_path, exclude_place_ids=exclude_place_ids)

    if not node:
        print(f"not a station: {station_name}")
        return 0
    else:
        return node

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(dest='station_name', help="Enter a station name")
    args = parser.parse_args()
    station_name = args.station_name.strip()

    print(get_node(station_name))
