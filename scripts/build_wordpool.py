from pathlib import Path
import runpy

if __name__ == '__main__':
    script_dir = Path(__file__).resolve().parent
    script_name = 'generate_ipa_from_json.py'
    script_path = script_dir / script_name
    print(f'Running {script_name}...')
    runpy.run_path(str(script_path), run_name='__main__')
    print(f'{script_name} completed.\n')
    print('Build complete: tu_vung_hoan_thien.json -> tu_vung_hoan_thien_with_ipa.json')
