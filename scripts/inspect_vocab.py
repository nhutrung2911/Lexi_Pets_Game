from pathlib import Path
import re

workspace_root = Path(__file__).resolve().parents[1]
local_path = workspace_root / 'js' / 'data' / 'tu_vung_hoan_thien.json'
if not local_path.exists():
    local_path = workspace_root / 'js' / 'data' / 'tu_vung_hoan_thien_fixed.json'
if not local_path.exists():
    local_path = workspace_root / 'js' / 'data' / 'tu_vung_hoan_thien_with_ipa.json'
if not local_path.exists():
    raise FileNotFoundError(f'Source file not found: {local_path}')

text = local_path.read_text(encoding='utf-8')
# Extract all valid key/value pairs of the form "key": "value"
pairs = re.findall(r'"([^"\\]+)"\s*:\s*"([^"\\]*)"', text)
print('pairs found', len(pairs))
print('unique', len({k:v for k,v in pairs}))
print('sample', list(pairs[:20]))

# Create object from pairs
word_dict = {k:v for k,v in pairs}
print('first 10 words:', list(word_dict.items())[:10])
print('first 10 entries by sorted key:')
for item in sorted(word_dict.items())[:10]:
    print(item)
