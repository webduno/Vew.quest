import json
import math
from pathlib import Path

def split_annotations():
    # Read the original JSON file
    with open('public/data/annotations_normalized.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Calculate items per file (rounded up to ensure all items are included)
    total_items = len(data)
    items_per_file = math.ceil(total_items / 5)
    
    # Create output directory if it doesn't exist
    output_dir = Path('public/data/split_annotations')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Split the data into 5 parts
    items = list(data.items())
    for i in range(5):
        start_idx = i * items_per_file
        end_idx = min((i + 1) * items_per_file, total_items)
        
        # Create a dictionary for this chunk
        chunk_dict = dict(items[start_idx:end_idx])
        
        # Save to a new file
        output_file = output_dir / f'annotations_part_{i + 1}.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(chunk_dict, f, indent=2, ensure_ascii=False)
        
        print(f'Created {output_file} with {len(chunk_dict)} items')

if __name__ == '__main__':
    split_annotations() 