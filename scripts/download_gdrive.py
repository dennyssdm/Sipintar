import os
import json
import urllib.request
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def download_file(item, dest_dir):
    name = item['name']
    fid = item['file_id']
    target_path = os.path.join(dest_dir, name)
    
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        return {'name': name, 'status': 'ALREADY_EXISTS', 'size': os.path.getsize(target_path)}

    url = f'https://drive.google.com/uc?export=download&id={fid}'
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    req = urllib.request.Request(url, headers=headers)
    
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                with open(target_path, 'wb') as f:
                    f.write(data)
                return {'name': name, 'status': 'DOWNLOADED', 'size': len(data)}
        except Exception as e:
            if attempt == 2:
                return {'name': name, 'status': f'ERROR: {str(e)}', 'size': 0}
            time.sleep(1)

def run():
    os.makedirs('uploads/library', exist_ok=True)
    os.makedirs('uploads/modul', exist_ok=True)

    # 1. Download Library items
    with open('library_inventory_items.json', 'r') as f:
        lib_items = json.load(f)
    print(f'Starting download of {len(lib_items)} Library inventory items...')
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(download_file, item, 'uploads/library'): item for item in lib_items}
        for future in as_completed(futures):
            res = future.result()
            name = res['name']
            status = res['status']
            size = res['size']
            print(f'  [Library] {name}: {status} ({size} bytes)')

    # 2. Download Modul and Hanjar items
    with open('modul_and_hanjar_items.json', 'r') as f:
        mh_data = json.load(f)
    mh_items = mh_data['modul'] + mh_data['hanjar']
    print(f'\nStarting download of {len(mh_items)} Modul & Hanjar items...')
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(download_file, item, 'uploads/modul'): item for item in mh_items}
        for future in as_completed(futures):
            res = future.result()
            name = res['name']
            status = res['status']
            size = res['size']
            print(f'  [Modul/Hanjar] {name}: {status} ({size} bytes)')

    print('\nAll downloads finished successfully!')

if __name__ == '__main__':
    run()
