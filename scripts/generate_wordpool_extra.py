from pathlib import Path
import json

workspace_root = Path(__file__).resolve().parents[1]
source_json = workspace_root / 'js' / 'data' / 'tu_vung_hoan_thien_with_ipa.json'
out = workspace_root / 'js' / 'data' / 'wordPoolsExtra.js'

if not source_json.exists():
    raise FileNotFoundError(f'Source JSON not found: {source_json}')

with source_json.open('r', encoding='utf-8') as f:
    data = json.load(f)

print('Loaded entries from JSON:', len(data))

with out.open('w', encoding='utf-8') as f:
    f.write('// Auto-generated extra vocabulary pool from tu_vung_hoan_thien_with_ipa.json\n')
    f.write('const EXTRA_WORDS = [\n')
    for item in sorted(data, key=lambda x: x.get('en', '').lower()):
        en = item.get('en', '')
        vn = item.get('vn', '')
        ipa = item.get('ipa', '')
        en_js = en.replace('\\', '\\\\').replace('"', '\\"')
        vn_js = vn.replace('\\', '\\\\').replace('"', '\\"')
        ipa_js = ipa.replace('\\', '\\\\').replace('"', '\\"')
        f.write(f'    {{ en: "{en_js.upper()}", vn: "{vn_js}", ipa: "{ipa_js}", ex: "" }},\n')
    f.write('];\n\n')
    f.write('if (typeof WORD_POOLS === "object") {\n')
    f.write('    WORD_POOLS.EXTRA = EXTRA_WORDS;\n')
    f.write('}\n')

print('Wrote', out)
